import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Save, X, Search, Monitor, Laptop, Smartphone, Package, User, Building2, Calendar, DollarSign, AlertCircle, CheckCircle2, UserPlus2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';

// 샘플 자산 데이터
const initialAssetList = [
  {
    code: 'AST-2025-001',
    name: 'MacBook Pro 16"',
    category: '노트북',
    type: 'IT기기',
    assetNumber: 'IT-2025-001',
    registrationDate: '2025-01-10',
    manufacturer: 'Apple',
    model: 'MacBook Pro 16" M3 Max',
    purchaseDate: '2025-01-15',
    purchaseAmount: 3890000,
    status: '사용중',
    assignee: '김광희',
    assigneeType: '직원',
    assigneeCode: 'EMP-1111',
    department: 'STE1실',
    team: 'LG전자 1팀',
    specs: '32GB RAM, 1TB SSD',
    assignDate: '2025-01-20',
  },
  {
    code: 'AST-2025-002',
    name: 'LG 그램 17',
    category: '노트북',
    type: 'IT기기',
    assetNumber: 'IT-2025-002',
    registrationDate: '2025-02-05',
    manufacturer: 'LG전자',
    model: '17Z90R-G.AA7BK',
    purchaseDate: '2025-02-10',
    purchaseAmount: 2390000,
    status: '사용중',
    assignee: '정홍근',
    assigneeType: '직원',
    assigneeCode: 'EMP-1112',
    department: 'STE1실',
    team: 'LG전자 1팀',
    specs: '16GB RAM, 512GB SSD',
    assignDate: '2025-02-15',
  },
  {
    code: 'AST-2025-003',
    name: 'Dell UltraSharp U2723DE',
    category: '모니터',
    type: 'IT기기',
    assetNumber: 'IT-2025-003',
    registrationDate: '2025-03-01',
    manufacturer: 'Dell',
    model: 'U2723DE',
    purchaseDate: '2025-03-05',
    purchaseAmount: 890000,
    status: '사용중',
    assignee: 'LG전자 1팀',
    assigneeType: '팀',
    assigneeCode: 'ORG-111',
    department: 'STE1실',
    team: 'LG전자 1팀',
    specs: '27인치, QHD, USB-C',
    assignDate: '2025-03-10',
  },
  {
    code: 'AST-2025-004',
    name: 'iPhone 15 Pro',
    category: '모바일 기기',
    type: 'IT기기',
    assetNumber: 'IT-2025-004',
    registrationDate: '2025-04-15',
    manufacturer: 'Apple',
    model: 'iPhone 15 Pro 256GB',
    purchaseDate: '2025-04-20',
    purchaseAmount: 1550000,
    status: '사용가능',
    assignee: '',
    assigneeType: '',
    assigneeCode: '',
    department: '',
    team: '',
    specs: '256GB, 티타늄 블루',
    assignDate: '',
  },
  {
    code: 'AST-2025-005',
    name: 'Microsoft Office 365',
    category: '소프트웨어',
    type: '소프트웨어',
    assetNumber: 'SW-2025-001',
    registrationDate: '2024-12-28',
    manufacturer: 'Microsoft',
    model: 'Office 365 Business Premium',
    purchaseDate: '2025-01-01',
    purchaseAmount: 18000,
    status: '사용중',
    assignee: '경영지원팀',
    assigneeType: '팀',
    assigneeCode: 'ORG-210',
    department: '경영전략실',
    team: '경영지원팀',
    specs: '1년 라이선스 (월구독)',
    assignDate: '2025-01-05',
  },
  {
    code: 'AST-2024-015',
    name: 'ThinkPad X1 Carbon',
    category: '노트북',
    type: 'IT기기',
    assetNumber: 'IT-2024-015',
    registrationDate: '2024-11-05',
    manufacturer: 'Lenovo',
    model: 'X1 Carbon Gen 11',
    purchaseDate: '2024-11-10',
    purchaseAmount: 2650000,
    status: '사용중',
    assignee: '조현균',
    assigneeType: '직원',
    assigneeCode: 'EMP-1211',
    department: 'STE2실',
    team: 'GS리테일 1팀',
    specs: '16GB RAM, 512GB SSD',
    assignDate: '2024-11-15',
  },
  {
    code: 'AST-2025-006',
    name: 'Samsung Galaxy Tab S9',
    category: '모바일 기기',
    type: 'IT기기',
    assetNumber: 'IT-2025-006',
    registrationDate: '2025-05-05',
    manufacturer: 'Samsung',
    model: 'Galaxy Tab S9 256GB',
    purchaseDate: '2025-05-10',
    purchaseAmount: 1200000,
    status: '사용가능',
    assignee: '',
    assigneeType: '',
    assigneeCode: '',
    department: '',
    team: '',
    specs: '256GB, Wi-Fi',
    assignDate: '',
  },
  {
    code: 'AST-2025-007',
    name: 'MacBook Air 13"',
    category: '노트북',
    type: 'IT기기',
    assetNumber: 'IT-2025-007',
    registrationDate: '2025-05-25',
    manufacturer: 'Apple',
    model: 'MacBook Air 13" M2',
    purchaseDate: '2025-06-01',
    purchaseAmount: 1690000,
    status: '사용가능',
    assignee: '',
    assigneeType: '',
    assigneeCode: '',
    department: '',
    team: '',
    specs: '16GB RAM, 512GB SSD',
    assignDate: '',
  },
];

