import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, ChevronRight, FolderKanban, Filter, X, Calendar, DollarSign, Users } from 'lucide-react';

// 샘플 프로젝트 데이터
interface Project {
  code: string;
  name: string;
  client: string;
  pm: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  teamSize: number;
  department: string;
  team: string;
  phase: string;
  description: string;
  members: string[]; // 투입 인력 이름 리스트
}

const projectData: Project[] = [
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
    description: 'LG전자 AI 챗봇 서비스의 품질 보증 및 테스트 자동화를 위한 프로젝트입니다.',
    members: ['김광희', '박성호', '이길원', '김동욱', '박지훈', '이서연', '최민수', '정수진']
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
    description: 'GS리테일 모바일 쇼핑몰 앱의 전면 리뉴얼에 따른 통합 테스트 및 성능 검증 프로젝트입니다.',
    members: ['조현균', '정홍근', '김종협', '강민지', '윤태호', '서지영', '한상우', '오지훈', '임하늘', '장예은', '신동현', '배소라']
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
    description: '삼성전자 LLM 기반 챗봇의 성능 평가 및 품질 보증 프로젝트입니다.',
    members: ['이길원', '김광희', '박성호', '정민아', '최준혁', '홍유라', '남궁진', '안지현', '권태윤', '유나영']
  },
  {
    code: 'PRJ-2025-003',
    name: '테스트 아웃소싱 프로젝트',
    client: '현대자동차',
    pm: '박성호',
    status: '지연',
    startDate: '2025-06-28',
    endDate: '2026-02-28',
    budget: 380000000,
    spent: 285000000,
    teamSize: 9,
    department: 'STE1실',
    team: 'LG전자 1팀',
    phase: '수행',
    description: '현대자동차 차량용 소프트웨어 테스트 아웃소싱 프로젝트입니다.',
    members: ['박성호', '김광희', '이길원', '송재현', '전미라', '노승훈', '문지수', '차은별', '백지훈']
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
    description: 'SK텔레콤 5G 서비스 플랫폼의 품질 보증 및 성능 테스트 프로젝트입니다.',
    members: ['김종협', '조현균', '정홍근']
  },
  {
    code: 'PRJ-2024-018',
    name: 'LG유플러스 통합 CRM 시스템',
    client: 'LG유플러스',
    pm: '정홍근',
    status: '계획',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    budget: 420000000,
    spent: 42000000,
    teamSize: 7,
    department: '',
    team: '',
    phase: '분석',
    description: 'LG유플러스 통합 CRM 시스템의 기능 테스트 및 품질 검증 프로젝트입니다.',
    members: ['정홍근', '김광희', '박성호']
  }
];

interface ProjectInfoInquiryProps {
  onProjectClick?: (code: string) => void;
}

