import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, TrendingUp, Calendar, Award, Target, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// 34명의 인력 데이터 생성 함수
const generateMembers = () => {
  // 조직도 관리 기준 부서 및 인원
  const departmentData = [
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
    
    // 경영전략실: 8명
    { name: '김완수', dept: '경영전략실', position: '수석', leader: '부사장' },
    { name: '이현직', dept: '경영전략실', position: '책임', leader: '실장' },
    { name: '김예림', dept: '경영전략실', position: '선임', leader: '파트장' },
    { name: '가라현', dept: '경영전략실', position: '사원', leader: '' },
    { name: '신소영', dept: '경영전략실', position: '사원', leader: '' },
    { name: '이유라', dept: '경영전략실', position: '선임', leader: '' },
    { name: '주호정', dept: '경영전략실', position: '사원', leader: '' },
    { name: '김연서', dept: '경영전략실', position: '사원', leader: '' },
    
    // 개발연구소: 8명
    { name: '김태영', dept: '개발연구소', position: '수석', leader: '부사장' },
    { name: '이혜진', dept: '개발연구소', position: '책임', leader: '이사' },
    { name: '우은순', dept: '개발연구소', position: '책임', leader: '팀장' },
    { name: '김지연', dept: '개발연구소', position: '사원', leader: '' },
    { name: '김준하', dept: '개발연구소', position: '선임', leader: '' },
    { name: '이유나', dept: '개발연구소', position: '선임', leader: '' },
    { name: '유정선', dept: '개발연구소', position: '선임', leader: '' },
    { name: '손진빈', dept: '개발연구소', position: '사원', leader: '' },
  ];

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

  // 입사일자 계산 함수
  const calculateJoinDate = (years: number, months: number) => {
    const currentDate = new Date(2026, 0, 5);
    const joinDate = new Date(currentDate);
    joinDate.setFullYear(joinDate.getFullYear() - years);
    joinDate.setMonth(joinDate.getMonth() - months);
    
    const year = joinDate.getFullYear();
    const month = String(joinDate.getMonth() + 1).padStart(2, '0');
    const day = String(joinDate.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const members = departmentData.map((person, index) => {
    const years = person.position === '사원' ? Math.floor(Math.random() * 4) + 1 :
                  person.position === '선임' ? Math.floor(Math.random() * 5) + 5 :
                  person.position === '책임' ? Math.floor(Math.random() * 5) + 10 :
                  Math.floor(Math.random() * 5) + 14;
    const months = Math.floor(Math.random() * 12);
    
    // 투입 상태 결정: STE1실, STE2실은 투입중, 경영전략실과 개발연구소는 관리/가용
    let status = '투입중';
    if (person.dept === '경영전략실') {
      status = '관리';
    } else if (person.dept === '개발연구소') {
      status = index < 33 ? '가용' : '관리';
    }
    
    return {
      id: index + 1,
      name: person.name,
      department: person.dept,
      position: person.position,
      yearsOfExperience: years,
      monthsOfExperience: months,
      joinDate: calculateJoinDate(years, months),
      status: status,
      skills: skills[Math.floor(Math.random() * skills.length)],
    };
  });

  return members;
};

const members = generateMembers();

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

// 월별 공수율 데이터 (비율로 변환)
const monthlyRateData = monthlyAllocationData.map(data => ({
  month: data.month,
  투입_정산: Math.round((data.투입_정산 / data.전체인원) * 100 * 10) / 10,
  투입_지원: Math.round((data.투입_지원 / data.전체인원) * 100 * 10) / 10,
  대기: Math.round((data.대기 / data.전체인원) * 100 * 10) / 10,
  관리: Math.round((data.관리 / data.전체인원) * 100 * 10) / 10,
  // 원본 인원수 데이터 추가
  투입_정산_인원: data.투입_정산,
  투입_지원_인원: data.투입_지원,
  대기_인원: data.대기,
  관리_인원: data.관리,
  전체인원: data.전체인원,
}));

// 최신 월(12월) 데이터로 투입률 계산
const latestMonthData = monthlyAllocationData[monthlyAllocationData.length - 1];
const deploymentRate = Math.round((latestMonthData.투입_정산 / latestMonthData.전체인원) * 100);

// 전월(11월) 데이터로 전월대비 계산
const previousMonthData = monthlyAllocationData[monthlyAllocationData.length - 2];
const previousDeploymentRate = Math.round((previousMonthData.투입_정산 / previousMonthData.전체인원) * 100);
const deploymentRateChange = deploymentRate - previousDeploymentRate;

// 부서별 인원 구성 (전체 34명)
const departmentHeadcount = {
  'STE1실': 15,
  'STE2실': 12,
  '기타': 7  // 경영전략실, 개발연구소 등
};

// 전문인력 (투입_정산 + 투입_지원 + 대기)
const professionalCount = latestMonthData.투입_정산 + latestMonthData.투입_지원 + latestMonthData.대기;
const professionalRate = Math.round((professionalCount / latestMonthData.전체인원) * 100);

// 올해 신규 입사 (2026년 기준으로 2025년 입사자 계산)
const newHires2025 = members.filter(m => {
  const joinYear = parseInt(m.joinDate.split('.')[0]);
  return joinYear === 2025;
}).length;

// 부서별 인력 분포
const departmentComposition = [
  {
    name: 'STE1실',
    인원수: members.filter(m => m.department === 'STE1실').length,
    비율: Math.round((members.filter(m => m.department === 'STE1실').length / members.length) * 100),
  },
  {
    name: 'STE2실',
    인원수: members.filter(m => m.department === 'STE2실').length,
    비율: Math.round((members.filter(m => m.department === 'STE2실').length / members.length) * 100),
  },
  {
    name: '경영전략실',
    인원수: members.filter(m => m.department === '경영전략실').length,
    비율: Math.round((members.filter(m => m.department === '경영전략실').length / members.length) * 100),
  },
  {
    name: '개발연구소',
    인원수: members.filter(m => m.department === '개발연구소').length,
    비율: Math.round((members.filter(m => m.department === '개발연구소').length / members.length) * 100),
  },
];

// 직급별 인력 분포
const positionOrder = ['사원', '선임', '책임', '수석'];

export function ResourceComposition() {
  return (
    <div className="space-y-6">
      <div>
        <h1>인력구성</h1>
        <p className="text-muted-foreground mt-1">조직의 인력 구성 현황을 확인하세요</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">전체 인력</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{latestMonthData.전체인원}명</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">STE1실 {departmentHeadcount.STE1실}명</span>
              <span className="mx-1">·</span>
              <span className="text-blue-600">STE2실 {departmentHeadcount.STE2실}명</span>
              <span className="mx-1">·</span>
              <span className="text-gray-600">기타 {departmentHeadcount.기타}명</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">관리인력</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{latestMonthData.관리}명</div>
            <p className="text-xs text-muted-foreground mt-1">
              경영/지원 업무
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">전문인력</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{professionalCount}명</div>
            <p className="text-xs text-muted-foreground mt-1">
              정산 {latestMonthData.투입_정산}명 · 지원 {latestMonthData.투입_지원}명 · 대기 {latestMonthData.대기}명
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">프로젝트 정산률</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{deploymentRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              전월대비 <span className={deploymentRateChange > 0 ? 'text-green-600' : deploymentRateChange < 0 ? 'text-red-600' : 'text-gray-600'}>
                {deploymentRateChange > 0 ? '+' : ''}{deploymentRateChange}%p
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 월별 구분별 인력 현황 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 공수율</CardTitle>
          <CardDescription>월별 정산, 지원, 대기, 관리 공수율 추이 (%)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
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
                labelFormatter={(label: string, payload: any) => {
                  if (payload && payload.length > 0) {
                    const totalCount = payload[0].payload.전체인원;
                    return `${label} (전체 ${totalCount}명)`;
                  }
                  return label;
                }}
                formatter={(value: number, name: string, props: any) => {
                  // 인원수 데이터 키 매핑
                  const countKey = `${name}_인원`;
                  const count = props.payload[countKey];
                  return `${value}% (${count}명)`;
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="투입_정산" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="투입_지원" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="대기" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="관리" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>상세 인력 통계</CardTitle>
          <CardDescription>부서 및 직급별 상세 구성 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">구분</th>
                  {positionOrder.map(position => (
                    <th key={position} className="text-center py-3 px-4">{position}</th>
                  ))}
                  <th className="text-center py-3 px-4">합계</th>
                </tr>
              </thead>
              <tbody>
                {departmentComposition.map((dept) => (
                  <tr key={dept.name} className="border-b border-border">
                    <td className="py-3 px-4">{dept.name}</td>
                    {positionOrder.map(position => {
                      const count = members.filter(m => m.department === dept.name && m.position === position).length;
                      return (
                        <td key={position} className="text-center py-3 px-4">
                          <Badge variant="secondary">{count}명</Badge>
                        </td>
                      );
                    })}
                    <td className="text-center py-3 px-4">
                      <Badge>{dept.인원수}명</Badge>
                    </td>
                  </tr>
                ))}
                <tr className="bg-accent/50">
                  <td className="py-3 px-4">합계</td>
                  {positionOrder.map(position => {
                    const count = members.filter(m => m.position === position).length;
                    return (
                      <td key={position} className="text-center py-3 px-4">
                        <Badge>{count}명</Badge>
                      </td>
                    );
                  })}
                  <td className="text-center py-3 px-4">
                    <Badge variant="default">{members.length}명</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}