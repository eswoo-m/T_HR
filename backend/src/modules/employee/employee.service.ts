import { Injectable, ConflictException, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { QueryEmployeeDto, CareerRange } from './dto/query-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeDetailResponseDto } from './dto/employee-detail-response.dto';

import { getErrorMessage } from '@common/utils/error.util';
import { saveProfileImage } from '@common/utils/file-upload.util';
import { getKstDate, calculateTotalCareerMonths, calculateCurrentServiceMonths } from '@common/utils/date.util';

import * as bcrypt from 'bcrypt';

// Prisma 타입 정의 (Relation 포함)
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

  // =======================================================================
  // 1. 계정생성 (신규 사원 등록)
  // =======================================================================
  async register(dto: RegisterEmployeeDto, adminId: string) {
    const TODAY = getKstDate();

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

    let savedProfilePath = dto.profilePath;
    if (dto.profileImageBase64) {
      const uploadedPath = saveProfileImage(dto.profileImageBase64, dto.no);
      if (uploadedPath) {
        savedProfilePath = uploadedPath;
      }
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
            jobPosition: dto.jobPosition,
            jobTitle: dto.jobTitle,
            jobRole: dto.jobRole,
            assignStatus: dto.assignStatus,
            authLevel: dto.authLevel,
            email: dto.email,
            joinDate: new Date(dto.joinDate),
            phone: dto.phone,
          },
        });

        await tx.employeeDetail.create({
          data: {
            employeeId: employee.id,
            type: dto.type || 'REGULAR',
            hrStatus: dto.hrStatus || 'EMPLOYED',
            skillLevel: dto.skillLevel || '초급',
            eduLevel: dto.eduLevel,
            lastSchool: dto.lastSchool,
            major: dto.major,
            maritalStatus: dto.maritalStatus,
            totalSwExperience: dto.totalSwExperience || 0,
            zipCode: dto.zipCode,
            address: dto.address,
            addressDetail: dto.addressDetail,
            profilePath: savedProfilePath,
          },
        });

        await tx.employeeOrganizationHistory.create({
          data: {
            employeeId: employee.id,
            departmentId: dto.departmentId,
            teamId: dto.teamId,
            jobPosition: dto.jobPosition,
            jobRole: dto.jobRole,
            jobTitle: dto.jobTitle,
            applyDate: new Date(TODAY),
          },
        });

        if (dto.previousExperiences && dto.previousExperiences.length > 0) {
          await tx.previousExperience.createMany({
            data: dto.previousExperiences.map((exp) => ({
              employeeId: employee.id,
              companyName: exp.companyName,
              department: exp.department,
              jobPosition: exp.jobPosition,
              jobRole: exp.jobRole,
              relevance: exp.relevance,
              entranceDate: new Date(exp.entranceDate),
              resignationDate: exp.resignationDate ? new Date(exp.resignationDate) : null,
              assignedTask: exp.assignedTask,
            })),
          });
        }

        if (dto.certificates && dto.certificates.length > 0) {
          for (const cert of dto.certificates) {
            const newCert = await tx.certificate.create({
              data: {
                employeeId: employee.id,
                type: cert.type,
                name: cert.name,
                number: cert.number,
                issuingAuthority: cert.issuingAuthority,
                acquisitionDate: new Date(cert.acquisitionDate),
                expDate: cert.expDate ? new Date(cert.expDate) : null,
              },
            });

            if (cert.attachmentPaths && cert.attachmentPaths.length > 0) {
              const path = cert.attachmentPaths[0];
              await tx.attachment.create({
                data: {
                  employeeId: employee.id,
                  uploaderId: employee.id,
                  certificateId: newCert.id,
                  fileType: 'CERTIFICATE',
                  filePath: path,
                  fileName: path.split('/').pop() || 'cert_file',
                  refId: newCert.id,
                  refType: 'CERTIFICATE',
                },
              });
            }
          }
        }

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

  // =======================================================================
  // 2. 인사관리 정보조회
  // =======================================================================
  async query(filter: QueryEmployeeDto) {
    try {
      const { departmentId, teamId, searchKeyword, skillLevel, assignStatus, careerRange } = filter;

      const employees = await this.prisma.employee.findMany({
        where: {
          exitDate: null,
          assignStatus: assignStatus || undefined,
          employeeDetail: {
            is: {
              hrStatus: 'EMPLOYED',
              ...(skillLevel && { skillLevel }),
            },
          },
          OR: searchKeyword ? [{ nameKr: { contains: searchKeyword } }, { no: { contains: searchKeyword } }, { nameEn: { contains: searchKeyword } }] : undefined,
          ...(departmentId && { departmentId }),
          ...(teamId && { teamId }),
        },
        include: {
          employeeDetail: true,
          previousExperiences: true,
          certificates: true,
          department: true,
          team: true,
          employeeTool: true,
        },
        orderBy: { no: 'asc' },
      });

      const list = employees.map((emp) => {
        const previousMonths = calculateTotalCareerMonths(emp.previousExperiences || []);
        const currentMonths = calculateCurrentServiceMonths(emp.joinDate);
        const totalSwExperience = previousMonths + currentMonths;

        return {
          id: emp.id,
          no: emp.no,
          name: emp.nameKr,
          departmentId: emp.departmentId,
          department: emp.department?.name,
          deptId: emp.deptId,
          teamId: emp.teamId,
          team: emp.team?.name,
          jobPosition: emp.jobPosition,
          jobRole: emp.jobRole,
          jobTitle: emp.jobTitle,
          assignStatus: emp.assignStatus,
          skillLevel: emp.employeeDetail?.skillLevel,
          certificates: emp.certificates || [],
          count: emp.certificates?.length ?? 0,
          totalCareerYear: totalSwExperience,
          prevSwExperience: emp.employeeDetail?.prevSwExperience || 0,
          totalExperience: emp.employeeDetail?.totalSwExperience || 0,
          joinDate: emp.joinDate,
          email: emp.email,
          phone: emp.phone,
          gender: emp.gender,
          type: emp.employeeDetail?.type || null,
          employeeTool: emp.employeeTool || null,
        };
      });

      if (!careerRange) return list;
      return list.filter((emp) => this.isWithinCareerRange(emp.totalCareerYear, careerRange));
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  // =======================================================================
  // 3. 사원 상세 조회
  // =======================================================================
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

  // =======================================================================
  // 4. 정보 수정 (Update)
  // =======================================================================
  async update(id: string, dto: UpdateEmployeeDto) {
    return this.prisma.$transaction(async (tx) => {
      const { basicInfo, skillsInfo, prevProjects, projects } = dto;

      // console.log('📦 수신 데이터(DTO):', JSON.stringify(dto, null, 2));

      if (basicInfo) {
        await tx.employee.update({
          where: { id },
          data: {
            nameEn: basicInfo.nameEn,
            nameCh: basicInfo.nameCh,
            departmentId: basicInfo.departmentId ? Number(basicInfo.departmentId) : undefined,
            teamId: basicInfo.teamId ? Number(basicInfo.teamId) : undefined,
            jobPosition: basicInfo.jobPosition,
            jobRole: basicInfo.jobRole,
            jobTitle: basicInfo.jobTitle,
            assignStatus: basicInfo.assignStatus,
            email: basicInfo.email,
            phone: basicInfo.phone,
          },
        });

        await tx.employeeDetail.update({
          where: { employeeId: id },
          data: {
            type: basicInfo.type,
            hrStatus: basicInfo.hrStatus,
            eduLevel: basicInfo.eduLevel ?? null,
            lastSchool: basicInfo.lastSchool ?? null,
            major: basicInfo.major ?? null,
            entranceDate: basicInfo.entranceDate ? new Date(`${basicInfo.entranceDate.replace(/\./g, '-')}T12:00:00Z`) : null,
            graduationDate: basicInfo.graduationDate ? new Date(`${basicInfo.graduationDate.replace(/\./g, '-')}T12:00:00Z`) : null,
            maritalStatus: basicInfo.maritalStatus,
            zipCode: basicInfo.zipCode,
            address: basicInfo.address,
            addressDetail: basicInfo.addressDetail,
            profilePath: basicInfo.profileImage,
          },
        });
      }

      // 2️⃣ [역량 정보 영역] (TechnicalAbility, EmployeeTool, Certificates)
      if (skillsInfo) {
        if (skillsInfo.technicalAbility) {
          await tx.technicalAbility.upsert({
            where: { employeeId: id },
            update: {
              communicationSkill: skillsInfo.technicalAbility.communication,
              officeSkill: skillsInfo.technicalAbility.officeSkill,
              testDesign: skillsInfo.technicalAbility.testDesign,
              testExecution: skillsInfo.technicalAbility.testExecution,
            },
            create: {
              employeeId: id,
              communicationSkill: skillsInfo.technicalAbility.communication,
              officeSkill: skillsInfo.technicalAbility.officeSkill,
              testDesign: skillsInfo.technicalAbility.testDesign,
              testExecution: skillsInfo.technicalAbility.testExecution,
            },
          });
        }

        // (2) 사용 도구 (Upsert)
        if (skillsInfo.employeeTool) {
          const { defectSystem, messenger, apiTool, etcTool } = skillsInfo.employeeTool;
          const formattedTools = {
            defectSystem: Array.isArray(defectSystem) ? defectSystem.join(',') : (defectSystem ?? ''),
            messenger: Array.isArray(messenger) ? messenger.join(',') : (messenger ?? ''),
            apiTool: Array.isArray(apiTool) ? apiTool.join(',') : (apiTool ?? ''),
            etcTool: etcTool ?? '',
          };

          await tx.employeeTool.upsert({
            where: { employeeId: id },
            update: formattedTools,
            create: {
              employeeId: id,
              ...formattedTools,
            },
          });
        }

        // (3) 자격증 처리 (기존꺼 유지/삭제 후 업데이트)
        if (skillsInfo.certificates) {
          const realCertIds = skillsInfo.certificates.map((c: any) => Number(c.id)).filter((cid: number) => cid < 1000000000); // 🚀 10억 미만인 것만 진짜 DB ID로 인정! ㅋ🥊

          // 2. 리스트에 없는 (사용자가 삭제한) 기존 자격증들만 삭제 ㅋ✨
          await tx.certificate.deleteMany({
            where: {
              employeeId: id,
              id: { notIn: realCertIds },
            },
          });

          // 3. 자격증 루프 돌며 처리 ㅋ🕺
          for (const cert of skillsInfo.certificates) {
            const certId = Number(cert.id);
            const certData = {
              type: cert.type || '취득',
              name: cert.name || '',
              number: cert.number || '',
              issuingAuthority: cert.issuingAuthority || '',
              acquisitionDate: cert.acquisitionDate ? new Date(cert.acquisitionDate) : new Date(),
            };

            if (certId && certId < 1000000000) {
              await tx.certificate.update({
                where: { id: certId },
                data: certData,
              });
            } else {
              await tx.certificate.create({
                data: { ...certData, employeeId: id },
              });
            }
          }
        }
      }

      // 3️⃣ [과거 경력 영역] (PreProjectAssignment)
      if (prevProjects) {
        await tx.preProjectAssignment.deleteMany({ where: { employeeId: id } });
        if (prevProjects.length > 0) {
          await tx.preProjectAssignment.createMany({
            data: prevProjects.map((pp) => ({
              employeeId: id,
              projectName: pp.projectName,
              customerName: pp.customerName || null,
              startDate: pp.startDate ? new Date(pp.startDate) : new Date(),
              endDate: pp.endDate ? new Date(pp.endDate) : null,
              assignedRole: pp.assignedRole || null,
              tools: pp.tools || null,
              workDetail: pp.workDetail || null,
              contribution: pp.contribution || null,
            })),
          });
        }
      }

      // 4️⃣ [프로젝트 경력 영역] (ProjectAssignment)
      if (projects && projects.length > 0) {
        for (const p of projects) {
          if (p.id) {
            await tx.projectAssignment.update({
              where: { id: Number(p.id) },
              data: {
                assignedRole: p.assignedRole,
                tools: p.tools,
                workDetail: p.workDetail,
                contribution: p.contribution,
              },
            });
          }
        }
      }

      return { success: true, message: 'Employee updated successfully' };
    });
  }

  private isWithinCareerRange(years: number, range: CareerRange): boolean {
    const ranges = {
      [CareerRange.BEGINNER]: years <= 3,
      [CareerRange.JUNIOR]: years >= 4 && years <= 7,
      [CareerRange.SENIOR]: years >= 8 && years <= 12,
      [CareerRange.EXPERT]: years >= 13,
    };
    return ranges[range] ?? true;
  }

  private mapToDetailDto(emp: EmployeeWithRelations): EmployeeDetailResponseDto {
    if (!emp) throw new Error('Data mapping failed: Employee object is null');

    return {
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
        jobPosition: emp.jobPosition,
        jobRole: emp.jobRole,
        jobTitle: emp.jobTitle,
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
        prevSwExperience: emp.employeeDetail?.prevSwExperience || null,
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

        previousExperiences:
          emp.previousExperiences.map((exp) =>
            JSON.stringify({
              id: exp.id,
              companyName: exp.companyName,
              department: exp.department,
              jobLevel: exp.jobLevel,
              jobRole: exp.jobRole,
              entranceDate: exp.entranceDate,
              resignationDate: exp.resignationDate,
              assignedTask: exp.assignedTask,
              relevance: exp.relevance,
            }),
          ) ?? [],

        assetsList: emp.assets?.map((assets) => `${assets.name} (${assets.typeId})`) ?? [],
      },
      skillsInfo: {
        certificates: emp.certificates.map((cert) => ({
          id: cert.id,
          name: cert.name,
          type: cert.type,
          issuingAuthority: cert.issuingAuthority,
          acquisitionDate: cert.acquisitionDate,
          displayDate: cert.acquisitionDate ? cert.acquisitionDate.toISOString().split('T')[0] : null,
        })),
        technicalAbility: {
          communication: (emp.technicalAbility?.communicationSkill as string) ?? null,
          officeSkill: (emp.technicalAbility?.officeSkill as string) ?? null,
          testDesign: (emp.technicalAbility?.testDesign as string) ?? null,
          testExecution: (emp.technicalAbility?.testExecution as string) ?? null,
        },
        employeeTool: {
          defectSystem: (emp.employeeTool?.defectSystem as string) ?? null,
          messenger: (emp.employeeTool?.messenger as string) ?? null,
          apiTool: (emp.employeeTool?.apiTool as string) ?? null,
          etcTool: (emp.employeeTool?.etcTool as string) ?? null,
        },
      },
      prevProjects: emp.preProjectAssignments.map((ppa) => ({
        id: ppa.id,
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
      projects: emp.projectAssignments.map((pa) => ({
        id: pa.id,
        projectId: pa.projectId,
        projectName: pa.project?.name ?? null,
        customerName: pa.project?.customer?.name ?? null,
        startDate: pa.startDate,
        endDate: pa.endDate,
        status: pa.project?.status ?? null,
        location: pa.project?.location ?? null,
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