export function ProjectInfoInquiry({ onProjectClick }: ProjectInfoInquiryProps) {
  const [deptFilter, setDeptFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [startDateFrom, setStartDateFrom] = useState('');
  const [startDateTo, setStartDateTo] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 프로젝트 상태 자동 계산 (날짜 기반)
  const getProjectStatus = (project: Project) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(project.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(project.endDate);
    endDate.setHours(0, 0, 0, 0);

    // 완료: 단계가 '완료'인 경우
    if (project.phase === '완료') {
      return '완료';
    }

    // 계획: 시작 전
    if (today < startDate) {
      return '계획';
    }

    // 종료일 지났는데 완료 아님 = 지연
    if (today > endDate) {
      return '지연';
    }

    // 진행중: 시작일과 종료일 사이
    if (today >= startDate && today <= endDate) {
      // 예상 진행률 계산
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const elapsedDays = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const expectedProgress = (elapsedDays / totalDays) * 100;
      
      // 실제 집행률
      const actualProgress = (project.spent / project.budget) * 100;
      
      // 예상 진행률보다 20% 이상 낮으면 지연
      if (actualProgress < expectedProgress - 20) {
        return '지연';
      }
      
      return '진행중';
    }

    return '계획';
  };

  // 필터링 및 검색
  const filteredProjects = useMemo(() => {
    return projectData.filter(project => {
      const autoStatus = getProjectStatus(project);
      const matchesDept = deptFilter === 'all' || project.department === deptFilter;
      const matchesTeam = teamFilter === 'all' || project.team === teamFilter;
      const matchesPhase = phaseFilter === 'all' || project.phase === phaseFilter;
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.pm.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMemberSearch = memberSearchQuery === '' || 
        project.members.some(member => member.toLowerCase().includes(memberSearchQuery.toLowerCase()));

      const matchesStartDateFrom = startDateFrom === '' || new Date(project.startDate) >= new Date(startDateFrom);
      const matchesStartDateTo = startDateTo === '' || new Date(project.startDate) <= new Date(startDateTo);
      const matchesBudgetMin = budgetMin === '' || project.budget >= parseInt(budgetMin);
      const matchesBudgetMax = budgetMax === '' || project.budget <= parseInt(budgetMax);

      return matchesDept && matchesTeam && matchesPhase && matchesSearch && matchesMemberSearch && matchesStartDateFrom && matchesStartDateTo && matchesBudgetMin && matchesBudgetMax;
    });
  }, [deptFilter, teamFilter, phaseFilter, searchQuery, memberSearchQuery, startDateFrom, startDateTo, budgetMin, budgetMax]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0
    }).format(amount / 100000000) + '억';
  };

  const formatDate = (dateString: string) => {
    return dateString.substring(0, 10);
  };

  const calculateProgress = (spent: number, budget: number) => {
    return Math.round((spent / budget) * 100);
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1>프로젝트 관리</h1>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">정보조회</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">기본정보</span>
          </div>
          <p className="text-muted-foreground mt-1">프로젝트 기본 정보를 조회하세요.</p>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 검색 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="프로젝트명, 코드, 고객사, PM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* 부서 필터 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">부서</label>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="STE1실">STE1실</SelectItem>
                  <SelectItem value="STE2실">STE2실</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 팀 필터 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">팀</label>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="LG전자 1팀">LG전자 1팀</SelectItem>
                  <SelectItem value="LG전자 2팀">LG전자 2팀</SelectItem>
                  <SelectItem value="GS리테일 1팀">GS리테일 1팀</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 단계 필터 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">진행 단계</label>
              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="분석">분석</SelectItem>
                  <SelectItem value="테스트 설계">테스트 설계</SelectItem>
                  <SelectItem value="구현">구현</SelectItem>
                  <SelectItem value="수행">수행</SelectItem>
                  <SelectItem value="결과분석">결과분석</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 고급 필터 토글 */}
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="mb-3"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? '고급 필터 숨기기' : '고급 필터 표시'}
            </Button>

            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t">
                {/* 인력 검색 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    투입 인력
                  </label>
                  <Input
                    placeholder="인력 이름으로 검색..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                  />
                </div>

                {/* 프로젝트 시작일 범위 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    시작일 (시작)
                  </label>
                  <Input
                    type="date"
                    value={startDateFrom}
                    onChange={(e) => setStartDateFrom(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    시작일 (종료)
                  </label>
                  <Input
                    type="date"
                    value={startDateTo}
                    onChange={(e) => setStartDateTo(e.target.value)}
                  />
                </div>

                {/* 예산 범위 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    예산 최소 (원)
                  </label>
                  <Input
                    type="number"
                    placeholder="예: 100000000"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    예산 최대 (원)
                  </label>
                  <Input
                    type="number"
                    placeholder="예: 500000000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              총 <span className="font-semibold text-foreground">{filteredProjects.length}</span>개 프로젝트
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setDeptFilter('all');
                setTeamFilter('all');
                setPhaseFilter('all');
                setSearchQuery('');
                setMemberSearchQuery('');
                setStartDateFrom('');
                setStartDateTo('');
                setBudgetMin('');
                setBudgetMax('');
              }}
            >
              <X className="h-4 w-4 mr-2" />
              필터 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 리스트 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            프로젝트 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">프로젝트명</th>
                  <th className="text-left p-3 font-medium">고객사</th>
                  <th className="text-left p-3 font-medium">부서</th>
                  <th className="text-left p-3 font-medium">팀</th>
                  <th className="text-left p-3 font-medium">상태</th>
                  <th className="text-left p-3 font-medium">기간</th>
                  <th className="text-right p-3 font-medium">예산</th>
                  <th className="text-center p-3 font-medium">인력</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                      <FolderKanban className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>조회된 프로젝트가 없습니다.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr
                      key={project.code}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onProjectClick?.(project.code)}
                    >
                      <td className="p-3">
                        <span className="font-medium">{project.name}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{project.client}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{project.department}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{project.team}</span>
                      </td>
                      <td className="p-3">
                        <Badge className={`text-xs ${getStatusColor(getProjectStatus(project))}`}>
                          {getProjectStatus(project)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div>{formatDate(project.startDate)}</div>
                          <div className="text-muted-foreground">~ {formatDate(project.endDate)}</div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="text-sm">
                          <div className="font-medium">{formatCurrency(project.budget)}</div>
                          <div className="text-muted-foreground text-xs">{formatCurrency(project.spent)}</div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-sm font-medium">{project.teamSize}명</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}