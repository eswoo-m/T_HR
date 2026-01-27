import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Users, UserCheck, UserX, TrendingUp, TrendingDown, Briefcase, Calendar, DollarSign, Activity, ExternalLink, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

const members = [
  { id: 1, name: '김민수', department: 'STE1실', position: '책임', yearsOfExperience: 12, monthsOfExperience: 5 },
  { id: 2, name: '이지은', department: 'STE1실', position: '선임', yearsOfExperience: 8, monthsOfExperience: 3 },
  { id: 3, name: '박준호', department: 'STE2실', position: '선임', yearsOfExperience: 7, monthsOfExperience: 9 },
  { id: 4, name: '최서연', department: 'STE2실', position: '책임', yearsOfExperience: 10, monthsOfExperience: 2 },
  { id: 5, name: '정현우', department: 'STE1실', position: '선임', yearsOfExperience: 6, monthsOfExperience: 7 },
  { id: 6, name: '강수진', department: 'STE2실', position: '사원', yearsOfExperience: 4, monthsOfExperience: 1 },
  { id: 7, name: '윤태영', department: 'STE1실', position: '선임', yearsOfExperience: 5, monthsOfExperience: 11 },
  { id: 8, name: '임소영', department: 'STE2실', position: '수석', yearsOfExperience: 15, monthsOfExperience: 4 },
  { id: 9, name: '송민재', department: 'STE1실', position: '사원', yearsOfExperience: 2, monthsOfExperience: 8 },
  { id: 10, name: '한지우', department: 'STE2실', position: '사원', yearsOfExperience: 1, monthsOfExperience: 6 },
  { id: 11, name: '조승현', department: 'STE1실', position: '책임', yearsOfExperience: 11, monthsOfExperience: 10 },
  { id: 12, name: '배수지', department: 'STE2실', position: '선임', yearsOfExperience: 9, monthsOfExperience: 0 },
  { id: 13, name: '서준혁', department: 'STE1실', position: '수석', yearsOfExperience: 14, monthsOfExperience: 7 },
  { id: 14, name: '문채원', department: 'STE2실', position: '책임', yearsOfExperience: 13, monthsOfExperience: 3 },
  { id: 15, name: '장동건', department: 'STE1실', position: '선임', yearsOfExperience: 7, monthsOfExperience: 5 },
  { id: 16, name: '김태희', department: 'STE2실', position: '사원', yearsOfExperience: 3, monthsOfExperience: 2 },
  { id: 17, name: '이민호', department: 'STE1실', position: '사원', yearsOfExperience: 2, monthsOfExperience: 4 },
  { id: 18, name: '박신혜', department: 'STE2실', position: '선임', yearsOfExperience: 6, monthsOfExperience: 9 },
  { id: 19, name: '현빈', department: 'STE1실', position: '책임', yearsOfExperience: 10, monthsOfExperience: 8 },
  { id: 20, name: '손예진', department: 'STE2실', position: '수석', yearsOfExperience: 16, monthsOfExperience: 1 },
];

