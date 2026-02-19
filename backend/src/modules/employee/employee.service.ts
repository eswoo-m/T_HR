import { Injectable, ConflictException, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getKstDate, calculateTotalCareerMonths } from '@common/utils/date.util';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { QueryEmployeeDto, CareerRange } from './dto/query-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeDetailResponseDto } from './dto/employee-detail-response.dto';
import { getErrorMessage } from '@common/utils/error.util';
// 📸 사진 저장을 위한 유틸리티 임포트
import { saveProfileImage } from '@common/utils/file-upload.util';
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

  // 1. 계정생성 (신규 사원 등록)
  async register(dto: RegisterEmployeeDto, adminId: string) {
    const TODAY = getKstDate();

    // 1-1. 중복 체크 (id, no, residentNo)
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

    // 📸 사진 업로드 처리 로직
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
            jobLevel: dto.jobLevel,
            jobRole: dto.jobRole,
            assignStatus: dto.assignStatus,
            authLevel: dto.authLevel,
            email: dto.email,
            joinDate: new Date(dto.joinDate),
            phone: dto.phone,
          },
        });

        // 상세정보 생성
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

        // 전직장 경력 등록
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

        // 자격증 등록
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

  // 2. 인사관리 정보조회 (수정된 핵심 로직)
  async query(filter: QueryEmployeeDto) {
    try {
      const { departmentId, teamId, searchKeyword, skillLevel, assignStatus, careerRange } = filter;

      // 1. Prisma 조회 쿼리 구성
      const employees = await this.prisma.employee.findMany({
        where: {
          assignStatus: assignStatus || undefined,
          // 사원 상세 정보(기술등급) 필터
          employeeDetail: skillLevel ? { is: { skillLevel } } : undefined,
          // 이름, 사번, 영문명 검색
          OR: searchKeyword ? [
            { nameKr: { contains: searchKeyword } },
            { no: { contains: searchKeyword } },
            { nameEn: { contains: searchKeyword } }
          ] : undefined,
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
          // ✅ [추가] 프론트엔드로 도구/기술 스택 데이터를 보내기 위해 포함
          employeeTool: true, 
        },
        orderBy: { no: 'asc' } // 사번순 정렬
      });

      const list = employees.map((emp) => {
        // 1. 경력 계산 (DB값 우선 -> 입사일 기준 -> 과거경력 합산)
        let finalCareerYear = 0;
        
        if (emp.employeeDetail?.totalSwExperience) {
           finalCareerYear = emp.employeeDetail.totalSwExperience;
        } else if (emp.joinDate) {
           // 입사일 기준 현재까지 연차 계산
           const join = new Date(emp.joinDate);
           const now = new Date();
           const diffTime = Math.abs(now.getTime() - join.getTime());
           const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365); 
           finalCareerYear = parseFloat(diffYears.toFixed(1));
        } else {
           const calcTotalMonths = calculateTotalCareerMonths(emp.previousExperiences);
           finalCareerYear = Math.floor(calcTotalMonths / 12);
        }

        // 2. 조직 ID 매핑
        const targetOrgId = emp.teamId ?? emp.departmentId;
        const targetOrgName = emp.team?.name ?? emp.department?.name ?? '미배정';

        return {
          id: emp.id,          
          no: emp.no,          
          name: emp.nameKr,    
          
          departmentId: targetOrgId,   
          department: targetOrgName,   
          
          deptId: emp.departmentId,
          teamId: emp.teamId,

          jobLevel: emp.jobLevel, 
          jobRole: emp.jobRole,   
          assignStatus: emp.assignStatus, 
          
          skillLevel: emp.employeeDetail?.skillLevel || '초급',
          
          count: emp._count?.certificates ?? 0,
          
          totalCareerYear: finalCareerYear,
          joinDate: emp.joinDate, 
          
          email: emp.email,
          phone: emp.phone,

          // ✅ [추가] EmployeeTool 데이터를 리스트 응답에 포함 (프론트 매핑용)
          employeeTool: emp.employeeTool || null,
        };
      });

      // 3. 경력 범위 필터링 (In-memory 필터링)
      if (!careerRange) return list;
      return list.filter((emp) => this.isWithinCareerRange(emp.totalCareerYear, careerRange));
    } catch (error) {
      throw new BadRequestException(getErrorMessage(error));
    }
  }

  // 3. 사원 상세 조회 (기존 유지)
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

  // 4. 정보 수정 (🌟 EmployeeTool upsert 로직 추가)
  async update(id: string, dto: UpdateEmployeeDto | any) {
    console.log('🔥 [백엔드] update 서비스 시작!');
    console.log('🔥 [백엔드] 프론트에서 받은 전체 데이터:', dto);
    console.log('🔥 [백엔드] techStack 값:', dto.techStack);
    return this.prisma.$transaction(async (tx) => {
      // 프론트엔드에서 EmployeeTool 데이터를 techStack 등의 이름으로 직접 보낼 수 있으므로 분리 (any 타입으로 유연성 허용)
      const {
        techStack, // 결함 관리 도구 (기술 스택)
        communicationTool,
        apiTool,
        otherTool,
        technicalAbility,
        ...basicDto
      } = dto;

      // 1. 사원 기본 정보
      await tx.employee.update({
        where: { id },
        data: {
          nameEn: basicDto.nameEn,
          nameCh: basicDto.nameCh,
          departmentId: basicDto.departmentId,
          teamId: basicDto.teamId,
          deptId: basicDto.deptId,
          jobLevel: basicDto.jobLevel,
          jobRole: basicDto.jobRole,
          assignStatus: basicDto.assignStatus,
          authLevel: basicDto.authLevel,
          email: basicDto.email,
          phone: basicDto.phone,
        },
      });

      // 2. 사원 상세 정보
      await tx.employeeDetail.update({
        where: { employeeId: id },
        data: {
          type: basicDto.type,
          hrStatus: basicDto.hrStatus,
          eduLevel: basicDto.eduLevel,
          lastSchool: basicDto.lastSchool,
          major: basicDto.major,
          maritalStatus: basicDto.maritalStatus,
          zipCode: basicDto.zipCode,
          address: basicDto.address,
          addressDetail: basicDto.addressDetail,
          profilePath: basicDto.profilePath,
        },
      });

      // 3. ✅ [수정] 기술 역량 (TechnicalAbility) - 기존 로직 유지
      if (technicalAbility) {
        await tx.technicalAbility.upsert({
          where: { employeeId: id },
          update: {
            communicationSkill: technicalAbility.communication,
            officeSkill: technicalAbility.officeSkill,
            testDesign: technicalAbility.testDesign,
            testExecution: technicalAbility.testExecution,
          },
          create: {
            employeeId: id,
            communicationSkill: technicalAbility.communication,
            officeSkill: technicalAbility.officeSkill,
            testDesign: technicalAbility.testDesign,
            testExecution: technicalAbility.testExecution,
          },
        });
      }

      // 3-1. ✅ [추가] 사용 가능 도구 및 기술 스택 (EmployeeTool) 업데이트
      // 프론트엔드에서 techStack(결함도구), communicationTool(메신저) 등을 보냈을 경우
      if (techStack !== undefined || communicationTool !== undefined || apiTool !== undefined || otherTool !== undefined) {
        await tx.employeeTool.upsert({
          where: { employeeId: id },
          update: {
            defectSystem: techStack !== undefined ? techStack : undefined,
            messenger: communicationTool !== undefined ? communicationTool : undefined,
            apiTool: apiTool !== undefined ? apiTool : undefined,
            etcTool: otherTool !== undefined ? otherTool : undefined,
          },
          create: {
            employeeId: id,
            defectSystem: techStack || '',
            messenger: communicationTool || '',
            apiTool: apiTool || '',
            etcTool: otherTool || '',
          },
        });
      }

      // 4. 자격증 (재등록 방식)
      await tx.certificate.deleteMany({ where: { employeeId: id } });
      if (basicDto.certificates && basicDto.certificates.length > 0) {
        for (const cert of basicDto.certificates) {
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
            const path = cert.attachmentPaths[0];
            await tx.attachment.create({
              data: {
                employeeId: id,
                uploaderId: id,
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

      // 5. 프로젝트 투입 이력
      await tx.projectAssignment.deleteMany({ where: { employeeId: id } });
      if (basicDto.projects && basicDto.projects.length > 0) {
        const projects = basicDto.projects;
        await tx.projectAssignment.createMany({
          data: projects.map((proj: any) => ({
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
    });
  }

  // --- 헬퍼 함수들 ---

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
          defectSystem: (emp.employeeTool?.defectSystem as string) ?? null,
          messenger: (emp.employeeTool?.messenger as string) ?? null,
          apiTool: (emp.employeeTool?.apiTool as string) ?? null,
          etcTool: (emp.employeeTool?.etcTool as string) ?? null,
        },
      },
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