import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { 
  Building2, 
  Users, 
  FolderKanban, 
  Calendar,
  Search,
  User,
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  position: string;
  allocation: number;
}

interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  status: string;
  pm: string;
  department: string;
  team: string;
  members: TeamMember[];
}

export function ProjectOrgInfo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // 샘플 데이터 - 플랫 구조로 변경
  const projectsData: Project[] = [
    {
      id: 'proj-1',
      code: 'PRJ-2025-001',
      name: 'AI 챗봇 테스트',
      client: 'LG전자',
      startDate: '2025-09-27',
      endDate: '2026-03-27',
      status: '진행중',
      pm: '김광희',
      department: 'STE1실',
      team: 'LG전자 1팀',
      members: [
        { id: 'm1', name: '김광희', role: 'PM', position: '수석', allocation: 100 },
        { id: 'm2', name: '이길원', role: '테스트 리드', position: '책임', allocation: 100 },
        { id: 'm3', name: '조현균', role: '테스트 엔지니어', position: '선임', allocation: 80 },
        { id: 'm4', name: '정홍근', role: '테스트 엔지니어', position: '사원', allocation: 60 }
      ]
    },
    {
      id: 'proj-2',
      code: 'PRJ-2025-002',
      name: 'LLM 챗봇 평가',
      client: 'LG전자',
      startDate: '2025-06-01',
      endDate: '2025-12-31',
      status: '완료',
      pm: '김광희',
      department: 'STE1실',
      team: 'LG전자 1팀',
      members: [
        { id: 'm5', name: '김광희', role: 'PM', position: '수석', allocation: 100 },
        { id: 'm6', name: '박철수', role: '평가 엔지니어', position: '책임', allocation: 100 }
      ]
    },
    {
      id: 'proj-3',
      code: 'PRJ-2026-001',
      name: '5G 네트워크 품질 테스트',
      client: 'SK텔레콤',
      startDate: '2026-01-15',
      endDate: '2026-07-15',
      status: '계획',
      pm: '박성호',
      department: 'STE1실',
      team: 'SK텔레콤 1팀',
      members: [
        { id: 'm7', name: '박성호', role: 'PM', position: '사장', allocation: 50 },
        { id: 'm8', name: '김영수', role: '네트워크 엔지니어', position: '책임', allocation: 100 }
      ]
    },
    {
      id: 'proj-4',
      code: 'PRJ-2025-015',
      name: '갤럭시 AI 기능 검증',
      client: '삼성전자',
      startDate: '2025-10-01',
      endDate: '2026-04-30',
      status: '진행중',
      pm: '김종협',
      department: 'STE2실',
      team: '삼성전자 1팀',
      members: [
        { id: 'm9', name: '김종협', role: 'PM', position: '실장', allocation: 80 },
        { id: 'm10', name: '이민호', role: 'QA 엔지니어', position: '선임', allocation: 100 },
        { id: 'm11', name: '최지원', role: 'QA 엔지니어', position: '사원', allocation: 100 }
      ]
    },
    {
      id: 'proj-5',
      code: 'PRJ-2025-020',
      name: 'ADAS 시스템 검증',
      client: '현대자동차',
      startDate: '2025-11-01',
      endDate: '2026-05-31',
      status: '진행중',
      pm: '이정민',
      department: 'STE2실',
      team: '현대자동차 1팀',
      members: [
        { id: 'm12', name: '이정민', role: 'PM', position: '책임', allocation: 100 },
        { id: 'm13', name: '강동현', role: '시스템 엔지니어', position: '선임', allocation: 100 },
        { id: 'm14', name: '윤서연', role: '테스트 엔지니어', position: '선임', allocation: 80 }
      ]
    },
    {
      id: 'proj-6',
      code: 'PRJ-2025-008',
      name: '모바일 앱 성능 테스트',
      client: 'SK텔레콤',
      startDate: '2025-08-01',
      endDate: '2025-12-31',
      status: '지연',
      pm: '박성호',
      department: 'STE1실',
      team: 'SK텔레콤 1팀',
      members: [
        { id: 'm15', name: '박성호', role: 'PM', position: '사장', allocation: 40 },
        { id: 'm16', name: '한지민', role: '성능 엔지니어', position: '선임', allocation: 100 }
      ]
    }
  ];

  const toggleRow = (projectId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedRows(newExpanded);
  };

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

  const formatDate = (dateString: string) => {
    return dateString.substring(0, 10);
  };

  // 필터링된 데이터
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.pm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesDept = deptFilter === 'all' || project.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // 통계 계산
  const totalProjects = projectsData.length;
  const totalMembers = projectsData.reduce((sum, project) => sum + project.members.length, 0);
  const activeProjects = projectsData.filter(p => p.status === '진행중').length;
  const departments = Array.from(new Set(projectsData.map(p => p.department)));

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDeptFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || deptFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1>프로젝트 조직 정보</h1>
        <p className="text-muted-foreground">조직별 프로젝트 및 투입 인력 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 부서</p>
                <p className="text-2xl font-semibold">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <FolderKanban className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 프로젝트</p>
                <p className="text-2xl font-semibold">{totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">진행중 프로젝트</p>
                <p className="text-2xl font-semibold">{activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 투입 인력</p>
                <p className="text-2xl font-semibold">{totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="프로젝트명, 코드, 고객사, PM, 팀, 부서, 인력 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 부서 필터 */}
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="부서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 부서</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 상태 필터 */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="계획">계획</SelectItem>
                <SelectItem value="진행중">진행중</SelectItem>
                <SelectItem value="지연">지연</SelectItem>
                <SelectItem value="완료">완료</SelectItem>
              </SelectContent>
            </Select>

            {/* 필터 초기화 */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                <X className="h-4 w-4 mr-2" />
                초기화
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 리스트 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>프로젝트 목록</CardTitle>
            <p className="text-sm text-muted-foreground">
              총 {filteredProjects.length}개 프로젝트
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {/* 테이블 헤더 */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
                <div className="col-span-1"></div>
                <div className="col-span-2">프로젝트 코드</div>
                <div className="col-span-2">프로젝트명</div>
                <div className="col-span-2">부서/팀</div>
                <div className="col-span-2">고객사</div>
                <div className="col-span-1">PM</div>
                <div className="col-span-1">상태</div>
                <div className="col-span-1 text-center">인력</div>
              </div>

              {/* 프로젝트 행 */}
              {filteredProjects.map((project) => (
                <div key={project.id} className="border rounded-lg overflow-hidden">
                  {/* 메인 행 */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors items-center"
                    onClick={() => toggleRow(project.id)}
                  >
                    {/* 확장 버튼 */}
                    <div className="hidden md:flex col-span-1 items-center">
                      {expandedRows.has(project.id) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    {/* 모바일 레이아웃 */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedRows.has(project.id) ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium">{project.name}</span>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1 pl-6">
                        <div>{project.code}</div>
                        <div>{project.department} / {project.team}</div>
                        <div>{project.client} | PM: {project.pm}</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(project.startDate)} ~ {formatDate(project.endDate)}</span>
                        </div>
                        <div>투입인력: {project.members.length}명</div>
                      </div>
                    </div>

                    {/* 데스크톱 레이아웃 */}
                    <div className="hidden md:block col-span-2">
                      <p className="font-mono text-sm">{project.code}</p>
                    </div>

                    <div className="hidden md:block col-span-2">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="font-medium truncate">{project.name}</span>
                      </div>
                    </div>

                    <div className="hidden md:block col-span-2">
                      <div className="text-sm">
                        <p className="font-medium">{project.department}</p>
                        <p className="text-muted-foreground text-xs">{project.team}</p>
                      </div>
                    </div>

                    <div className="hidden md:block col-span-2 text-sm">
                      {project.client}
                    </div>

                    <div className="hidden md:block col-span-1 text-sm">
                      {project.pm}
                    </div>

                    <div className="hidden md:block col-span-1">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>

                    <div className="hidden md:flex col-span-1 justify-center">
                      <Badge variant="outline">
                        {project.members.length}명
                      </Badge>
                    </div>
                  </div>

                  {/* 확장 영역 - 투입 인력 */}
                  {expandedRows.has(project.id) && (
                    <div className="border-t bg-muted/30 p-4">
                      <div className="space-y-3">
                        {/* 프로젝트 기간 */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pb-2 border-b">
                          <Calendar className="h-4 w-4" />
                          <span>프로젝트 기간: {formatDate(project.startDate)} ~ {formatDate(project.endDate)}</span>
                        </div>

                        {/* 투입 인력 */}
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            투입 인력 ({project.members.length}명)
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {project.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center justify-between p-3 bg-background rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-medium">
                                      {member.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium truncate">{member.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                      {member.position} | {member.role}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="ml-2 flex-shrink-0">
                                  {member.allocation}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
