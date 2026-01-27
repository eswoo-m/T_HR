import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterProjectDto } from './dto/register-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectAssignmentDto } from '../common/dto/project-assignment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterProjectDto) {
    // 1. 구조 분해 할당 확인 (contacts로 통합해서 받기로 한 경우)000
    const { customerId, name, amount, location, taskName, taskSummary, remarks, startDate, endDate, departmentId, teamId, contacts, projectAssignment } = dto;

    // 2. 고객사 존재 여부 확인
    if (customerId) {
      const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
      if (!customer) throw new NotFoundException('해당 고객사를 찾을 수 없습니다.');
    }

    // 3. 중복 체크
    const isExist = await this.prisma.project.findFirst({
      where: { customerId, name },
    });
    if (isExist) throw new ConflictException('해당 고객사에 이미 동일한 이름의 프로젝트가 존재합니다.');
    return this.prisma.$transaction(async (tx) => {
      // 3. 담당자(Contacts) 데이터 가공
      const projectContactData = (contacts ?? []).map((c) => {
        if (c.id) {
          return { contact: { connect: { id: c.id } } };
        } else {
          return {
            contact: {
              create: {
                name: c.name,
                email: c.email,
                phone: c.phone,
                jobRole: c.jobRole,
                department: c.department,
                customer: { connect: { id: customerId } },
              },
            },
          };
        }
      });

      // 4. 프로젝트 생성 (인력 및 상세 기간 포함)
      return tx.project.create({
        data: {
          name,
          amount,
          location,
          taskName,
          taskSummary,
          remarks,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,

          customer: { connect: { id: customerId } },
          department: departmentId ? { connect: { id: departmentId } } : undefined,
          team: teamId ? { connect: { id: teamId } } : undefined,

          // 담당자 연결/생성
          projectContacts: {
            create: projectContactData,
          },

          // ✅ 인력 및 상세 투입 기간(Period) 계층적 생성
          projectAssignment: projectAssignment?.length ? this.formatAssignmentData(projectAssignment) : undefined,
        },
        include: {
          customer: true,
          department: true,
          team: true,
          projectAssignment: {
            include: {
              employee: true,
              projectAssignmentPeriod: true,
            },
          },
          projectContacts: { include: { contact: true } },
        },
      });
    });
  }

  async query(query: QueryProjectsDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { keyword, departmentId, teamId, status } = query;

    // 1. 페이지네이션 계산
    const skip = (page - 1) * limit;

    // 2. 동적 WHERE 조건 구성
    const where: Prisma.ProjectWhereInput = {
      AND: [
        // 1. 키워드 검색 (OR 조건)
        ...(keyword
          ? [
              {
                OR: [
                  { name: { contains: keyword, mode: 'insensitive' as const } },
                  {
                    customer: {
                      name: { contains: keyword, mode: 'insensitive' as const },
                    },
                  },
                ],
              },
            ]
          : []),

        // 2. 부서/팀/상태 셀렉트 박스
        ...(departmentId ? [{ departmentId }] : []),
        ...(teamId ? [{ teamId }] : []),
        ...(status ? [{ status }] : []),
      ],
    };

    try {
      const [total, items] = await this.prisma.$transaction([
        this.prisma.project.count({ where }),
        this.prisma.project.findMany({
          where,
          skip,
          take: limit,
          include: {
            customer: { select: { name: true } },
            department: { select: { name: true } },
            team: { select: { name: true } },
            _count: {
              select: { projectContacts: true },
            },
          },
          orderBy: { regTime: 'desc' },
        }),
      ]);

      const formattedItems = items.map((item) => {
        const deptName = item.department?.name || '';
        const teamName = item.team?.name || '';

        return {
          id: item.id,
          name: item.name,
          amount: item.amount,
          displayOrg: [deptName, teamName].filter(Boolean).join(' / '),
          customerName: item.customer?.name || '미지정',
          status: item.status,
          startDate: item.startDate,
          endDate: item.endDate,
          memberCount: item._count.projectContacts,
          regTime: item.regTime,
        };
      });

      return {
        items: formattedItems,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('목록 조회 중 오류가 발생했습니다.');
    }
  }

  async get(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        department: { select: { name: true } },
        team: { select: { name: true } },
        customer: true,
        projectContacts: {
          include: {
            // ✅ 2. 조회된 contact_id로 실제 담당자(customer_contact) 정보 추출
            contact: true,
          },
        },

        projectAssignment: {
          include: {
            employee: {
              include: {
                department: { select: { name: true } },
                team: { select: { name: true } },
              },
            },
            projectAssignmentPeriod: {
              orderBy: { startDate: 'asc' },
            },
          },
        },

        // 인원수는 이제 projectAssignments의 개수를 세어야 합니다.
        _count: { select: { projectAssignment: true } },
      },
    });

    if (!project) throw new NotFoundException('프로젝트를 찾을 수 없습니다.');

    // 1. 프로젝트 전체 기간(일수) 계산 함수
    const getDaysBetween = (start: Date | string, end: Date | string) => {
      const s = new Date(start);
      const e = new Date(end);
      const diffTime = Math.abs(e.getTime() - s.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const totalProjectDays = getDaysBetween(project.startDate ?? new Date(), project.endDate || new Date());

    const allMemberHistory = project.projectAssignment.flatMap((pa) => {
      const periods = pa.projectAssignmentPeriod || [];

      return periods.map((period) => {
        let inputRate = 0;

        if (period.endDate) {
          const periodDays = getDaysBetween(period.startDate, period.endDate);
          inputRate = totalProjectDays > 0 ? Math.round((periodDays / totalProjectDays) * 100) : 0;
        }

        return {
          id: pa.employee.id,
          assignmentId: pa.id,
          periodId: period.id,
          name: pa.employee.nameKr,
          assignmentStatus: period.status || '미정',
          assignedRole: pa.assignedRole,
          jobRole: pa.employee.jobRole,
          department: pa.employee.department?.name || '',
          team: pa.employee.team?.name || '',
          inputRate: inputRate,
          inputPeriod: `${this.formatDate(period.startDate)} ~ ${this.formatDate(period.endDate)}`,
          email: pa.employee.email,
        };
      });
    });

    allMemberHistory.sort((a, b) => a.name.localeCompare(b.name));
    return {
      basicInfo: {
        id: project.id,
        name: project.name,
        orgText: [project.department?.name, project.team?.name].filter(Boolean).join(' > '),
        period: `${this.formatDate(project.startDate)} ~ ${this.formatDate(project.endDate)}`,
        status: project.status,
        location: project.location,
        headcount: project.headcount,
        customerName: project.customer?.name || '미정',
        amount: project.amount,
        remarks: project.remarks,
        taskName: project.taskName,
        taskSummary: project.taskSummary,
        customerContacts: (project.projectContacts || []).map((pc) => ({
          name: pc.contact.name,
          jobRole: pc.contact.jobRole,
          department: pc.contact.department,
          tel: pc.contact.tel,
          phone: pc.contact.phone,
          email: pc.contact.email,
          remarks: pc.contact.remarks,
        })),
      },
      members: allMemberHistory,
    };
  }

  async update(id: number, dto: UpdateProjectDto) {
    const { endDate, status, departmentId, teamId, location, taskSummary, remarks, projectAssignment } = dto;

    try {
      return this.prisma.$transaction(async (tx) => {
        // 1. 대상 프로젝트 존재 확인
        const currentProject = await tx.project.findUnique({ where: { id } });
        if (!currentProject) throw new NotFoundException('프로젝트를 찾을 수 없습니다.');

        // 2. 인력 데이터 변경 여부 확인
        // projectAssignment가 배열로 들어왔을 때만 기존 데이터를 삭제하고 새로 생성합니다.
        const isMembersUpdated = Array.isArray(projectAssignment);

        // 3. 기존 데이터 초기화 (상세 기간 -> 인력 순으로 삭제)
        if (isMembersUpdated) {
          // 상세 기간(Period) 먼저 삭제
          await tx.projectAssignmentPeriod.deleteMany({
            where: { assignment: { projectId: id } },
          });
          // 인력 투입(Assignment) 삭제
          await tx.projectAssignment.deleteMany({
            where: { projectId: id },
          });
        }

        // 4. 프로젝트 정보 및 인력 데이터 업데이트
        return tx.project.update({
          where: { id },
          data: {
            departmentId: departmentId ?? undefined,
            teamId: teamId ?? undefined,
            status: status ?? undefined,
            location: location ?? undefined,
            taskSummary: taskSummary ?? undefined,
            remarks: remarks ?? undefined,
            // 종료일 처리 (null이면 삭제, 값이 있으면 변환)
            endDate: endDate ? new Date(endDate) : endDate === null ? null : undefined,

            // ✅ 공통 DTO 구조를 활용한 중첩 생성(Nested Create)
            projectAssignment: isMembersUpdated ? this.formatAssignmentData(projectAssignment) : undefined,
          },
          include: {
            department: true,
            team: true,
            projectAssignment: {
              include: {
                employee: true,
                projectAssignmentPeriod: true,
              },
            },
          },
        });
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`프로젝트 수정 실패: ${error.message}`);
        throw error;
      }
      throw new InternalServerErrorException('수정 중 서버 오류가 발생했습니다.');
    }
  }

  private formatDate(date: Date | null): string {
    return date ? date.toISOString().split('T')[0] : '미정';
  }

  private formatAssignmentData(projectAssignment: ProjectAssignmentDto[]) {
    return {
      create: projectAssignment.map((pa) => ({
        employeeId: String(pa.employeeId),
        startDate: pa.startDate ? new Date(pa.startDate) : new Date(),
        endDate: pa.endDate ? new Date(pa.endDate) : null,
        assignedRole: pa.assignedRole || '팀원',
        projectAssignmentPeriod: {
          create: (pa.projectAssignment ?? []).map((period) => ({
            status: period.status || '투입_정산',
            startDate: new Date(period.startDate),
            endDate: period.endDate ? new Date(period.endDate) : null,
          })),
        },
      })),
    };
  }
}
