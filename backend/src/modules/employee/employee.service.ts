import { Injectable } from '@nestjs/common';
import { ConflictException, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getKstDate } from '../../common/utils/date.util';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { QueryEmployeeDto, CareerRange } from './dto/query-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeDetailResponseDto } from './dto/employee-detail-response.dto';
import { calculateTotalCareerMonths } from '../../common/utils/date.util';
import { getErrorMessage } from '../../common/utils/error.util';

import * as bcrypt from 'bcrypt';

type EmployeeWithRelations = Prisma.EmployeeGetPayload<{
  include: {
    employeeDetail: true;
    technicalAbility: true;
    employeeTool: true;
    department: true;
    team: true;
    certificates: true;
    previousExperiences: true;
    assets: true;
    preProjectAssignments: true;
    projectAssignments: {
      include: {
        project: {
          include: {
            customer: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  // 계정생성
  async register(dto: RegisterEmployeeDto, adminId: string) {
    const TODAY = getKstDate();

    // 1. 중복 체크 (id, no, residentNo)
    const existing = await this.prisma.employee.findFirst({
      where: {
        OR: [{ id: dto.id }, { no: dto.no }, { AND: [{ residentNo: dto.residentNo }, { exitDate: null }] }],
      },
    });

    if (existing) {
      if (existing.id === dto.id) throw new ConflictException('이미 사용 중인 아이디입니다.');
      if (existing.no === dto.no) throw new ConflictException('이미 사용 중인 사번입니다.');
      throw new ConflictException('이미 등록된 주민번호입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      try {
        const employee = await tx.employee.create({
          data: {
            id: dto.id,
            no: dto.no,
            nameKr: dto.nameKr,
            nameEn: dto.nameEn,
            nameCh: dto.nameCh,
            residentNo: dto.residentNo,
            password: hashedPassword,
            birthDate: new Date(dto.birthDate),
            isLunar: dto.isLunar ?? false,
            gender: dto.gender,
            departmentId: dto.departmentId,
            teamId: dto.teamId,
            deptId: dto.deptId,
            jobLevel: dto.jobLevel,
            jobRole: dto.jobRole,
            assignStatus: dto.assignStatus,
            authLevel: dto.authLevel,
            email: dto.email,
            joinDate: new Date(dto.joinDate),
            phone: dto.phone,
          },
        });

        // 상세정보
        await tx.employeeDetail.create({
          data: {
            employeeId: employee.id,
            type: dto.type || '정규직',
            hrStatus: dto.hrStatus || '재직',
            skillLevel: dto.skillLevel || '초급',
            lastSchool: dto.lastSchool,
            major: dto.major,
            // previousExperiences: dto.previousExperiences,
            // certificates: dto.certificates,
            maritalStatus: dto.maritalStatus,
            totalSwExperience: dto.totalSwExperience || 0,
            zipCode: dto.zipCode,
            address: dto.address,
            addressDetail: dto.addressDetail,
            profilePath: dto.profilePath,
          },
        });

        // 최초 부서 이력 생성
        await tx.employeeOrganizationHistory.create({
          data: {
            employeeId: employee.id,
            departmentId: dto.departmentId,
            teamId: dto.teamId,
            jobLevel: dto.jobLevel,
            jobRole: dto.jobRole,
            applyDate: new Date(TODAY),
          },
        });

        // 전직장 경력 등록 (있을 경우)
        if (dto.previousExperiences && dto.previousExperiences.length > 0) {
          await tx.previousExperience.createMany({
            data: dto.previousExperiences.map((exp) => ({
              employeeId: employee.id,
              companyName: exp.companyName,
              department: exp.department,
              jobLevel: exp.jobLevel,
              jobRole: exp.jobRole,
              relevance: exp.relevance,
              entranceDate: new Date(exp.entranceDate),
              resignationDate: exp.resignationDate ? new Date(exp.resignationDate) : null,
              assignedTask: exp.assignedTask,
            })),
          });
        }

        // 자격증 및 파일 등록 (있을 경우)
        if (dto.certificates && dto.certificates.length > 0) {
          for (const cert of dto.certificates) {
            const newCert = await tx.certificate.create({
              data: {
                employeeId: employee.id,
                type: cert.type,
                name: cert.name,
                issuingAuthority: cert.issuingAuthority,
                acquisitionDate: new Date(cert.acquisitionDate),
                expDate: cert.expDate ? new Date(cert.expDate) : null,
              },
            });

            if (cert.attachmentPaths && cert.attachmentPaths.length > 0) {
              const path = cert.attachmentPaths[0]; // 무조건 첫 번째 파일만 취함

              await tx.attachment.create({
                data: {
                  employeeId: employee.id, // 사원 PK (누구의 파일인가)
                  uploaderId: adminId, // 관리자 PK (누가 올렸는가)
                  certificateId: newCert.id, // 자격증 PK (어떤 자격증의 파일인가)

                  fileType: 'CERTIFICATE',
                  filePath: path,
                  // 필수값 fileName 추출 (에러 해결)
                  fileName: path.split('/').pop() || 'cert_file',

                  // 기존에 사용하던 ref 구조가 있다면 유지
                  refId: newCert.id,
                  refType: 'CERTIFICATE',
                },
              });
            }
          }
        }

        // 자산 할당
        if (dto.assetIds && dto.assetIds.length > 0) {
          await tx.asset.updateMany({
            where: {
              id: { in: dto.assetIds },
              employeeId: null,
            },
            data: {
              employeeId: employee.id,
              assignDate: new Date(TODAY),
              status: '사용중',
            },
          });
        }
      } catch (error) {
        console.error('Registration Transaction Error:', error);
        throw new InternalServerErrorException('사원 등록 처리 중 오류가 발생했습니다.');
      }
    });
  }

  // 인사관리 정보조회
  async query(filter: QueryEmployeeDto) {
    try {
      const { departmentId, teamId, searchKeyword, skillLevel, assignStatus, careerRange } = filter;

      // 1. Prisma 조회 쿼리 구성
      const employees = await this.prisma.employee.findMany({
        where: {
          assignStatus: assignStatus || undefined,
          // 사원 상세 정보(기술등급) 필터
          employeeDetail: skillLevel ? { is: { skillLevel } } : undefined,
          // 이름 또는 사번 검색
          OR: searchKeyword ? [{ nameKr: { contains: searchKeyword } }, { no: { contains: searchKeyword } }] : undefined,
          // 소속 조직 필터 (현재 소속 기준)
          ...(departmentId && { departmentId }),
          ...(teamId && { teamId }),
        },
        include: {
          employeeDetail: true,
          previousExperiences: true,
          _count: { select: { certificates: true } },
          department: true,
          team: true,
        },
      });

      const list = employees.map((emp) => {
        const totalMonths = calculateTotalCareerMonths(emp.previousExperiences);
        const totalYears = Math.floor(totalMonths / 12);

        return {
          id: emp.id,
          name: emp.nameKr,
          department: true,
          team: true,
          jobRol: emp.jobRole,
          assignStatus: emp.assignStatus,
          skillLevel: emp.employeeDetail?.skillLevel || '미등록',
          count: emp._count?.certificates ?? 0,
          totalCareerYear: totalYears,
        };
      });

      // 3. 경력 범위 필터링 (In-memory 필터링)
      if (!careerRange) return list;
      return list.filter((emp) => this.isWithinCareerRange(emp.totalCareerYear, careerRange));
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  async get(id: string): Promise<EmployeeDetailResponseDto> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        employeeDetail: true,
        employeeTool: true,
        department: true,
        team: true,
        certificates: true,
        previousExperiences: true,
        assets: true,
        technicalAbility: true,
        preProjectAssignments: true,
        projectAssignments: {
          include: {
            project: {
              include: {
                customer: true,
              },
            },
          },
        },
      },
    });

    if (!employee) throw new NotFoundException();

    return this.mapToDetailDto(employee as EmployeeWithRelations);
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. 사원 기본 정보 (반드시 존재하므로 update)
      await tx.employee.update({
        where: { id },
        data: {
          nameEn: dto.nameEn,
          nameCh: dto.nameCh,
          departmentId: dto.departmentId,
          teamId: dto.teamId,
          deptId: dto.deptId,
          jobLevel: dto.jobLevel,
          jobRole: dto.jobRole,
          assignStatus: dto.assignStatus,
          authLevel: dto.authLevel,
          email: dto.email,
          phone: dto.phone,
        },
      });

      // 2. 사원 상세 정보 (반드시 존재하므로 update)
      await tx.employeeDetail.update({
        where: { employeeId: id },
        data: {
          type: dto.type,
          hrStatus: dto.hrStatus,
          lastSchool: dto.lastSchool,
          major: dto.major,
          maritalStatus: dto.maritalStatus,
          zipCode: dto.zipCode,
          address: dto.address,
          addressDetail: dto.addressDetail,
          profilePath: dto.profilePath,
        },
      });

      // 3. 기술 역량 (1:1 관계 - upsert 활용)
      if (dto.technicalAbility) {
        await tx.technicalAbility.upsert({
          where: { employeeId: id },
          update: {
            communicationSkill: dto.technicalAbility.communication,
            officeSkill: dto.technicalAbility.officeSkill,
            testDesign: dto.technicalAbility.testDesign,
            testExecution: dto.technicalAbility.testExecution,
          },
          create: {
            employeeId: id,
            communicationSkill: dto.technicalAbility.communication,
            officeSkill: dto.technicalAbility.officeSkill,
            testDesign: dto.technicalAbility.testDesign,
            testExecution: dto.technicalAbility.testExecution,
          },
        });
      }

      // 4. 자격증 및 경력 (1:N 관계 - Delete-Insert 전략)
      await tx.certificate.deleteMany({ where: { employeeId: id } });
      if (dto.certificates && dto.certificates.length > 0) {
        for (const cert of dto.certificates) {
          const newCert = await tx.certificate.create({
            data: {
              employeeId: id,
              type: cert.type,
              name: cert.name,
              issuingAuthority: cert.issuingAuthority,
              acquisitionDate: new Date(cert.acquisitionDate),
              expDate: cert.expDate ? new Date(cert.expDate) : null,
            },
          });

          if (cert.attachmentPaths && cert.attachmentPaths.length > 0) {
            const path = cert.attachmentPaths[0]; // 무조건 첫 번째 파일만 취함

            await tx.attachment.create({
              data: {
                employeeId: id,
                uploaderId: id,
                certificateId: newCert.id, // 자격증 PK (어떤 자격증의 파일인가)

                fileType: 'CERTIFICATE',
                filePath: path,
                // 필수값 fileName 추출 (에러 해결)
                fileName: path.split('/').pop() || 'cert_file',

                // 기존에 사용하던 ref 구조가 있다면 유지
                refId: newCert.id,
                refType: 'CERTIFICATE',
              },
            });
          }
        }
      }

      // 5. 프로젝트 투입 이력 (ProjectAssignment)
      await tx.projectAssignment.deleteMany({ where: { employeeId: id } });
      if (dto.projects && dto.projects.length > 0) {
        const projects = dto.projects;

        await tx.projectAssignment.createMany({
          data: projects.map((proj) => ({
            employeeId: id,
            projectId: Number(proj.projectId),

            startDate: proj.startDate,
            endDate: proj.endDate ?? null,
            assignedRole: proj.assignedRole ?? null,
            tools: proj.tools ?? null,
            workDetail: proj.workDetail ?? null,
            contribution: proj.contribution ?? null,
          })),
        });
      }

      // 6. 자산할당

      // 7. 부서나 직급 변경시 조직히스토리
    });
  }

  /** 경력 구간 체크 함수 */
  private isWithinCareerRange(years: number, range: CareerRange): boolean {
    const ranges = {
      [CareerRange.BEGINNER]: years <= 3,
      [CareerRange.JUNIOR]: years >= 4 && years <= 7,
      [CareerRange.SENIOR]: years >= 8 && years <= 12,
      [CareerRange.EXPERT]: years >= 13,
    };
    return ranges[range] ?? true;
  }

  private calculatePeriod(start: Date | null, end: Date | null): string {
    if (!start) return '기간 미상';
    const startYear = start.getFullYear();
    const endYear = end ? end.getFullYear() : '현재';
    return `${startYear} ~ ${endYear}`;
  }

  private mapToDetailDto(emp: EmployeeWithRelations): EmployeeDetailResponseDto {
    if (!emp) throw new Error('Data mapping failed: Employee object is null');

    return {
      // 1. 기본정보 (구조에 맞게 가공)
      basicInfo: {
        id: emp.id,
        no: emp.no,
        nameKr: emp.nameKr,
        nameEn: emp.nameEn,
        nameCh: emp.nameCh,
        residentNo: emp.residentNo,
        birthDate: new Date(emp.birthDate),
        isLunar: emp.isLunar,
        gender: emp.gender,
        departmentId: emp.departmentId,
        teamId: emp.teamId,
        jobLevel: emp.jobLevel,
        jobRole: emp.jobRole,
        assignStatus: emp.assignStatus,
        email: emp.email,
        joinDate: new Date(emp.joinDate),
        phone: emp.phone || null,
        type: emp.employeeDetail?.type || null,
        hrStatus: emp.employeeDetail?.hrStatus || null,
        skillLevel: emp.employeeDetail?.skillLevel || null,
        leaveStartDate: emp.employeeDetail?.leaveStartDate || null,
        leaveEndDate: emp.employeeDetail?.leaveEndDate || null,
        eduLevel: emp.employeeDetail?.eduLevel || null,
        lastSchool: emp.employeeDetail?.lastSchool || null,
        major: emp.employeeDetail?.major || null,
        entranceDate: emp.employeeDetail?.entranceDate || null,
        graduationDate: emp.employeeDetail?.graduationDate || null,
        totalSwExperience: emp.employeeDetail?.totalSwExperience || null,
        prevSwExperience: emp.employeeDetail?.totalSwExperience || null,
        maritalStatus: emp.employeeDetail?.maritalStatus || null,
        weddingAnniv: emp.employeeDetail?.weddingAnniv || null,
        emergencyPhone: emp.employeeDetail?.emergencyPhone || null,
        emergencyRelation: emp.employeeDetail?.emergencyRelation || null,
        zipCode: emp.employeeDetail?.zipCode || null,
        address: emp.employeeDetail?.address || null,
        addressDetail: emp.employeeDetail?.addressDetail || null,
        experienceDisplay: `${Math.floor((emp.employeeDetail?.totalSwExperience || 0) / 12)}년`,
        remarks: emp.employeeDetail?.remarks || null,
        profileImage: emp.employeeDetail?.profilePath ?? null,
        previousExperiences: emp.previousExperiences?.map((exp) => `${exp.companyName ?? '미정'} / ${exp.jobRole ?? '-'} / ${this.calculatePeriod(exp.entranceDate, exp.resignationDate)}`) ?? [],
        assetsList: emp.assets?.map((assets) => `${assets.name} (${assets.typeId})`) ?? [],
      },

      // 2. 역량정보
      skillsInfo: {
        certificates: emp.certificates.map((cert) => ({
          name: cert.name,
          type: cert.type,
          acquisitionDate: cert.acquisitionDate,
          issuingAuthority: cert.issuingAuthority,
        })),
        technicalAbility: {
          communication: (emp.technicalAbility?.communicationSkill as string) ?? null,
          officeSkill: (emp.technicalAbility?.officeSkill as string) ?? null,
          testDesign: (emp.technicalAbility?.testDesign as string) ?? null,
          testExecution: (emp.technicalAbility?.testExecution as string) ?? null,
        },
        employeeTool: {
          // ✅ (as string) 캐스팅과 ?? null을 조합하여 타입을 확정합니다.
          defectSystem: (emp.employeeTool?.defectSystem as string) ?? null,
          messenger: (emp.employeeTool?.messenger as string) ?? null,
          apiTool: (emp.employeeTool?.apiTool as string) ?? null,
          etcTool: (emp.employeeTool?.etcTool as string) ?? null,
        },
      },

      // 3. 과거경력 (Join 테이블: preProjectAssignments)
      preProject: emp.preProjectAssignments.map((ppa) => ({
        projectName: ppa.projectName,
        customerName: ppa.customerName,
        startDate: ppa.startDate,
        endDate: ppa.endDate,
        headcount: ppa.headcount as number,
        taskName: ppa.taskName,
        taskSummary: ppa.taskSummary,
        assignedRole: ppa.assignedRole,
        tools: (ppa.tools as string) ?? null,
        workDetail: (ppa.workDetail as string) ?? null,
        contribution: (ppa.contribution as string) ?? null,
      })),

      // 4. 프로젝트 경력 (사내 수행 프로젝트)
      projects: emp.projectAssignments.map((pa) => ({
        projectName: pa.project?.name ?? null,
        customerName: pa.project?.customer?.name ?? null,
        startDate: pa.startDate,
        endDate: pa.endDate,
        headcount: pa.project?.headcount ?? 0,

        taskName: pa.project?.taskName ?? null,
        taskSummary: pa.project?.taskSummary ?? null,

        assignedRole: (pa.assignedRole as string) ?? null,
        tools: (pa.tools as string) ?? null,
        workDetail: (pa.workDetail as string) ?? null,
        contribution: (pa.contribution as string) ?? null,
      })),
    };
  }
}
