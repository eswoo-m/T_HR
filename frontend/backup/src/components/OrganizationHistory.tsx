import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { History, Search, Filter, Calendar as CalendarIcon, Building2, ArrowUpRight, ArrowDownRight, RefreshCw, Edit, X, Clock, FolderKanban, Users, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner@2.0.3';

type DateRange = {
  from?: Date;
  to?: Date;
};

// 조직 변경 이력 데이터 (과거~현재)
const orgHistoryData = [
  {
    id: 1,
    date: '2025-01-15',
    displayDate: '2025.01.15',
    type: '신설',
    category: 'org',
    organization: 'LG전자 4팀',
    department: 'STE1실',
    description: 'LG전자 프로젝트 확대에 따른 신규 팀 신설',
    headCountBefore: 0,
    headCountAfter: 3,
    leader: '박준수 책임',
    approver: '강현규 이사',
  },
  {
    id: 4,
    date: '2024-12-28',
    displayDate: '2024.12.28',
    type: '신설',
    category: 'org',
    organization: 'LG전자 2팀',
    department: 'STE1실',
    description: 'LG전자 프로젝트 팀 구성',
    headCountBefore: 0,
    headCountAfter: 4,
    leader: '이길원 팀장',
    approver: '강현규 이사',
  },
  {
    id: 6,
    date: '2024-12-15',
    displayDate: '2024.12.15',
    type: '신설',
    category: 'org',
    organization: 'LG전자 1팀',
    department: 'STE1실',
    description: 'LG전자 프로젝트 착수',
    headCountBefore: 0,
    headCountAfter: 2,
    leader: '전광희 팀장',
    approver: '강현규 이사',
  },
  {
    id: 8,
    date: '2024-11-25',
    displayDate: '2024.11.25',
    type: '신설',
    category: 'org',
    organization: 'KT 알파1팀',
    department: 'STE2실',
    description: 'KT 프로젝트 신규 팀 구성',
    headCountBefore: 0,
    headCountAfter: 3,
    leader: '윤제진 수석',
    approver: '김종협 실장',
  },
  {
    id: 10,
    date: '2024-11-01',
    displayDate: '2024.11.01',
    type: '신설',
    category: 'org',
    organization: 'GS리테일 1팀',
    department: 'STE2실',
    description: 'GS리테일 프로젝트 착수',
    headCountBefore: 0,
    headCountAfter: 3,
    leader: '조현균 팀장',
    approver: '김종협 실장',
  },
  {
    id: 11,
    date: '2024-10-31',
    displayDate: '2024.10.31',
    type: '폐지',
    category: 'org',
    organization: '현대차 2팀',
    department: 'STE2실',
    description: '프로젝트 종료에 따른 팀 해체',
    headCountBefore: 4,
    headCountAfter: 0,
    leader: '-',
    approver: '김종협 실장',
  },
  {
    id: 12,
    date: '2024-09-15',
    displayDate: '2024.09.15',
    type: '폐지',
    category: 'org',
    organization: 'SK텔레콤 3팀',
    department: 'STE1실',
    description: '프로젝트 완료 및 팀 해체',
    headCountBefore: 3,
    headCountAfter: 0,
    leader: '-',
    approver: '강현규 이사',
  },
];

// 예정된 조직 변경 데이터 (오늘 이후)
const scheduledOrgChangesData = [
  {
    id: 101,
    date: '2026-02-01',
    displayDate: '2026.02.01',
    type: '신설',
    category: 'org',
    organization: '삼성전자 1팀',
    department: 'STE1실',
    description: '삼성전자 신규 프로젝트 착수',
    headCountBefore: 0,
    headCountAfter: 5,
    leader: '김철수 팀장',
    registrant: '강현규 이사',
    registeredDate: '2026-01-05',
    status: '대기',
    projectName: '삼성전자 IoT 플랫폼 구축',
    projectPeriod: '2026.02.01 ~ 2026.10.31',
    members: [
      { name: '이영희', position: '책임' },
      { name: '박민수', position: '선임' },
      { name: '최지훈', position: '사원' },
      { name: '강서연', position: '사원' },
    ],
  },
  {
    id: 102,
    date: '2026-03-01',
    displayDate: '2026.03.01',
    type: '신설',
    category: 'org',
    organization: '네이버 1팀',
    department: 'STE2실',
    description: '네이버 클라우드 프로젝트',
    headCountBefore: 0,
    headCountAfter: 4,
    leader: '박영희 책임',
    registrant: '김종협 실장',
    registeredDate: '2026-01-06',
    status: '대기',
    projectName: '',
    projectPeriod: '',
    members: [
      { name: '정수민', position: '선임' },
      { name: '김태우', position: '사원' },
      { name: '윤지원', position: '사원' },
    ],
  },
  {
    id: 103,
    date: '2026-04-15',
    displayDate: '2026.04.15',
    type: '폐지',
    category: 'org',
    organization: 'HDC랩스 1팀',
    department: 'STE2실',
    description: '프로젝트 종료 예정',
    headCountBefore: 3,
    headCountAfter: 0,
    leader: '-',
    registrant: '김종협 실장',
    registeredDate: '2026-01-03',
    status: '대기',
    projectName: 'HDC 디지털 트윈 플랫폼',
    projectPeriod: '2024.06.01 ~ 2026.04.15',
    members: [
      { name: '조현수', position: '책임' },
      { name: '한지민', position: '선임' },
      { name: '송민호', position: '사원' },
    ],
  },
];

const orgTypeColors: { [key: string]: string } = {
  '신설': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  '폐지': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const statusColors: { [key: string]: string } = {
  '대기': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  '승인': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

interface OrganizationHistoryProps {
  onOrganizationSelect?: (orgData: any) => void;
}

export function OrganizationHistory({ onOrganizationSelect }: OrganizationHistoryProps) {
  const [selectedOrgType, setSelectedOrgType] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(),
  });

  // 예정된 변경사항 필터
  const [scheduledSearchQuery, setScheduledSearchQuery] = useState('');
  const [scheduledTypeFilter, setScheduledTypeFilter] = useState<string>('전체');
  const [scheduledChanges, setScheduledChanges] = useState(scheduledOrgChangesData);

  // 수정 팝업 관련 state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChange, setEditingChange] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    organization: '',
    department: '',
    date: '',
    description: '',
    leader: '',
    projectName: '',
    projectPeriod: '',
    type: '신설',
  });
  const [editMembers, setEditMembers] = useState<Array<{ name: string; position: string }>>([]);

  // 구성원 추가 팝업 관련 state
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [memberSearchFilter, setMemberSearchFilter] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // 프로젝트 추가 팝업 관련 state
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [selectedProjectCode, setSelectedProjectCode] = useState('');

  // 전체 프로젝트 목록
  const allProjects = [
    { code: 'PRJ-001', name: 'LG전자 스마트홈 플랫폼 고도화', client: 'LG전자', period: '2025.04.11 ~ 2025.12.31', status: '진행중', team: '' },
    { code: 'PRJ-002', name: 'LG전자 통합 관리 시스템', client: 'LG전자', period: '2024.03 ~ 2025.06', status: '진행중', team: 'LG전자 2팀' },
    { code: 'PRJ-003', name: 'GS리테일 통합 POS 시스템 구축', client: 'GS리테일', period: '2024.02 ~ 2025.08', status: '진행중', team: 'GS리테일 1팀' },
    { code: 'PRJ-004', name: 'KT 알파 AI 플랫폼', client: 'KT', period: '2024.12 ~ 2025.11', status: '진행중', team: 'KT 알파1팀' },
    { code: 'PRJ-005', name: '삼성전자 IoT 플랫폼 구축', client: '삼성전자', period: '2026.02.01 ~ 2026.10.31', status: '대기중', team: '' },
    { code: 'PRJ-006', name: '네이버 클라우드 마이그레이션', client: '네이버', period: '2026.03.01 ~ 2026.09.30', status: '계획중', team: '' },
  ];

  // 팀에 배정되지 않은 프로젝트 가져오기
  const getUnassignedProjects = () => {
    return allProjects.filter(project => !project.team);
  };

  // 조직 이력 필터링
  const filteredOrgData = orgHistoryData.filter(history => {
    const matchesType = selectedOrgType === '전체' || history.type === selectedOrgType;
    const matchesSearch = searchQuery === '' || 
      history.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      history.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      history.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateRange || !dateRange.from || !dateRange.to ||
      (new Date(history.date) >= dateRange.from && new Date(history.date) <= dateRange.to);
    return matchesType && matchesSearch && matchesDate;
  });

  // 예정된 변경사항 필터링
  const filteredScheduledData = scheduledChanges.filter(change => {
    const matchesType = scheduledTypeFilter === '전체' || change.type === scheduledTypeFilter;
    const matchesSearch = scheduledSearchQuery === '' || 
      change.organization.toLowerCase().includes(scheduledSearchQuery.toLowerCase()) ||
      change.department.toLowerCase().includes(scheduledSearchQuery.toLowerCase()) ||
      change.description.toLowerCase().includes(scheduledSearchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // 조직 이력 통계 (필터링된 데이터 기준)
  const orgStats = {
    total: filteredOrgData.length,
    new: filteredOrgData.filter(h => h.type === '신설').length,
    close: filteredOrgData.filter(h => h.type === '폐지').length,
  };

  // 예정된 변경사항 통계
  const scheduledStats = {
    total: filteredScheduledData.length,
    new: filteredScheduledData.filter(h => h.type === '신설').length,
    close: filteredScheduledData.filter(h => h.type === '폐지').length,
  };

  // 예정된 변경 취소
  const handleCancelScheduled = (id: number, orgName: string) => {
    setScheduledChanges(prev => prev.filter(item => item.id !== id));
    toast.success(`${orgName}의 예정된 변경이 취소되었습니다.`);
  };

  // 수정 버튼 클릭
  const handleEditClick = (change: any) => {
    setEditingChange(change);
    setEditFormData({
      organization: change.organization,
      department: change.department,
      date: change.date,
      description: change.description,
      leader: change.leader,
      projectName: change.projectName || '',
      projectPeriod: change.projectPeriod || '',
      type: change.type,
    });
    setEditMembers(change.members || []);
    setIsEditDialogOpen(true);
  };

  // 수정 저장
  const handleSaveEdit = () => {
    if (!editingChange) return;
    
    setScheduledChanges(prev => prev.map(item => 
      item.id === editingChange.id 
        ? { 
            ...item, 
            ...editFormData,
            displayDate: editFormData.date.replace(/-/g, '.'),
            members: editMembers,
          }
        : item
    ));
    
    setIsEditDialogOpen(false);
    toast.success('예정된 조직 변경이 수정되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>조직 이력 관리</h1>
          <p className="text-muted-foreground mt-1">조직 변경 이력 및 예정된 변경사항을 관리하세요</p>
        </div>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            조직 변경 이력
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Clock className="h-4 w-4 mr-2" />
            예정된 조직 변경
            {scheduledChanges.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {scheduledChanges.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* 조직 변경 이력 탭 */}
        <TabsContent value="history" className="space-y-6">
          {/* 검색 및 필터 영역 */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* 검색바 */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="조직명, 부서, 설명으로 검색..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, 'yyyy.MM.dd', { locale: ko })} - {format(dateRange.to, 'yyyy.MM.dd', { locale: ko })}
                            </>
                          ) : (
                            format(dateRange.from, 'yyyy.MM.dd', { locale: ko })
                          )
                        ) : (
                          '기간 설정'
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        locale={ko}
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 필터 버튼들 */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground mr-2">변경 유형:</span>
                  <div className="flex gap-2">
                    {['전체', '신설', '폐지'].map((type) => (
                      <Badge
                        key={type}
                        variant={selectedOrgType === type ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSelectedOrgType(type)}
                      >
                        {type}
                        {type !== '전체' && (
                          <span className="ml-1">
                            ({type === '신설' ? orgStats.new : 
                              orgStats.close})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => {
                    setSelectedOrgType('전체');
                    setSearchQuery('');
                    setDateRange(undefined);
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    초기화
                  </Button>
                </div>

                {/* 검색 결과 정보 */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    총 <span className="font-medium text-foreground">{filteredOrgData.length}</span>개의 이력이 검색되었습니다
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      신설 {orgStats.new}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      폐지 {orgStats.close}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 이력 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>조직 변경 목록</CardTitle>
              <CardDescription>시간순으로 정렬된 조직 변경 내역</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredOrgData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>검색 결과가 없습니다</p>
                    <p className="text-sm mt-1">다른 검색어나 필터를 사용해보세요</p>
                  </div>
                ) : (
                  filteredOrgData.map((history) => (
                    <div
                      key={history.id}
                      className="relative pl-8 pb-6 border-l-2 border-border last:pb-0"
                    >
                      {/* Timeline dot */}
                      <div 
                        className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-background ${
                          history.type === '신설' ? 'bg-green-500' :
                          'bg-gray-500'
                        }`}
                      ></div>
                      
                      <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                        {/* 헤더 */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4>{history.organization}</h4>
                              <Badge className={orgTypeColors[history.type]}>
                                {history.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              {history.displayDate}
                              <span>•</span>
                              <Building2 className="h-3 w-3" />
                              {history.department}
                            </div>
                          </div>
                          {history.type !== '리더변경' && (
                            <div className="flex items-center gap-1">
                              {history.headCountAfter > history.headCountBefore ? (
                                <>
                                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                                  <span className="text-green-600">
                                    +{history.headCountAfter - history.headCountBefore}명
                                  </span>
                                </>
                              ) : history.headCountAfter < history.headCountBefore ? (
                                <>
                                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                                  <span className="text-red-600">
                                    {history.headCountAfter - history.headCountBefore}명
                                  </span>
                                </>
                              ) : null}
                            </div>
                          )}
                        </div>

                        {/* 설명 */}
                        <p className="text-sm text-muted-foreground mb-3">
                          {history.description}
                        </p>

                        {/* 하단 정보 */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t">
                          <div>리더: {history.leader}</div>
                          <div>승인: {history.approver}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 예정된 조직 변경 탭 */}
        <TabsContent value="scheduled" className="space-y-6">
          {/* 검색 및 필터 영역 */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* 검색바 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="조직명, 부서, 설명으로 검색..."
                    className="pl-9"
                    value={scheduledSearchQuery}
                    onChange={(e) => setScheduledSearchQuery(e.target.value)}
                  />
                </div>

                {/* 필터 버튼들 */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground mr-2">변경 유형:</span>
                  <div className="flex gap-2">
                    {['전체', '신설', '폐지'].map((type) => (
                      <Badge
                        key={type}
                        variant={scheduledTypeFilter === type ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setScheduledTypeFilter(type)}
                      >
                        {type}
                        {type !== '전체' && (
                          <span className="ml-1">
                            ({type === '신설' ? scheduledStats.new : scheduledStats.close})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => {
                    setScheduledTypeFilter('전체');
                    setScheduledSearchQuery('');
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    초기화
                  </Button>
                </div>

                {/* 검색 결과 정보 */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    총 <span className="font-medium text-foreground">{filteredScheduledData.length}</span>개의 예정된 변경이 있습니다
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      신설 {scheduledStats.new}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      폐지 {scheduledStats.close}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 예정된 변경 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>예정된 변경 목록</CardTitle>
              <CardDescription>적용 예정일순으로 정렬된 조직 변경 내역</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredScheduledData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>예정된 조직 변경이 없습니다</p>
                    <p className="text-sm mt-1">다른 검색어나 필터를 사용해보세요</p>
                  </div>
                ) : (
                  filteredScheduledData.map((change) => (
                    <div
                      key={change.id}
                      className="relative pl-8 pb-6 border-l-2 border-border border-dashed last:pb-0"
                    >
                      {/* Timeline dot */}
                      <div 
                        className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-background ${
                          change.type === '신설' ? 'bg-green-500' :
                          'bg-gray-500'
                        }`}
                      ></div>
                      
                      <div className="p-4 border border-border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                        {/* 헤더 */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4>{change.organization}</h4>
                              <Badge className={orgTypeColors[change.type]}>
                                {change.type}
                              </Badge>
                              <Badge className={statusColors[change.status]}>
                                {change.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              적용 예정: {change.displayDate}
                              <span>•</span>
                              <Building2 className="h-3 w-3" />
                              {change.department}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {change.headCountAfter > change.headCountBefore ? (
                              <>
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">
                                  +{change.headCountAfter - change.headCountBefore}명
                                </span>
                              </>
                            ) : change.headCountAfter < change.headCountBefore ? (
                              <>
                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">
                                  {change.headCountAfter - change.headCountBefore}명
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>

                        {/* 설명 */}
                        <p className="text-sm text-muted-foreground mb-3">
                          {change.description}
                        </p>

                        {/* 연결 프로젝트 */}
                        {change.projectName && (
                          <div className="flex items-center gap-2 text-xs mb-3 p-2 bg-accent/30 rounded">
                            <FolderKanban className="h-3 w-3 text-primary" />
                            <span className="font-medium">{change.projectName}</span>
                            <span className="text-muted-foreground">({change.projectPeriod})</span>
                          </div>
                        )}

                        {/* 구성원 정보 */}
                        {change.members && change.members.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                              <Users className="h-3 w-3" />
                              <span>구성원:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {change.members.map((member: any, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {member.name}({member.position})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 하단 정보 및 버튼 */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div>리더: {change.leader}</div>
                            <div>등록자: {change.registrant}</div>
                            <div>등록일: {change.registeredDate}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditClick(change)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              수정
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleCancelScheduled(change.id, change.organization)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              취소
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 수정 팝업 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>예정된 조직 변경 수정</DialogTitle>
            <DialogDescription>
              예정된 조직 변경 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* 기본 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">기본 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">팀명 *</Label>
                  <Input
                    id="organization"
                    value={editFormData.organization}
                    onChange={(e) => setEditFormData({ ...editFormData, organization: e.target.value })}
                    placeholder="팀명 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">상위조직 *</Label>
                  <Select
                    value={editFormData.department}
                    onValueChange={(value) => setEditFormData({ ...editFormData, department: value })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="상위조직 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STE1실">STE1실</SelectItem>
                      <SelectItem value="STE2실">STE2실</SelectItem>
                      <SelectItem value="경영전략실">경영전략실</SelectItem>
                      <SelectItem value="개발연구소">개발연구소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">적용 예정일 *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">변경 유형 *</Label>
                  <Select
                    value={editFormData.type}
                    onValueChange={(value) => setEditFormData({ ...editFormData, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="변경 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="신설">신설</SelectItem>
                      <SelectItem value="폐지">폐지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="변경 사유 또는 설명 입력"
                />
              </div>
            </div>

            {/* 구성원 섹션 */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  구성원
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {editMembers.length}명
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedMembers([]);
                      setMemberSearchFilter('');
                      setIsAddMemberDialogOpen(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    추가
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg p-3 bg-accent/20 max-h-48 overflow-y-auto">
                {editMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">구성원이 없습니다</p>
                ) : (
                  <div className="space-y-2">
                    {editMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-background border rounded hover:border-primary/50 transition-colors">
                        <span className="text-sm">
                          {member.name} <span className="text-muted-foreground">({member.position})</span>
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setEditMembers(editMembers.filter((_, i) => i !== idx));
                            toast.success(`${member.name} 구성원이 삭제되었습니다.`);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 연결 프로젝트 섹션 */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FolderKanban className="h-4 w-4" />
                연결 프로젝트
              </h3>
              {editFormData.projectName ? (
                <div className="border rounded-lg p-4 bg-accent/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{editFormData.projectName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{editFormData.projectPeriod}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAddProjectDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      수정
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-20 border-dashed hover:border-primary hover:bg-accent"
                  onClick={() => {
                    setIsAddProjectDialogOpen(true);
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-5 w-5" />
                    <span className="text-sm">프로젝트 추가</span>
                  </div>
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 구성원 추가 팝업 */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>구성원 추가</DialogTitle>
            <DialogDescription>
              {editFormData.organization}에 구성원을 추가합니다. 조직별로 구성원을 선택하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto flex-1 min-h-0">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 직급, 팀으로 검색..."
                className="pl-9"
                value={memberSearchFilter}
                onChange={(e) => setMemberSearchFilter(e.target.value)}
              />
            </div>

            {/* 선택된 구성원 */}
            <div className="p-3 bg-accent/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">선택된 구성원</span>
                <Badge variant="default">{selectedMembers.length}명</Badge>
              </div>
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {selectedMembers.map((memberCode, idx) => {
                    // 임시 구성원 데이터 (조직도 관리와 동일한 데이터 구조)
                    const memberName = memberCode === 'M001' ? '이영희' :
                                      memberCode === 'M002' ? '박민수' :
                                      memberCode === 'M003' ? '최지훈' : '구성원';
                    const memberPos = memberCode === 'M001' ? '책임' :
                                     memberCode === 'M002' ? '선임' : '사원';
                    
                    return (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="gap-1 pr-1"
                      >
                        <span>{memberName}</span>
                        <span className="text-xs text-muted-foreground">({memberPos})</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMembers(prev => prev.filter(m => m !== memberCode));
                          }}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 조직별 구성원 목록 */}
            <div className="border border-border rounded-lg overflow-hidden">
              {/* STE1실 */}
              <div className="border-b border-border">
                <div className="p-3 bg-background border-b border-border sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">STE1실</span>
                    <Badge variant="secondary" className="text-xs">5명</Badge>
                  </div>
                </div>
                
                <div className="divide-y divide-border">
                  {/* LG전자 1팀 */}
                  <div className="border-b border-border">
                    <div className="px-6 py-2 bg-muted/50 flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">LG전자 1팀</span>
                      <Badge variant="outline" className="text-xs">2명</Badge>
                    </div>
                    <div className="divide-y divide-border">
                      {[
                        { code: 'M001', name: '이영희', position: '책임' },
                        { code: 'M002', name: '박민수', position: '선임' },
                      ].map((member) => {
                        const isSelected = selectedMembers.includes(member.code);
                        return (
                          <div
                            key={member.code}
                            className={`p-3 pl-9 flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                              isSelected ? 'bg-accent/70' : ''
                            }`}
                            onClick={() => {
                              setSelectedMembers(prev => 
                                prev.includes(member.code)
                                  ? prev.filter(m => m !== member.code)
                                  : [...prev, member.code]
                              );
                            }}
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-primary border-primary'
                                    : 'border-border'
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-primary-foreground"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{member.name}</span>
                                <Badge variant="outline" className="text-xs">{member.position}</Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* LG전자 2팀 */}
                  <div className="border-b border-border">
                    <div className="px-6 py-2 bg-muted/50 flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">LG전자 2팀</span>
                      <Badge variant="outline" className="text-xs">3명</Badge>
                    </div>
                    <div className="divide-y divide-border">
                      {[
                        { code: 'M003', name: '최지훈', position: '사원' },
                        { code: 'M004', name: '강서연', position: '사원' },
                        { code: 'M005', name: '정수민', position: '선임' },
                      ].map((member) => {
                        const isSelected = selectedMembers.includes(member.code);
                        return (
                          <div
                            key={member.code}
                            className={`p-3 pl-9 flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                              isSelected ? 'bg-accent/70' : ''
                            }`}
                            onClick={() => {
                              setSelectedMembers(prev => 
                                prev.includes(member.code)
                                  ? prev.filter(m => m !== member.code)
                                  : [...prev, member.code]
                              );
                            }}
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-primary border-primary'
                                    : 'border-border'
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3 h-3 text-primary-foreground"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{member.name}</span>
                                <Badge variant="outline" className="text-xs">{member.position}</Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddMemberDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                // 선택된 구성원을 editMembers에 추가
                selectedMembers.forEach(memberCode => {
                  const memberName = memberCode === 'M001' ? '이영희' :
                                    memberCode === 'M002' ? '박민수' :
                                    memberCode === 'M003' ? '최지훈' :
                                    memberCode === 'M004' ? '강서연' :
                                    memberCode === 'M005' ? '정수민' : '구성원';
                  const memberPos = memberCode === 'M001' ? '책임' :
                                   memberCode === 'M002' ? '선임' :
                                   memberCode === 'M005' ? '선임' : '사원';
                  
                  // 중복 체크
                  if (!editMembers.some(m => m.name === memberName)) {
                    setEditMembers(prev => [...prev, { name: memberName, position: memberPos }]);
                  }
                });
                toast.success(`${selectedMembers.length}명의 구성원이 추가되었습니다.`);
                setIsAddMemberDialogOpen(false);
                setSelectedMembers([]);
              }}
              disabled={selectedMembers.length === 0}
            >
              추가 ({selectedMembers.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 추가 팝업 */}
      <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>프로젝트 추가</DialogTitle>
            <DialogDescription>
              {editFormData.organization}에 프로젝트를 추가합니다. 팀에 배정되지 않은 프로젝트를 선택하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto flex-1 min-h-0">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="프로젝트명, 클라이언트, 기간으로 검색..."
                className="pl-9"
                value={memberSearchFilter}
                onChange={(e) => setMemberSearchFilter(e.target.value)}
              />
            </div>

            {/* 선택된 프로젝트 */}
            <div className="p-3 bg-accent/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">선택된 프로젝트</span>
                <Badge variant="default">{selectedProjectCode ? 1 : 0}개</Badge>
              </div>
              {selectedProjectCode && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {allProjects.find(project => project.code === selectedProjectCode) && (
                    <Badge 
                      key={selectedProjectCode} 
                      variant="secondary" 
                      className="gap-1 pr-1"
                    >
                      <span>{allProjects.find(project => project.code === selectedProjectCode)?.name}</span>
                      <span className="text-xs text-muted-foreground">({allProjects.find(project => project.code === selectedProjectCode)?.period})</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectCode('');
                        }}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* 프로젝트 목록 */}
            <div className="border border-border rounded-lg overflow-hidden">
              {/* 팀에 배정되지 않은 프로젝트 */}
              <div className="border-b border-border">
                <div className="p-3 bg-background border-b border-border sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">팀에 배정되지 않은 프로젝트</span>
                    <Badge variant="secondary" className="text-xs">{getUnassignedProjects().length}개</Badge>
                  </div>
                </div>
                
                <div className="divide-y divide-border">
                  {getUnassignedProjects().map((project) => {
                    const isSelected = selectedProjectCode === project.code;
                    return (
                      <div
                        key={project.code}
                        className={`p-3 pl-9 flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                          isSelected ? 'bg-accent/70' : ''
                        }`}
                        onClick={() => {
                          setSelectedProjectCode(prev => 
                            prev === project.code
                              ? ''
                              : project.code
                          );
                        }}
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-primary border-primary'
                                : 'border-border'
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-primary-foreground"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{project.name}</span>
                            <Badge variant="outline" className="text-xs">{project.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{project.period}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddProjectDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                // 선택된 프로젝트를 editFormData에 추가
                if (selectedProjectCode) {
                  const selectedProject = allProjects.find(project => project.code === selectedProjectCode);
                  if (selectedProject) {
                    setEditFormData(prev => ({
                      ...prev,
                      projectName: selectedProject.name,
                      projectPeriod: selectedProject.period,
                    }));
                    toast.success(`${selectedProject.name} 프로젝트가 추가되었습니다.`);
                  }
                }
                setIsAddProjectDialogOpen(false);
                setSelectedProjectCode('');
              }}
              disabled={!selectedProjectCode}
            >
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}