// src/features/employee/types.ts
export interface Employee {
    id?: number;
    code: string;        // 사번 (EMP-xxx)
    name: string;        // 이름
    email: string;       // 이메일
    password?: string;   // 비밀번호
    rank: string;        // 직급
    position: string;    // 직책
    department: string;  // 부서
    team: string;        // 팀
    gender: '남' | '여';
    joinYear: string;    // 입사년도
    experience: number;  // 경력
    skillLevel: '초급' | '중급' | '고급';
    certifications: string[];
    skills: string[];
    status: string;      // 재직상태
}