import { Injectable, Logger, ConflictException, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { QueryEmployeeDto, CareerRange } from './dto/query-employee.dto';
import { UpdateEmployeeAuthDto } from './dto/update-employee-auth.dto';
import { QueryMonthlyListDto } from './dto/query-monthly-list.dto';
import { UpdateEmployeeDto, EmployeeDetailResponseDto } from '@modules/dto/employee-detail.dto';

import dayjs from 'dayjs';

import { getErrorMessage } from '@common/utils/error.util';
import { saveProfileImage } from '@common/utils/file-upload.util';
import { isValidDate } from '@common/utils/date.util';
import { getKstDate, calculateTotalCareerMonths, calculateCurrentServiceMonths } from '@common/utils/date.util';

import * as bcrypt from 'bcrypt';
import { EmployeesMonthlyStats } from '@modules/dto/employee.dto';

interface RawMember {
  no: string;
  nameKr: string;
  email: string;
  departmentId?: number;
  education?: {
    level?: string;
    school?: string;
    major?: string;
    graduationDate?: string | Date;
    status?: string;
  };
  [key: string]: any;
}

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

interface BatchData {
  employeeData: Prisma.EmployeeUncheckedCreateInput;
  detailData: Prisma.EmployeeDetailUncheckedCreateInput;
  historyData: Prisma.EmployeeOrganizationHistoryUncheckedCreateInput;
}

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);
  constructor(private readonly prisma: PrismaService) {}

  // =======================================================================
  // 1. 계정생성 (신규 사원 등록)
  // =======================================================================
  async register(dto: RegisterEmployeeDto, adminId: string) {
    const TODAY = getKstDate();

    // 1. 중복 체크
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
        // 사원 기본 정보 생성
        const employee = await tx.employee.create({
          data: {
            id: dto.id,
            no: dto.no,
            nameKr: dto.nameKr,
            nameEn: dto.nameEn,
            nameCh: dto.nameCh,
            residentNo: dto.residentNo,
            password: hashedPassword,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : new Date(),
            isLunar: dto.isLunar ?? false,
            gender: dto.gender,
            departmentId: dto.departmentId,
            teamId: dto.teamId,
            deptId: dto.deptId,
            jobPosition: dto.jobPosition,
            jobTitle: dto.jobTitle,
            jobRole: dto.jobRole,
            jobRole2: dto.jobRole2,
            assignStatus: dto.assignStatus,
            authLevel: dto.authLevel,
            email: dto.email,
            joinDate: new Date(dto.joinDate),
            phone: dto.phone,
          },
        });

        // 상세 정보 생성
        await tx.employeeDetail.create({
          data: {
            employeeId: employee.id,
            type: dto.type || 'REGULAR',
            hrStatus: dto.hrStatus || 'EMPLOYED',
            skillLevel: dto.skillLevel || '',
            eduLevel: dto.eduLevel,
            lastSchool: dto.lastSchool,
            graduationDate: dto.graduationDate,
            eduStatus: dto.eduStatus,
            major: dto.major,
            maritalStatus: dto.maritalStatus,
            totalSwExperience: dto.totalSwExperience || 0,
            zipCode: dto.zipCode,
            address: dto.address,
            addressDetail: dto.addressDetail,
            residenceArea: dto.residenceArea,
            profilePath: savedProfilePath,
          },
        });

        // 발령/조직 이력 생성
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

        // 경력 사항 (createMany 활용)
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

        // 자격증 및 첨부파일
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
                  uploaderId: adminId,
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

        // 자산 할당 업데이트
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

        return employee;
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
      const endOfToday = dayjs().endOf('day').toDate();

      const employees = await this.prisma.employee.findMany({
        where: {
          AND: [
            {
              OR: [{ exitDate: null }, { exitDate: { gte: endOfToday } }],
            },
            ...(searchKeyword
              ? [
                  {
                    OR: [{ nameKr: { contains: searchKeyword } }, { no: { contains: searchKeyword } }, { nameEn: { contains: searchKeyword } }],
                  },
                ]
              : []),
          ],

          // 3. 기타 고정 필터들
          assignStatus: assignStatus || undefined,
          employeeDetail: {
            is: {
              hrStatus: 'EMPLOYED',
              ...(skillLevel && { skillLevel }),
            },
          },
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
          birthDate: emp.birthDate,
          departmentId: emp.departmentId,
          department: emp.department?.name,
          deptId: emp.deptId,
          teamId: emp.teamId,
          team: emp.team?.name,
          authLevel: emp.authLevel,
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
          hrStatus: emp.employeeDetail?.hrStatus || null,
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

      console.log('📦 수신 데이터(DTO):', JSON.stringify(dto, null, 2));

      if (basicInfo) {
        const finalDeptId = basicInfo.teamId ? Number(basicInfo.teamId) : basicInfo.departmentId ? Number(basicInfo.departmentId) : null;

        await tx.employee.update({
          where: { id },
          data: {
            nameEn: basicInfo.nameEn,
            nameCh: basicInfo.nameCh,
            departmentId: basicInfo.departmentId ? Number(basicInfo.departmentId) : undefined,
            teamId: basicInfo.teamId ? Number(basicInfo.teamId) : null,
            deptId: finalDeptId,
            jobPosition: basicInfo.jobPosition,
            jobRole: basicInfo.jobRole,
            jobTitle: basicInfo.jobTitle,
            assignStatus: basicInfo.assignStatus,
            email: basicInfo.email,
            phone: basicInfo.phone,
          },
        });

        const rawGraduationDate = basicInfo.education?.graduationDate;
        let graduationDate: Date | null = null;

        if (rawGraduationDate) {
          let parsed: Date;

          if (typeof rawGraduationDate === 'string') {
            const dateStr = rawGraduationDate.includes('-') ? rawGraduationDate : rawGraduationDate.replace(/\./g, '-');
            parsed = new Date(dateStr);
          } else {
            parsed = rawGraduationDate;
          }

          graduationDate = isValidDate(parsed) ? parsed : null;
        }

        await tx.employeeDetail.update({
          where: { employeeId: id },
          data: {
            type: basicInfo.type ?? undefined,
            hrStatus: basicInfo.hrStatus ?? undefined,
            eduLevel: basicInfo.education?.level ?? null,
            lastSchool: basicInfo.education?.school ?? null,
            major: basicInfo.education?.major ?? null,
            graduationDate: graduationDate,
            eduStatus: basicInfo.education?.status ?? null,
            maritalStatus: basicInfo.maritalStatus,
            zipCode: basicInfo.zipCode,
            address: basicInfo.address,
            addressDetail: basicInfo.addressDetail,
            residenceArea: basicInfo.residenceArea,
            profilePath: basicInfo.profileImage,
          },
        });

        const assetIds = (dto.basicInfo?.assets ?? []).map((a) => Number(a.id));
        const assetsToUnassign = await tx.asset.findMany({
          where: {
            employeeId: id,
            id: { notIn: assetIds },
          },
        });

        for (const asset of assetsToUnassign) {
          await tx.asset.update({
            where: { id: asset.id },
            data: {
              employeeId: null,
              teamId: null,
              assignDate: null,
              status: 'AVAILABLE',
            },
          });

          await tx.assetHistory.create({
            data: {
              assetId: asset.id,
              category: 'RETURN',
              content: `${basicInfo.team} / ${basicInfo.nameKr} > - / -`,
              regTime: new Date(),
            },
          });
        }

        for (const assetId of assetIds) {
          const asset = await tx.asset.update({
            where: { id: assetId },
            data: {
              employeeId: id,
              teamId: basicInfo.teamId,
              status: 'IN_USE',
              assignDate: new Date(),
            },
          });

          await tx.assetHistory.create({
            data: {
              assetId: asset.id,
              category: 'ASSIGNMENT',
              content: `- / - > ${basicInfo.team} / ${basicInfo.nameKr}`,
              remarks: ``,
              regTime: new Date(),
            },
          });
        }
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
          const realCertIds = skillsInfo.certificates.map((c: any) => Number(c.id)).filter((cid: number) => cid < 1000000000);

          await tx.certificate.deleteMany({
            where: {
              employeeId: id,
              id: { notIn: realCertIds },
            },
          });

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
              projectName: pp.projectName ?? '',
              customerName: pp.customerName || null,
              startDate: pp.startDate ? new Date(pp.startDate) : new Date(),
              endDate: pp.endDate ? new Date(pp.endDate) : null,
              assignedRole: pp.assignedRole || null,
              taskName: pp.taskName || null,
              tools: pp.tools || null,
              taskSummary: pp.taskSummary || null,
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

  async bulkUpsertMembers(members: RawMember[]) {
    const successList: string[] = [];
    const failureList: any[] = [];

    for (const member of members) {
      let currentEmployeeData: Prisma.EmployeeUncheckedCreateInput | null = null;

      try {
        const { employeeData, detailData, historyData } = await this.prepareBatchData(member);
        currentEmployeeData = employeeData;

        await this.prisma.$transaction(async (tx) => {
          const existingEmployee = await tx.employee.findUnique({
            where: { no: employeeData.no },
            include: { employeeDetail: true },
          });

          let employeeId = existingEmployee?.id;

          if (!existingEmployee) {
            const newEmployee = await tx.employee.create({ data: employeeData });
            employeeId = newEmployee.id;

            await tx.employeeDetail.create({
              data: { ...detailData, employeeId },
            });

            await tx.employeeOrganizationHistory.create({
              data: {
                ...historyData,
                employeeId: employeeId,
                memo: '신규 등록 발령',
                applyDate: new Date(),
              },
            });
          } else {
            // [CASE 2] 계정이 있는 경우 -> 변경 사항 확인
            // 비교하고 싶은 필드들을 나열하세요 (여기에 이름, 성별 등 추가 가능)
            const isBasicChanged =
              existingEmployee.nameKr !== employeeData.nameKr ||
              existingEmployee.email !== employeeData.email ||
              existingEmployee.departmentId !== (employeeData.departmentId ?? null) ||
              existingEmployee.teamId !== (employeeData.teamId ?? null) ||
              existingEmployee.jobPosition !== (employeeData.jobPosition ?? null) ||
              existingEmployee.jobTitle !== (employeeData.jobTitle ?? null);

            // 상세 정보(detail) 변경 확인
            const existingDetail = existingEmployee.employeeDetail;
            const isDetailChanged = !existingDetail || existingDetail.address !== detailData.address || existingDetail.emergencyPhone !== detailData.emergencyPhone;

            // 2-1. 본체나 상세정보가 바뀌었을 때만 UPDATE
            if (isBasicChanged || isDetailChanged) {
              await tx.employee.update({
                where: { no: employeeData.no },
                data: employeeData,
              });

              await tx.employeeDetail.upsert({
                where: { employeeId: existingEmployee.id },
                update: detailData,
                create: { ...detailData, employeeId: existingEmployee.id },
              });
            }

            // 2-2. 조직 정보(History 대상)가 바뀌었을 때만 HISTORY 생성
            const isHistoryChanged = existingEmployee.departmentId !== (employeeData.departmentId ?? null) || existingEmployee.teamId !== (employeeData.teamId ?? null) || existingEmployee.jobPosition !== (employeeData.jobPosition ?? null);

            if (isHistoryChanged) {
              await tx.employeeOrganizationHistory.create({
                data: {
                  ...historyData,
                  employeeId: existingEmployee.id,
                  memo: '엑셀 업로드 정보 변경 자동 발령',
                  applyDate: new Date(),
                },
              });
            }
          }
        });

        successList.push(member.no);
      } catch (error) {
        let errorMessage = error instanceof Error ? error.message : String(error);

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          const target = error.meta?.target as string[];

          if (target?.includes('id') && currentEmployeeData) {
            const intruder = await this.prisma.employee.findUnique({
              where: { id: currentEmployeeData.id }, // 🚀 여기!
              select: { no: true, nameKr: true },
            });

            errorMessage = `[ID 충돌] 사번 ${member.no}가 쓰려는 ID '${currentEmployeeData.id}'를 ` + `이미 DB 사번: ${intruder?.no}(${intruder?.nameKr})님이 사용 중!`;
          }
        }

        this.logger.error(`❌ 실패: ${errorMessage}`);
        failureList.push({ no: member.no, error: errorMessage });
      }
    }

    return { successList, failureList };
  }

  async updateEmployeeAuth(employeeId: string, updateDto: UpdateEmployeeAuthDto) {
    const { authLevel: newLevel, remarks } = updateDto;

    return this.prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({
        where: { id: employeeId },
        select: { authLevel: true },
      });

      if (!employee) {
        throw new NotFoundException(`사용자(ID: ${employeeId})를 찾을 수 없어요!`);
      }

      await tx.employee.update({
        where: { id: employeeId },
        data: { authLevel: newLevel },
      });

      const history = await tx.employeeAuthLevelHistory.create({
        data: {
          employeeId: employeeId,
          previousLevel: employee.authLevel,
          newLevel: newLevel,
          remarks: remarks,
        },
      });

      return {
        success: true,
        message: '권한 변경 및 이력 저장이 완료되었습니다!',
        historyId: history.id,
      };
    });
  }

  async getAuthHistory() {
    return this.prisma.employeeAuthLevelHistory.findMany({
      include: { employee: true },
      orderBy: { regTime: 'desc' },
    });
  }

  async queryMonthly(query: QueryMonthlyListDto) {
    // 1. 쿼리 파라미터 처리 (DTO에 jobLevel이 있더라도 실제 DB 필드인 jobPosition으로 매핑)
    const { yearMonth, departmentId, teamId, assignStatus } = query;

    // 2. 프로젝트 카테고리(투입_정산, 지원 등) 조회
    const categories = await this.prisma.commonCode.findMany({
      where: {
        type: 'PROJECT_CATEGORY',
        isUsed: true,
      },
      select: { name: true },
      orderBy: { id: 'asc' },
    });

    // 3. 월간 투입 레코드 조회
    const records = await this.prisma.employeeMonthlyMm.findMany({
      where: {
        // yearMonth: yearMonth,
        employee: {
          // assignStatus: assignStatus || undefined,
          // jobPosition: jobPosition || undefined,
          // OR: searchKeyword ? [{ nameKr: { contains: searchKeyword } }, { no: { contains: searchKeyword } }] : undefined,
          departmentId: departmentId ? Number(departmentId) : undefined,
          teamId: teamId ? Number(teamId) : undefined,
        },
      },
      include: {
        employee: {
          include: {
            department: true,
            team: true,
            projectAssignments: {
              include: {
                project: true,
                projectAssignmentPeriod: {
                  where: {
                    AND: [{ startDate: { lte: new Date(`${yearMonth}-31`) } }, { OR: [{ endDate: null }, { endDate: { gte: new Date(`${yearMonth}-01`) } }] }],
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        employee: { nameKr: 'asc' },
      },
    });

    // 4. 데이터 가공 (Frontend 전달용)
    const list = records
      .map((record) => {
        const emp = record.employee;

        // 카테고리별 컬럼 초기화
        const projectColumns = categories.reduce((acc, cat) => {
          acc[cat.name] = 0;
          return acc;
        }, {});

        // 해당 레코드의 MM 값을 카테고리에 할당
        if (record.assignStatus && Object.prototype.hasOwnProperty.call(projectColumns, record.assignStatus)) {
          projectColumns[record.assignStatus] = Number(record.value);
        }

        const totalMm = Number(record.value);
        const calculatedStatus = totalMm === 0 ? 'IDLE' : totalMm > 1.0 ? 'OVER' : 'ACTIVE';

        // 상태 필터링 (ALL이 아닌 경우)
        if (assignStatus && assignStatus !== 'ALL' && calculatedStatus !== assignStatus) {
          return null;
        }

        return {
          name: emp.nameKr,
          code: emp.id,
          department: emp.department?.name ?? '-',
          team: emp.team?.name ?? '-',
          // ✅ 수정: 존재하지 않는 jobLevel 대신 jobPosition 사용
          position: emp.jobPosition ?? '-',
          // ✅ 수정: jobRole은 스키마에 존재하므로 유지
          title: emp.jobRole ?? '-',
          ...projectColumns,
          totalMm: parseFloat(totalMm.toFixed(2)),
          effortRate: `${Math.round(totalMm * 100)}%`,
          assignStatus: calculatedStatus,
        };
      })
      .filter((item) => item !== null);

    return {
      summary: {
        totalCount: list.length,
        activeCount: list.filter((i) => i.assignStatus === 'ACTIVE').length,
        idleCount: list.filter((i) => i.assignStatus === 'IDLE').length,
        overCount: list.filter((i) => i.assignStatus === 'OVER').length,
      },
      list,
    };
  }

  async getMonthlyStats(year?: string, month?: string) {
    // ✅ 1. 특정 년/월 검색 모드 (상세 데이터 반환)
    if (year && month) {
      const targetYearMonth = `${year}-${month.padStart(2, '0')}`;

      const monthlyData = await this.prisma.employeeMonthlyMm.findMany({
        where: { yearMonth: targetYearMonth },
        select: {
          employeeId: true,
          assignStatus: true,
          value: true,
        },
      });

      const aggregated = monthlyData.reduce(
        (acc: Record<string, EmployeesMonthlyStats>, d) => {
          const id = d.employeeId;

          if (!acc[id]) {
            acc[id] = {
              employeeId: id,
              assignedSettlement: 0,
              assignedSupport: 0,
              support: 0,
              waiting: 0,
              management: 0,
            };
          }

          const status = d.assignStatus;
          const val = Number(d.value || 0);
          const target = acc[id];

          if (status === 'ASSIGNED_SETTLEMENT') {
            target.assignedSettlement += val;
          } else if (status === 'ASSIGNED_SUPPORT') {
            target.assignedSupport += val;
          } else if (status === 'SUPPORT') {
            target.support += val;
          } else if (status === 'WAITING') {
            target.waiting += val;
          } else if (status === 'MANAGEMENT') {
            target.management += val;
          }

          return acc;
        },
        {} as Record<string, EmployeesMonthlyStats>,
      );

      return {
        list: Object.values(aggregated),
      };
    }

    // ✅ 2. 기본 모드 (기존 12개월 대시보드 통계용)
    const last12Months = Array.from({ length: 12 }, (_, i) => dayjs().subtract(i, 'month').format('YYYY-MM')).reverse();

    const rawData = await this.prisma.employeeMonthlyMm.findMany({
      where: { yearMonth: { in: last12Months } },
      select: {
        yearMonth: true,
        assignStatus: true,
        value: true,
        employeeId: true,
      },
    });

    return last12Months.map((month) => {
      const monthRecords = rawData.filter((d) => d.yearMonth === month);
      const uniqueEmployeeIds = new Set(monthRecords.map((r) => r.employeeId).filter((id) => id !== null && id !== undefined));

      const totalHeadcount = uniqueEmployeeIds.size;
      const totalMMValue = monthRecords.reduce((acc, r) => acc + Number(r.value || 0), 0);
      const sumMM = (statuses: string[]) => monthRecords.filter((r) => r.assignStatus && statuses.includes(r.assignStatus)).reduce((acc, r) => acc + Number(r.value || 0), 0);

      return {
        month,
        totalCount: totalHeadcount,
        totalMM: Number(totalMMValue.toFixed(1)),
        assignedSettlementCount: Number(sumMM(['ASSIGNED_SETTLEMENT']).toFixed(1)),
        assignedSupportCount: Number(sumMM(['ASSIGNED_SUPPORT']).toFixed(1)),
        supportCount: Number(sumMM(['GEN_SUPPORT']).toFixed(1)),
        waitingCount: Number(sumMM(['WAITING']).toFixed(1)),
        managementCount: Number(sumMM(['MANAGEMENT']).toFixed(1)),
      };
    });
  }

  async getMonthlyStatsYears() {
    const records = await this.prisma.employeeMonthlyMm.findMany({
      distinct: ['yearMonth'],
      select: { yearMonth: true },
      orderBy: { yearMonth: 'desc' },
    });

    return Array.from(new Set(records.map((r) => r.yearMonth.split('-')[0]))).sort((a, b) => b.localeCompare(a)); // 내림차순 정렬 (2026, 2025...)
  }

  private async prepareBatchData(member: RawMember): Promise<BatchData> {
    const emailId = member.email?.split('@')[0] || `user_${member.no}`;
    const hashedPassword = await bcrypt.hash('qwer!@#$', 10);

    const rawDeptId = member.departmentId ? Number(member.departmentId) : null;
    const rawTeamId = member.teamId ? Number(member.teamId) : null;

    // 1. Employee 가공
    const employeeData: Prisma.EmployeeUncheckedCreateInput = {
      id: emailId,
      no: member.no,
      nameKr: member.nameKr,
      nameEn: (member.nameEn as string) || null,
      nameCh: (member.nameCh as string) || null,
      email: member.email || `${member.no}@temporary.com`,
      password: hashedPassword,
      residentNo: (member.residentNo as string) || `TEMP-${member.no}`,
      gender: (member.gender as string) || '',
      birthDate: member.birthDate ? new Date(member.birthDate) : new Date('1900-01-01'),
      joinDate: member.joinDate ? new Date(member.joinDate) : new Date(),
      exitDate: member.exitDate ? new Date(member.exitDate) : null,
      isLunar: !!member.isLunar,
      authLevel: (member.authLevel as string) || '',
      departmentId: rawDeptId !== null && !isNaN(rawDeptId) ? rawDeptId : null,
      teamId: rawTeamId !== null && !isNaN(rawTeamId) ? rawTeamId : null,
      deptId: rawTeamId || rawDeptId || null,

      jobTitle: (member.jobTitle as string) || null,
      jobPosition: (member.jobPosition as string) || null,
      jobRole: (member.jobRole as string) || null,
    };

    // 2. Detail 가공
    const detailData: Prisma.EmployeeDetailUncheckedCreateInput = {
      employeeId: emailId, // Unchecked 타입일 경우 필수!
      hrStatus: (member.hrStatus as string) || 'EMPLOYED',
      type: (member.type as string) || '',
      skillLevel: (member.skillLevel as string) || '',

      eduLevel: (member.education?.level as string) || 'null',
      lastSchool: (member.education?.school as string) || null,
      major: (member.education?.major as string) || null,
      graduationDate: member.education?.graduationDate ? new Date(member.education.graduationDate as string) : null,

      address: (member.address as string) || null,
      addressDetail: (member.addressDetail as string) || null,
      residenceArea: (member.residenceArea as string) || null,
      emergencyPhone: (member.emergencyPhone as string) || null,
      emergencyRelation: (member.emergencyRelation as string) || null,

      // 숫자는 as number로!
      totalSwExperience: (member.totalSwExperience as number) || 0,
      prevSwExperience: (member.prevSwExperience as number) || 0,

      maritalStatus: (member.maritalStatus as string) || null,
      weddingAnniv: member.weddingAnniv ? new Date(member.weddingAnniv as string) : null,
    };

    // 3. History 기본 틀 가공
    const historyData: Prisma.EmployeeOrganizationHistoryUncheckedCreateInput = {
      employeeId: emailId,
      departmentId: (employeeData.departmentId as number) || null,
      teamId: (employeeData.teamId as number) || null,
      jobPosition: (employeeData.jobPosition as string) || null,
      jobTitle: (employeeData.jobTitle as string) || null,
      jobRole: (employeeData.jobRole as string) || null,
      applyDate: employeeData.joinDate as Date,
      memo: '일괄 업로드 가공 데이터',
    };

    return { employeeData, detailData, historyData };
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
        authLevel: emp.authLevel,
        birthDate: new Date(emp.birthDate),
        isLunar: emp.isLunar,
        gender: emp.gender,
        departmentId: emp.departmentId,
        department: emp.department?.name || null,
        teamId: emp.teamId || null,
        team: emp.team?.name || null,
        jobPosition: emp.jobPosition,
        jobRole: emp.jobRole,
        jobRole2: emp.jobRole2,
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
        education: {
          level: emp.employeeDetail?.eduLevel || null,
          school: emp.employeeDetail?.lastSchool || null,
          major: emp.employeeDetail?.major || null,
          graduationDate: emp.employeeDetail?.graduationDate || null,
          status: emp.employeeDetail?.eduStatus || null,
        },
        totalSwExperience: emp.employeeDetail?.totalSwExperience || null,
        prevSwExperience: emp.employeeDetail?.prevSwExperience || null,
        maritalStatus: emp.employeeDetail?.maritalStatus || null,
        weddingAnniv: emp.employeeDetail?.weddingAnniv || null,
        emergencyPhone: emp.employeeDetail?.emergencyPhone || null,
        emergencyRelation: emp.employeeDetail?.emergencyRelation || null,
        zipCode: emp.employeeDetail?.zipCode || null,
        address: emp.employeeDetail?.address || null,
        addressDetail: emp.employeeDetail?.addressDetail || null,
        residenceArea: emp.employeeDetail?.residenceArea || null,
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
        assets:
          emp.assets?.map((asset) => ({
            ...asset,
            purchaseAmount: asset.purchaseAmount ? Number(asset.purchaseAmount) : 0,

            warrantyDate: asset.warrantyDate ? asset.warrantyDate.toISOString() : '',
            purchaseDate: asset.purchaseDate ? asset.purchaseDate.toISOString() : '',
            registDate: asset.registDate ? asset.registDate.toISOString() : '',
            assignDate: asset.assignDate ? asset.assignDate.toISOString() : '',

            serialNo: asset.serialNo ?? '',
            status: asset.status ?? '',

            vendor: asset.vendor ?? '',
            model: asset.model ?? '',
            number: asset.number ?? '',
            remarks: asset.remarks ?? '',
            employeeId: asset.employeeId ?? undefined,
            teamId: asset.teamId ?? undefined,
            typeId: asset.typeId ?? 0,
          })) ?? [],
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
