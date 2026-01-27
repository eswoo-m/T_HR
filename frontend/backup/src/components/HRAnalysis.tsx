import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, Award, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useState } from 'react';

// 조직도 기반 실제 데이터 (조직 구조 관리 페이지의 organizationData와 동기화)

// 전체 인원 데이터 (조직도에서 추출)
interface Employee {
  name: string;
  code: string;
  rank: string;
  position: string;
  department: string;
  gender: string;
  experience: number;
  joinYear: string;
  age: number;
  certifications: string[];
  skills: string[];
  skillLevel: string;
}

const allEmployees: Employee[] = [
  // STE1실
  { name: '강현규', code: 'EMP-111', rank: '임원급', position: '이사', department: 'STE1실', gender: '남', experience: 15, joinYear: '2018', age: 45, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'Spring Framework', 'JIRA', 'Mantis'], skillLevel: '고급' },
  { name: '전광희', code: 'EMP-1111', rank: '임원급', position: '팀장', department: 'STE1실', gender: '남', experience: 12, joinYear: '2019', age: 42, certifications: ['정보처리기사'], skills: ['Java', 'Python', 'JIRA', 'Redmine'], skillLevel: '고급' },
  { name: '정홍근', code: 'EMP-1112', rank: '사원', position: '사원', department: 'STE1실', gender: '남', experience: 2, joinYear: '2023', age: 28, certifications: ['정보처리산업기사'], skills: ['JavaScript/React', 'Node.js', 'JIRA'], skillLevel: '초급' },
  { name: '이길원', code: 'EMP-1121', rank: '임원급', position: '팀장', department: 'STE1실', gender: '남', experience: 13, joinYear: '2018', age: 43, certifications: ['정보처리기사', 'ISTQB'], skills: ['Java', 'Spring Framework', 'JIRA', 'Mantis'], skillLevel: '고급' },
  { name: '이성미', code: 'EMP-1122', rank: '책임', position: '책임', department: 'STE1실', gender: '여', experience: 8, joinYear: '2020', age: 36, certifications: ['정보처리기사', '컴퓨터활용능력'], skills: ['Java', 'Python', 'JIRA'], skillLevel: '중급' },
  { name: '조혜진', code: 'EMP-1123', rank: '책임', position: '책임', department: 'STE1실', gender: '여', experience: 7, joinYear: '2021', age: 35, certifications: ['정보처리산업기사'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '이나리', code: 'EMP-1124', rank: '선임', position: '선임', department: 'STE1실', gender: '여', experience: 5, joinYear: '2022', age: 32, certifications: ['컴퓨터활용능력'], skills: ['JavaScript/React', 'Node.js', 'JIRA'], skillLevel: '중급' },
  { name: '박준수', code: 'EMP-1141', rank: '책임', position: '책임', department: 'STE1실', gender: '남', experience: 7, joinYear: '2021', age: 35, certifications: ['정보처리기사'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '용상수', code: 'EMP-1142', rank: '책임', position: '책임', department: 'STE1실', gender: '남', experience: 6, joinYear: '2022', age: 34, certifications: [], skills: ['Python', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '김규현', code: 'EMP-1143', rank: '사원', position: '사원', department: 'STE1실', gender: '남', experience: 1, joinYear: '2024', age: 26, certifications: [], skills: ['Java', 'JIRA'], skillLevel: '초급' },
  
  // STE2실
  { name: '조현균', code: 'EMP-1211', rank: '임원급', position: '팀장', department: 'STE2실', gender: '남', experience: 14, joinYear: '2018', age: 44, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'Spring Framework', 'JIRA', 'Redmine'], skillLevel: '고급' },
  { name: '조현정', code: 'EMP-1212', rank: '책임', position: '책임', department: 'STE2실', gender: '여', experience: 7, joinYear: '2021', age: 36, certifications: ['정보처리기사'], skills: ['Java', 'Python', 'JIRA'], skillLevel: '중급' },
  { name: '최현준', code: 'EMP-1213', rank: '책임', position: '책임', department: 'STE2실', gender: '남', experience: 8, joinYear: '2020', age: 37, certifications: ['정보처리기사', 'ISTQB'], skills: ['Java', 'Spring Framework', 'JIRA', 'Mantis'], skillLevel: '중급' },
  { name: '강성희', code: 'EMP-1214', rank: '선임', position: '선임', department: 'STE2실', gender: '여', experience: 4, joinYear: '2023', age: 31, certifications: ['컴퓨터활용능력'], skills: ['JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '강문혁', code: 'EMP-1215', rank: '사원', position: '사원', department: 'STE2실', gender: '남', experience: 2, joinYear: '2023', age: 28, certifications: ['정보처리산업기사'], skills: ['Java', 'JIRA'], skillLevel: '초급' },
  { name: '장대열', code: 'EMP-1221', rank: '선임', position: '선임', department: 'STE2실', gender: '남', experience: 5, joinYear: '2022', age: 32, certifications: ['정보처리기사'], skills: ['Python', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '윤제진', code: 'EMP-1231', rank: '수석', position: '수석', department: 'STE2실', gender: '남', experience: 12, joinYear: '2019', age: 40, certifications: ['정보처리기사', 'PMP', 'ISTQB'], skills: ['Java', 'Spring Framework', 'JIRA', 'Mantis'], skillLevel: '고급' },
  { name: '신진욱', code: 'EMP-1232', rank: '수석', position: '수석', department: 'STE2실', gender: '남', experience: 11, joinYear: '2019', age: 39, certifications: ['정보처리기사', 'ISTQB'], skills: ['Java', 'Python', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '이영택', code: 'EMP-1233', rank: '책임', position: '책임', department: 'STE2실', gender: '남', experience: 6, joinYear: '2022', age: 34, certifications: ['정보처리산업기사'], skills: ['Java', 'JIRA', 'Redmine'], skillLevel: '중급' },
  
  // 경영전략실
  { name: '김완수', code: 'EMP-2101', rank: '임원급', position: '부사장', department: '경영전략실', gender: '남', experience: 18, joinYear: '2015', age: 48, certifications: ['정보처리기사'], skills: ['JIRA', 'Redmine'], skillLevel: '고급' },
  { name: '이현직', code: 'EMP-2102', rank: '임원급', position: '실장', department: '경영전략실', gender: '남', experience: 16, joinYear: '2016', age: 46, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'JIRA'], skillLevel: '고급' },
  { name: '김예림', code: 'EMP-2103', rank: '임원급', position: '파트장', department: '경영전략실', gender: '여', experience: 10, joinYear: '2020', age: 38, certifications: ['컴퓨터활용능력', '기타'], skills: ['JIRA'], skillLevel: '중급' },
  { name: '가라현', code: 'EMP-2104', rank: '사원', position: '사원', department: '경영전략실', gender: '여', experience: 2, joinYear: '2023', age: 27, certifications: ['컴퓨터활용능력'], skills: ['JIRA'], skillLevel: '초급' },
  { name: '신소영', code: 'EMP-2105', rank: '사원', position: '사원', department: '경영전략실', gender: '여', experience: 1, joinYear: '2024', age: 25, certifications: [], skills: ['JIRA'], skillLevel: '초급' },
  { name: '이유라', code: 'EMP-2201', rank: '선임', position: '선임', department: '경영전략실', gender: '여', experience: 5, joinYear: '2022', age: 32, certifications: ['정보처리산업기사', '컴퓨터활용능력'], skills: ['JIRA', 'Mantis'], skillLevel: '중급' },
  { name: '주호정', code: 'EMP-2202', rank: '사원', position: '사원', department: '경영전략실', gender: '남', experience: 2, joinYear: '2023', age: 29, certifications: ['컴퓨터활용능력'], skills: ['JIRA'], skillLevel: '초급' },
  { name: '김연서', code: 'EMP-2203', rank: '사원', position: '사원', department: '경영전략실', gender: '여', experience: 1, joinYear: '2024', age: 26, certifications: [], skills: ['JIRA'], skillLevel: '초급' },
  
  // 개발연구소
  { name: '김태영', code: 'EMP-301', rank: '임원급', position: '부사장', department: '개발연구소', gender: '남', experience: 20, joinYear: '2015', age: 50, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'Python', 'Spring Framework', 'JIRA'], skillLevel: '고급' },
  { name: '이혜진', code: 'EMP-302', rank: '임원급', position: '이사', department: '개발연구소', gender: '여', experience: 16, joinYear: '2016', age: 46, certifications: ['정보처리기사', 'ISTQB', '기타'], skills: ['Java', 'Python', 'JIRA', 'Mantis'], skillLevel: '고급' },
  { name: '우은순', code: 'EMP-303', rank: '임원급', position: '팀장', department: '개발연구소', gender: '여', experience: 12, joinYear: '2019', age: 42, certifications: ['정보처리기사'], skills: ['Java', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '김지연', code: 'EMP-304', rank: '사원', position: '사원', department: '개발연구소', gender: '여', experience: 2, joinYear: '2023', age: 28, certifications: ['정보처리산업기사', 'ISTQB'], skills: ['JavaScript/React', 'Node.js', 'JIRA'], skillLevel: '초급' },
  { name: '추경운', code: 'EMP-305', rank: '사원', position: '사원', department: '개발연구소', gender: '남', experience: 2, joinYear: '2023', age: 29, certifications: ['컴퓨터활용능력'], skills: ['Python', 'JIRA'], skillLevel: '초급' },
  { name: '김준하', code: 'EMP-3101', rank: '선임', position: '선임', department: '개발연구소', gender: '남', experience: 4, joinYear: '2023', age: 31, certifications: ['정보처리기사', 'ISTQB'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '이유나', code: 'EMP-3102', rank: '선임', position: '선임', department: '개발연구소', gender: '여', experience: 5, joinYear: '2022', age: 32, certifications: ['정보처리산업기사'], skills: ['JavaScript/React', 'Node.js', 'JIRA'], skillLevel: '중급' },
  { name: '유정선', code: 'EMP-3103', rank: '선임', position: '선임', department: '개발연구소', gender: '여', experience: 4, joinYear: '2023', age: 30, certifications: ['컴퓨터활용능력', '기타'], skills: ['Python', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '손진빈', code: 'EMP-3104', rank: '사원', position: '사원', department: '개발연구소', gender: '남', experience: 1, joinYear: '2024', age: 27, certifications: [], skills: ['Java', 'JIRA'], skillLevel: '초급' },
  { name: '유예진', code: 'EMP-3105', rank: '사원', position: '사원', department: '개발연구소', gender: '여', experience: 1, joinYear: '2024', age: 26, certifications: ['컴퓨터활용능력'], skills: ['JavaScript/React', 'JIRA'], skillLevel: '초급' },
  { name: '박민수', code: 'EMP-3106', rank: '책임', position: '책임', department: '개발연구소', gender: '남', experience: 7, joinYear: '2021', age: 35, certifications: ['정보처리기사'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '정하은', code: 'EMP-3107', rank: '책임', position: '책임', department: '개발연구소', gender: '여', experience: 6, joinYear: '2022', age: 33, certifications: ['정보처리산업기사', 'ISTQB'], skills: ['Python', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  
  // STE그룹
  { name: '박성호', code: 'EMP-101', rank: '임원급', position: '사장', department: 'STE그룹', gender: '남', experience: 22, joinYear: '2010', age: 52, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'JIRA'], skillLevel: '고급' },
  { name: '김종협', code: 'EMP-102', rank: '임원급', position: '실장', department: 'STE그룹', gender: '남', experience: 17, joinYear: '2015', age: 47, certifications: ['정보처리기사'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '고급' },
];

// 직급별 인원 데이터 (직급체계: 사원, 선임, 책임, 수석)
const rankDistributionData = [
  { rank: '사원', count: 11, percentage: 30.6 }, // 정홍근, 김규현, 강문혁, 가라현, 신소영, 주호정, 김연서, 김지연, 추경운, 손진빈, 유예진
  { rank: '선임', count: 7, percentage: 19.4 }, // 이나리, 강성희, 장대열, 이유라, 김준하, 이유나, 유정선
  { rank: '책임', count: 9, percentage: 25.0 }, // 이성미, 조혜진, 박준수, 용상수, 조현정, 최현준, 이영택, 박민수, 정하은
  { rank: '수석', count: 2, percentage: 5.6 }, // 윤제진, 신진욱
  { rank: '임원급', count: 7, percentage: 19.4 }, // 팀장(전광희, 이길원, 조현균, 우은순), 파트장(김예림), 이사(강현규, 이혜진)
];

// 직책별 인원 데이터
const positionDistributionData = [
  { position: '팀원', count: 19 },
  { position: '파트장', count: 1 }, // 김예림
  { position: '팀장', count: 4 }, // 전광희, 이길원, 조현균, 우은순
  { position: '이사', count: 2 }, // 강현규, 이혜진
  { position: '실장', count: 2 }, // 김종협, 이현직
  { position: '부사장', count: 2 }, // 김완수, 김태영
  { position: '사장', count: 1 }, // 박성호
  { position: '대표이사', count: 1 }, // 김종균
];

// 부서별 인원 데이터 (조직도 기반)
const departmentData = [
  { 
    dept: 'STE1실', 
    count: 9, 
    male: 7, 
    female: 2,
    rank사원: 2, // 정홍근, 김규현
    rank선임: 1, // 이나리
    rank책임: 4, // 이성미, 조혜진, 박준수, 용상수
    rank수석: 0,
    rank임원급: 2, // 강현규 이사, 전광희 팀장, 이길원 팀장
  },
  { 
    dept: 'STE2실', 
    count: 9, 
    male: 8, 
    female: 1,
    rank사원: 1, // 강문혁
    rank선임: 2, // 강성희, 장대열
    rank책임: 3, // 조현정, 최현준, 이영택
    rank수석: 2, // 윤제진, 신진욱
    rank임원급: 1, // 조현균 팀장
  },
  { 
    dept: '경영전략실', 
    count: 8, 
    male: 5, 
    female: 3,
    rank사원: 4, // 가라현, 신소영, 주호정, 김연서
    rank선임: 1, // 이유라
    rank책임: 0,
    rank수석: 0,
    rank임원급: 3, // 김완수 부사장, 이현직 실장, 김예림 파트장
  },
  { 
    dept: '개발연구소', 
    count: 12, 
    male: 7, 
    female: 5,
    rank사원: 4, // 김지연, 추경운, 손진빈, 유예진
    rank선임: 3, // 김준하, 이유나, 유정선
    rank책임: 2, // 박민수, 정하은
    rank수석: 0,
    rank임원급: 3, // 김태영 부사장, 이혜진 이사, 우은순 팀장
  },
  { 
    dept: 'STE그룹(사장/실장)', 
    count: 2, 
    male: 2, 
    female: 0,
    rank사원: 0,
    rank선임: 0,
    rank책임: 0,
    rank수석: 0,
    rank임원급: 2, // 박성호 사장, 김종협 실장
  },
];

// 기술 스택별 인력 분포
const techStackData = [
  { tech: 'Java', count: 28, junior: 10, middle: 12, senior: 6 },
  { tech: 'Python', count: 18, junior: 7, middle: 8, senior: 3 },
  { tech: 'JavaScript/React', count: 22, junior: 9, middle: 9, senior: 4 },
  { tech: 'Node.js', count: 14, junior: 6, middle: 5, senior: 3 },
  { tech: 'Spring Framework', count: 24, junior: 8, middle: 11, senior: 5 },
  { tech: 'JIRA', count: 30, junior: 11, middle: 13, senior: 6 },
  { tech: 'Mantis', count: 16, junior: 5, middle: 7, senior: 4 },
  { tech: 'Redmine', count: 12, junior: 3, middle: 6, senior: 3 },
];

// 기술 역량 레벨 분포
const skillLevelData = [
  { level: '초급', count: 12, percentage: 35.3 },
  { level: '중급', count: 17, percentage: 50.0 },
  { level: '고급', count: 5, percentage: 14.7 },
];

// 인증/자격증 현황
const certificationData = [
  { name: '정보처리기사', count: 22, percentage: 64.7 },
  { name: '정보처리산업기사', count: 15, percentage: 44.1 },
  { name: '컴퓨터활용능력', count: 18, percentage: 52.9 },
  { name: 'ISTQB', count: 8, percentage: 23.5 },
  { name: '기타', count: 12, percentage: 35.3 },
];

// 자격증 보유 개수별 인원
const certCountData = [
  { count: '0개', people: 8 },
  { count: '1개', people: 12 },
  { count: '2개', people: 10 },
  { count: '3개', people: 6 },
  { count: '4개 이상', people: 3 },
];

// 직급별 상세 현황 (조직도 기반)
const rankDetailData = [
  { rank: '사원', total: 11, ste1: 2, ste2: 1, mgmt: 4, dev: 4, avgYear: 2.1 },
  { rank: '선임', total: 7, ste1: 1, ste2: 2, mgmt: 1, dev: 3, avgYear: 4.8 },
  { rank: '책임', total: 9, ste1: 4, ste2: 3, mgmt: 0, dev: 2, avgYear: 7.0 },
  { rank: '수석', total: 2, ste1: 0, ste2: 2, mgmt: 0, dev: 0, avgYear: 11.5 },
  { rank: '임원급', total: 7, ste1: 2, ste2: 1, mgmt: 3, dev: 3, avgYear: 15.2 },
];

// 연령대별 분포 (mock)
const ageDistributionData = [
  { age: '20대', count: 12, percentage: 35.3 },
  { age: '30대', count: 15, percentage: 44.1 },
  { age: '40대', count: 6, percentage: 17.6 },
  { age: '50대', count: 1, percentage: 2.9 },
];

// 근속년수별 분포 (mock)
const tenureData = [
  { tenure: '1년 미만', count: 6 },
  { tenure: '1-3년', count: 12 },
  { tenure: '3-5년', count: 10 },
  { tenure: '5-10년', count: 8 },
  { tenure: '10년 이상', count: 3 },
];

// 연차별 인원 분포 (mock)
const experienceYearData = [
  { year: '1년차', count: 8 },
  { year: '2년차', count: 7 },
  { year: '3년차', count: 5 },
  { year: '4년차', count: 4 },
  { year: '5년차', count: 6 },
  { year: '6-10년차', count: 11 },
  { year: '11-15년차', count: 5 },
  { year: '15년차 이상', count: 3 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f97316'];

export function HRAnalysis() {
  const totalEmployees = 36; // 실제 조직도 기반 (대표 제외한 임직원 수)
  const certHolders = totalEmployees - certCountData[0].people;
  const certHoldingRate = ((certHolders / totalEmployees) * 100).toFixed(1);

  // Dialog state
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [showGroupedByLevel, setShowGroupedByLevel] = useState(false);

  // 인원 클릭 핸들러
  const handleEmployeeClick = (title: string, filterFn: (emp: Employee) => boolean, groupByLevel = false) => {
    const filtered = allEmployees.filter(filterFn);
    setDialogTitle(title);
    setFilteredEmployees(filtered);
    setShowGroupedByLevel(groupByLevel);
    setIsEmployeeDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-primary mb-2">인사현황</h1>
        <p className="text-muted-foreground">인력 현황, 기술 역량, 자격증 보유 현황을 분석하고 통계를 확인하세요</p>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="rank" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rank">직급/연차 현황</TabsTrigger>
          <TabsTrigger value="department">부서/조직 현황</TabsTrigger>
          <TabsTrigger value="skills">기술 역량 분석</TabsTrigger>
          <TabsTrigger value="cert">인증/자격증</TabsTrigger>
          <TabsTrigger value="age">연령/근속 분</TabsTrigger>
        </TabsList>

        {/* 직급/연차 현황 탭 */}
        <TabsContent value="rank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>직급별 부서 분포 및 평균 연차</CardTitle>
              <CardDescription>각 직급별로 부서에 배치된 인원 및 평균 경력 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">직급</th>
                      <th className="text-center p-3">전체</th>
                      <th className="text-center p-3">STE1실</th>
                      <th className="text-center p-3">STE2실</th>
                      <th className="text-center p-3">경영전략실</th>
                      <th className="text-center p-3">개발연구소</th>
                      <th className="text-center p-3">평균연차</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankDetailData.map((row) => (
                      <tr key={row.rank} className="border-b hover:bg-accent/50">
                        <td className="p-3">
                          <Badge variant="outline">{row.rank}</Badge>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleEmployeeClick(
                            `${row.rank} 전체 ${row.total}명`,
                            (emp) => emp.rank === row.rank
                          )}
                        >
                          <span className="underline decoration-dotted">{row.total}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleEmployeeClick(
                            `STE1실 ${row.rank} ${row.ste1}명`,
                            (emp) => emp.rank === row.rank && emp.department === 'STE1실'
                          )}
                        >
                          <span className="underline decoration-dotted">{row.ste1}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleEmployeeClick(
                            `STE2실 ${row.rank} ${row.ste2}명`,
                            (emp) => emp.rank === row.rank && emp.department === 'STE2실'
                          )}
                        >
                          <span className="underline decoration-dotted">{row.ste2}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleEmployeeClick(
                            `경영전략실 ${row.rank} ${row.mgmt}명`,
                            (emp) => emp.rank === row.rank && emp.department === '경영전략실'
                          )}
                        >
                          <span className="underline decoration-dotted">{row.mgmt}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleEmployeeClick(
                            `개발연구소 ${row.rank} ${row.dev}명`,
                            (emp) => emp.rank === row.rank && emp.department === '개발연구소'
                          )}
                        >
                          <span className="underline decoration-dotted">{row.dev}명</span>
                        </td>
                        <td className="text-center p-3">
                          <Badge>{row.avgYear}년</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>직급 분포 비율</CardTitle>
                <CardDescription>전체 인원 대비 직급별 비율 (사원, 선임, 책임, 수석, 임원급)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center" style={{ height: 300 }}>
                  <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                    {/* 피라미드 층 그리기 (위에서 아래로: 임원급 → 수석 → 책임 → 선임 → 사원) */}
                    {(() => {
                      const pyramidData = [...rankDistributionData].reverse(); // 임원급이 맨 위로
                      const centerX = 200;
                      const startY = 20;
                      const layerHeight = 55;
                      const maxWidth = 350;
                      const maxCount = Math.max(...pyramidData.map(d => d.count)); // 최대 인원 수
                      
                      return pyramidData.map((item, index) => {
                        const y = startY + index * layerHeight;
                        
                        // 현재 층의 너비 (인원 수에 비례)
                        const widthRatio = item.count / maxCount;
                        const width = maxWidth * widthRatio * 0.9 + maxWidth * 0.1; // 최소 10% 너비 보장
                        const x1 = centerX - width / 2;
                        const x2 = centerX + width / 2;
                        const y1 = y;
                        const y2 = y + layerHeight;
                        
                        // 다음 층의 너비 계산 (인원 수에 비례)
                        let nextWidth = width;
                        if (index < pyramidData.length - 1) {
                          const nextWidthRatio = pyramidData[index + 1].count / maxCount;
                          nextWidth = maxWidth * nextWidthRatio * 0.9 + maxWidth * 0.1;
                        }
                        const nextX1 = centerX - nextWidth / 2;
                        const nextX2 = centerX + nextWidth / 2;
                        
                        return (
                          <g key={item.rank}>
                            {/* 사다리꼴 */}
                            <path
                              d={`M ${x1} ${y1} L ${x2} ${y1} L ${nextX2} ${y2} L ${nextX1} ${y2} Z`}
                              fill={COLORS[pyramidData.length - 1 - index % COLORS.length]}
                              stroke="#fff"
                              strokeWidth="2"
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleEmployeeClick(
                                `${item.rank} 전체 ${item.count}명`,
                                (emp) => emp.rank === item.rank
                              )}
                            />
                            {/* 텍스트 라벨 */}
                            <text
                              x={centerX}
                              y={y + layerHeight / 2 + 5}
                              textAnchor="middle"
                              fill="#fff"
                              fontSize="14"
                              fontWeight="600"
                              className="pointer-events-none"
                            >
                              {item.rank} {item.count}명 ({item.percentage}%)
                            </text>
                          </g>
                        );
                      });
                    })()}
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>연차별 인원 분포</CardTitle>
                <CardDescription>경력 연차별 인원 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={experienceYearData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}명`, '인원']} />
                    <Bar dataKey="count" fill="#10b981" name="인원" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>직책별 인원 현황</CardTitle>
              <CardDescription>직책별 상세 분포 (대표이사, 사장, 부사장, 실장, 이사, 파트장, 팀장, 팀원)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={positionDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}명`, '인원']} />
                  <Bar dataKey="count" fill="#8b5cf6" name="인원" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 부서/조직 현황 탭 */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>부서별 직급 구성</CardTitle>
              <CardDescription>각 부서의 직급별 인원 분포</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${value}명`, name]} />
                  <Legend />
                  <Bar dataKey="rank사원" stackId="a" fill="#3b82f6" name="사원" />
                  <Bar dataKey="rank선임" stackId="a" fill="#8b5cf6" name="선임" />
                  <Bar dataKey="rank책임" stackId="a" fill="#ec4899" name="책임" />
                  <Bar dataKey="rank수석" stackId="a" fill="#f59e0b" name="수석" />
                  <Bar dataKey="rank임원급" stackId="a" fill="#10b981" name="임원급" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>조직별 주요 지표</CardTitle>
              <CardDescription>부서별 요약 통계</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {departmentData.map((dept, index) => (
                  <div key={dept.dept} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <h4 className="text-sm">{dept.dept}</h4>
                    </div>
                    <div className="text-2xl mb-1">{dept.count}명</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>남성 {dept.male}명 ({((dept.male / dept.count) * 100).toFixed(0)}%)</div>
                      <div>여성 {dept.female}명 ({((dept.female / dept.count) * 100).toFixed(0)}%)</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>부서별 상세 현황</CardTitle>
              <CardDescription>각 부서의 인원 구성 및 직급 분포</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">부서명</th>
                      <th className="text-center p-3">전체 인원</th>
                      <th className="text-center p-3">사원</th>
                      <th className="text-center p-3">선임</th>
                      <th className="text-center p-3">책임</th>
                      <th className="text-center p-3">수석</th>
                      <th className="text-center p-3">임원급</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((dept) => (
                      <tr key={dept.dept} className="border-b hover:bg-accent/50">
                        <td className="p-3">
                          <Badge variant="outline">{dept.dept}</Badge>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleEmployeeClick(
                            `${dept.dept} 전체 ${dept.count}명`,
                            (emp) => emp.department === dept.dept || (dept.dept === 'STE그룹(사장/실장)' && emp.department === 'STE그룹')
                          )}
                        >
                          <span className="underline decoration-dotted">{dept.count}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => dept.rank사원 > 0 && handleEmployeeClick(
                            `${dept.dept} 사원 ${dept.rank사원}명`,
                            (emp) => emp.rank === '사원' && (emp.department === dept.dept || (dept.dept === 'STE그룹(사장/실장)' && emp.department === 'STE그룹'))
                          )}
                        >
                          <span className={dept.rank사원 > 0 ? "underline decoration-dotted" : ""}>{dept.rank사원}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => dept.rank선임 > 0 && handleEmployeeClick(
                            `${dept.dept} 선임 ${dept.rank선임}명`,
                            (emp) => emp.rank === '선임' && (emp.department === dept.dept || (dept.dept === 'STE그룹(사장/실장)' && emp.department === 'STE그룹'))
                          )}
                        >
                          <span className={dept.rank선임 > 0 ? "underline decoration-dotted" : ""}>{dept.rank선임}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => dept.rank책임 > 0 && handleEmployeeClick(
                            `${dept.dept} 책임 ${dept.rank책임}명`,
                            (emp) => emp.rank === '책임' && (emp.department === dept.dept || (dept.dept === 'STE그룹(사장/실장)' && emp.department === 'STE그룹'))
                          )}
                        >
                          <span className={dept.rank책임 > 0 ? "underline decoration-dotted" : ""}>{dept.rank책임}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => dept.rank수석 > 0 && handleEmployeeClick(
                            `${dept.dept} 수석 ${dept.rank수석}명`,
                            (emp) => emp.rank === '수석' && (emp.department === dept.dept || (dept.dept === 'STE그룹(사장/실장)' && emp.department === 'STE그룹'))
                          )}
                        >
                          <span className={dept.rank수석 > 0 ? "underline decoration-dotted" : ""}>{dept.rank수석}명</span>
                        </td>
                        <td 
                          className="text-center p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => dept.rank임원급 > 0 && handleEmployeeClick(
                            `${dept.dept} 임원급 ${dept.rank임원급}명`,
                            (emp) => emp.rank === '임원급' && (emp.department === dept.dept || (dept.dept === 'STE그룹(사장/실장)' && emp.department === 'STE그룹'))
                          )}
                        >
                          <span className={dept.rank임원급 > 0 ? "underline decoration-dotted" : ""}>{dept.rank임원급}명</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 기술 역량 분석 탭 */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>전체 기술 역량 레벨 분포</CardTitle>
              <CardDescription>전 직원의 기술 숙련도 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={skillLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ level, percentage }) => `${level} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {skillLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value}명`, props.payload.level]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center space-y-3">
                  {skillLevelData.map((item, index) => (
                    <div 
                      key={item.level} 
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleEmployeeClick(
                        `${item.level} 역량 보유자 ${item.count}명`,
                        (emp) => emp.skillLevel === item.level
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span>{item.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="underline decoration-dotted">{item.count}명</Badge>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>기술 스택별 상세 분포</CardTitle>
              <CardDescription>기술별 초급/중급/고급 인력 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {techStackData.map((tech) => (
                  <div key={tech.tech} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{tech.tech}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover:bg-accent underline decoration-dotted"
                        onClick={() => handleEmployeeClick(
                          `${tech.tech} 보유자 ${tech.count}명`,
                          (emp) => emp.skills.includes(tech.tech),
                          true
                        )}
                      >
                        {tech.count}명
                      </Badge>
                    </div>
                    <div className="flex gap-1 h-2 rounded overflow-hidden">
                      <div 
                        className="bg-green-500 cursor-pointer hover:opacity-80" 
                        style={{ width: `${(tech.junior / tech.count) * 100}%` }}
                        title={`초급: ${tech.junior}명`}
                        onClick={() => handleEmployeeClick(
                          `${tech.tech} 초급 ${tech.junior}명`,
                          (emp) => emp.skills.includes(tech.tech) && emp.skillLevel === '초급'
                        )}
                      ></div>
                      <div 
                        className="bg-blue-500 cursor-pointer hover:opacity-80" 
                        style={{ width: `${(tech.middle / tech.count) * 100}%` }}
                        title={`중급: ${tech.middle}명`}
                        onClick={() => handleEmployeeClick(
                          `${tech.tech} 중급 ${tech.middle}명`,
                          (emp) => emp.skills.includes(tech.tech) && emp.skillLevel === '중급'
                        )}
                      ></div>
                      <div 
                        className="bg-purple-500 cursor-pointer hover:opacity-80" 
                        style={{ width: `${(tech.senior / tech.count) * 100}%` }}
                        title={`고급: ${tech.senior}명`}
                        onClick={() => handleEmployeeClick(
                          `${tech.tech} 고급 ${tech.senior}명`,
                          (emp) => emp.skills.includes(tech.tech) && emp.skillLevel === '고급'
                        )}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span 
                        className="cursor-pointer hover:underline"
                        onClick={() => handleEmployeeClick(
                          `${tech.tech} 초급 ${tech.junior}명`,
                          (emp) => emp.skills.includes(tech.tech) && emp.skillLevel === '초급'
                        )}
                      >
                        초급 {tech.junior}
                      </span>
                      <span 
                        className="cursor-pointer hover:underline"
                        onClick={() => handleEmployeeClick(
                          `${tech.tech} 중급 ${tech.middle}명`,
                          (emp) => emp.skills.includes(tech.tech) && emp.skillLevel === '중급'
                        )}
                      >
                        중급 {tech.middle}
                      </span>
                      <span 
                        className="cursor-pointer hover:underline"
                        onClick={() => handleEmployeeClick(
                          `${tech.tech} 고급 ${tech.senior}명`,
                          (emp) => emp.skills.includes(tech.tech) && emp.skillLevel === '고급'
                        )}
                      >
                        고급 {tech.senior}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 인증/자격증 탭 */}
        <TabsContent value="cert" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>주요 자격증 보유 현황</CardTitle>
                <CardDescription>자격증별 보유 인원 및 비율</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certificationData.map((cert) => (
                    <div 
                      key={cert.name} 
                      className="border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleEmployeeClick(
                        `${cert.name} 보유자 ${cert.count}명`,
                        (emp) => emp.certifications.includes(cert.name)
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span>{cert.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="underline decoration-dotted">{cert.count}명</Badge>
                          <span className="text-xs text-muted-foreground">{cert.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-accent h-2 rounded overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full" 
                          style={{ width: `${cert.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>자격증 보유 개수별 인원</CardTitle>
                <CardDescription>개인별 자격증 보유 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={certCountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="count" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}명`, '인원']} />
                    <Bar 
                      dataKey="people" 
                      fill="#f59e0b" 
                      name="인원"
                      className="cursor-pointer"
                      onClick={(data) => {
                        const certCount = data.count;
                        let filterFn: (emp: Employee) => boolean;
                        if (certCount === '0개') {
                          filterFn = (emp) => emp.certifications.length === 0;
                        } else if (certCount === '1개') {
                          filterFn = (emp) => emp.certifications.length === 1;
                        } else if (certCount === '2개') {
                          filterFn = (emp) => emp.certifications.length === 2;
                        } else if (certCount === '3개') {
                          filterFn = (emp) => emp.certifications.length === 3;
                        } else {
                          filterFn = (emp) => emp.certifications.length >= 4;
                        }
                        handleEmployeeClick(`자격증 ${certCount} 보유자 ${data.people}명`, filterFn);
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">전체 자격증 보유율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{certHoldingRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">{totalEmployees}명 중 {certHolders}명 보유</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">평균 보유 개수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">1.6개</div>
                <p className="text-xs text-muted-foreground mt-1">보유자 기준 2.1개</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">고급 자격증 보유자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">14명</div>
                <p className="text-xs text-muted-foreground mt-1">전체의 41.2%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 연령/근속 분석 탭 */}
        <TabsContent value="age" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>연령대별 분포</CardTitle>
                <CardDescription>연령대별 인원 구성</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ageDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ age, percentage }) => `${age} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {ageDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value}명`, props.payload.age]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>근속년수별 분포</CardTitle>
                <CardDescription>근속기간별 인원 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tenureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tenure" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}명`, '인원']} />
                    <Bar dataKey="count" fill="#f59e0b" name="인원" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>연령 및 근속 상세 분석</CardTitle>
              <CardDescription>연령대별, 근속년수별 주요 지표</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-3">연령대별 현황</h4>
                  <div className="space-y-3">
                    {ageDistributionData.map((item) => (
                      <div key={item.age} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{item.age}</Badge>
                          <span>{item.count}명</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3">근속년수별 현황</h4>
                  <div className="space-y-3">
                    {tenureData.map((item) => (
                      <div key={item.tenure} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{item.tenure}</Badge>
                          <span>{item.count}명</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {((item.count / totalEmployees) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for Employee List */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>해당 조건에 맞는 직원 목록입니다.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto overflow-x-auto flex-1 px-6">
            {showGroupedByLevel ? (
              <div className="space-y-4">
                {/* 고급 */}
                {filteredEmployees.filter(emp => emp.skillLevel === '고급').length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background pb-2">
                      <Badge className="bg-purple-500">고급</Badge>
                      <span className="text-sm text-muted-foreground">
                        {filteredEmployees.filter(emp => emp.skillLevel === '고급').length}명
                      </span>
                    </div>
                    <table className="w-full text-sm mb-4">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 text-xs">이름</th>
                          <th className="text-center p-2 text-xs">직급</th>
                          <th className="text-center p-2 text-xs">부서</th>
                          <th className="text-center p-2 text-xs">경력</th>
                          <th className="text-center p-2 text-xs">자격증</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.filter(emp => emp.skillLevel === '고급').map((emp) => (
                          <tr key={emp.code} className="border-b hover:bg-accent/50">
                            <td className="p-2">{emp.name}</td>
                            <td className="text-center p-2">{emp.rank}</td>
                            <td className="text-center p-2">{emp.department}</td>
                            <td className="text-center p-2">{emp.experience}년</td>
                            <td className="text-center p-2 text-xs">
                              {emp.certifications.length > 0 ? emp.certifications.join(', ') : '없음'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* 중급 */}
                {filteredEmployees.filter(emp => emp.skillLevel === '중급').length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background pb-2">
                      <Badge className="bg-blue-500">중급</Badge>
                      <span className="text-sm text-muted-foreground">
                        {filteredEmployees.filter(emp => emp.skillLevel === '중급').length}명
                      </span>
                    </div>
                    <table className="w-full text-sm mb-4">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 text-xs">이름</th>
                          <th className="text-center p-2 text-xs">직급</th>
                          <th className="text-center p-2 text-xs">부서</th>
                          <th className="text-center p-2 text-xs">경력</th>
                          <th className="text-center p-2 text-xs">자격증</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.filter(emp => emp.skillLevel === '중급').map((emp) => (
                          <tr key={emp.code} className="border-b hover:bg-accent/50">
                            <td className="p-2">{emp.name}</td>
                            <td className="text-center p-2">{emp.rank}</td>
                            <td className="text-center p-2">{emp.department}</td>
                            <td className="text-center p-2">{emp.experience}년</td>
                            <td className="text-center p-2 text-xs">
                              {emp.certifications.length > 0 ? emp.certifications.join(', ') : '없음'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* 초급 */}
                {filteredEmployees.filter(emp => emp.skillLevel === '초급').length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background pb-2">
                      <Badge className="bg-green-500">초급</Badge>
                      <span className="text-sm text-muted-foreground">
                        {filteredEmployees.filter(emp => emp.skillLevel === '초급').length}명
                      </span>
                    </div>
                    <table className="w-full text-sm mb-4">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 text-xs">이름</th>
                          <th className="text-center p-2 text-xs">직급</th>
                          <th className="text-center p-2 text-xs">부서</th>
                          <th className="text-center p-2 text-xs">경력</th>
                          <th className="text-center p-2 text-xs">자격증</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.filter(emp => emp.skillLevel === '초급').map((emp) => (
                          <tr key={emp.code} className="border-b hover:bg-accent/50">
                            <td className="p-2">{emp.name}</td>
                            <td className="text-center p-2">{emp.rank}</td>
                            <td className="text-center p-2">{emp.department}</td>
                            <td className="text-center p-2">{emp.experience}년</td>
                            <td className="text-center p-2 text-xs">
                              {emp.certifications.length > 0 ? emp.certifications.join(', ') : '없음'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="text-left p-2 text-xs">이름</th>
                    <th className="text-center p-2 text-xs">직급</th>
                    <th className="text-center p-2 text-xs">부서</th>
                    <th className="text-center p-2 text-xs">경력</th>
                    <th className="text-center p-2 text-xs">자격증</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.code} className="border-b hover:bg-accent/50">
                      <td className="p-2">{emp.name}</td>
                      <td className="text-center p-2">{emp.rank}</td>
                      <td className="text-center p-2">{emp.department}</td>
                      <td className="text-center p-2">{emp.experience}년</td>
                      <td className="text-center p-2 text-xs">
                        {emp.certifications.length > 0 ? emp.certifications.join(', ') : '없음'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}