const projectAllocation = [
  // STE1실 프로젝트 (10개)
  {
    project: '프로젝트1',
    department: 'STE1실',
    members: 8,
    memberNames: ['김민수', '이지은', '윤태영', '정현우', '송민재', '조승현', '장동건', '이민호'],
  },
  {
    project: '프로젝트3',
    department: 'STE1실',
    members: 3,
    memberNames: ['김민수', '정현우'],
  },
  {
    project: '프로젝트5',
    department: 'STE1실',
    members: 6,
    memberNames: ['이지은', '정현우', '송민재'],
  },
  {
    project: '프로젝트8',
    department: 'STE1실',
    members: 4,
    memberNames: ['이지은', '윤태영'],
  },
  {
    project: '프로젝트9',
    department: 'STE1실',
    members: 7,
    memberNames: ['조승현', '서준혁', '장동건'],
  },
  {
    project: '프로젝트11',
    department: 'STE1실',
    members: 4,
    memberNames: ['서준혁', '이민호'],
  },
  {
    project: '프로젝트13',
    department: 'STE1실',
    members: 5,
    memberNames: ['조승현', '장동건', '송민재'],
  },
  {
    project: '프로젝트15',
    department: 'STE1실',
    members: 3,
    memberNames: ['현빈', '이민호'],
  },
  {
    project: '프로젝트17',
    department: 'STE1실',
    members: 6,
    memberNames: ['김민수', '서준혁', '현빈'],
  },
  {
    project: '프로젝트19',
    department: 'STE1실',
    members: 4,
    memberNames: ['장동건', '윤태영'],
  },
  
  // STE2실 프로젝트 (10개)
  {
    project: '프로젝트2',
    department: 'STE2실',
    members: 8,
    memberNames: ['박준호', '최서연', '임소영', '한지우'],
  },
  {
    project: '프로젝트4',
    department: 'STE2실',
    members: 4,
    memberNames: ['박준호', '임소영'],
  },
  {
    project: '프로젝트6',
    department: 'STE2실',
    members: 4,
    memberNames: ['최서연', '임소영'],
  },
  {
    project: '프로젝트7',
    department: 'STE2실',
    members: 4,
    memberNames: ['강수진', '한지우'],
  },
  {
    project: '프로젝트10',
    department: 'STE2실',
    members: 6,
    memberNames: ['배수지', '문채원', '김태희'],
  },
  {
    project: '프로젝트12',
    department: 'STE2실',
    members: 5,
    memberNames: ['손예진', '박신혜', '김태희'],
  },
  {
    project: '프로젝트14',
    department: 'STE2실',
    members: 7,
    memberNames: ['채원', '임소영', '배수지', '박신혜'],
  },
  {
    project: '프로젝트16',
    department: 'STE2실',
    members: 3,
    memberNames: ['손예진', '한지우'],
  },
  {
    project: '프로젝트18',
    department: 'STE2실',
    members: 5,
    memberNames: ['최서연', '박준호', '강수진'],
  },
  {
    project: '프로젝트20',
    department: 'STE2실',
    members: 4,
    memberNames: ['배수지', '김태희'],
  },
];

// 동적 계산
const totalMembers = 34; // 전체 인력
const allocatedMembers = 31; // 투입 인력 (투입_정산 28 + 투입_지원 3)
const totalProjects = 24; // 진행중 프로젝트
const averageUtilization = ((allocatedMembers / totalMembers) * 100).toFixed(1); // 평균 투입률 계산

// 각 인력의 투입률 계산 (프로젝트 투입 횟수 기반)
const memberUtilization = members.map(member => {
  const projectCount = projectAllocation.filter(project => 
    project.memberNames.includes(member.name)
  ).length;
  
  // 프로젝트 수에 따른 투입률 계산
  // 0개 = 0%, 1개 = 75%, 2개 = 90%, 3개 이상 = 100%
  let utilization = 0;
  if (projectCount === 1) utilization = 75;
  else if (projectCount === 2) utilization = 90;
  else if (projectCount >= 3) utilization = 100;
  
  return {
    name: member.name,
    projectCount,
    utilization
  };
});

// 투입률 구간별 인원 수 계산
const over80 = memberUtilization.filter(m => m.utilization >= 80).length;
const between60and80 = memberUtilization.filter(m => m.utilization >= 60 && m.utilization < 80).length;
const under60 = memberUtilization.filter(m => m.utilization < 60).length;

const utilizationDistribution = [
  { name: '80% 이상', value: over80, color: '#22c55e' },
  { name: '60-80%', value: between60and80, color: '#3b82f6' },
  { name: '60% 미만', value: under60, color: '#ef4444' },
];

// 년차별 인력 분포 계산
const yearsGroups = [
  { name: '1-3년', min: 1, max: 3, color: '#3b82f6' },
  { name: '4-7년', min: 4, max: 7, color: '#10b981' },
  { name: '8-10년', min: 8, max: 10, color: '#f59e0b' },
  { name: '11년+', min: 11, max: 100, color: '#ef4444' },
];

const yearsDistribution = yearsGroups.map(group => ({
  name: group.name,
  value: members.filter(m => m.yearsOfExperience >= group.min && m.yearsOfExperience <= group.max).length,
  color: group.color,
}));

