import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { 
  FolderKanban, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  User,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';

// 샘플 프로젝트 데이터
const projectData = [
  {
    code: 'PRJ-2025-001',
    name: 'AI 챗봇 테스트',
    client: 'LG전자',
    pm: '김광희',
    status: '진행중',
    startDate: '2025-09-27',
    endDate: '2026-03-27',
    budget: 450000000,
    spent: 225000000,
    teamSize: 8,
    department: 'STE1실',
    team: 'LG전자 1팀',
    phase: '구현',
    // 구현 단계 지표
    automation: { total: 120, completed: 60, inProgress: 35, pending: 25 }
  },
  {
    code: 'PRJ-2025-002',
    name: '모바일 쇼핑몰 앱 리뉴얼',
    client: 'GS리테일',
    pm: '조현균',
    status: '진행중',
    startDate: '2025-11-26',
    endDate: '2026-03-26',
    budget: 680000000,
    spent: 170000000,
    teamSize: 12,
    department: 'STE2실',
    team: 'GS리테일 1팀',
    phase: '테스트 설계',
    // 테스트 설계 단계 지표
    testDesign: { total: 520, designed: 130, reviewed: 78, pending: 390 }
  },
  {
    code: 'PRJ-2024-015',
    name: 'LLM 챗봇 평가',
    client: '삼성전자',
    pm: '이길원',
    status: '완료',
    startDate: '2024-06-01',
    endDate: '2024-12-20',
    budget: 520000000,
    spent: 498000000,
    teamSize: 10,
    department: 'STE1실',
    team: 'LG전자 2팀',
    phase: '완료',
    // 완료 단계 지표
    completion: { deliverables: 12, quality: 'A', defectRate: 1.5 }
  },
  {
    code: 'PRJ-2025-004',
    name: 'SK텔레콤 5G 서비스 플랫폼',
    client: 'SK텔레콤',
    pm: '김종협',
    status: '계획',
    startDate: '2026-01-15',
    endDate: '2026-10-31',
    budget: 750000000,
    spent: 50000000,
    teamSize: 15,
    department: 'STE2실',
    team: 'GS리테일 1팀',
    phase: '분석',
    // 분석 단계 지표
    analysis: { requirements: 120, analyzed: 0, reviewing: 0, pending: 120 }
  },
  {
    code: 'PRJ-2024-018',
    name: 'LG유플러스 통합 CRM 시스템',
    client: 'LG유플러스',
    pm: '정홍근',
    status: '진행중',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    budget: 420000000,
    spent: 42000000,
    teamSize: 7,
    department: 'STE1실',
    team: 'LG전자 1팀',
    phase: '분석',
    // 분석 단계 지표
    analysis: { requirements: 85, analyzed: 8, reviewing: 5, pending: 72 }
  }
];

interface ProjectManagementAnalysisProps {
  onProjectClick?: (code: string) => void;
}

export function ProjectManagementAnalysis({ onProjectClick }: ProjectManagementAnalysisProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [departmentFilter, setDepartmentFilter] = useState('전체');

  // 일정 기반 진행률 계산 함수
  const calculateProgress = (project: typeof projectData[0]) => {
    // 완료된 프로젝트는 100%
    if (project.status === '완료') {
      return 100;
    }

    const today = new Date('2025-12-26');
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // 시작 전이면 0%
    if (elapsedDays < 0) {
      return 0;
    }
    
    // 진행률 계산 (0-100 사이로 제한)
    const progress = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));
    
    return progress;
  };

  // 통계 계산
  const stats = {
    total: projectData.length,
    inProgress: projectData.filter(p => p.status === '진행중').length,
    completed: projectData.filter(p => p.status === '완료').length,
    delayed: projectData.filter(p => p.status === '지연').length,
    planned: projectData.filter(p => p.status === '계획').length,
    totalBudget: projectData.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projectData.reduce((sum, p) => sum + p.spent, 0),
    totalTeamSize: projectData.reduce((sum, p) => sum + p.teamSize, 0),
    avgProgress: Math.round(projectData.reduce((sum, p) => sum + calculateProgress(p), 0) / projectData.length)
  };

  // 예산 집행률
  const budgetExecutionRate = Math.round((stats.totalSpent / stats.totalBudget) * 100);

  // 부서별 통계 계산
  const departmentStats = ['STE1실', 'STE2실'].map(dept => {
    const deptProjects = projectData.filter(p => p.department === dept);
    const avgProgress = deptProjects.length > 0
      ? Math.round(deptProjects.reduce((sum, p) => sum + calculateProgress(p), 0) / deptProjects.length)
      : 0;
    const totalMembers = deptProjects.reduce((sum, p) => sum + p.teamSize, 0);
    
    return {
      department: dept,
      projectCount: deptProjects.length,
      avgProgress,
      totalMembers
    };
  });

  // 필터링
  const filteredProjects = projectData.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.pm.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '전체' || project.status === statusFilter;
    const matchesDepartment = departmentFilter === '전체' || project.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '진행중':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
      case '완료':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400';
      case '지연':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400';
      case '계획':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  // 진행단계 매핑 함수 (계획, 진행, 완료)
  const getProgressStage = (status: string) => {
    if (status === '계획') return '계획';
    if (status === '완료') return '완료';
    return '진행'; // '진행중', '지연' 모두 '진행'으로 표시
  };

  const getProgressStageColor = (stage: string) => {
    switch (stage) {
      case '계획':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
      case '진행':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
      case '완료':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>현황분석</h1>
          <p className="text-muted-foreground mt-1">전체 프로젝트 현황을 확인하고 관리하세요.</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 전체 프로젝트 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">전체 프로젝트</p>
                <p className="text-2xl font-bold">{stats.total}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-blue-600">진행 {stats.inProgress}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-green-600">완료 {stats.completed}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-red-600">지연 {stats.delayed}</span>
                </div>
                <div className="mt-3 pt-3 border-t space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">STE1실</span>
                    <span className="font-medium">{departmentStats[0].projectCount}개</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">STE2실</span>
                    <span className="font-medium">{departmentStats[1].projectCount}개</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <FolderKanban className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 평균 진행률 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">평균 진행률</p>
                <p className="text-2xl font-bold">{stats.avgProgress}%</p>
                <Progress value={stats.avgProgress} className="mt-2 h-2" />
                <div className="mt-3 pt-3 border-t space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">STE1실</span>
                    <span className="font-medium">{departmentStats[0].avgProgress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">STE2실</span>
                    <span className="font-medium">{departmentStats[1].avgProgress}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 투입 인력 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 투입 인력</p>
                <p className="text-2xl font-bold">{stats.totalTeamSize}명</p>
                <p className="text-xs text-muted-foreground mt-2">
                  평균 {Math.round(stats.totalTeamSize / stats.total)}명/프로젝트
                </p>
                <div className="mt-3 pt-3 border-t space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">STE1실</span>
                    <span className="font-medium">{departmentStats[0].totalMembers}명</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">STE2실</span>
                    <span className="font-medium">{departmentStats[1].totalMembers}명</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-950">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="flex gap-2">
                <Search className="h-5 w-5 text-muted-foreground mt-2" />
                <Input
                  placeholder="프로젝트명, 고객사, PM 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 상태</SelectItem>
                  <SelectItem value="계획">계획</SelectItem>
                  <SelectItem value="진행중">진행중</SelectItem>
                  <SelectItem value="지연">지연</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="부서" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 부서</SelectItem>
                  <SelectItem value="STE1실">STE1실</SelectItem>
                  <SelectItem value="STE2실">STE2실</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>프로젝트 현황</CardTitle>
            <Badge variant="outline">{filteredProjects.length}개</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.code}
                className="p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onProjectClick?.(project.code)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        PM: {project.pm}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {project.teamSize}명
                      </span>
                      <span>{project.department} • {project.team}</span>
                    </div>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">진행률</span>
                    <span className="font-medium">{calculateProgress(project)}%</span>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getProgressColor(calculateProgress(project))}`}
                        style={{ width: `${calculateProgress(project)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 하단 정보 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* 일정 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      일정
                    </div>
                    <p className="text-sm font-medium">
                      {project.startDate} ~ {project.endDate}
                    </p>
                  </div>

                  {/* 예산 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5" />
                      예산
                    </div>
                    <p className="text-sm font-medium">
                      {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((project.spent / project.budget) * 100)}% 집행
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}