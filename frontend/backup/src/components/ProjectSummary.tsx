import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Calendar, TrendingUp, TrendingDown, Users, CheckCircle2, AlertCircle, Clock, ExternalLink, Briefcase, Wallet, UserCheck, ClipboardList } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

// 날짜 기반 진행률 계산 함수
const calculateDateProgress = (startDate: string, endDate: string): number => {
  const today = new Date('2024-12-30'); // 현재 날짜 (시스템 날짜로 설정)
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  const progress = Math.round((elapsedDays / totalDays) * 100);
  return Math.max(0, Math.min(100, progress)); // 0-100 사이로 제한
};

// 남은 일수에 따른 컬러 반환
const getDaysLeftColor = (daysLeft: number): string => {
  if (daysLeft <= 7) return 'text-red-600';
  if (daysLeft <= 14) return 'text-orange-600';
  if (daysLeft <= 30) return 'text-yellow-600';
  return 'text-green-600';
};

const recentProjects = [
  {
    id: 1,
    name: 'SKT 챗봇 LLM 평가 시스템',
    status: '진행중',
    progress: 75,
    team: 5,
    deadline: '2025-01-15',
    department: 'STE1실',
    client: 'SKT',
    budget: '2천2백만원',
    startDate: '2024-10-01',
    pm: '김민수',
    description: 'SKT 챗봇 LLM 평가 시스템 구축',
    teamMembers: ['김민수', '이지은', '박준호', '최서연', '정태영'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    manpower: { planned: 15, actual: 14.2, unit: 'M/M' },
    manpowerMonthly: [
      { month: '10월', planned: 3, actual: 3.2 },
      { month: '11월', planned: 4, actual: 3.8 },
      { month: '12월', planned: 4, actual: 4.0 },
      { month: '1월', planned: 4, actual: 3.2 },
    ],
  },
  {
    id: 2,
    name: 'AI 고객 상담 챗봇 시스템',
    status: '진행중',
    progress: 45,
    team: 8,
    deadline: '2025-02-28',
    department: 'STE2실',
    client: '글로벌뱅크',
    budget: '3천5백만원',
    startDate: '2024-11-01',
    pm: '이지은',
    description: 'AI 고객 상담 챗봇 시스템 구축',
    teamMembers: ['이지은', '박준호', '최서연', '정태영', '강수진', '윤민재', '임지우', '송승현'],
    technologies: ['Python', 'TensorFlow', 'FastAPI', 'Redis'],
    manpower: { planned: 32, actual: 14.5, unit: 'M/M' },
    manpowerMonthly: [
      { month: '11월', planned: 8, actual: 7.5 },
      { month: '12월', planned: 8, actual: 7.0 },
      { month: '1월', planned: 8, actual: 0 },
      { month: '2월', planned: 8, actual: 0 },
    ],
  },
  {
    id: 3,
    name: '모바일 쇼핑몰 앱 고도화 프로젝트',
    status: '진행중',
    progress: 90,
    team: 3,
    deadline: '2025-01-10',
    department: 'STE1실',
    client: '유통플러스',
    budget: '1천8백만원',
    startDate: '2024-09-01',
    pm: '박준호',
    description: '모바일 쇼핑몰 앱 고도화 프로젝트',
    teamMembers: ['박준호', '최서연', '정태영'],
    technologies: ['React Native', 'GraphQL', 'MongoDB'],
    manpower: { planned: 12, actual: 11.8, unit: 'M/M' },
    manpowerMonthly: [
      { month: '9월', planned: 3, actual: 2.8 },
      { month: '10월', planned: 3, actual: 3.2 },
      { month: '11월', planned: 3, actual: 3.0 },
      { month: '12월', planned: 3, actual: 2.8 },
    ],
  },
  {
    id: 4,
    name: '프로젝트4',
    status: '진행중',
    progress: 60,
    team: 4,
    deadline: '2025-02-15',
    department: 'STE2실',
    client: '제조코리아',
    budget: '2천5백만원',
    startDate: '2024-10-15',
    pm: '최서연',
    description: '스마트 팩토리 IoT 플랫폼 구축',
    teamMembers: ['최서연', '정태영', '강수진', '윤민재'],
    technologies: ['Java', 'Spring Boot', 'Kafka', 'Docker'],
    manpower: { planned: 16, actual: 9.8, unit: 'M/M' },
    manpowerMonthly: [
      { month: '10월', planned: 2, actual: 2.0 },
      { month: '11월', planned: 4, actual: 4.2 },
      { month: '12월', planned: 5, actual: 3.6 },
      { month: '1월', planned: 5, actual: 0 },
    ],
  },
  {
    id: 5,
    name: '프로젝트5',
    status: '진행중',
    progress: 30,
    team: 6,
    deadline: '2025-03-20',
    department: 'STE1실',
    client: '헬스케어솔루션',
    budget: '3천만원',
    startDate: '2024-12-01',
    pm: '김민수',
    description: '의료 데이터 분석 플랫폼 개발',
    teamMembers: ['김민수', '이지은', '박준호', '최서연', '정태영', '강진'],
    technologies: ['Python', 'Django', 'PostgreSQL', 'Kubernetes'],
    manpower: { planned: 24, actual: 7.2, unit: 'M/M' },
    manpowerMonthly: [
      { month: '12월', planned: 6, actual: 7.2 },
      { month: '1월', planned: 6, actual: 0 },
      { month: '2월', planned: 6, actual: 0 },
      { month: '3월', planned: 6, actual: 0 },
    ],
  },
  {
    id: 8,
    name: '클라우드 마이그레이션 프로젝트',
    status: '계획',
    progress: 0,
    team: 5,
    deadline: '2025-05-31',
    department: 'STE1실',
    client: '금융서비스',
    budget: '4천만원',
    startDate: '2025-02-01',
    pm: '임지우',
    description: '온프레미스 시스템의 클라우드 마이그레이션',
    teamMembers: ['임지우', '송승현', '박준호', '최서연', '윤민재'],
    technologies: ['AWS', 'Terraform', 'Docker', 'Kubernetes'],
    manpower: { planned: 20, actual: 0, unit: 'M/M' },
    manpowerMonthly: [
      { month: '2월', planned: 5, actual: 0 },
      { month: '3월', planned: 5, actual: 0 },
      { month: '4월', planned: 5, actual: 0 },
      { month: '5월', planned: 5, actual: 0 },
    ],
  },
  {
    id: 9,
    name: '빅데이터 분석 플랫폼',
    status: '계획',
    progress: 0,
    team: 6,
    deadline: '2025-06-30',
    department: 'STE2실',
    client: '리테일그룹',
    budget: '5천만원',
    startDate: '2025-03-01',
    pm: '강수진',
    description: '실시간 빅데이터 처리 및 분석 플랫폼 구축',
    teamMembers: ['강수진', '윤민재', '김민수', '이지은', '정태영', '송승현'],
    technologies: ['Spark', 'Kafka', 'Hadoop', 'Elasticsearch'],
    manpower: { planned: 24, actual: 0, unit: 'M/M' },
    manpowerMonthly: [
      { month: '3월', planned: 6, actual: 0 },
      { month: '4월', planned: 6, actual: 0 },
      { month: '5월', planned: 6, actual: 0 },
      { month: '6월', planned: 6, actual: 0 },
    ],
  },
  {
    id: 10,
    name: '블록체인 기반 인증 시스템',
    status: '계획',
    progress: 0,
    team: 4,
    deadline: '2025-07-31',
    department: 'STE1실',
    client: '보안솔루션',
    budget: '3천8백만원',
    startDate: '2025-04-01',
    pm: '박준호',
    description: '블록체인 기반 사용자 인증 시스템 개발',
    teamMembers: ['박준호', '최서연', '임지우', '송승현'],
    technologies: ['Ethereum', 'Solidity', 'Web3.js', 'Node.js'],
    manpower: { planned: 16, actual: 0, unit: 'M/M' },
    manpowerMonthly: [
      { month: '4월', planned: 4, actual: 0 },
      { month: '5월', planned: 4, actual: 0 },
      { month: '6월', planned: 4, actual: 0 },
      { month: '7월', planned: 4, actual: 0 },
    ],
  },
];

const teamMembers = [
  { name: '민수', role: '프로젝트 매니저', projects: 5, avatar: 'KM' },
  { name: '이지은', role: '개발 리드', projects: 8, avatar: 'LJ' },
  { name: '박준호', role: 'UI/UX 디자이너', projects: 6, avatar: 'PJ' },
  { name: '최서연', role: '백엔드 개발자', projects: 7, avatar: 'CS' },
];

const milestones = [
  {
    id: 1,
    project: '모바일 ��핑몰 앱 고도화 프로젝트',
    title: '최종 검수 및 배포',
    date: '2025-01-10',
    status: 'upcoming',
    department: 'STE1실',
    daysLeft: 7,
  },
  {
    id: 2,
    project: 'SKT 챗봇 LLM 평가 시스템',
    title: 'Phase 2 완료',
    date: '2025-01-15',
    status: 'upcoming',
    department: 'STE1실',
    daysLeft: 12,
  },
  {
    id: 3,
    project: '프로젝트4',
    title: '중간 보고',
    date: '2025-02-15',
    status: 'scheduled',
    department: 'STE2실',
    daysLeft: 43,
  },
  {
    id: 4,
    project: 'AI 고객 상담 챗봇 시스템',
    title: '개발 완료',
    date: '2025-02-28',
    status: 'scheduled',
    department: 'STE2실',
    daysLeft: 56,
  },
  {
    id: 5,
    project: '프로젝트5',
    title: 'Phase 1 킥오프',
    date: '2025-03-20',
    status: 'scheduled',
    department: 'STE1실',
    daysLeft: 76,
  },
];

const urgentProjects = [
  {
    id: 1,
    name: '프로젝트7',
    deadline: '2025-01-08',
    daysLeft: 5,
    progress: 50,
    department: 'STE2실',
    team: 4,
    status: 'critical',
    tasks: '개발 지연으로 긴급 대응 필요',
    client: '삼성전자',
    budget: '1천5백만원',
    startDate: '2024-11-01',
    pm: '강수진',
    description: '삼성전자 통합 관리 시스템 개발',
    teamMembers: ['강수진', '윤민재', '임지우', '송승현'],
    technologies: ['Vue.js', 'Express', 'MySQL', 'Docker'],
    manpower: { planned: 8, actual: 6.5, unit: 'M/M' },
    manpowerMonthly: [
      { month: '11월', planned: 4, actual: 3.5 },
      { month: '12월', planned: 4, actual: 3.0 },
    ],
  },
  {
    id: 2,
    name: '프로젝트3',
    deadline: '2025-01-10',
    daysLeft: 7,
    progress: 90,
    department: 'STE1실',
    team: 3,
    status: 'normal',
    tasks: '최종 검수 진행 중',
    client: '유통플러스',
    budget: '1천8백만원',
    startDate: '2024-09-01',
    pm: '박준호',
    description: '모바일 쇼핑몰 앱 리뉴얼',
    teamMembers: ['박준호', '최서연', '정태영'],
    technologies: ['React Native', 'GraphQL', 'MongoDB'],
    manpower: { planned: 12, actual: 11.8, unit: 'M/M' },
    manpowerMonthly: [
      { month: '9월', planned: 3, actual: 2.8 },
      { month: '10월', planned: 3, actual: 3.2 },
      { month: '11월', planned: 3, actual: 3.0 },
      { month: '12월', planned: 3, actual: 2.8 },
    ],
  },
  {
    id: 3,
    name: '프로젝트1',
    deadline: '2025-01-15',
    daysLeft: 12,
    progress: 75,
    department: 'STE1실',
    team: 5,
    status: 'normal',
    tasks: 'Phase 2 마무리 단계',
    client: 'SKT',
    budget: '2천2백만원',
    startDate: '2024-10-01',
    pm: '김민수',
    description: 'SKT 챗봇 LLM 평가 시스템 구축',
    teamMembers: ['김민수', '이지은', '박준호', '최서연', '정태영'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    manpower: { planned: 15, actual: 14.2, unit: 'M/M' },
    manpowerMonthly: [
      { month: '10월', planned: 3, actual: 3.2 },
      { month: '11월', planned: 4, actual: 3.8 },
      { month: '12월', planned: 4, actual: 4.0 },
      { month: '1월', planned: 4, actual: 3.2 },
    ],
  },
  {
    id: 4,
    name: '프로젝트6',
    deadline: '2025-01-25',
    daysLeft: 22,
    progress: 55,
    department: 'STE2실',
    team: 4,
    status: 'warning',
    tasks: '개발 및 테스트 진행',
    client: 'LG유플러스',
    budget: '2천만원',
    startDate: '2024-11-15',
    pm: '정태영',
    description: 'LG유플러스 고객관리 포털 구축',
    teamMembers: ['정태영', '강수진', '윤민재', '임지우'],
    technologies: ['Angular', 'NestJS', 'PostgreSQL', 'Redis'],
    manpower: { planned: 10, actual: 5.8, unit: 'M/M' },
    manpowerMonthly: [
      { month: '11월', planned: 2, actual: 2.2 },
      { month: '12월', planned: 4, actual: 3.6 },
      { month: '1월', planned: 4, actual: 0 },
    ],
  },
  {
    id: 5,
    name: '프로젝트4',
    deadline: '2025-02-15',
    daysLeft: 43,
    progress: 60,
    department: 'STE2실',
    team: 4,
    status: 'normal',
    tasks: '중간 보고 준비',
    client: '제조코리아',
    budget: '2천5백만원',
    startDate: '2024-10-15',
    pm: '최서연',
    description: '스마트 팩토리 IoT 플랫폼 구축',
    teamMembers: ['최서연', '정태영', '강수진', '윤민재'],
    technologies: ['Java', 'Spring Boot', 'Kafka', 'Docker'],
    manpower: { planned: 16, actual: 9.8, unit: 'M/M' },
    manpowerMonthly: [
      { month: '10월', planned: 2, actual: 2.0 },
      { month: '11월', planned: 4, actual: 4.2 },
      { month: '12월', planned: 5, actual: 3.6 },
      { month: '1월', planned: 5, actual: 0 },
    ],
  },
];

const monthlyData = [
  { month: '1월', 완료: 8, 진행중: 3 },
  { month: '2월', 완료: 6, 진행중: 4 },
  { month: '3월', 완료: 10, 진행중: 5 },
  { month: '4월', 완료: 9, 진행중: 6 },
  { month: '5월', 완료: 11, 진행중: 7 },
  { month: '6월', 완료: 7, 진행중: 8 },
  { month: '7월', 완료: 12, 진행중: 6 },
  { month: '8월', 완료: 9, 진행중: 7 },
  { month: '9월', 완료: 10, 진행중: 9 },
  { month: '10월', 완료: 8, 진행중: 8 },
  { month: '11월', 완료: 7, 진행중: 10 },
  { month: '12월', 완료: 10, 진행중: 5 },
];

export function ProjectSummary() {
  // 현재 날짜
  const today = new Date('2024-12-30');
  
  // 동적으로 프로젝트 상태 계산
  const plannedProjects = recentProjects.filter(p => new Date(p.startDate) > today);
  const ongoingProjects = recentProjects.filter(p => new Date(p.startDate) <= today && new Date(p.deadline) >= today);
  const completedCount = 6; // 완료된 프로젝트 수 (고정값)
  
  const totalProjects = plannedProjects.length + ongoingProjects.length + completedCount;
  
  // 동적 프로젝트 통계
  const dynamicProjectStats = [
    {
      title: '전체 프로젝트',
      value: totalProjects.toString(),
      change: '+15%',
      trend: 'up' as const,
      icon: Calendar,
    },
    {
      title: '계획된',
      value: plannedProjects.length.toString(),
      change: '+1',
      trend: 'up' as const,
      icon: ClipboardList,
    },
    {
      title: '진행중',
      value: ongoingProjects.length.toString(),
      change: '+8%',
      trend: 'up' as const,
      icon: Clock,
    },
    {
      title: '완료됨',
      value: completedCount.toString(),
      change: '+2',
      trend: 'up' as const,
      icon: CheckCircle2,
    },
  ];
  
  // 동적 상태 분포
  const dynamicStatusDistribution = [
    { name: '계획된', value: plannedProjects.length, color: '#f59e0b' },
    { name: '진행중', value: ongoingProjects.length, color: '#3b82f6' },
    { name: '완료', value: completedCount, color: '#22c55e' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>프로젝트</h1>
        <p className="text-muted-foreground mt-1">현재 진행 중인 모든 프로젝트의 상태를 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dynamicProjectStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              {stat.subValue && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span>전년 대비</span>
                  <span className="ml-2">({stat.subValue})</span>
                </p>
              )}
              {!stat.subValue && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span>전년 대비</span>
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
            <CardTitle>월별 프로젝트 추이</CardTitle>
            <CardDescription>2025년 월별 프로젝트 완료 및 진행 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
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
                <Bar dataKey="완료" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="진행중" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>프로젝트 상태 분포</CardTitle>
            <CardDescription>전체 프로젝트의 상태별 비율</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dynamicStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dynamicStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  position={{ x: 150, y: 125 }}
                  wrapperStyle={{ position: 'absolute', zIndex: 1000 }}
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
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">프로젝트</TabsTrigger>
          <TabsTrigger value="urgent">프로젝트 종료예정 현황</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 프로젝트</CardTitle>
              <CardDescription>현재 진행 중인 프로젝트 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ongoingProjects.map((project) => (
                  <Dialog key={project.id}>
                    <DialogTrigger asChild>
                      <div
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4>{project.name}</h4>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{project.department}</span>
                            <Badge variant="outline">
                              {project.team}명
                            </Badge>
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              <span>{project.manpower.actual}/{project.manpower.planned} M/M</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{project.deadline}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">진행률 (기간 기준)</span>
                              <span>{calculateDateProgress(project.startDate, project.deadline)}%</span>
                            </div>
                            <Progress value={calculateDateProgress(project.startDate, project.deadline)} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{project.name} 상세정보</DialogTitle>
                        <DialogDescription>
                          {project.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">프로젝트명</div>
                            <div>{project.name}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">부서</div>
                            <div><Badge variant="outline">{project.department}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">고객사</div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              {project.client}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">예산</div>
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-muted-foreground" />
                              {project.budget}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">시작일</div>
                            <div>{project.startDate}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">종료예정일</div>
                            <div>{project.deadline}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">팀장</div>
                            <div><Badge>{project.pm}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">상태</div>
                            <div>
                              {project.status === 'critical' && (
                                <Badge className="bg-red-500 hover:bg-red-600">긴급대응</Badge>
                              )}
                              {project.status === 'warning' && (
                                <Badge className="bg-orange-500 hover:bg-orange-600">지연위험</Badge>
                              )}
                              {project.status === 'normal' && (
                                <Badge className="bg-green-500 hover:bg-green-600">정상</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">진행률</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-3" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">투입 인력 ({project.team}명)</div>
                            <div className="flex flex-wrap gap-2">
                              {project.teamMembers.map((member, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {member}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">투입 공수</div>
                            <div className="flex gap-2">
                              <Badge variant="outline">계획: {project.manpower.planned} M/M</Badge>
                              <Badge variant="outline">실제: {project.manpower.actual} M/M</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">기술 스택</div>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            alert(`${project.name}의 상세 정보 페이지로 이동합니다.`);
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

        <TabsContent value="urgent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 종료예정 현황</CardTitle>
              <CardDescription>종료 예정일이 가까운 프로젝트 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urgentProjects.map((project) => (
                  <Dialog key={project.id}>
                    <DialogTrigger asChild>
                      <div
                        className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className={`text-2xl font-bold ${getDaysLeftColor(project.daysLeft)}`}>{project.daysLeft}</div>
                          <div className={`text-xs ${getDaysLeftColor(project.daysLeft)}`}>일 남음</div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4>{project.name}</h4>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{project.department}</span>
                            <Badge variant="outline">
                              {project.team}명
                            </Badge>
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              <span>{project.manpower.actual}/{project.manpower.planned} M/M</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{project.deadline}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">진행률 (기간 기준)</span>
                              <span>{calculateDateProgress(project.startDate, project.deadline)}%</span>
                            </div>
                            <Progress value={calculateDateProgress(project.startDate, project.deadline)} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{project.name} 상세정보</DialogTitle>
                        <DialogDescription>
                          {project.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">프로젝트명</div>
                            <div>{project.name}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">부서</div>
                            <div><Badge variant="outline">{project.department}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">고객사</div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              {project.client}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">예산</div>
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-muted-foreground" />
                              {project.budget}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">시작일</div>
                            <div>{project.startDate}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">종료예정일</div>
                            <div>{project.deadline}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">팀장</div>
                            <div><Badge>{project.pm}</Badge></div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">상태</div>
                            <div>
                              {project.status === 'critical' && (
                                <Badge className="bg-red-500 hover:bg-red-600">긴급대응</Badge>
                              )}
                              {project.status === 'warning' && (
                                <Badge className="bg-orange-500 hover:bg-orange-600">지연위험</Badge>
                              )}
                              {project.status === 'normal' && (
                                <Badge className="bg-green-500 hover:bg-green-600">정상</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">진행률</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-3" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">투입 인력 ({project.team}명)</div>
                            <div className="flex flex-wrap gap-2">
                              {project.teamMembers.map((member, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {member}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">투입 공수</div>
                            <div className="flex gap-2">
                              <Badge variant="outline">계획: {project.manpower.planned} M/M</Badge>
                              <Badge variant="outline">실제: {project.manpower.actual} M/M</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">기술 스택</div>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            alert(`${project.name}의 상세 정보 페이지로 이동합니다.`);
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
      </Tabs>
    </div>
  );
}