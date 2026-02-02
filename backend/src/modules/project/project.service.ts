import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterProjectDto } from './dto/register-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectAssignmentDto } from '@common/dto/project-assignment.dto';
import { UpdateMemberAssignmentDto } from './dto/update-member-assignment.dto';
import { formatDate } from '@common/utils/date.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterProjectDto) {
    // 1. 구조 분해 할당 확인 (contacts로 통합해서 받기로 한 경우)000
    const { customerId, name, amount, location, taskName, taskSummary, remarks, startDate, endDate, teamId, contacts, projectAssignment } = dto;

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
          team: teamId ? { connect: { id: teamId } } : undefined,

          // 담당자 연결/생성
          projectContacts: {
            create: projectContactData,
          },

          projectAssignment: projectAssignment?.length ? this.formatAssignmentData(projectAssignment) : undefined,
        },
        include: {
          customer: true,
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

  async query(dto: QueryProjectsDto) {
    const { keyword, departmentId, teamId, status, minHeadcount, maxHeadcount, startDate, endDate, minAmount, maxAmount } = dto;

    const where: Prisma.ProjectWhereInput = {
      AND: [
        ...(keyword
          ? [
              {
                OR: [{ name: { contains: keyword, mode: 'insensitive' as const } }, { customer: { name: { contains: keyword, mode: 'insensitive' as const } } }],
              },
            ]
          : []),

        // 2. 부서 및 팀 필터 (Organization 관계 활용)
        ...(teamId ? [{ teamId: teamId }] : []),
        ...(departmentId && !teamId
          ? [
              {
                team: {
                  OR: [{ id: departmentId }, { parentId: departmentId }],
                },
              },
            ]
          : []),

        // 3. 진행 단계(상태)
        ...(status ? [{ status }] : []),

        // 4. 투입 인원 범위 검색
        ...(minHeadcount !== undefined || maxHeadcount !== undefined
          ? [
              {
                headcount: {
                  gte: minHeadcount ?? 0,
                  ...(maxHeadcount && { lte: maxHeadcount }),
                },
              },
            ]
          : []),

        // 5. 날짜 범위 검색 (프로젝트 기간 내 포함 여부)
        ...(startDate ? [{ startDate: { gte: new Date(startDate) } }] : []),
        ...(endDate ? [{ endDate: { lte: new Date(endDate) } }] : []),

        // 6. 예산(계약금) 범위 검색
        ...(minAmount !== undefined || maxAmount !== undefined
          ? [
              {
                amount: {
                  gte: minAmount ?? 0,
                  ...(maxAmount && { lte: maxAmount }),
                },
              },
            ]
          : []),
      ],
    };

    const projects = await this.prisma.project.findMany({
      where,
      include: {
        customer: { select: { name: true } },
        team: {
          select: {
            name: true,
            parent: { select: { name: true } }, // 부서명을 가져오기 위해 상위 조직 포함
          },
        },
      },
      orderBy: { regTime: 'desc' },
    });

    // 데이터 가공: 목록 구성 (프로젝트명, 고객사, 부서명, 팀명, 상태, 기간, 예산, 인력)
    return projects.map((p) => ({
      id: p.id,
      projectName: p.name,
      customerName: p.customer?.name ?? '-',
      // 부서명/팀명 구분 로직
      departmentName: p.team?.parent?.name ?? p.team?.name ?? '-',
      teamName: p.team?.parent ? p.team.name : '-',
      status: p.status,
      period: `${p.startDate?.toISOString().split('T')[0] ?? ''} ~ ${p.endDate?.toISOString().split('T')[0] ?? '진행중'}`,
      amount: p.amount,
      headcount: p.headcount,
    }));
  }

  async get(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            parent: { select: { name: true } },
          },
        },
        customer: true,
        projectContacts: {
          include: { contact: true },
        },
        projectAssignment: {
          include: {
            employee: {
              include: {
                team: {
                  include: { parent: { select: { name: true } } },
                },
              },
            },
            projectAssignmentPeriod: {
              orderBy: { startDate: 'asc' },
            },
          },
        },
        _count: { select: { projectAssignment: true } },
      },
    });

    if (!project) throw new NotFoundException('프로젝트를 찾을 수 없습니다.');

    const getDaysBetween = (start: Date | string, end: Date | string) => {
      const s = new Date(start);
      const e = new Date(end);
      const diffTime = Math.abs(e.getTime() - s.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const totalProjectDays = getDaysBetween(project.startDate ?? new Date(), project.endDate || new Date());

    const allMemberHistory = (project.projectAssignment || []).flatMap((pa) => {
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
          department: pa.employee.team?.parent?.name || '',
          team: pa.employee.team?.name || '',
          inputRate,
          startDate: period.startDate,
          endDate: period.endDate,
          email: pa.employee.email,
        };
      });
    });

    allMemberHistory.sort((a, b) => a.name.localeCompare(b.name));

    // 3. 최종 반환 객체
    return {
      basicInfo: {
        id: project.id,
        name: project.name,
        orgText: [project.team?.parent?.name, project.team?.name].filter(Boolean).join(' > '),
        startDate: project.startDate,
        endDate: project.endDate,
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
    const { endDate, status, teamId, location, taskSummary, remarks, projectAssignment } = dto;

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
            teamId: teamId ?? undefined,
            status: status ?? undefined,
            location: location ?? undefined,
            taskSummary: taskSummary ?? undefined,
            remarks: remarks ?? undefined,
            endDate: endDate ? new Date(endDate) : endDate === null ? null : undefined,

            // ✅ 공통 DTO 구조를 활용한 중첩 생성(Nested Create)
            projectAssignment: isMembersUpdated ? this.formatAssignmentData(projectAssignment) : undefined,
          },
          include: {
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

  async getMemberAssignmentData(projectId: number, employeeId: string) {
    try {
      const data = await this.prisma.projectAssignment.findFirst({
        where: {
          projectId: projectId,
          employeeId: employeeId,
        },
        include: {
          project: true,
          employee: {
            include: {
              department: true,
              team: true,
            },
          },
          projectAssignmentPeriod: {
            orderBy: { startDate: 'asc' },
          },
        },
      });

      if (!data) throw new NotFoundException('투입 정보를 찾을 수 없습니다.');

      // 해당 프로젝트 기간 내의 월별 M/M 정보를 별도로 가져옵니다.
      const monthlyMm = await this.prisma.employeeMonthlyMm.findMany({
        where: {
          employeeId: employeeId,
          // 프로젝트 기간 내 데이터만 필터링 (필요시)
          yearMonth: {
            gte: data.startDate.toISOString().substring(0, 7),
          },
        },
        orderBy: { yearMonth: 'asc' },
      });

      // UI 데이터 매핑
      return {
        employee: {
          id: data.employee.id,
          name: data.employee.nameKr,
          jobRole: data.employee.jobRole || '',
          department: data.employee.department?.name || '-',
          team: data.employee.team?.name || '-',
        },
        project: {
          id: data.project.id,
          name: data.project.name,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.startDate),
        },
        periods: data.projectAssignmentPeriod.map((p) => ({
          status: p.status ?? '',
          startDate: formatDate(p.startDate),
          endDate: formatDate(p.endDate),
        })),
        monthlyMms: monthlyMm.map((m) => ({
          yearMonth: m.yearMonth,
          startDate: m.startDate,
          endDate: m.endDate,
          assignStatus: m.assignStatus ?? '',
          mmValue: Number(m.value), // Decimal 타입을 number로 변환
        })),
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(`데이터베이스 요청 오류: ${error.code}`);
      }

      const errorMessage = error instanceof Error ? error.message : String(error);

      console.error(`[Project Assignment Detail Error]: ${errorMessage}`);

      throw new InternalServerErrorException(errorMessage);
    }
  }

  async updateMemberAssignment(projectId: number, employeeId: string, updateDto: UpdateMemberAssignmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.projectAssignment.findFirst({
        where: { projectId, employeeId },
        select: { id: true },
      });

      if (!assignment) {
        throw new NotFoundException('해당 프로젝트 투입 정보를 찾을 수 없습니다.');
      }

      const assignmentId = assignment.id;

      // 1. 기존 투입 기간(Periods) 삭제 후 재생성 (Delete-Insert 방식이 가장 안전함)
      await tx.projectAssignmentPeriod.deleteMany({
        where: { assignmentId },
      });

      await tx.projectAssignmentPeriod.createMany({
        data: updateDto.periods.map((p) => ({
          assignmentId: assignmentId,
          status: p.status,
          startDate: new Date(p.startDate),
          endDate: p.endDate ? new Date(p.endDate) : null,
        })),
      });

      // 2. 월별 M/M 데이터 업데이트
      // 만약 프론트에서 계산된 monthly 데이터를 보낸다면 그것을 저장
      // if (updateDto.monthly && updateDto.monthly.length > 0) {
      //   await tx.employeeMonthlyMm.deleteMany({
      //     where: { employeeId, projectId }, // 해당 프로젝트 관련 M/M만 삭제
      //   });
      //
      //   await tx.employeeMonthlyMm.createMany({
      //     data: updateDto.monthly.map((m) => ({
      //       employeeId,
      //       projectId,
      //       yearMonth: m.yearMonth,
      //       startDate: new Date(m.startDate),
      //       endDate: new Date(m.endDate),
      //       assignStatus: m.assignStatus,
      //       value: m.mmValue, // Decimal로 자동 변환됨
      //     })),
      //   });
      // }

      return { success: true };
    });
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