// 샘플 직원 데이터
const employeeList = [
  { code: 'EMP-1111', name: '김광희', department: 'STE1실', team: 'LG전자 1팀', position: '책임' },
  { code: 'EMP-1112', name: '정홍근', department: 'STE1실', team: 'LG전자 1팀', position: '사원' },
  { code: 'EMP-1121', name: '이길원', department: 'STE1실', team: 'LG전자 2팀', position: '책임' },
  { code: 'EMP-1211', name: '조현균', department: 'STE2실', team: 'GS리테일 1팀', position: '책임' },
  { code: 'EMP-2101', name: '김완호', department: '경영전략실', team: '경영지원팀', position: '수' },
  { code: 'EMP-1113', name: '박성호', department: 'STE1실', team: 'LG전자 1팀', position: '수석' },
  { code: 'EMP-1212', name: '김종협', department: 'STE2실', team: 'GS리테일 1팀', position: '실장' },
];

// 샘플 팀 데이터
const teamList = [
  { code: 'ORG-111', name: 'LG전자 1팀', department: 'STE1실', memberCount: 3 },
  { code: 'ORG-112', name: 'LG전자 2팀', department: 'STE1실', memberCount: 4 },
  { code: 'ORG-121', name: 'GS리테일 1팀', department: 'STE2실', memberCount: 5 },
  { code: 'ORG-210', name: '경영지원팀', department: '경영전략실', memberCount: 5 },
];