// 월별 구분별 인력 현황 데이터
const monthlyAllocationData = [
  { month: '1월', 투입_정산: 24, 투입_지원: 6, 대기: 2, 관리: 2, 전체인원: 34 },
  { month: '2월', 투입_정산: 25, 투입_지원: 5, 대기: 2, 관리: 2, 전체인원: 34 },
  { month: '3월', 투입_정산: 26, 투입_지원: 5, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '4월', 투입_정산: 27, 투입_지원: 4, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '5월', 투입_정산: 28, 투입_지원: 3, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '6월', 투입_정산: 27, 투입_지원: 4, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '7월', 투입_정산: 26, 투입_지원: 5, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '8월', 투입_정산: 25, 투입_지원: 6, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '9월', 투입_정산: 27, 투입_지원: 4, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '10월', 투입_정산: 28, 투입_지원: 3, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '11월', 투입_정산: 29, 투입_지원: 2, 대기: 1, 관리: 2, 전체인원: 34 },
  { month: '12월', 투입_정산: 28, 투입_지원: 3, 대기: 1, 관리: 2, 전체인원: 34 },
];

const resourceStats = [
  {
    title: '전체 인력',
    value: `${totalMembers}명`,
    change: '+8%',
    trend: 'up' as const,
    icon: Users,
  },
  {
    title: '투입인력',
    value: `${allocatedMembers}명`,
    change: '+2',
    trend: 'up' as const,
    icon: UserCheck,
  },
  {
    title: '진행중 프로젝트',
    value: totalProjects.toString(),
    change: '+12%',
    trend: 'up' as const,
    icon: Briefcase,
  },
  {
    title: '평균 투입률',
    value: `${averageUtilization}%`,
    change: '+3%',
    trend: 'up' as const,
    icon: TrendingUp,
  },
];

// 프로젝트별 투입 인원수 데이터
const projectMemberData = projectAllocation.map(p => ({
  name: p.project,
  투입인원: p.members,
  department: p.department
}));

