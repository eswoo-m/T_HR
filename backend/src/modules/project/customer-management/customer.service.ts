import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueryCustomerDto } from './dto/query-customer.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { formatDate } from '../../../common/utils/date.util';
import { CustomerWithCounts } from '../../../types/customer-with-counts.interface';
import { CustomerListItemDto, CustomerSummaryDto } from './dto/customer-response.dto';
import { CustmerDto } from '../../dto/custmer.dto';

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
  async get(id: number): Promise<CustmerDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        contacts: {
          include: {
            projectContacts: {
              include: {
                project: true,
              },
            },
          },
          orderBy: { isPrimary: 'desc' },
        },
        projects: {
          orderBy: { regTime: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('존재하지 않는 고객사입니다.');
    }

    const result: CustmerDto = {
      id: customer.id,
      name: customer.name,
      businessNo: customer.businessNo ?? '',
      ceoName: customer.ceoName ?? '',
      tel: customer.tel ?? '',
      fax: customer.fax ?? '',
      address: customer.address ?? '',
      homepage: customer.homepage ?? '',
      industry: customer.industry ?? '',
      status: customer.status,
      remarks: customer.remarks ?? '',
      regDate: customer.regTime,

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
        projectContacts: c.projectContacts
          ? c.projectContacts.map((pc) => ({
              id: pc.id,
              projectId: pc.projectId,
              projectName: pc.project?.name ?? '알 수 없는 프로젝트', // ⭐️ 참조한 프로젝트명 삽입
              contactId: pc.contactId,
              regTime: pc.regTime || new Date(),
            }))
          : [],
      })),

      projects: customer.projects.map((p) => ({
        id: p.id,
        name: p.name,
        startDate: formatDate(p.startDate),
        endDate: formatDate(p.endDate),
        amount: p.amount ? Number(p.amount) : 0,
      })),
    };
    return result;
  }

  async register(dto: RegisterCustomerDto) {
    const { contacts, ...customerData } = dto;

    if (!dto.businessNo) {
      throw new BadRequestException('사업자등록번호는 필수입니다.');
    }

    // 트랜잭션 시작
    return this.prisma.$transaction(async (tx) => {
      // 2. 중복 체크
      const existingCustomer = await tx.customer.findUnique({
        where: { businessNo: customerData.businessNo },
      });

      if (existingCustomer) {
        throw new ConflictException('이미 등록된 사업자등록번호입니다.');
      }

      // 3. 고객사 생성 (DB 컬럼에 맞는 데이터만 전달)
      const customer = await tx.customer.create({
        data: {
          name: customerData.name,
          businessNo: customerData.businessNo,
          ceoName: customerData.ceoName,
          address: customerData.address,
          industry: customerData.industry,
          status: customerData.status,
          tel: customerData.tel,
          fax: customerData.fax,
          homepage: customerData.homepage,
          remarks: customerData.remarks,
          // 담당자 생성 로직
          contacts:
            contacts && contacts.length > 0
              ? {
                  create: contacts.map((contact) => ({
                    name: contact.name,
                    jobRole: contact.jobRole || '',
                    department: contact.department || '',
                    email: contact.email || '',
                    phone: contact.phone || '',
                    tel: contact.tel || '',
                    remarks: contact.remarks || '',
                    isPrimary: contact.isPrimary ?? false,
                  })),
                }
              : undefined,
        },
      });

      return customer;
    });
  }

  async update(id: number, dto: UpdateCustomerDto) {
    const { contacts, ...customerData } = dto;

    return this.prisma.$transaction(async (tx) => {
      // 2. 고객사 업데이트
      const updatedCustomer = await tx.customer.update({
        where: { id: id }, // 업데이트 대상 ID는 여기서 사용
        data: {
          name: customerData.name,
          businessNo: customerData.businessNo,
          ceoName: customerData.ceoName,
          address: customerData.address,
          industry: customerData.industry,
          tel: customerData.tel,
          fax: customerData.fax,
          homepage: customerData.homepage,
          remarks: customerData.remarks,

          // 3. 담당자 목록 처리 (기존 것 삭제 후 새로 생성하는 방식)
          contacts: contacts
            ? {
                deleteMany: {},
                create: contacts.map((contact) => ({
                  name: contact.name,
                  jobRole: contact.jobRole || '',
                  department: contact.department || '',
                  email: contact.email || '',
                  phone: contact.phone || '',
                  tel: contact.tel || '',
                  remarks: contact.remarks || '',
                  isPrimary: contact.isPrimary ?? false,
                })),
              }
            : undefined,
        },
      });

      return updatedCustomer;
    });
  }

  async delete(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`ID가 ${id}인 고객사를 찾을 수 없습니다.`);
    }

    await this.prisma.customer.update({
      where: { id },
      data: {
        status: 'TERMINATED',
      },
    });

    return { message: '고객사 정보와 관련 담당자 정보가 모두 삭제되었습니다.', id };
  }
}
