import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, UserPlus, User, Calendar, DollarSign, Building2, Users, X } from 'lucide-react';
import { AssetDetailView } from './AssetDetailView';
import { allAssets, calculateAssetAge, type Asset } from '../data/assetData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface AssignmentHistory {
  id: string;
  userName: string;
  userCode: string;
  department: string;
  team: string;
  startDate: string;
  endDate: string;
  status: '사용중' | '반납완료';
}

interface AssetInquiryProps {
  onAssetClick?: (code: string) => void;
}

export function AssetInquiry({ onAssetClick }: AssetInquiryProps) {
  const [assetTypeFilter, setAssetTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [usagePeriodFilter, setUsagePeriodFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortField, setSortField] = useState<keyof Asset | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [assignStatusFilter, setAssignStatusFilter] = useState('all');
  
  // 사용자 설정 관련 상태
  const [selectedAssetCode, setSelectedAssetCode] = useState<string>('');
  const [isAssetDetailOpen, setIsAssetDetailOpen] = useState(false);
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [selectedOrgDept, setSelectedOrgDept] = useState('STE1실');
  const [selectedOrgTeam, setSelectedOrgTeam] = useState('LG전자 1팀');
  const [selectedUser, setSelectedUser] = useState('');
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split('T')[0]);

  // 부서별 팀 목록
  const teamsByDepartment: { [key: string]: string[] } = {
    'STE1실': ['LG전자 1팀', 'LG전자 2팀', 'LG전자 4팀'],
    'STE2실': ['GS리테일 1팀', 'HDC랩스 1팀', 'KT 알파1팀'],
    '경영전략실': ['경영지원팀', '사업전략팀'],
    '개발연구소': ['개발연구소', '자동화개발팀'],
    'STE그룹': ['STE그룹']
  };

  // 팀별 구성원 목록
  const membersByTeam: { [key: string]: string[] } = {
    'LG전자 1팀': ['전광희', '정홍근'],
    'LG전자 2팀': ['이길원', '이성미', '조혜진', '이나리'],
    'LG전자 4팀': ['박준수', '용상수', '김규현'],
    'GS리테일 1팀': ['조현균', '조현정', '최현준', '강성희', '강문혁'],
    'HDC랩스 1팀': ['장대열'],
    'KT 알파1팀': ['윤제진', '신진욱', '이영택'],
    '경영지원팀': ['김완수', '이현직', '김예림', '가라현', '신소영'],
    '사업전략팀': ['이라', '주호정', '김연서'],
    '자동화개발팀': ['김준하', '이유나', '유정선', '손진빈', '유예진']
  };

  // 부서별 직속 인원
  const directMembersByDepartment: { [key: string]: string[] } = {
    'STE1실': ['강현규'],
    'STE2실': [],
    '경영전략실': [],
    '개발연구소': ['김태영', '이혜진', '우은순', '김지연', '추경운'],
    'STE그룹': ['박성호', '김종협']
  };

  // 할당 이력 (자산 데이터에서 담당자 정보로 자동 생성)
  const [assignmentHistory, setAssignmentHistory] = useState<{ [key: string]: AssignmentHistory[] }>(() => {
    const history: { [key: string]: AssignmentHistory[] } = {};
    
    allAssets.forEach((asset, index) => {
      if (asset.status === '사용중' && asset.assignee && asset.assignee !== '-') {
        let foundDept = '';
        let foundTeam = '';
        
        // 팀에서 찾기
        for (const [team, members] of Object.entries(membersByTeam)) {
          if (members.includes(asset.assignee)) {
            foundTeam = team;
            // 팀으로부터 부서 찾기
            for (const [dept, teams] of Object.entries(teamsByDepartment)) {
              if (teams.includes(team)) {
                foundDept = dept;
                break;
              }
            }
            break;
          }
        }
        
        // 부서 직속에서 찾기
        if (!foundDept) {
          for (const [dept, members] of Object.entries(directMembersByDepartment)) {
            if (members.includes(asset.assignee)) {
              foundDept = dept;
              foundTeam = '';
              break;
            }
          }
        }
        
        // 할당 이력 생성 (구매일 이후 랜덤 날짜)
        const [year, month, day] = asset.purchaseDate.split('.').map(Number);
        const purchaseDate = new Date(year, month - 1, day);
        const daysAfterPurchase = Math.floor(Math.random() * 30);
        const assignDate = new Date(purchaseDate);
        assignDate.setDate(assignDate.getDate() + daysAfterPurchase);
        
        history[asset.assetCode] = [{
          id: `AH-${String(index + 1).padStart(4, '0')}`,
          userName: asset.assignee,
          userCode: `E${String(index + 1).padStart(3, '0')}`,
          department: foundDept || asset.department,
          team: foundTeam || asset.team,
          startDate: `${assignDate.getFullYear()}.${String(assignDate.getMonth() + 1).padStart(2, '0')}.${String(assignDate.getDate()).padStart(2, '0')}`,
          endDate: '-',
          status: '사용중'
        }];
      }
    });
    
    return history;
  });

  // 조직도 팀 목록
  const availableOrgTeams = teamsByDepartment[selectedOrgDept] || [];

  // 조직도 구성원 목록
  const availableOrgMembers = useMemo(() => {
    if (selectedOrgTeam === '-' || selectedOrgTeam === '') {
      return directMembersByDepartment[selectedOrgDept] || [];
    }
    return membersByTeam[selectedOrgTeam] || [];
  }, [selectedOrgTeam, selectedOrgDept]);

  // 선택된 부서의 팀 목록
  const availableTeams = deptFilter !== 'all' ? teamsByDepartment[deptFilter] || [] : [];

  // 부서 변경 시 팀 필터 초기화
  const handleDeptChange = (value: string) => {
    setDeptFilter(value);
    setTeamFilter('all');
  };

  // 필터링된 자산 목록
  const filteredAssets = useMemo(() => {
    return allAssets.filter(asset => {
      const matchType = assetTypeFilter === 'all' || asset.assetType === assetTypeFilter;
      const matchStatus = statusFilter === 'all' || asset.status === statusFilter;
      const matchDept = deptFilter === 'all' || asset.department === deptFilter;
      const matchTeam = teamFilter === 'all' || asset.team === teamFilter;
      
      // 사용기간 필터 (구매일 기준)
      let matchUsagePeriod = true;
      if (usagePeriodFilter !== 'all') {
        const [year, month, day] = asset.purchaseDate.split('.').map(Number);
        const purchaseDate = new Date(year, month - 1, day);
        const currentDate = new Date(2026, 0, 6); // 오늘 날짜: 2026년 1월 6일
        const daysDiff = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
        const yearsDiff = daysDiff / 365;
        
        if (usagePeriodFilter === 'new') {
          matchUsagePeriod = daysDiff < 30; // 1개월 미만
        } else if (usagePeriodFilter === 'under1') {
          matchUsagePeriod = yearsDiff < 1;
        } else if (usagePeriodFilter === '1to2') {
          matchUsagePeriod = yearsDiff >= 1 && yearsDiff < 2;
        } else if (usagePeriodFilter === '2to3') {
          matchUsagePeriod = yearsDiff >= 2 && yearsDiff < 3;
        } else if (usagePeriodFilter === 'over3') {
          matchUsagePeriod = yearsDiff >= 3;
        }
      }
      
      // 할당 상태 매칭
      let matchAssignStatus = true;
      if (assignStatusFilter !== 'all') {
        const assetHistory = assignmentHistory[asset.assetCode] || [];
        const assignedUser = assetHistory.find(h => h.status === '사용중');
        
        if (assignStatusFilter === 'assigned' && !assignedUser) {
          matchAssignStatus = false;
        } else if (assignStatusFilter === 'unassigned' && assignedUser) {
          matchAssignStatus = false;
        }
      }
      
      const matchSearch = searchKeyword === '' || 
        asset.assetCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        asset.assetName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        asset.assignee.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        asset.manufacturer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchKeyword.toLowerCase());
      
      return matchType && matchStatus && matchDept && matchTeam && matchUsagePeriod && matchAssignStatus && matchSearch;
    });
  }, [assetTypeFilter, statusFilter, deptFilter, teamFilter, usagePeriodFilter, assignStatusFilter, searchKeyword, assignmentHistory]);

  // 정렬된 자산 목록
  const sortedAssets = useMemo(() => {
    if (!sortField) return filteredAssets;

    const sorted = [...filteredAssets].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // 날짜 정렬의 경우 Date 객체로 변환
      if (sortField === 'purchaseDate') {
        const [aYear, aMonth, aDay] = aValue.toString().split('.').map(Number);
        const [bYear, bMonth, bDay] = bValue.toString().split('.').map(Number);
        aValue = new Date(aYear, aMonth - 1, aDay).getTime();
        bValue = new Date(bYear, bMonth - 1, bDay).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredAssets, sortField, sortDirection]);

  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      // 같은 필드를 클릭하면 방향 전환
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드를 클릭하면 해당 필드로 오름차순 정렬
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Asset) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const handleReset = () => {
    setAssetTypeFilter('all');
    setStatusFilter('all');
    setDeptFilter('all');
    setTeamFilter('all');
    setUsagePeriodFilter('all');
    setSearchKeyword('');
    setSortField(null);
    setSortDirection('asc');
    setAssignStatusFilter('all');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '사용중':
        return <Badge className="bg-green-500">{status}</Badge>;
      case '가용':
        return <Badge className="bg-blue-500">{status}</Badge>;
      case '수리중':
        return <Badge className="bg-orange-500">{status}</Badge>;
      case '폐기예정':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAgeBadge = (purchaseDate: string) => {
    const age = calculateAssetAge(purchaseDate);
    if (age >= 3) {
      return <Badge variant="destructive">노후</Badge>;
    } else if (age >= 2) {
      return <Badge variant="secondary">2년+</Badge>;
    }
    return null;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0
    }).format(value);
  };

  const getAssignmentStatusBadge = (status: '사용중' | '반납완료') => {
    return status === '사용중' 
      ? <Badge className="bg-green-500">{status}</Badge>
      : <Badge variant="secondary">{status}</Badge>;
  };

  // 선택된 자산
  const selectedAsset = useMemo(() => {
    return allAssets.find(asset => asset.assetCode === selectedAssetCode);
  }, [selectedAssetCode]);

  // 선택된 자산의 할당 이력
  const currentHistory = selectedAssetCode ? (assignmentHistory[selectedAssetCode] || []) : [];

  // 현재 사용자
  const currentUser = currentHistory.find(h => h.status === '사용중');

  const handleOrgDeptChange = (value: string) => {
    setSelectedOrgDept(value);
    const teams = teamsByDepartment[value] || [];
    const firstTeam = teams.length > 0 ? teams[0] : '-';
    setSelectedOrgTeam(firstTeam);
    
    const members = firstTeam !== '-' 
      ? membersByTeam[firstTeam] || [] 
      : directMembersByDepartment[value] || [];
    setSelectedUser(members.length > 0 ? members[0] : '');
  };

  const handleOrgTeamChange = (value: string) => {
    setSelectedOrgTeam(value);
    
    const members = value !== '-' 
      ? membersByTeam[value] || [] 
      : directMembersByDepartment[selectedOrgDept] || [];
    setSelectedUser(members.length > 0 ? members[0] : '');
  };

  const handleOpenOrgDialog = () => {
    setIsOrgDialogOpen(true);
    setSelectedOrgDept('STE1실');
    setSelectedOrgTeam('LG전자 1팀');
    setSelectedUser('전광희');
    setAssignDate(new Date().toISOString().split('T')[0]);
  };

  const handleAssignUser = () => {
    if (!selectedAssetCode) {
      toast.error('자산을 선택해주세요');
      return;
    }

    if (!selectedUser) {
      toast.error('사용자를 선택해주세요');
      return;
    }

    if (!assignDate) {
      toast.error('할당일을 입력해주세요');
      return;
    }

    // 기존 사용중인 이력을 반납완료로 변경
    const updatedHistory = [...currentHistory];
    const currentIndex = updatedHistory.findIndex(h => h.status === '사용중');
    if (currentIndex !== -1) {
      updatedHistory[currentIndex] = {
        ...updatedHistory[currentIndex],
        endDate: assignDate.split('-').join('.'),
        status: '반납완료'
      };
    }

    // 새 할당 이력 추가
    const newHistory: AssignmentHistory = {
      id: `AH-${String(currentHistory.length + 1).padStart(3, '0')}`,
      userName: selectedUser,
      userCode: `E${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      department: selectedOrgDept,
      team: selectedOrgTeam !== '-' ? selectedOrgTeam : '',
      startDate: assignDate.split('-').join('.'),
      endDate: '-',
      status: '사용중'
    };

    updatedHistory.push(newHistory);

    setAssignmentHistory({
      ...assignmentHistory,
      [selectedAssetCode]: updatedHistory
    });

    setIsOrgDialogOpen(false);
    toast.success(`${selectedAsset?.assetName}을(를) ${selectedUser}에게 할당했습니다`);
  };

  const handleReturnAsset = () => {
    if (!selectedAssetCode || !currentUser) {
      return;
    }

    const returnDate = new Date().toISOString().split('T')[0].split('-').join('.');
    
    const updatedHistory = currentHistory.map(h => {
      if (h.status === '사용중') {
        return {
          ...h,
          endDate: returnDate,
          status: '반납완료' as const
        };
      }
      return h;
    });

    setAssignmentHistory({
      ...assignmentHistory,
      [selectedAssetCode]: updatedHistory
    });

    toast.success(`${selectedAsset?.assetName}이(가) 반납되었습니다`);
  };

  const handleOpenAssetDetail = (assetCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAssetCode(assetCode);
    setIsAssetDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1>상세조회</h1>
        <p className="text-muted-foreground mt-1">전체 자산 정보를 조회하고 검색할 수 있습니다</p>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 및 필터</CardTitle>
          <CardDescription>자산 유형, 상태, 부서로 필터링하거나 키워드로 검색하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 자산 유형 필터 */}
            <div className="space-y-2">
              <label className="text-sm">자산 유형</label>
              <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="노트북">노트북</SelectItem>
                  <SelectItem value="데스크탑">데스크탑</SelectItem>
                  <SelectItem value="모니터">모니터</SelectItem>
                  <SelectItem value="키보드/마우스">키보드/마우스</SelectItem>
                  <SelectItem value="휴대폰">휴대폰</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 상태 필터 */}
            <div className="space-y-2">
              <label className="text-sm">상태</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="사용중">사용중</SelectItem>
                  <SelectItem value="가용">가용</SelectItem>
                  <SelectItem value="수리중">수리중</SelectItem>
                  <SelectItem value="폐기예정">폐기예정</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 부서 필터 */}
            <div className="space-y-2">
              <label className="text-sm">부서</label>
              <Select value={deptFilter} onValueChange={handleDeptChange}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="STE1실">STE1실</SelectItem>
                  <SelectItem value="STE2실">STE2실</SelectItem>
                  <SelectItem value="경영전략실">경영전략실</SelectItem>
                  <SelectItem value="개발연구소">개발연구소</SelectItem>
                  <SelectItem value="STE그룹">STE그룹</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 팀 필터 */}
            <div className="space-y-2">
              <label className="text-sm">팀</label>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {availableTeams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 사용기간 필터 */}
            <div className="space-y-2">
              <label className="text-sm">사용기간</label>
              <Select value={usagePeriodFilter} onValueChange={setUsagePeriodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="new">1개월 미만</SelectItem>
                  <SelectItem value="under1">1년 미만</SelectItem>
                  <SelectItem value="1to2">1년 ~ 2년</SelectItem>
                  <SelectItem value="2to3">2년 ~ 3년</SelectItem>
                  <SelectItem value="over3">3년 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 할당 상태 필터 */}
            <div className="space-y-2">
              <label className="text-sm">할당 상태</label>
              <Select value={assignStatusFilter} onValueChange={setAssignStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="assigned">할당됨</SelectItem>
                  <SelectItem value="unassigned">미할당</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 검색 */}
            <div className="space-y-2">
              <label className="text-sm">키워드 검색</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="자산코드, 이름, 담당자 등"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              필터 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 자산 목록 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>자산 목록</CardTitle>
          <CardDescription>총 {filteredAssets.length}개의 자산</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('assetName')}
                  >
                    자산명 {sortField === 'assetName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('assetType')}
                  >
                    유형 {sortField === 'assetType' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('manufacturer')}
                  >
                    제조사 {sortField === 'manufacturer' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('status')}
                  >
                    상태 {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('department')}
                  >
                    부서 {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('assignee')}
                  >
                    담당자 {sortField === 'assignee' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('purchaseDate')}
                  >
                    구매일 {sortField === 'purchaseDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-center p-3 bg-accent/50 whitespace-nowrap">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      검색 결과가 없습니다
                    </td>
                  </tr>
                ) : (
                  sortedAssets.map((asset) => (
                    <tr 
                      key={asset.assetCode} 
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onAssetClick?.(asset.assetCode)}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {asset.assetName}
                          {getAgeBadge(asset.purchaseDate)}
                        </div>
                      </td>
                      <td className="p-3">{asset.assetType}</td>
                      <td className="p-3">{asset.manufacturer}</td>
                      <td className="p-3">{getStatusBadge(asset.status)}</td>
                      <td className="p-3">{asset.department}</td>
                      <td className="p-3">{asset.assignee}</td>
                      <td className="p-3">{asset.purchaseDate}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => handleOpenAssetDetail(asset.assetCode, e)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            설정
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 자산 상세 팝업 */}
      <Dialog open={isAssetDetailOpen} onOpenChange={setIsAssetDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>자산 상세 정보 및 사용자 설정</DialogTitle>
            <DialogDescription>
              {selectedAsset?.assetCode} - {selectedAsset?.assetName}
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-6 py-4">
              {/* 자산 정보 */}
              <div className="space-y-4">
                <h3 className="font-semibold">자산 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">자산명</label>
                    <div className="flex items-center gap-2">
                      <span>{selectedAsset.assetName}</span>
                      {getStatusBadge(selectedAsset.status)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">유형</label>
                    <div>{selectedAsset.assetType}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">제조사</label>
                    <div>{selectedAsset.manufacturer}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">모델명</label>
                    <div>{selectedAsset.model}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">구매일</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {selectedAsset.purchaseDate}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">취득가액</label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {formatCurrency(selectedAsset.purchasePrice)}원
                    </div>
                  </div>
                </div>
              </div>

              {/* 현재 사용자 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">현재 사용자</h3>
                  <div className="flex gap-2">
                    {currentUser && (
                      <Button variant="outline" size="sm" onClick={handleReturnAsset}>
                        <X className="h-4 w-4 mr-2" />
                        반납
                      </Button>
                    )}
                    <Button size="sm" onClick={handleOpenOrgDialog}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      사용자 할당
                    </Button>
                  </div>
                </div>

                {currentUser ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">사용자</label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{currentUser.userName}</span>
                        <Badge variant="outline">{currentUser.userCode}</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">소속</label>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {currentUser.department} {currentUser.team && `· ${currentUser.team}`}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">할당일</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {currentUser.startDate}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">상태</label>
                      <div>{getAssignmentStatusBadge(currentUser.status)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8 border rounded-lg bg-muted/30">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>할당된 사용자가 없습니다</p>
                    <p className="text-sm mt-2">사용자 할당 버튼을 눌러 담당자를 지정하세요</p>
                  </div>
                )}
              </div>

              {/* 할당 이력 */}
              <div className="space-y-4">
                <h3 className="font-semibold">할당 이력 ({currentHistory.length}건)</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="text-left p-3">사용자</th>
                        <th className="text-left p-3">소속</th>
                        <th className="text-left p-3">할당일</th>
                        <th className="text-left p-3">반납일</th>
                        <th className="text-left p-3">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center p-8 text-muted-foreground">
                            할당 이력이 없습니다
                          </td>
                        </tr>
                      ) : (
                        [...currentHistory].reverse().map((history) => (
                          <tr key={history.id} className="border-b last:border-0">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {history.userName}
                                <Badge variant="outline" className="text-xs">
                                  {history.userCode}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-3">
                              {history.department} {history.team && `· ${history.team}`}
                            </td>
                            <td className="p-3">{history.startDate}</td>
                            <td className="p-3">{history.endDate}</td>
                            <td className="p-3">{getAssignmentStatusBadge(history.status)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 조직도 선택 Dialog */}
      <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>사용자 할당</DialogTitle>
            <DialogDescription>
              자산을 할당할 사용자를 선택하세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 부서 선택 */}
            <div className="space-y-2">
              <label className="text-sm">부서 *</label>
              <Select value={selectedOrgDept} onValueChange={handleOrgDeptChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STE1실">STE1실</SelectItem>
                  <SelectItem value="STE2실">STE2실</SelectItem>
                  <SelectItem value="경영전략실">경영전략실</SelectItem>
                  <SelectItem value="개발연구소">개발연구소</SelectItem>
                  <SelectItem value="STE그룹">STE그룹</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 팀 선택 */}
            <div className="space-y-2">
              <label className="text-sm">팀</label>
              <Select value={selectedOrgTeam} onValueChange={handleOrgTeamChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableOrgTeams.length === 0 ? (
                    <SelectItem value="-">직속</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="-">직속</SelectItem>
                      {availableOrgTeams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 사용자 선택 */}
            <div className="space-y-2">
              <label className="text-sm">사용자 *</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableOrgMembers.map(member => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 할당일 */}
            <div className="space-y-2">
              <label className="text-sm">할당일 *</label>
              <Input
                type="date"
                value={assignDate}
                onChange={(e) => setAssignDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOrgDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAssignUser}>
              할당
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}