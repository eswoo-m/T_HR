import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { formatDate } from '../../../common/utils/date.util';
import { CustomerWithCounts } from '../../../types/customer-with-counts.interface';
import { CustomerListItemDto, CustomerSummaryDto, CustomerDetailResponseDto } from './dto/customer-response.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * 고객사 목록 및 상단 요약 통계 조회
   */
  async query(dto: QueryCustomerDto) {
    const [summary, customers] = await Promise.all([
      this.getCustomerSummary(),
      this.getCustomerList(dto || {}), // dto를 사용하여 'unused-vars' 에러 해결
    ]);

    // 3. (customers as CustomerWithCounts[]) 를 사용하여 'unused-vars' 및 'unsafe-member-access' 해결
    const list: CustomerListItemDto[] = (customers as CustomerWithCounts[]).map((c) => ({
      id: c.id,
      name: c.name,
      ceoName: c.ceoName ?? '',
      industry: c.industry ?? '',
      tel: c.tel ?? '',
      status: c.status,
      remarks: c.remarks ?? '',
      activeProjectCount: c.projects.length, // 현재 진행 중인 수
      totalProjectCount: c._count.projects, // 전체 이력 수
    }));

    return { summary, list };
  }

  /**
   * 상단 요약 통계 계산
   */
  private async getCustomerSummary(): Promise<CustomerSummaryDto> {
    const today = new Date();

    const [total, active, inactive, ongoing] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.count({ where: { status: 'ACTIVE' } }),
      this.prisma.customer.count({ where: { status: 'INACTIVE' } }),
      this.prisma.project.count({
        where: {
          OR: [{ endDate: null }, { endDate: { gte: today } }],
        },
      }),
    ]);

    return {
      totalCount: total,
      activeCount: active,
      inactiveCount: inactive,
      ongoingProjectCount: ongoing,
    };
  }

  /**
   * 필터링된 고객사 목록 조회
   */
  private async getCustomerList(dto: QueryCustomerDto) {
    const today = new Date();
    const { name, status } = dto;

    return this.prisma.customer.findMany({
      where: {
        name: name ? { contains: name } : undefined,
        status: status || undefined,
      },
      include: {
        _count: { select: { projects: true } },
        projects: {
          where: {
            OR: [{ endDate: null }, { endDate: { gte: today } }],
          },
          select: { id: true },
        },
      },
      orderBy: { regTime: 'desc' },
    });
  }

  // 고객사 상세 정보
  async get(id: number): Promise<CustomerDetailResponseDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        contacts: {
          orderBy: { isPrimary: 'desc' }, // 주담당자가 맨 위로 오게 정렬
        },
        projects: {
          orderBy: { regTime: 'desc' }, // 최신 프로젝트순
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('존재하지 않는 고객사입니다.');
    }

    // 데이터 가공 (Entity -> DTO)
    const result: CustomerDetailResponseDto = {
      id: customer.id,
      name: customer.name,
      businessNo: customer.businessNo ?? '',
      ceoName: customer.ceoName ?? '',
      tel: customer.tel ?? '',
      fax: customer.fax ?? '',
      address: customer.address ?? '',
      homepage: customer.homepage ?? '',
      status: customer.status,
      remarks: customer.remarks ?? '',
      regTime: customer.regTime,

      contacts: customer.contacts.map((c) => ({
        id: c.id,
        name: c.name,
        jobRole: c.jobRole ?? '',
        department: c.department ?? '',
        tel: c.tel ?? '',
        email: c.email ?? '',
        phone: c.phone ?? '',
        remarks: c.remarks ?? '',
        isPrimary: !!c.isPrimary,
      })),

      projects: customer.projects.map((p) => ({
        id: p.id,
        name: p.name,
        startDate: formatDate(p.startDate),
        endDate: formatDate(p.endDate),
      })),
    };
    return result;
  }

  async register(dto: RegisterCustomerDto) {
    const { contacts, ...customerData } = dto;

    // 트랜잭션 시작
    return this.prisma.$transaction(async (tx) => {
      const existingCustomer = await tx.customer.findUnique({
        where: { businessNo: dto.businessNo }, // 스키마 필드명 확인 (businessNo 또는 business_no)
      });

      if (existingCustomer) {
        throw new ConflictException('이미 등록된 사업자등록번호입니다.');
      }

      // 1. 고객사 기본 정보 생성
      const customer = await tx.customer.create({
        data: {
          ...customerData,
          // 2. 담당자 목록이 있을 경우 함께 생성 (Relation Create)
          contacts: {
            create: contacts.map((contact) => ({
              name: contact.name,
              jobRole: contact.jobRole,
              department: contact.department,
              email: contact.email,
              phone: contact.phone,
              tel: contact.tel,
              remarks: contact.remarks,
              isPrimary: contact.isPrimary,
            })),
          },
        },
      });

      return customer;
    });
  }

  async update(id: number, dto: UpdateCustomerDto) {
    const { contacts, ...customerData } = dto;

    return this.prisma.$transaction(async (tx) => {
      // 1. 고객사 기본 정보 수정
      const updatedCustomer = await tx.customer.update({
        where: { id },
        data: {
          ...customerData,
          // 2. 담당자 목록 처리: 기존 것 삭제 후 새로 생성 (가장 안전한 방식)
          contacts: contacts
            ? {
                deleteMany: {}, // 해당 고객사의 모든 담당자 삭제
                create: contacts.map((contact) => ({
                  name: contact.name,
                  jobRole: contact.jobRole,
                  department: contact.department,
                  email: contact.email,
                  phone: contact.phone,
                  tel: contact.tel,
                  remarks: contact.remarks,
                  isPrimary: contact.isPrimary,
                })),
              }
            : undefined,
        },
        include: {
          contacts: true,
        },
      });

      return updatedCustomer;
    });
  }

  async delete(id: number) {
    // 1. 삭제 전 해당 고객사가 존재하는지 확인
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`ID가 ${id}인 고객사를 찾을 수 없습니다.`);
    }

    // schema.prisma에 onDelete: Cascade가 설정되어 있어
    // 연결된 customer_contact 데이터도 자동으로 함께 삭제됩니다.
    await this.prisma.customer.delete({
      where: { id },
    });

    return { message: '고객사 정보와 관련 담당자 정보가 모두 삭제되었습니다.', id };
  }
}
