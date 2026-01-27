import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, UserCheck, UserX, Calendar, TrendingUp, TrendingDown, Award, ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { useState } from 'react';

// 120명의 인력 데이터 생성 함수
const generateMembers = () => {
  const positions = ['사원', '선임', '책임', '수석'];
  const departments = ['STE1실', 'STE2실'];
  const skills = [
    ['Java', 'Spring', 'AWS'],
    ['React', 'TypeScript', 'Node.js'],
    ['Python', 'Django', 'Docker'],
    ['Vue', 'Nuxt', 'Vuex'],
    ['Java', 'Kubernetes', 'CI/CD'],
    ['React', 'Next.js', 'GraphQL'],
    ['Python', 'FastAPI', 'MongoDB'],
    ['Node.js', 'Express', 'PostgreSQL'],
    ['Java', 'Spring Boot', 'Redis'],
    ['React', 'Redux', 'Jest'],
  ];

  const certificates = [
    ['정보처리기사', 'SQLD'],
    ['AWS Solutions Architect', 'AWS Developer'],
    ['정보처리기사', '리눅스마스터 1급'],
    ['PMP', '정보처리기사'],
    ['정보보안기사', '네트워크관리사'],
    ['정보처리기사', 'OCP'],
    ['CKAD', 'CKA'],
    ['AWS Solutions Architect', 'SQLD'],
    ['정보처리기사'],
    ['정보처리기사', 'SQLD', '리눅스마스터 2급'],
    ['PMP', 'AWS Solutions Architect'],
    ['정보보안기사'],
    [],
    ['정보처리기사', 'SQLD'],
    ['AWS Developer'],
  ];

  const educations = [
    { degree: '학사', major: '컴퓨터공학' },
    { degree: '학사', major: '소프트웨어공학' },
    { degree: '석사', major: '컴퓨터공학' },
    { degree: '학사', major: '전자공학' },
    { degree: '학사', major: '정보통신공학' },
    { degree: '석사', major: '소프트웨어공학' },
    { degree: '학사', major: '수학' },
    { degree: '박사', major: '컴퓨터공학' },
    { degree: '학사', major: '산업공학' },
    { degree: '석사', major: '정보보안' },
  ];

  const firstNames = ['민수', '지은', '준호', '서연', '현우', '수진', '태영', '소영', '민재', '지우', '승현', '수지', '준혁', '채원', '동건', '태희', '민호', '신혜', '빈', '예진', '재석', '호동', '동엽', '희선', '우진', '하늘', '서준', '지후', '도윤', '시우'];
  const lastNames = ['김', '이', '박', '최', '정', '강', '윤', '임', '송', '한', '조', '배', '서', '문', '장', '전', '오', '신', '권', '황', '안', '유', '홍', '전', '고', '류', '노', '하', '곽', '성'];

  const projectNames = [
    '차세대 ERP 시스템 구축',
    'AI 기반 챗봇 개발',
    '클라우드 마이그레이션',
    '모바일 앱 리뉴얼',
    'IoT 플랫폼 구축',
    '데이터 분석 시스템',
    '전자상거래 플랫폼',
    'CRM 시스템 고도화',
    '보안 시스템 강화',
    '빅데이터 분석 플랫폼',
    '스마트 팩토리 시스템',
    '블록체인 플랫폼',
    '메타버스 프로젝트',
    'MSA 전환 프로젝트',
    'DevOps 환경 구축',
  ];

  // 입사일자 계산 함수 (현재: 2025년 12월 18일 기준)
  const calculateJoinDate = (years: number, months: number) => {
    const currentDate = new Date(2025, 11, 18); // 2025년 12월 18일
    const joinDate = new Date(currentDate);
    joinDate.setFullYear(joinDate.getFullYear() - years);
    joinDate.setMonth(joinDate.getMonth() - months);
    
    const year = joinDate.getFullYear();
    const month = String(joinDate.getMonth() + 1).padStart(2, '0');
    const day = String(joinDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 프로젝트 마감일자 생성 함수 (현재 날짜 이후 1~12개월)
  const generateProjectEndDate = () => {
    const currentDate = new Date(2025, 11, 18); // 2025년 12월 18일
    const endDate = new Date(currentDate);
    const monthsToAdd = Math.floor(Math.random() * 12) + 1; // 1~12개월
    endDate.setMonth(endDate.getMonth() + monthsToAdd);
    
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 복귀일 생성 함수 (현재 날 이후 1~30일)
  const generateReturnDate = () => {
    const currentDate = new Date(2025, 11, 18); // 2025년 12월 18일
    const returnDate = new Date(currentDate);
    const daysToAdd = Math.floor(Math.random() * 30) + 1; // 1~30일
    returnDate.setDate(returnDate.getDate() + daysToAdd);
    
    const year = returnDate.getFullYear();
    const month = String(returnDate.getMonth() + 1).padStart(2, '0');
    const day = String(returnDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const members = [];
  
  // 조직도 관리 기준 투입중 18명 (STE1실 9명 + STE2실 9명)
  const assignedMembers = [
    // STE1실: 9명
    { name: '강현규', dept: 'STE1실', position: '수석', leader: '이사' },
    { name: '전광희', dept: 'STE1실', position: '책임', leader: '팀장' },
    { name: '정홍근', dept: 'STE1실', position: '사원', leader: '' },
    { name: '이길원', dept: 'STE1실', position: '책임', leader: '팀장' },
    { name: '이성미', dept: 'STE1실', position: '책임', leader: '' },
    { name: '조혜진', dept: 'STE1실', position: '책임', leader: '' },
    { name: '이나리', dept: 'STE1실', position: '선임', leader: '' },
    { name: '박준수', dept: 'STE1실', position: '책임', leader: '' },
    { name: '용상수', dept: 'STE1실', position: '책임', leader: '' },
    
    // STE2실: 9명
    { name: '조현균', dept: 'STE2실', position: '책임', leader: '팀장' },
    { name: '조현정', dept: 'STE2실', position: '책임', leader: '' },
    { name: '최현준', dept: 'STE2실', position: '책임', leader: '' },
    { name: '강성희', dept: 'STE2실', position: '선임', leader: '' },
    { name: '강문혁', dept: 'STE2실', position: '사원', leader: '' },
    { name: '장대열', dept: 'STE2실', position: '선임', leader: '' },
    { name: '윤제진', dept: 'STE2실', position: '수석', leader: '' },
    { name: '신진욱', dept: 'STE2실', position: '수석', leader: '' },
    { name: '이영택', dept: 'STE2실', position: '책임', leader: '' },
  ];
  
  // 가용 인력 8명 (개발연구소) - 일부는 휴직/교육 상태
  const availableMembers = [
    { name: '김태영', dept: '개발연구소', position: '수석', leader: '부사장', onLeave: false },
    { name: '혜진', dept: '개발연구소', position: '책임', leader: '이사', onLeave: false },
    { name: '우은순', dept: '개발연구소', position: '책임', leader: '팀장', onLeave: false },
    { name: '김지연', dept: '개발연구소', position: '사원', leader: '', onLeave: true },
    { name: '김준하', dept: '개발연구소', position: '선임', leader: '', onLeave: true },
    { name: '이유나', dept: '개발연구소', position: '선임', leader: '', onLeave: false },
    { name: '유정선', dept: '개발연구소', position: '선임', leader: '', onLeave: false },
    { name: '손진빈', dept: '개발연구소', position: '사원', leader: '', onLeave: false },
  ];
  
  // 관리 인력 8명 (경영전략실) - 전체에 포함되지 않음
  const managementMembers = [
    { name: '김완수', dept: '경영전략실', position: '수석', leader: '부사장' },
    { name: '이현직', dept: '경영전략실', position: '책임', leader: '실장' },
    { name: '김예림', dept: '경영전략실', position: '선임', leader: '파트장' },
    { name: '가라현', dept: '경영전략실', position: '사원', leader: '' },
    { name: '신소영', dept: '경영전략실', position: '사원', leader: '' },
    { name: '이유라', dept: '경영전략실', position: '선임', leader: '' },
    { name: '주호정', dept: '경영전략실', position: '사원', leader: '' },
    { name: '김연서', dept: '경영전략실', position: '사원', leader: '' },
  ];

  // 투입중 인원 추가
  assignedMembers.forEach((person, i) => {
    const years = person.position === '사원' ? Math.floor(Math.random() * 4) + 1 :
                  person.position === '선임' ? Math.floor(Math.random() * 5) + 5 :
                  person.position === '책임' ? Math.floor(Math.random() * 5) + 10 :
                  Math.floor(Math.random() * 5) + 14;
    const months = Math.floor(Math.random() * 12);
    
    const memberName = person.name;
    const projectName = memberName === '김민수' 
      ? '삼성카드 앱 크래시 관리 자동화' 
      : projectNames[Math.floor(Math.random() * projectNames.length)];
    
    members.push({
      id: i + 1,
      name: memberName,
      department: person.dept,
      position: person.position,
      yearsOfExperience: years,
      monthsOfExperience: months,
      joinDate: calculateJoinDate(years, months),
      projectEndDate: generateProjectEndDate(),
      status: '투입중',
      projectName: projectName,
      skills: skills[Math.floor(Math.random() * skills.length)],
      certificates: certificates[Math.floor(Math.random() * certificates.length)],
      education: educations[Math.floor(Math.random() * educations.length)],
      email: `${person.name.toLowerCase()}@tbell.co.kr`,
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    });
  });

  // 가용 인력 추가
  availableMembers.forEach((person, i) => {
    const years = person.position === '사원' ? Math.floor(Math.random() * 4) + 1 :
                  person.position === '선임' ? Math.floor(Math.random() * 5) + 5 :
                  person.position === '책임' ? Math.floor(Math.random() * 5) + 10 :
                  Math.floor(Math.random() * 5) + 14;
    const months = Math.floor(Math.random() * 12);
    
    members.push({
      id: assignedMembers.length + i + 1,
      name: person.name,
      department: person.dept,
      position: person.position,
      yearsOfExperience: years,
      monthsOfExperience: months,
      joinDate: calculateJoinDate(years, months),
      status: person.onLeave ? '관리' : '가용',
      returnDate: person.onLeave ? generateReturnDate() : '',
      skills: skills[Math.floor(Math.random() * skills.length)],
      certificates: certificates[Math.floor(Math.random() * certificates.length)],
      education: educations[Math.floor(Math.random() * educations.length)],
      email: `${person.name.toLowerCase()}@tbell.co.kr`,
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    });
  });

  return members;
};

const members = generateMembers();

// 가용 인력 계산
const availableMembers = members.filter(m => m.status === '가용');
const assignedMembers = members.filter(m => m.status === '투입중');
const onLeaveMembers = members.filter(m => m.status === '관리');

// 전체 인력 = 투입_정산 + 투입_지원 + 대기 (휴직/교육 포함)
const totalActiveMembers = assignedMembers.length + availableMembers.length + onLeaveMembers.length;

const availabilityStats = [
  {
    title: '전체',
    value: `${totalActiveMembers}명`,
    change: '투입_정산+투입_지원+대기',
    trend: '' as const,
    icon: Users,
    showSubtext: true,
  },
  {
    title: '투입',
    value: `${assignedMembers.length}명`,
    change: '투입_정산+투입_지원',
    trend: 'down' as const,
    icon: Award,
    showSubtext: true,
  },
  {
    title: '가용',
    value: `${availableMembers.length + onLeaveMembers.length}명`,
    change: '대기',
    trend: 'up' as const,
    icon: UserCheck,
    showSubtext: true,
  },
  {
    title: '휴직/교육',
    value: `${onLeaveMembers.length}명`,
    change: '',
    trend: '' as const,
    icon: Calendar,
    showSubtext: false,
  },
];

// 부서별 가용 인력
const departmentAvailability = [
  {
    name: 'STE1실',
    전체: members.filter(m => m.department === 'STE1실').length,
    가용: availableMembers.filter(m => m.department === 'STE1실').length,
    투입중: assignedMembers.filter(m => m.department === 'STE1실').length,
  },
  {
    name: 'STE2실',
    전체: members.filter(m => m.department === 'STE2실').length,
    가용: availableMembers.filter(m => m.department === 'STE2실').length,
    투입중: assignedMembers.filter(m => m.department === 'STE2실').length,
  },
];

// 직급별 가용 인력
const positionOrder = ['사원', '선임', '책임', '수석'];
const positionAvailability = positionOrder.map(position => ({
  name: position,
  전체: members.filter(m => m.position === position).length,
  가용: availableMembers.filter(m => m.position === position).length,
  투입중: assignedMembers.filter(m => m.position === position).length,
  휴직교육: onLeaveMembers.filter(m => m.position === position).length,
}));

// 월별 가 인력 추이 (시뮬레이션 데이터)
const monthlyAvailability = [
  { month: '1월', 가용인력: 3, 투입가능: 8 },
  { month: '2월', 가용인력: 4, 투입가능: 7 },
  { month: '3월', 가용인력: 2, 투입가능: 6 },
  { month: '4월', 가용인력: 5, 투입가능: 9 },
  { month: '5월', 가용인력: 6, 투입가능: 10 },
  { month: '6월', 가용인력: 4, 투입가능: 8 },
  { month: '7월', 가용인력: 5, 투입가능: 9 },
  { month: '8월', 가용인력: 3, 투입가능: 7 },
  { month: '9월', 가용인력: 4, 투입가능: 8 },
  { month: '10월', 가용인력: 6, 투입가능: 10 },
  { month: '11월', 가용인력: 5, 투입가능: 9 },
  { month: '12월', 가용인력: 5, 투입가능: 9 },
];

// 스킬별 가용 인력 분포
const skillCategories = [
  { name: 'Backend', skills: ['Java', 'Spring', 'Node.js', 'Python', 'Django'], color: '#3b82f6' },
  { name: 'Frontend', skills: ['React', 'Vue', 'TypeScript', 'JavaScript'], color: '#10b981' },
  { name: 'DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], color: '#f59e0b' },
  { name: 'Data', skills: ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL'], color: '#ef4444' },
];

const skillDistribution = skillCategories.map(category => {
  const count = availableMembers.filter(m => 
    m.skills.some(skill => category.skills.includes(skill))
  ).length;
  return {
    name: category.name,
    value: count,
    color: category.color,
  };
});

export function ResourceAvailability() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1>인력가용</h1>
        <p className="text-muted-foreground mt-1">투입 가능한 인력 현황을 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {availabilityStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              {stat.showSubtext && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span>{stat.change}</span>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>직급별 가용 인력</CardTitle>
            <CardDescription>직급별 전체/가용/투입중 인력 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionAvailability}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '2px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    fontSize: '14px'
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}
                  itemStyle={{
                    color: 'hsl(var(--foreground))',
                    padding: '2px 0'
                  }}
                />
                <Legend />
                <Bar dataKey="전체" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="가용" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="투입중" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="휴직교육" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>월별 가용 인력 추이</CardTitle>
            <CardDescription>2025년 월별 가용 인력 변화</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAvailability}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '2px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    fontSize: '14px'
                  }}
                  labelStyle={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}
                  itemStyle={{
                    color: 'hsl(var(--foreground))',
                    padding: '2px 0'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="가용인력" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="투입가능" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Available Members List */}
      <Tabs defaultValue="available" className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">가용</TabsTrigger>
          <TabsTrigger value="assigned">투입중</TabsTrigger>
          <TabsTrigger value="leave">휴직/교육</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>가용 인력 목록</CardTitle>
              <CardDescription>현재 투입 가능한 인력 상세 정보</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableMembers.map((member) => (
                  <Dialog key={member.id}>
                    <DialogTrigger asChild>
                      <div
                        className="p-5 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h4>{member.name}</h4>
                              <Badge variant="outline">{member.department}</Badge>
                              <Badge>{member.position}</Badge>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {member.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>경력: {member.yearsOfExperience}년 {member.monthsOfExperience}개월</span>
                              <span>입사일: {member.joinDate}</span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              <span className="text-sm text-muted-foreground mr-2">보유 스킬:</span>
                              {member.skills.map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>인사 정보</DialogTitle>
                        <DialogDescription>
                          직원 상세 정보
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">이름</div>
                            <div>{member.name}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">부서</div>
                            <div><Badge variant="outline">{member.department}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">직급</div>
                            <div><Badge>{member.position}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">상태</div>
                            <div><Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{member.status}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">입사일</div>
                            <div>{member.joinDate}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">경력</div>
                            <div>{member.yearsOfExperience}년 {member.monthsOfExperience}개월</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">학력</div>
                            <div>{member.education.degree} {member.education.major}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">이메일</div>
                            <div>{member.email}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">연락처</div>
                            <div>{member.phone}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">보유 스킬</div>
                          <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">보유 자격증</div>
                          <div className="flex flex-wrap gap-2">
                            {member.certificates && member.certificates.length > 0 ? (
                              member.certificates.map((cert, idx) => (
                                <Badge key={idx} variant="outline" className="bg-blue-50 dark:bg-blue-950">
                                  {cert}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">없음</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            alert(`${member.name}님의 상세 정보 페이지로 이동합니다.`);
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          상세조회
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assigned" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>투입중 인력 목록</CardTitle>
              <CardDescription>현재 프로젝트에 투입중인 인력 상세 정보</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedMembers.map((member) => (
                  <Dialog key={member.id}>
                    <DialogTrigger asChild>
                      <div
                        className="p-5 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h4>{member.name}</h4>
                              <Badge variant="outline">{member.department}</Badge>
                              <Badge>{member.position}</Badge>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {member.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>경력: {member.yearsOfExperience}년 {member.monthsOfExperience}개월</span>
                              <span>입사일: {member.joinDate}</span>
                              <span>프로젝트 마감일: {member.projectEndDate}</span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              <span className="text-sm text-muted-foreground mr-2">보유 스킬:</span>
                              {member.skills.map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>인사 정보</DialogTitle>
                        <DialogDescription>
                          직원 상세 정보
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">이름</div>
                            <div>{member.name}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">부서</div>
                            <div><Badge variant="outline">{member.department}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">직급</div>
                            <div><Badge>{member.position}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">상태</div>
                            <div><Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{member.status}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">입사일</div>
                            <div>{member.joinDate}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">경력</div>
                            <div>{member.yearsOfExperience}년 {member.monthsOfExperience}개월</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">투입 프로젝트</div>
                            <div><Badge variant="default" className="bg-purple-600">{member.projectName}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">프로젝트 마감일</div>
                            <div>{member.projectEndDate}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">학력</div>
                            <div>{member.education.degree} {member.education.major}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">이메일</div>
                            <div>{member.email}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">연락처</div>
                            <div>{member.phone}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">보유 스킬</div>
                          <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">보유 자격증</div>
                          <div className="flex flex-wrap gap-2">
                            {member.certificates && member.certificates.length > 0 ? (
                              member.certificates.map((cert, idx) => (
                                <Badge key={idx} variant="outline" className="bg-blue-50 dark:bg-blue-950">
                                  {cert}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">없음</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            alert(`${member.name}님의 상세 정보 페이지로 이동합니다.`);
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          상세조회
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>관리 인력 목록</CardTitle>
              <CardDescription>현재 관리 업무를 담당하는 인력 상세 정보</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onLeaveMembers.length > 0 ? (
                  onLeaveMembers.map((member) => (
                    <Dialog key={member.id}>
                      <DialogTrigger asChild>
                        <div
                          className="p-5 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <h4>{member.name}</h4>
                                <Badge variant="outline">{member.department}</Badge>
                                <Badge>{member.position}</Badge>
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                  {member.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>경력: {member.yearsOfExperience}년 {member.monthsOfExperience}개월</span>
                                <span>입사일: {member.joinDate}</span>
                                <span>복귀예정일: {member.returnDate}</span>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                <span className="text-sm text-muted-foreground mr-2">보유 스킬:</span>
                                {member.skills.map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>인사 정보</DialogTitle>
                          <DialogDescription>
                            직원 상세 정보
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">이름</div>
                              <div>{member.name}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">부서</div>
                              <div><Badge variant="outline">{member.department}</Badge></div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">직급</div>
                              <div><Badge>{member.position}</Badge></div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">상태</div>
                              <div><Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">{member.status}</Badge></div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">입사일</div>
                              <div>{member.joinDate}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">경력</div>
                              <div>{member.yearsOfExperience}년 {member.monthsOfExperience}개월</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">복귀예정일</div>
                              <div>{member.returnDate}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">학력</div>
                              <div>{member.education.degree} {member.education.major}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">이메일</div>
                              <div>{member.email}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">연락처</div>
                              <div>{member.phone}</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">보유 스킬</div>
                            <div className="flex flex-wrap gap-2">
                              {member.skills.map((skill, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">보유 자격증</div>
                            <div className="flex flex-wrap gap-2">
                              {member.certificates && member.certificates.length > 0 ? (
                                member.certificates.map((cert, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-blue-50 dark:bg-blue-950">
                                    {cert}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">없음</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              alert(`${member.name}님의 상세 정보 페이지로 이동합니다.`);
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            상세조회
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    현재 휴직/교육 중인 인력이 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}