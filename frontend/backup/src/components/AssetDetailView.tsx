import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Package,
  History,
  Wrench,
  Info,
  Plus
} from 'lucide-react';
import { getAssetByCode, type Asset } from '../data/assetData';

interface AssetDetailViewProps {
  assetCode: string;
  onBack: () => void;
}

interface UsageHistory {
  id: string;
  date: string;
  type: string; // '배정', '회수', '이동'
  fromDept?: string;
  fromAssignee?: string;
  toDept: string;
  toAssignee: string;
  note: string;
}

interface MaintenanceHistory {
  id: string;
  date: string;
  type: string; // '수리', '점검', '교체'
  status: string; // '완료', '진행중', '대기'
  description: string;
  cost: number;
  vendor: string;
  note: string;
}

export function AssetDetailView({ assetCode, onBack }: AssetDetailViewProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUsageDialogOpen, setIsUsageDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);

  // 기본 정보 - 초기값 설정 (먼저 선언)
  const initialAsset: Asset = {
    assetCode: assetCode,
    assetName: '로딩중...',
    assetType: '노트북',
    manufacturer: '',
    model: '',
    serialNumber: '',
    specifications: '',
    purchaseDate: '2023.05.15',
    purchasePrice: 0,
    status: '사용중',
    department: 'STE1실',
    team: 'LG전자 1팀',
    assignee: '',
    location: '본사 3층 개발실',
    warrantyPeriod: '2026.05.14',
    assetNumber: '',
    note: ''
  };

  const [assetData, setAssetData] = useState<Asset>(initialAsset);

  // 새 사용이력 폼 데이터 (assetData 다음에 선언)
  const [newUsage, setNewUsage] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '배정',
    fromDept: '',
    fromTeam: '',
    fromAssignee: '',
    toDept: '',
    toTeam: '',
    toAssignee: '',
    note: ''
  });

  // 새 유지보수이력 폼 데이터 (assetData 다음에 선언)
  const [newMaintenance, setNewMaintenance] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '수리',
    status: '완료',
    description: '',
    cost: 0,
    vendor: '',
    note: ''
  });

  // 사용 이력
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([
    {
      id: 'UH-001',
      date: '2025.01.15',
      type: '이동',
      fromDept: 'STE2실',
      fromAssignee: '조현균',
      toDept: 'STE1실',
      toAssignee: '강현규',
      note: '팀 이동에 따른 자산 이전'
    },
    {
      id: 'UH-002',
      date: '2024.03.10',
      type: '배정',
      toDept: 'STE2실',
      toAssignee: '조현균',
      note: '신규 배정'
    },
    {
      id: 'UH-003',
      date: '2023.05.15',
      type: '배정',
      toDept: 'STE1실',
      toAssignee: '전광희',
      note: '초기 배정'
    }
  ]);

  // 유지보수 이력
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceHistory[]>([
    {
      id: 'MH-001',
      date: '2024.11.20',
      type: '수리',
      status: '완료',
      description: '키보드 일부 키 작동 불량 수리',
      cost: 85000,
      vendor: '삼성전자 A/S센터',
      note: '보증 기간 내 무상 수리'
    },
    {
      id: 'MH-002',
      date: '2024.06.10',
      type: '점검',
      status: '완료',
      description: '정기 점검 및 청소',
      cost: 0,
      vendor: '자체',
      note: '이상 없음'
    },
    {
      id: 'MH-003',
      date: '2024.01.05',
      type: '수리',
      status: '완료',
      description: '배터리 교체',
      cost: 120000,
      vendor: '삼성전자 A/S센터',
      note: '배터리 팽창으로 교체'
    }
  ]);

  useEffect(() => {
    const fetchAssetData = async () => {
      const asset = await getAssetByCode(assetCode);
      if (asset) {
        setAssetData(asset);
      }
    };
    fetchAssetData();
  }, [assetCode]);

  // 부서별 팀 목록
  const teamsByDepartment: { [key: string]: string[] } = {
    'STE1실': ['LG전자 1팀', 'LG전자 2팀', 'LG전자 4팀'],
    'STE2실': ['GS리테일 1팀', 'HDC랩스 1팀', 'KT 알파1팀'],
    '경영전략실': ['경영지원팀', '사업전략팀'],
    '개발연구소': ['자동화개발팀'],
    'STE그룹': []
  };

  // 부서별 직속 인원 (팀이 없을 때 선택 가능한 인원)
  const directMembersByDepartment: { [key: string]: string[] } = {
    'STE1실': ['강현규'], // 이사
    'STE2실': [], // 직속 인원 없음
    '경영전략실': [], // 팀으로만 구성
    '개발연구소': ['김태영', '이혜진', '우은순', '김지연', '추경운'], // 부사장, 이사, 팀장, 사원들
    'STE그룹': ['박성호', '김종협'] // 사장, 실장
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
    '사업전략팀': ['이유라', '주호정', '김연서'],
    '자동화개발팀': ['김준하', '이유나', '유정선', '손진빈', '유예진']
  };

  // 선택된 부서의 팀 목록
  const availableTeams = teamsByDepartment[assetData.department] || [];

  // 선택된 팀의 구성원 목록
  const availableMembers = assetData.team && assetData.team !== '-' 
    ? membersByTeam[assetData.team] || [] 
    : [];

  // 사용이력 추가 모달 - 현재 부서에 따른 팀 목록
  const newUsageAvailableTeams = teamsByDepartment[newUsage.toDept] || [];

  // 사용이력 추가 모달 - 현재 팀에 따른 담당자 목록
  const newUsageAvailableMembers = newUsage.toTeam && newUsage.toTeam !== '-'
    ? membersByTeam[newUsage.toTeam] || []
    : directMembersByDepartment[newUsage.toDept] || []; // 팀이 없으면 부서 직속 인원 표시

  // 부서 변경 시 팀 초기화
  const handleDepartmentChange = (value: string) => {
    const newTeams = teamsByDepartment[value] || [];
    const newTeam = newTeams.length > 0 ? newTeams[0] : '-';
    const newMembers = newTeam !== '-' ? membersByTeam[newTeam] || [] : [];
    
    setAssetData({ 
      ...assetData, 
      department: value,
      team: newTeam,
      assignee: newMembers.length > 0 ? newMembers[0] : '' // 첫 번째 구성원으로 자동 설정
    });
  };

  // 팀 변경 시 담당자 초기화
  const handleTeamChange = (value: string) => {
    const newMembers = value !== '-' ? membersByTeam[value] || [] : [];
    
    setAssetData({
      ...assetData,
      team: value,
      assignee: newMembers.length > 0 ? newMembers[0] : '' // 첫 번째 구성원으로 자동 설정
    });
  };

  const handleSave = () => {
    setIsEditMode(false);
    // 실제로는 여기서 서버에 데이터 저장
    alert('자산 정보가 저장되었습니다.');
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // 실제로는 원래 데이터로 복원
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '사용중':
        return <Badge className="bg-green-500">{status}</Badge>;
      case '가용':
        return <Badge className="bg-blue-500">{status}</Badge>;
      case '수리중':
        return <Badge className="bg-orange-500">{status}</Badge>;
      case '폐기예':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case '완료':
        return <Badge className="bg-green-500">{status}</Badge>;
      case '진행중':
        return <Badge className="bg-blue-500">{status}</Badge>;
      case '대기':
        return <Badge className="bg-gray-500">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUsageTypeBadge = (type: string) => {
    switch (type) {
      case '배정':
        return <Badge className="bg-blue-500">{type}</Badge>;
      case '회수':
        return <Badge className="bg-gray-500">{type}</Badge>;
      case '이동':
        return <Badge className="bg-orange-500">{type}</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateAssetAge = (purchaseDateStr: string): number => {
    const [year, month, day] = purchaseDateStr.split('.').map(Number);
    const purchaseDate = new Date(year, month - 1, day);
    const currentDate = new Date(2025, 11, 26);
    const ageInYears = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(ageInYears * 10) / 10; // 소수점 첫째 자리까지
  };

  const inputClassName = (value: string | number) => {
    if (!isEditMode) return "bg-gray-100";
    // 편집 모드일 때는 모든 수정 가능한 필드를 노란색으로 표시
    return "bg-yellow-100 border-yellow-300";
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1>자산 상세 정보</h1>
            <p className="text-muted-foreground mt-1">
              {assetData.assetCode} · {assetData.assetName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditMode ? (
            <Button onClick={() => setIsEditMode(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              편집
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">
            <Info className="h-4 w-4 mr-2" />
            기본정보
          </TabsTrigger>
          <TabsTrigger value="status">
            <Package className="h-4 w-4 mr-2" />
            상태정보
          </TabsTrigger>
          <TabsTrigger value="usage">
            <History className="h-4 w-4 mr-2" />
            사용이력
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="h-4 w-4 mr-2" />
            유지보수이력
          </TabsTrigger>
        </TabsList>

        {/* 기본정보 탭 */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>자산 기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">자산코드 *</label>
                  <Input
                    value={assetData.assetCode}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">자산명 *</label>
                  <Input
                    value={assetData.assetName}
                    onChange={(e) => setAssetData({ ...assetData, assetName: e.target.value })}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">자산 유형 *</label>
                  <Select 
                    value={assetData.assetType}
                    onValueChange={(value) => setAssetData({ ...assetData, assetType: value })}
                    disabled
                  >
                    <SelectTrigger className="bg-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="노트북">노트북</SelectItem>
                      <SelectItem value="데스크탑">데스크탑</SelectItem>
                      <SelectItem value="모니터">모니터</SelectItem>
                      <SelectItem value="키보드/마우스">키보드/마우스</SelectItem>
                      <SelectItem value="휴대폰">휴대폰</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">제조사 *</label>
                  <Input
                    value={assetData.manufacturer}
                    onChange={(e) => setAssetData({ ...assetData, manufacturer: e.target.value })}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">모델명</label>
                  <Input
                    value={assetData.model}
                    onChange={(e) => setAssetData({ ...assetData, model: e.target.value })}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">시리얼번호 *</label>
                  <Input
                    value={assetData.serialNumber}
                    onChange={(e) => setAssetData({ ...assetData, serialNumber: e.target.value })}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">사양</label>
                  <Input
                    value={assetData.specifications}
                    onChange={(e) => setAssetData({ ...assetData, specifications: e.target.value })}
                    disabled={!isEditMode}
                    className={inputClassName(assetData.specifications)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">구매일 *</label>
                  <Input
                    type="date"
                    value={assetData.purchaseDate.split('.').join('-')}
                    onChange={(e) => setAssetData({ ...newAsset, purchaseDate: e.target.value.split('-').join('.') })}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">취득가액 *</label>
                  <Input
                    type="number"
                    value={assetData.purchasePrice}
                    onChange={(e) => setAssetData({ ...assetData, purchasePrice: Number(e.target.value) })}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">보증기간</label>
                  <Input
                    type="date"
                    value={assetData.warrantyPeriod.split('.').join('-')}
                    onChange={(e) => setAssetData({ ...assetData, warrantyPeriod: e.target.value.split('-').join('.') })}
                    disabled={!isEditMode}
                    className={inputClassName(assetData.warrantyPeriod)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">사용 기간</label>
                  <Input
                    value={`${calculateAssetAge(assetData.purchaseDate)}년`}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">비고</label>
                <Textarea
                  value={assetData.note}
                  onChange={(e) => setAssetData({ ...assetData, note: e.target.value })}
                  disabled={!isEditMode}
                  className={inputClassName(assetData.note)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 상태정보 탭 */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>현재 상태 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">상태 *</label>
                  <Select 
                    value={assetData.status}
                    onValueChange={(value) => setAssetData({ ...assetData, status: value })}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger className={inputClassName(assetData.status)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사용중">사용중</SelectItem>
                      <SelectItem value="가용">가용</SelectItem>
                      <SelectItem value="수리중">수리중</SelectItem>
                      <SelectItem value="폐기예정">폐기예정</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">상태 표시</label>
                  <div className="p-2 border rounded-md bg-gray-100">
                    {getStatusBadge(assetData.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">소속 부서 *</label>
                  <Select 
                    value={assetData.department}
                    onValueChange={handleDepartmentChange}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger className={inputClassName(assetData.department)}>
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

                <div className="space-y-2">
                  <label className="text-sm">소속 팀</label>
                  <Select 
                    value={assetData.team}
                    onValueChange={handleTeamChange}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger className={inputClassName(assetData.team)}>
                      <SelectValue placeholder="팀 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">없음</SelectItem>
                      {availableTeams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">현재 담당자</label>
                  <Select 
                    value={assetData.assignee}
                    onValueChange={(value) => setAssetData({ ...assetData, assignee: value })}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger className={inputClassName(assetData.assignee)}>
                      <SelectValue placeholder="담당자 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">없음</SelectItem>
                      {availableMembers.map(member => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">위치</label>
                  <Input
                    value={assetData.location}
                    onChange={(e) => setAssetData({ ...assetData, location: e.target.value })}
                    disabled={!isEditMode}
                    className={inputClassName(assetData.location)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 사용이력 탭 */}
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>사용 이력</CardTitle>
              {isEditMode && (
                <Button size="sm" onClick={() => {
                  // 모달 열 때 최신 사용이력 정보로 초기화
                  const latestHistory = usageHistory.length > 0 ? usageHistory[0] : null;
                  
                  setNewUsage({
                    date: new Date().toISOString().split('T')[0],
                    type: '배정',
                    // 최신 이력이 있으면 그것의 "현재 정보"가 이번 이력의 "이전 정보"가 됨
                    fromDept: latestHistory ? latestHistory.toDept : assetData.department,
                    fromTeam: latestHistory ? (latestHistory.toDept === assetData.department ? assetData.team : '') : assetData.team,
                    fromAssignee: latestHistory ? latestHistory.toAssignee : assetData.assignee,
                    toDept: '',
                    toTeam: '',
                    toAssignee: '',
                    note: ''
                  });
                  setIsUsageDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  이력 추가
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">일자</th>
                      <th className="text-left p-3">유형</th>
                      <th className="text-left p-3">이전 부서/담당자</th>
                      <th className="text-left p-3">현재 부서/담당자</th>
                      <th className="text-left p-3">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageHistory.map((history) => (
                      <tr key={history.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">{history.date}</td>
                        <td className="p-3">{getUsageTypeBadge(history.type)}</td>
                        <td className="p-3">
                          {history.fromDept && history.fromAssignee 
                            ? `${history.fromDept} / ${history.fromAssignee}`
                            : '-'}
                        </td>
                        <td className="p-3">{history.toDept} / {history.toAssignee}</td>
                        <td className="p-3">{history.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 유지보수이력 탭 */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>유지보수 이력</CardTitle>
              {isEditMode && (
                <Button size="sm" onClick={() => {
                  // 모달 열 때 최신 유지보수이력 정보로 초기화
                  const latestHistory = maintenanceHistory.length > 0 ? maintenanceHistory[0] : null;
                  
                  setNewMaintenance({
                    date: new Date().toISOString().split('T')[0],
                    type: '수리',
                    status: '완료',
                    description: '',
                    cost: 0,
                    vendor: '',
                    note: ''
                  });
                  setIsMaintenanceDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  이력 추가
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">일자</th>
                      <th className="text-left p-3">유형</th>
                      <th className="text-left p-3">상태</th>
                      <th className="text-left p-3">내용</th>
                      <th className="text-right p-3">비용</th>
                      <th className="text-left p-3">업체</th>
                      <th className="text-left p-3">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceHistory.map((history) => (
                      <tr key={history.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">{history.date}</td>
                        <td className="p-3">
                          <Badge variant="outline">{history.type}</Badge>
                        </td>
                        <td className="p-3">{getMaintenanceStatusBadge(history.status)}</td>
                        <td className="p-3">{history.description}</td>
                        <td className="p-3 text-right">
                          {history.cost === 0 ? '-' : `${formatCurrency(history.cost)}`}
                        </td>
                        <td className="p-3">{history.vendor}</td>
                        <td className="p-3">{history.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 유지보수 통계 */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">총 유지보수 건수</div>
                    <div className="text-2xl font-bold">{maintenanceHistory.length}건</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">총 유지보수 비용</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(maintenanceHistory.reduce((sum, h) => sum + h.cost, 0))}원
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">최근 유지보수</div>
                    <div className="text-2xl font-bold">
                      {maintenanceHistory[0]?.date || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 사용이력 추가 다이얼로그 */}
      <Dialog open={isUsageDialogOpen} onOpenChange={setIsUsageDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>사용 이력 추가</DialogTitle>
            <DialogDescription>
              새로운 사용 이력을 추가하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm">일자</label>
              <Input
                type="date"
                value={newUsage.date}
                onChange={(e) => setNewUsage({ ...newUsage, date: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">유형</label>
              <Select
                value={newUsage.type}
                onValueChange={(value) => setNewUsage({ ...newUsage, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="배정">배정</SelectItem>
                  <SelectItem value="회수">회수</SelectItem>
                  <SelectItem value="이동">이동</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">이전 정보</h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm">이전 부서</label>
                  <Input
                    value={newUsage.fromDept}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">이전 팀</label>
                  <Input
                    value={newUsage.fromTeam}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">이전 담당자</label>
                  <Input
                    value={newUsage.fromAssignee}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">현재 정보</h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm">현재 부서</label>
                  <Select
                    value={newUsage.toDept}
                    onValueChange={(value) => {
                      // 부서 변경 시 해당 부서의 첫 번째 팀과 첫 번째 담당자 자동 선택
                      const teams = teamsByDepartment[value] || [];
                      const firstTeam = teams.length > 0 ? teams[0] : '';
                      const members = firstTeam ? membersByTeam[firstTeam] || [] : [];
                      setNewUsage({ 
                        ...newUsage, 
                        toDept: value,
                        toTeam: firstTeam,
                        toAssignee: members.length > 0 ? members[0] : ''
                      });
                    }}
                    disabled={newUsage.type === '회수'}
                  >
                    <SelectTrigger className={newUsage.type === '회수' ? 'bg-gray-100' : ''}>
                      <SelectValue placeholder="선택하세요" />
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

                <div className="space-y-2">
                  <label className="text-sm">현재 팀</label>
                  <Select
                    value={newUsage.toTeam}
                    onValueChange={(value) => {
                      // 팀 변경 시 해당 팀의 첫 번째 담당자 자동 선택
                      const members = value && value !== '-' ? membersByTeam[value] || [] : [];
                      setNewUsage({ 
                        ...newUsage, 
                        toTeam: value,
                        toAssignee: members.length > 0 ? members[0] : '-'
                      });
                    }}
                    disabled={newUsage.type === '회수'}
                  >
                    <SelectTrigger className={newUsage.type === '회수' ? 'bg-gray-100' : ''}>
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">없음</SelectItem>
                      {newUsageAvailableTeams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">현재 담당자</label>
                  <Select
                    value={newUsage.toAssignee}
                    onValueChange={(value) => setNewUsage({ ...newUsage, toAssignee: value })}
                    disabled={newUsage.type === '회수'}
                  >
                    <SelectTrigger className={newUsage.type === '회수' ? 'bg-gray-100' : ''}>
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">없음</SelectItem>
                      {newUsageAvailableMembers.map(member => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm">비고</label>
              <Textarea
                value={newUsage.note}
                onChange={(e) => setNewUsage({ ...newUsage, note: e.target.value })}
                rows={3}
                placeholder="메모를 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUsageDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                const newId = `UH-${String(usageHistory.length + 1).padStart(3, '0')}`;
                const formattedDate = newUsage.date.split('-').join('.');
                
                const newHistory: UsageHistory = {
                  id: newId,
                  date: formattedDate,
                  type: newUsage.type,
                  fromDept: newUsage.fromDept || undefined,
                  fromAssignee: newUsage.fromAssignee || undefined,
                  toDept: newUsage.toDept,
                  toAssignee: newUsage.toAssignee,
                  note: newUsage.note
                };
                
                // 최신 이력이 위로 오도록 배열 앞에 추가
                setUsageHistory([newHistory, ...usageHistory]);
                
                // 폼 초기화
                setNewUsage({
                  date: new Date().toISOString().split('T')[0],
                  type: '배정',
                  fromDept: assetData.department || '',
                  fromTeam: assetData.team || '',
                  fromAssignee: assetData.assignee || '',
                  toDept: '',
                  toTeam: '',
                  toAssignee: '',
                  note: ''
                });
                
                setIsUsageDialogOpen(false);
                alert('사용 이력이 추가되었습니다.');
              }}
            >
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 유지보수이력 추가 다이얼로그 */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>유지보수 이력 추가</DialogTitle>
            <DialogDescription>
              새로운 유지보수 이력을 추가하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm">일자</label>
              <Input
                type="date"
                value={newMaintenance.date}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, date: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">유형</label>
              <Select
                value={newMaintenance.type}
                onValueChange={(value) => setNewMaintenance({ ...newMaintenance, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="수리">수리</SelectItem>
                  <SelectItem value="점검">점검</SelectItem>
                  <SelectItem value="교체">교체</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">상태</label>
              <Select
                value={newMaintenance.status}
                onValueChange={(value) => setNewMaintenance({ ...newMaintenance, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="완료">완료</SelectItem>
                  <SelectItem value="진행중">진행중</SelectItem>
                  <SelectItem value="대기">대기</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">내용</label>
              <Textarea
                value={newMaintenance.description}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                rows={3}
                placeholder="내용을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">비용</label>
              <Input
                type="number"
                value={newMaintenance.cost}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, cost: Number(e.target.value) })}
                placeholder="비용을 입력하세요 (숫자만)"
              />
              <p className="text-xs text-muted-foreground">무료인 경우 0을 입력하세요</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm">업체</label>
              <Input
                value={newMaintenance.vendor}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, vendor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">비고</label>
              <Textarea
                value={newMaintenance.note}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, note: e.target.value })}
                rows={3}
                placeholder="메모를 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMaintenanceDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                const newId = `MH-${String(maintenanceHistory.length + 1).padStart(3, '0')}`;
                const formattedDate = newMaintenance.date.split('-').join('.');
                
                const newHistory: MaintenanceHistory = {
                  id: newId,
                  date: formattedDate,
                  type: newMaintenance.type,
                  status: newMaintenance.status,
                  description: newMaintenance.description,
                  cost: newMaintenance.cost,
                  vendor: newMaintenance.vendor,
                  note: newMaintenance.note
                };
                
                // 최신 이력이 위로 오도록 배열 앞에 추가
                setMaintenanceHistory([newHistory, ...maintenanceHistory]);
                
                // 폼 초기화
                setNewMaintenance({
                  date: new Date().toISOString().split('T')[0],
                  type: '수리',
                  status: '완료',
                  description: '',
                  cost: 0,
                  vendor: '',
                  note: ''
                });
                
                setIsMaintenanceDialogOpen(false);
                alert('유지보수 이력이 추가되었습니다.');
              }}
            >
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}