export function HRRegistrationAsset() {
  const [isEditing, setIsEditing] = useState(true);
  const [assetList, setAssetList] = useState(initialAssetList);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isAssetDetailOpen, setIsAssetDetailOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isAssigneeSearchOpen, setIsAssigneeSearchOpen] = useState(false);
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState('');
  const [assigneeType, setAssigneeType] = useState<'직원' | '팀'>('직원');
  
  // 오늘 날짜
  const today = new Date().toISOString().split('T')[0];

  // 자산 배정 폼 데이터
  const [assignFormData, setAssignFormData] = useState({
    assetCode: '',
    assetName: '',
    assetCategory: '',
    assigneeType: '',
    assigneeCode: '',
    assigneeName: '',
    assigneeDepartment: '',
    assigneeTeam: '',
    assignDate: today,
    returnDate: '',
    note: '',
  });

  const [assignTouched, setAssignTouched] = useState<Record<string, boolean>>({});

  const handleAssignInputChange = (field: string, value: string) => {
    setAssignFormData(prev => ({ ...prev, [field]: value }));
    setAssignTouched(prev => ({ ...prev, [field]: true }));
  };

  const getInputClassName = (field: string, touchedState: Record<string, boolean>, dataObj: any) => {
    if (!isEditing) return 'bg-muted/30';
    return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
  };

  // 자산 배정 저장
  const handleSaveAssignment = () => {
    const requiredFields = ['assetCode', 'assigneeCode', 'assignDate'];
    const missingFields = requiredFields.filter(field => !assignFormData[field as keyof typeof assignFormData]);

    if (missingFields.length > 0) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (confirm(`${assignFormData.assetName}을(를) ${assignFormData.assigneeName}에게 배정하시겠습니까?`)) {
      setAssetList(prev => prev.map(asset => {
        if (asset.code === assignFormData.assetCode) {
          return {
            ...asset,
            assignee: assignFormData.assigneeName,
            assigneeType: assignFormData.assigneeType,
            assigneeCode: assignFormData.assigneeCode,
            department: assignFormData.assigneeDepartment,
            team: assignFormData.assigneeTeam,
            status: '사용중',
            assignDate: assignFormData.assignDate,
          };
        }
        return asset;
      }));

      toast.success(`${assignFormData.assetName}이(가) ${assignFormData.assigneeName}에게 배정되었습니다.`);

      // 배정 완료 후 자동으로 팝업 닫기
      setIsAssignDialogOpen(false);
      resetAssignForm();
      setSelectedAsset(null);
    }
  };

  // 자산 선택 (배정용)
  const handleSelectAssetForAssign = (asset: any) => {
    if (asset.status === '사용중') {
      if (!confirm(`이미 ${asset.assignee}에게 배정된 자산입니다.\n다른 사람에게 재배정하시겠습니까?`)) {
        return;
      }
    }
    if (asset.status === '수리중' || asset.status === '폐기예정' || asset.status === '폐기완료') {
      toast.error('배정할 수 없는 상태의 자산입니다.');
      return;
    }

    setSelectedAsset(asset);
    setAssignFormData(prev => ({
      ...prev,
      assetCode: asset.code,
      assetName: asset.name,
      assetCategory: asset.category,
    }));
    setAssignTouched(prev => ({
      ...prev,
      assetCode: true,
      assetName: true,
      assetCategory: true,
    }));
    setIsAssignDialogOpen(true);
  };

  // 배정 대상 선택
  const handleSelectAssignee = (item: any, type: '직원' | '팀') => {
    setAssignFormData(prev => ({
      ...prev,
      assigneeType: type,
      assigneeCode: item.code,
      assigneeName: item.name,
      assigneeDepartment: item.department,
      assigneeTeam: item.team || item.name,
    }));
    setAssignTouched(prev => ({
      ...prev,
      assigneeType: true,
      assigneeCode: true,
      assigneeName: true,
      assigneeDepartment: true,
      assigneeTeam: true,
    }));
    setIsAssigneeSearchOpen(false);
    setAssigneeSearchQuery('');
  };

  // 검색 필터링
  const filteredAssets = assetList.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.team.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '전체' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === '전체' || asset.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 배정 대상 검색 필터링
  const filteredAssignees = assigneeType === '직원'
    ? employeeList.filter(emp =>
        emp.name.toLowerCase().includes(assigneeSearchQuery.toLowerCase()) ||
        emp.code.toLowerCase().includes(assigneeSearchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(assigneeSearchQuery.toLowerCase()) ||
        emp.team.toLowerCase().includes(assigneeSearchQuery.toLowerCase())
      )
    : teamList.filter(team =>
        team.name.toLowerCase().includes(assigneeSearchQuery.toLowerCase()) ||
        team.code.toLowerCase().includes(assigneeSearchQuery.toLowerCase()) ||
        team.department.toLowerCase().includes(assigneeSearchQuery.toLowerCase())
      );

  const resetAssignForm = () => {
    setAssignFormData({
      assetCode: '',
      assetName: '',
      assetCategory: '',
      assigneeType: '',
      assigneeCode: '',
      assigneeName: '',
      assigneeDepartment: '',
      assigneeTeam: '',
      assignDate: today,
      returnDate: '',
      note: '',
    });
    setAssignTouched({});
  };

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 있습니다. 취소하시겠습니까?')) {
      resetAssignForm();
      setSelectedAsset(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '노트북':
        return <Laptop className="h-4 w-4" />;
      case '모니터':
        return <Monitor className="h-4 w-4" />;
      case '모바일 기기':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '사용가능':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400';
      case '사용중':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
      case '수리중':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400';
      case '폐기예정':
      case '폐기완료':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>자산등록</h1>
          <p className="text-muted-foreground mt-1">자산 사용 현황을 조회하고 직원/팀에게 배정하세요.</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>자산 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 카테고리</SelectItem>
                  <SelectItem value="노트북">노트북</SelectItem>
                  <SelectItem value="데스크톱">데스크톱</SelectItem>
                  <SelectItem value="모니터">모니터</SelectItem>
                  <SelectItem value="키보드/마우스">키보드/마우스</SelectItem>
                  <SelectItem value="소프트웨어">소프트웨어</SelectItem>
                  <SelectItem value="모바일 기기">모바일 기기</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <div className="flex gap-2">
                <Search className="h-5 w-5 text-muted-foreground mt-2" />
                <Input
                  placeholder="자산명, 코드, 사용자, 팀 검색..."
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
                  <SelectItem value="사용가능">사용가능</SelectItem>
                  <SelectItem value="사용중">사용중</SelectItem>
                  <SelectItem value="수리중">수리중</SelectItem>
                  <SelectItem value="폐기예정">폐기예정</SelectItem>
                  <SelectItem value="폐기완료">폐기완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 메인 컨텐츠 - 전체 너비 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>자산 사용 현황</CardTitle>
            <Badge variant="outline">{filteredAssets.length}개</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-[calc(100vh-350px)] overflow-y-auto">
            <table className="w-full">
              <thead className="border-b sticky top-0 bg-card">
                <tr className="text-sm text-muted-foreground">
                  <th className="text-left py-3 px-4 w-[25%]">자산명</th>
                  <th className="text-center py-3 px-4 w-[10%]">상태</th>
                  <th className="text-left py-3 px-4 w-[15%]">사용자</th>
                  <th className="text-left py-3 px-4 w-[20%]">소속</th>
                  <th className="text-left py-3 px-4 w-[12%]">배정일</th>
                  <th className="text-left py-3 px-4 w-[13%]">구매일</th>
                  <th className="text-center py-3 px-4 w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAssets.map((asset) => (
                  <tr 
                    key={asset.code} 
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsAssetDetailOpen(true);
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/80 shrink-0">
                          {getCategoryIcon(asset.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{asset.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{asset.code} • {asset.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={`text-xs ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {asset.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${
                            asset.assigneeType === '직원' 
                              ? 'bg-blue-100 dark:bg-blue-950' 
                              : 'bg-green-100 dark:bg-green-950'
                          }`}>
                            {asset.assigneeType === '직원' ? (
                              <User className="h-3.5 w-3.5 text-blue-600" />
                            ) : (
                              <Building2 className="h-3.5 w-3.5 text-green-600" />
                            )}
                          </div>
                          <span className="text-sm font-medium truncate">{asset.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">미배정</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {asset.department ? (
                        <div className="text-sm">
                          <div className="font-medium truncate">{asset.team}</div>
                          <div className="text-xs text-muted-foreground truncate">{asset.department}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {asset.assignDate ? (
                        <div className="text-sm">{asset.assignDate}</div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-muted-foreground">{asset.purchaseDate}</div>
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSelectAssetForAssign(asset)}
                        disabled={asset.status === '폐기예정' || asset.status === '폐기완료'}
                        className="h-8 w-8 p-0"
                      >
                        <UserPlus2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAssets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 자산 배정 팝업 */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>자산 배정</DialogTitle>
            <DialogDescription>
              자산을 직원 또는 팀에 배정하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* 선택된 자산 정보 */}
            {selectedAsset && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0">
                    {getCategoryIcon(selectedAsset.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1">{selectedAsset.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">{selectedAsset.code}</div>
                    <Badge className={`text-xs ${getStatusColor(selectedAsset.status)}`}>
                      {selectedAsset.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* 배정 대상 선택 */}
            <div>
              <label className="text-sm mb-1.5 block">
                배정 대상 <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <Button
                  variant={assigneeType === '직원' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAssigneeType('직원')}
                  className="flex-1"
                >
                  <User className="h-4 w-4 mr-1" />
                  직원
                </Button>
                <Button
                  variant={assigneeType === '팀' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAssigneeType('팀')}
                  className="flex-1"
                >
                  <Building2 className="h-4 w-4 mr-1" />
                  팀
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={assignFormData.assigneeName}
                  disabled
                  placeholder={`${assigneeType} 선택`}
                  className="flex-1 bg-muted text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAssigneeSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 선택된 배정 대상 정보 */}
            {assignFormData.assigneeCode && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                    {assignFormData.assigneeType === '직원' ? (
                      <User className="h-4 w-4 text-primary" />
                    ) : (
                      <Building2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-0.5">{assignFormData.assigneeName}</div>
                    <div className="text-xs text-muted-foreground">
                      {assignFormData.assigneeDepartment} • {assignFormData.assigneeTeam}
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                </div>
              </div>
            )}

            {/* 배정 일자 */}
            <div>
              <label className="text-sm mb-1.5 block">
                배정일자 <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={assignFormData.assignDate}
                onChange={(e) => handleAssignInputChange('assignDate', e.target.value)}
                className={getInputClassName('assignDate', assignTouched, assignFormData)}
              />
            </div>

            {/* 반납예정일 */}
            <div>
              <label className="text-sm mb-1.5 block">반납예정일</label>
              <Input
                type="date"
                value={assignFormData.returnDate}
                onChange={(e) => handleAssignInputChange('returnDate', e.target.value)}
                className={getInputClassName('returnDate', assignTouched, assignFormData)}
              />
            </div>

            {/* 비고 */}
            <div>
              <label className="text-sm mb-1.5 block">비고</label>
              <Textarea
                value={assignFormData.note}
                onChange={(e) => handleAssignInputChange('note', e.target.value)}
                placeholder="추가 정보를 입력하세요"
                className={getInputClassName('note', assignTouched, assignFormData)}
                rows={3}
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAssignDialogOpen(false);
                  resetAssignForm();
                  setSelectedAsset(null);
                }} 
                className="flex-1"
              >
                <X className="h-4 w-4 mr-1" />
                취소
              </Button>
              <Button size="sm" onClick={handleSaveAssignment} className="flex-1">
                <Save className="h-4 w-4 mr-1" />
                배정
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 배정 대상 검색 모달 */}
      <Dialog open={isAssigneeSearchOpen} onOpenChange={setIsAssigneeSearchOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{assigneeType} 검색</DialogTitle>
            <DialogDescription>
              배정할 {assigneeType}을(를) 선택하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Search className="h-5 w-5 text-muted-foreground mt-2" />
              <Input
                placeholder="검색어를 입력하세요"
                value={assigneeSearchQuery}
                onChange={(e) => setAssigneeSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredAssignees.length > 0 ? (
                <div className="divide-y">
                  {assigneeType === '직원' 
                    ? (filteredAssignees as typeof employeeList).map((employee) => (
                        <button
                          key={employee.code}
                          onClick={() => handleSelectAssignee(employee, '직원')}
                          className="w-full text-left p-4 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 shrink-0">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{employee.name}</p>
                                <Badge variant="outline" className="text-xs">{employee.code}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>{employee.department}</span>
                                <span>•</span>
                                <span>{employee.team}</span>
                                <span>•</span>
                                <span>{employee.position}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                    : (filteredAssignees as typeof teamList).map((team) => (
                        <button
                          key={team.code}
                          onClick={() => handleSelectAssignee(team, '팀')}
                          className="w-full text-left p-4 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 shrink-0">
                              <Building2 className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{team.name}</p>
                                <Badge variant="outline" className="text-xs">{team.code}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {team.department} • {team.memberCount}명
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                  }
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  {assigneeSearchQuery ? '검색 결과가 없습니다.' : '검색어를 입력하세요.'}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 자산 상세 정보 팝업 */}
      <Dialog open={isAssetDetailOpen} onOpenChange={setIsAssetDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>자산 상세 정보</DialogTitle>
            <DialogDescription>
              자산의 상세 정보 및 배정 현황을 확인하세요
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-6 py-4">
              {/* 자산 기본 정보 */}
              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 shrink-0">
                  {getCategoryIcon(selectedAsset.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{selectedAsset.name}</h3>
                    <Badge className={`text-xs ${getStatusColor(selectedAsset.status)}`}>
                      {selectedAsset.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <p>자산코드: {selectedAsset.code}</p>
                    <p>자산번호: {selectedAsset.assetNumber}</p>
                    <p>카테고리: {selectedAsset.category}</p>
                    <p>구매일: {selectedAsset.purchaseDate}</p>
                    <p className="col-span-2">자산등록일: {selectedAsset.registrationDate}</p>
                  </div>
                </div>
              </div>

              {/* 제품 정보 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  제품 정보
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">제조사</div>
                    <div className="text-sm font-medium">{selectedAsset.manufacturer}</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">모델명</div>
                    <div className="text-sm font-medium">{selectedAsset.model}</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg col-span-2">
                    <div className="text-xs text-muted-foreground mb-1">사양</div>
                    <div className="text-sm font-medium">{selectedAsset.specs || '-'}</div>
                  </div>
                </div>
              </div>

              {/* 배정 정보 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  배정 정보
                </h4>
                {selectedAsset.assignee ? (
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                          selectedAsset.assigneeType === '직원' 
                            ? 'bg-blue-100 dark:bg-blue-950' 
                            : 'bg-green-100 dark:bg-green-950'
                        }`}>
                          {selectedAsset.assigneeType === '직원' ? (
                            <User className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Building2 className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{selectedAsset.assignee}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {selectedAsset.department} • {selectedAsset.team}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            자산 지일: {selectedAsset.assignDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border rounded-lg border-dashed">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">배정된 사용자가 없습니다</p>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAssetDetailOpen(false)}
                  className="flex-1"
                >
                  닫기
                </Button>
                {selectedAsset.status !== '폐기예정' && selectedAsset.status !== '폐기완료' && (
                  <Button 
                    onClick={() => {
                      setIsAssetDetailOpen(false);
                      handleSelectAssetForAssign(selectedAsset);
                    }}
                    className="flex-1"
                  >
                    <UserPlus2 className="h-4 w-4 mr-2" />
                    {selectedAsset.assignee ? '재배정' : '배정하기'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}