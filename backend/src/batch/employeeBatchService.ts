import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
// import { Employee, EmployeeDetail, EmployeeOrganizationHistory } from '@prisma/client';

type RawExcelRow = (string | number | Date | null | undefined)[];

interface BatchData {
  employeeData: Prisma.EmployeeCreateInput; // 또는 Prisma.EmployeeUncheckedCreateInput
  detailData: Prisma.EmployeeDetailCreateWithoutEmployeeInput;
  historyData: Prisma.EmployeeOrganizationHistoryUncheckedCreateInput;
}

interface FailureReport {
  name: string;
  no: string;
  reason: string;
}

@Injectable()
export class EmployeeBatchService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    console.log('🚀 [BATCH] Prisma를 이용한 단발성 배치를 시작합니다...');
    this.runOneTimeBatch();
  }

  private readExcel(filePath: string): RawExcelRow[] {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown as RawExcelRow[];
    return data.slice(2); // 3행부터 읽기
  }

  private parseBirthDate = (dateStr: string | number): Date => {
    const str = String(dateStr).trim();
    if (str.length !== 6) return new Date(); // 형식이 안 맞으면 오늘 날짜나 기본값 ㅋ

    const yearStr = str.substring(0, 2);
    const monthStr = str.substring(2, 4);
    const dayStr = str.substring(4, 6);

    const year = Number(yearStr) >= 50 ? `19${yearStr}` : `20${yearStr}`;

    return new Date(Number(year), Number(monthStr) - 1, Number(dayStr));
  };

  private parseExcelDate(value: any): Date | null {
    if (value === undefined || value === null || String(value).trim() === '') {
      return null;
    }

    if (value instanceof Date) return value;

    if (typeof value === 'number') {
      return new Date(Math.round((value - 25569) * 86400 * 1000));
    }

    let str = String(value).trim();

    if (str.includes('.')) {
      str = str.replace(/\. /g, '-').replace(/\./g, '-');
      str = str.split('오전')[0].split('오후')[0].trim();
      if (str.endsWith('-')) str = str.slice(0, -1);
    }

    const d = new Date(str);

    return isNaN(d.getTime()) ? null : d;
  }

  //개월수 계산
  private parseCareerMonths(value: any): number {
    const str = String(value || '').trim();
    if (!str || str === '0') return 0;

    let totalMonths = 0;

    const yearMatch = str.match(/(\d+)\s*년/);
    if (yearMatch) {
      totalMonths += Number(yearMatch[1]) * 12; // 년도 * 12개월 ✨
    }

    const monthMatch = str.match(/(\d+)\s*개월/);
    if (monthMatch) {
      totalMonths += Number(monthMatch[1]);
    }

    if (!yearMatch && !monthMatch && !isNaN(Number(str))) {
      totalMonths = Number(str);
    }

    return totalMonths;
  }

  async runOneTimeBatch() {
    try {
      const filePath1 = path.join(process.cwd(), 'src', 'batch', 'entities', 'employee_260210.xlsx');
      const filePath2 = path.join(process.cwd(), 'src', 'batch', 'entities', 'employee_260211.xlsx');

      if (!fs.existsSync(filePath1) || !fs.existsSync(filePath2)) {
        console.error('❌ 파일 중 하나를 찾을 수 없습니다.');
        return;
      }

      const failureList: FailureReport[] = [];
      const allCodes = await this.prisma.commonCode.findMany(); //공통코드
      const codeLookup: Record<string, string> = {};
      allCodes.forEach((c) => {
        const key = `${c.type}_${c.name.trim()}`;
        codeLookup[key] = c.code; // 👈 여기서 c.code로 값을 바꿉니다! 🚀
      });

      const allOrgs = await this.prisma.organization.findMany();
      const orgLookup: Record<string, string> = {};
      allOrgs.forEach((o) => {
        orgLookup[o.name.trim()] = String(o.id);
      });

      const orgMap = new Map<
        string,
        {
          no: string;
          jobTitleCode: string;
          jobPositionCode: string;
          jobRoleCode: string;
          jobRole2Code: string;
          departmentId: number;
          teamId: number;
          deptId: number;
          typeCode: string;
        }
      >();

      // console.log('📝 codeLookup 키 샘플:', Object.keys(codeLookup).slice(0, 55));

      const baseData = this.readExcel(filePath1);
      const orgData = this.readExcel(filePath2);

      orgData.forEach((row) => {
        const empNo = String(row[1] || ''); // 사번 (B열)
        if (!empNo) return;

        if (empNo) {
          const findOrgId = (name: string): number | null => {
            if (!name || name.trim() === '') return null;

            const idStr = orgLookup[name.trim()] || orgLookup[Object.keys(orgLookup).find((key) => key.includes(name) || name.includes(key)) || ''];

            const parsedId = idStr ? Number(idStr) : null;
            return parsedId !== null && !isNaN(parsedId) && parsedId !== 0 ? parsedId : null;
          };

          const excelDeptName = String(row[7] || '').trim();
          const excelTeamName = String(row[8] || '').trim();

          const teamId = findOrgId(excelTeamName);
          const departmentId = findOrgId(excelDeptName);

          const deptId = teamId || departmentId;

          orgMap.set(empNo, {
            no: empNo,
            jobTitleCode: codeLookup[`JOB_TITLE_${String(row[3])}`] || '', // 직책
            jobPositionCode: codeLookup[`JOB_POSITION_${String(row[4])}`] || '', // 직급
            jobRoleCode: codeLookup[`JOB_ROLE_${String(row[6])}`] || '', // 직무
            jobRole2Code: codeLookup[`JOB_ROLE2_${String(row[6])}`] || '', // 직무
            departmentId: departmentId as number, // 💡 TS 에러 방지용 단언 (실제값은 null 가능)
            teamId: teamId as number,
            deptId: deptId as number,
            typeCode: codeLookup[`EMP_TYPE_${String(row[5])}`] || '',
          });
        }
      });

      // console.log('--------------------------------------------------');
      // console.log(`📊 [조직정보 Map 생성 완료] 총 ${orgMap.size}명의 조직 정보가 로드되었습니다.`);
      // const sampleKeys = Array.from(orgMap.keys()).slice(0, 10);
      // console.log('👀 orgMap 데이터 샘플 (상위 3개):');
      // sampleKeys.forEach((key) => {
      //   console.log(`🔑 사번 [${key}]:`, orgMap.get(key));
      // });
      // console.log('--------------------------------------------------');

      const authMapping: Record<string, string> = {
        PRESIDENT: 'MASTER',
        CEO: 'MASTER',
        DIRECTOR: 'MASTER',
        DEPT_LEADER: 'MASTER',
        TEAM_LEADER: 'MANAGER',
        PART_LEADER: 'MANAGER',
      };

      const finalDataList: BatchData[] = [];

      for (const row of baseData) {
        const empNo = String(row[1] || '').trim();
        if (!empNo) continue;
        const orgInfo = orgMap.get(empNo);
        if (!orgInfo) {
          console.log(`⚠️ 사번 [${empNo}]에 해당하는 조직 정보를 찾을 수 없어 건너뜁니다.`);
          continue;
        }

        const rawEmail = String(row[48] || '').trim();
        let emailId = empNo;

        if (rawEmail && rawEmail.includes('@')) {
          emailId = rawEmail.split('@')[0];
        }

        // 주소
        const rawAddress = String(row[54] || '').trim(); // 엑셀 주소 컬럼
        let mainAddress = rawAddress;
        let detailAddress = '';
        if (rawAddress.includes(',')) {
          const parts = rawAddress.split(',');
          mainAddress = parts[0].trim(); // "서울시 동작구 서달로123"
          detailAddress = parts.slice(1).join(',').trim(); // "102동 1502호 (흑석동...)"
        }

        // 결혼 유무
        const excelMarital = String(row[17] || '').trim();
        const rawAnniversary = row[18];

        let maritalStatusCode = '';
        let anniversaryDate: Date | null = null;
        if (excelMarital.includes('유')) {
          maritalStatusCode = codeLookup['MARITAL_STATUS_기혼'] || '';
          anniversaryDate = this.parseExcelDate(rawAnniversary);
        } else {
          maritalStatusCode = codeLookup['MARITAL_STATUS_미혼'] || '';
          anniversaryDate = null; // 미혼이면 기념일은 없음 🛡️
        }

        const employeeData = {
          nameKr: String(row[2] || '').trim(),
          nameEn: String(row[7] || '').trim() ?? undefined,
          nameCh: String(row[20] || '').trim() ?? undefined,
          no: empNo, // 사번
          id: emailId,
          email: rawEmail ?? undefined,

          departmentId: orgInfo.departmentId ?? undefined,
          teamId: orgInfo.teamId ?? undefined,
          deptId: (orgInfo.teamId || orgInfo.departmentId) ?? undefined,

          // 직급/직책 (코드 또는 명칭)
          jobTitle: orgInfo.jobTitleCode || null,
          jobPosition: orgInfo.jobPositionCode || null,
          jobRole: orgInfo.jobRoleCode || null,
          jobRole2: orgInfo.jobRole2Code || null,

          // 기본 필수 필드 (데이터가 없다면 임시값 설정) ㅋ
          password: await bcrypt.hash('qwer!@#$', 10),
          residentNo: String(row[8] || '').trim(),
          birthDate: this.parseBirthDate(String(row[9]).substring(0, 6)) ?? new Date('1900-01-01'),
          joinDate: this.parseExcelDate(row[3]) ?? new Date(),
          authLevel: authMapping[orgInfo.jobTitleCode] || 'USER',
          gender: String(row[11] || '').trim() === '남자' ? 'MALE' : 'FEMALE',
          isLunar: String(row[13] || '').trim() === '음력' ? true : false,
        };

        const rawGradDate = row[27]; // 엑셀 인덱스 확인
        let finalGradDate: Date | null = null;

        if (typeof rawGradDate === 'number') {
          finalGradDate = new Date(Math.round((rawGradDate - 25569) * 86400 * 1000));
        } else if (rawGradDate instanceof Date) {
          finalGradDate = rawGradDate;
        } else {
          finalGradDate = this.parseExcelDate(String(rawGradDate || ''));
        }

        const detailData = {
          employeeId: employeeData.id,
          type: orgInfo.typeCode || undefined,
          hrStatus: 'EMPLOYED',
          skillLevel: codeLookup[`SKILL_LEVEL_${String(row[29])}`] || undefined,
          eduLevel: String(row[26] || '').trim() || undefined,
          lastSchool: String(row[24] || '').trim() || undefined,
          major: String(row[25] || '').trim() || undefined,
          graduationDate: finalGradDate || undefined,
          zipCode: '',
          address: mainAddress,
          addressDetail: detailAddress,
          emergencyPhone: String(row[47] || '').trim(),
          emergencyRelation: String(row[46] || '').trim(),
          remarks: '',
          totalSwExperience: this.parseCareerMonths(String(row[21] || '').trim()),
          prevSwExperience: this.parseCareerMonths(String(row[22] || '').trim()),
          maritalStatus: maritalStatusCode || undefined,
          weddingAnniv: anniversaryDate || undefined,
        };

        const historyData = {
          employeeId: employeeData.id,
          departmentId: employeeData.departmentId ?? null,
          teamId: employeeData.teamId ?? null,
          ㅇteamId: employeeData.teamId ?? null,
          jobPosition: employeeData.jobPosition ?? null,
          jobTitle: employeeData.jobTitle ?? null,
          applyDate: new Date('2026-01-01'),
          regTime: new Date('2026-01-01'),
          memo: null,
        };

        finalDataList.push({ employeeData, detailData, historyData });

        // // 로그 출력
        // if (finalDataList.length < 10) {
        //   console.log(`\n================= 👤 사원 상세 데이터 [${empNo}] =================`);
        //
        //   // 1. Employee 본체 데이터 전체 출력
        //   console.log('🔹 [Employee Data]');
        //   console.table(employeeData); // 표 형태로 깔끔하게 Key-Value 출력! 🕵️‍♂️
        //
        //   // 2. 상세 정보 데이터 전체 출력
        //   console.log('🔹 [Detail Data]');
        //   console.table(detailData);
        //
        //   // 3. 히스토리 데이터 전체 출력
        //   console.log('🔹 [History Data]');
        //   console.table(historyData);
        //
        //   // 3. 날짜 객체 확인 (toISOString을 써야 시차가 정확히 보입니다 ㅋ)
        //   // console.log('🔹 [Date Check]');
        //   // console.log(` - 생일: ${employeeData.birthDate?.toISOString().split('T')[0]}`);
        //   // console.log(` - 입사: ${employeeData.joinDate?.toISOString().split('T')[0]}`);
        //   // console.log(` - 졸업일: ${detailData.graduationDate?.toISOString().split('T')[0]}`);
        //   // console.log(` - 결혼기념일: ${detailData.weddingAnniv?.toISOString().split('T')[0]}`);
        //   // console.log(` - 적용일: ${historyData.applyDate?.toISOString().split('T')[0]}`);
        //
        //   console.log('===========================================================');
        // }
      }

      const successList: string[] = [];

      for (const data of finalDataList) {
        const { employeeData, detailData, historyData } = data;

        try {
          await this.prisma.$transaction(async (tx) => {
            const employee = await tx.employee.upsert({
              where: { id: employeeData.id },
              update: employeeData,
              create: employeeData,
            });

            // 2. EmployeeDetail 저장 (employee_id 기준)
            // detailData에 employee_id가 연결되어 있어야 합니다.
            await tx.employeeDetail.upsert({
              where: { employeeId: employee.id },
              update: detailData as Prisma.EmployeeDetailUncheckedUpdateInput,
              create: {
                ...detailData,
                employeeId: employee.id,
              } as Prisma.EmployeeDetailUncheckedCreateInput,
            });

            // 3. EmployeeHistory 저장 (이력은 보통 누적이므로 create)
            await tx.employeeOrganizationHistory.create({
              data: {
                ...historyData,
                employeeId: employee.id,
              } as Prisma.EmployeeOrganizationHistoryUncheckedCreateInput,
            });
          });

          process.stdout.write('.'); // 점 하나씩 찍어서 진행 표시
          successList.push(`${employeeData.nameKr}(${employeeData.no})`);
        } catch (error: unknown) {
          const errorMessage: string = error instanceof Error ? error.message : '알 수 없는 에러';

          failureList.push({
            name: String(employeeData.nameKr || 'Unknown'),
            no: String(employeeData.no || 'N/A'),
            reason: errorMessage,
          });
          process.stdout.write('X');
        }
      }

      console.log('\n\n=========================================');
      console.log('📊 배치 작업 최종 결과 리포트');
      console.log('=========================================');
      console.log(`✅ 성공: ${successList.length}명`);
      console.log(`❌ 실패: ${failureList.length}명`);
      console.log('-----------------------------------------');

      if (failureList.length > 0) {
        console.log('🚫 [실패 명단 및 사유]');
        // 테이블 형태로 깔끔하게 출력 ㅋ
        console.table(failureList);
      } else {
        console.log('🎉 축하합니다! 모든 데이터가 성공적으로 적재되었습니다.');
      }
      console.log('=========================================');

      // const fileBuffer = fs.readFileSync(filePath);
      // const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      // const sheet = workbook.Sheets[workbook.SheetNames[0]];
      // const rawData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
      // const dataFromThirdRow = rawData.slice(2);
      //
      // // 2. Prisma 양식에 맞게 매핑 ㅋ
      // const employees = dataFromThirdRow.map((row, index) => {
      //   // 🕵️‍♂️ 엑셀의 열 순서대로 인덱스를 맞추세요 (A열=0, B열=1, C열=2...)
      //   const employeeNo = String(row[0] || ''); // A열: 사번
      //   const employeeName = String(row[1] || ''); // B열: 성명
      //   const employeeEmail = String(row[2] || ''); // C열: 이메일
      //   // const employeeJoinDate = row[3]; // D열: 입사일
      //
      //   return {
      //     id: `EMP-${employeeNo}-${Date.now()}-${index}`, // 고유 ID 생성 ㅋ
      //     employeeCode: employeeNo,
      //     nameKr: employeeName,
      //     email: employeeEmail,
      //     // joinDate: employeeJoinDate ? new Date(employeeJoinDate) : new Date(),
      //     password: 'password123!',
      //     no: employeeNo,
      //     residentNo: '000000-0000000',
      //     birthDate: new Date('1900-01-01'),
      //   };
      // });

      // const validEmployees = employees.filter(emp => emp.employeeCode !== '');

      // console.log('--------------------------------------------------');
      // console.log(`📊 데이터 분석 완료!`);
      // console.log(`✅ 총 건수: ${validEmployees.length}개`);
      //
      // // 2. 상위 3개 상세 로그 (데이터가 제대로 들어갔는지 검증) 🕵️‍♂️
      // console.log('👀 상위 3개 데이터 샘플 상세 확인:');
      // console.dir(validEmployees.slice(0, 3), { depth: null, colors: true });
      //
      // // 3. 마지막 데이터 샘플 (끝까지 잘 읽었는지 확인) 🛡️
      // if (validEmployees.length > 0) {
      //   console.log('🏁 마지막 데이터 샘플:');
      //   console.dir(validEmployees[validEmployees.length - 1], { depth: null, colors: true });
      // }
      //
      // console.log('⚠️ [확인 전용] DB 인서트 로직은 실행되지 않았습니다.');
      // console.log('--------------------------------------------------');

      /* 💡 인서트 로직은 주석 처리하여 실행하지 않음
      const result = await this.prisma.employee.createMany({
        data: validEmployees,
        skipDuplicates: true,
      });
      console.log(`✅ [BATCH] 성공: ${result.count}명 등록됨`);
      */

      // console.log(`✅ [BATCH] 성공: ${result.count}명의 사원이 등록되었습니다.`);
    } catch (error) {
      console.error('❌ [BATCH] 실행 중 오류 발생:', error);
    }
  }
}