export function ResourceAllocation() {
  return (
    <div className="space-y-6">
      <div>
        <h1>투입인력</h1>
        <p className="text-muted-foreground mt-1">프로젝트별 인력 투입 현황을 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resourceStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span>전월 대비</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>프로젝트별 투입 인원</CardTitle>
            <CardDescription>각 프로젝트에 투입된 인력 수</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="STE1실" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="STE1실">STE1실</TabsTrigger>
                <TabsTrigger value="STE2실">STE2실</TabsTrigger>
              </TabsList>
              
              <TabsContent value="STE1실" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectMemberData.filter(p => p.department === 'STE1실')}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
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
                    <Bar dataKey="투입인원" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="STE2실" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectMemberData.filter(p => p.department === 'STE2실')}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
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
                    <Bar dataKey="투입인원" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>년차별 인력 분포</CardTitle>
            <CardDescription>경력 년차별 인력 구성 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={yearsDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}명`}
                >
                  {yearsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="years" className="space-y-6">
        <TabsList>
          <TabsTrigger value="years">프로젝트별 년차 투입</TabsTrigger>
          <TabsTrigger value="positions">프로젝트별 직급 투입</TabsTrigger>
        </TabsList>

        <TabsContent value="years" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트별 년차 투입 정보</CardTitle>
              <CardDescription>각 프로젝트에 투입된 인력의 년차별 분포</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectAllocation.map((project, index) => {
                  const projectMembers = project.memberNames.map(name => 
                    members.find(m => m.name === name)
                  ).filter(Boolean);
                  
                  const yearsGroups = [
                    { label: '1-3년', min: 1, max: 3 },
                    { label: '4-7년', min: 4, max: 7 },
                    { label: '8-10년', min: 8, max: 10 },
                    { label: '11년+', min: 11, max: 100 },
                  ];
                  
                  return (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="p-5 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4>{project.project}</h4>
                                <Badge variant="outline">{project.department}</Badge>
                              </div>
                              <Badge variant="secondary" className="text-base px-3 py-1">
                                총 {project.members}명
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {yearsGroups.map(group => {
                                const count = projectMembers.filter(m => 
                                  m && m.yearsOfExperience >= group.min && m.yearsOfExperience <= group.max
                                ).length;
                                
                                const colors: { [key: string]: string } = {
                                  '1-3년': 'bg-blue-500',
                                  '4-7년': 'bg-green-500',
                                  '8-10년': 'bg-orange-500',
                                  '11년+': 'bg-red-500'
                                };
                                
                                return (
                                  <div key={group.label} className="space-y-2 p-3 bg-accent/30 rounded-md">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">{group.label}</span>
                                      <div className={`px-2 py-0.5 rounded text-white text-sm ${colors[group.label]}`}>
                                        {count}명
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{project.project} 년차별 투입 상세</DialogTitle>
                          <DialogDescription>
                            {project.department} - 총 {project.members}명 투입
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {yearsGroups.map(group => {
                              const groupMembers = projectMembers
                                .filter(m => m && m.yearsOfExperience >= group.min && m.yearsOfExperience <= group.max);
                              const count = groupMembers.length;
                              
                              return (
                                <div key={group.label} className="space-y-3 p-4 border border-border rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{group.label}</span>
                                    <Badge variant="outline">{count}명</Badge>
                                  </div>
                                  {count > 0 ? (
                                    <div className="space-y-2">
                                      {groupMembers.map((member, idx) => (
                                        <div key={idx} className="p-3 bg-accent/30 rounded-md">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <div>{member?.name}</div>
                                              <div className="text-sm text-muted-foreground">
                                                {member?.position} • {member?.department}
                                              </div>
                                            </div>
                                            <Badge variant="secondary">
                                              {member?.yearsOfExperience}년 {member?.monthsOfExperience}개월
                                            </Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground text-center py-2">
                                      해당 없음
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              alert(`${project.project}의 상세 정보 페이지로 이동합니다.`);
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            상세조회
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트별 직급 투입 정보</CardTitle>
              <CardDescription>각 프로젝트에 투입된 인력의 직급별 분포</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectAllocation.map((project, index) => {
                  const projectMembers = project.memberNames.map(name => 
                    members.find(m => m.name === name)
                  ).filter(Boolean);
                  
                  const positionOrder = ['사원', '선임', '책임', '수석'];
                  
                  return (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="p-5 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4>{project.project}</h4>
                                <Badge variant="outline">{project.department}</Badge>
                              </div>
                              <Badge variant="secondary" className="text-base px-3 py-1">
                                총 {project.members}명
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {positionOrder.map(position => {
                                const count = projectMembers.filter(m => m && m.position === position).length;
                                
                                const colors: { [key: string]: string } = {
                                  '사원': 'bg-blue-500',
                                  '선임': 'bg-green-500',
                                  '책임': 'bg-orange-500',
                                  '수석': 'bg-red-500'
                                };
                                
                                return (
                                  <div key={position} className="space-y-2 p-3 bg-accent/30 rounded-md">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">{position}</span>
                                      <div className={`px-2 py-0.5 rounded text-white text-sm ${colors[position]}`}>
                                        {count}명
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{project.project} 직급별 투입 상세</DialogTitle>
                          <DialogDescription>
                            {project.department} - 총 {project.members}명 투입
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {positionOrder.map(position => {
                              const positionMembers = projectMembers
                                .filter(m => m && m.position === position);
                              const count = positionMembers.length;
                              
                              return (
                                <div key={position} className="space-y-3 p-4 border border-border rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{position}</span>
                                    <Badge variant="outline">{count}명</Badge>
                                  </div>
                                  {count > 0 ? (
                                    <div className="space-y-2">
                                      {positionMembers.map((member, idx) => (
                                        <div key={idx} className="p-3 bg-accent/30 rounded-md">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <div>{member?.name}</div>
                                              <div className="text-sm text-muted-foreground">
                                                {member?.department}
                                              </div>
                                            </div>
                                            <Badge variant="secondary">
                                              {member?.yearsOfExperience}년 {member?.monthsOfExperience}개월
                                            </Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground text-center py-2">
                                      해당 없음
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              alert(`${project.project}의 상세 정보 페이지로 이동합니다.`);
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            상세조회
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}