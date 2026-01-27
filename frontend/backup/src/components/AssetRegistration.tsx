import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Package, Plus, Save, RotateCcw, Calendar, DollarSign, Building2, FileText, Tag, AlertCircle, User, Search, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

interface AssetType {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  isActive: boolean;
}

interface NewAssetFormData {
  assetName: string;
  assetType: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  assetNumber: string;
  specifications: string;
  purchaseDate: string;
  purchasePrice: string;
  warrantyPeriod: string;
  department: string;
  status: string;
  assignedTo: string;
  note: string;
}

export function AssetRegistration() {
  const [activeTab, setActiveTab] = useState('asset');
  
  // 신규 유형 등록 상태
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDescription, setNewTypeDescription] = useState('');
  
  // 기존 자산 유형 목록 (prefix 추가)
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([
    { id: 'TYPE-001', name: '노트북', description: '휴대용 개인 컴퓨터', createdDate: '2020.01.15', isActive: true },
    { id: 'TYPE-002', name: '데스크탑', description: '업무용 데스크탑 컴퓨터', createdDate: '2020.01.15', isActive: true },
    { id: 'TYPE-003', name: '모니터', description: '디스플레이 장치', createdDate: '2020.01.15', isActive: true },
    { id: 'TYPE-004', name: '키보드/마우스', description: '입력 장치', createdDate: '2020.01.15', isActive: true },
    { id: 'TYPE-005', name: '휴대폰', description: '업무용 모바일 기기', createdDate: '2020.01.15', isActive: true },
  ]);

  // 자산 유형별 prefix 매핑
  const getAssetTypePrefix = (typeName: string): string => {
    const prefixMap: { [key: string]: string } = {
      '노트북': 'LAP',
      '데스크탑': 'DSK',
      '모니터': 'MON',
      '키보드/마우스': 'INP',
      '휴대폰': 'MOB',
      '태블릿': 'TAB',
    };
    return prefixMap[typeName] || 'AST';
  };

  // 담당자 목록
  const employees = [
    { code: 'EMP-001', name: '김종균', position: '대표이사', department: '티벨' },
    { code: 'EMP-002', name: '박성호', position: '사장', department: 'STE그룹' },
    { code: 'EMP-003', name: '김종협', position: '실장', department: 'STE그룹' },
    { code: 'EMP-004', name: '이민수', position: '팀장', department: 'STE1실' },
    { code: 'EMP-005', name: '박지영', position: '책임', department: 'STE1실' },
    { code: 'EMP-006', name: '최현우', position: '선임', department: 'STE1실' },
    { code: 'EMP-007', name: '강민지', position: '사원', department: 'STE1실' },
    { code: 'EMP-008', name: '정수현', position: '팀장', department: 'STE2실' },
    { code: 'EMP-009', name: '홍길동', position: '수석', department: 'STE2실' },
    { code: 'EMP-010', name: '김영희', position: '책임', department: 'STE2실' },
    { code: 'EMP-011', name: '이철수', position: '선임', department: '경영전략실' },
    { code: 'EMP-012', name: '박미영', position: '책임', department: '경영전략실' },
    { code: 'EMP-013', name: '최정훈', position: '수석', department: '개발연구소' },
    { code: 'EMP-014', name: '윤서연', position: '책임', department: '개발연구소' },
  ];

  // 신규 자산 등록 상태
  const [newAsset, setNewAsset] = useState<NewAssetFormData>({
    assetName: '',
    assetType: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    assetNumber: '',
    specifications: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyPeriod: '',
    department: '',
    status: '가용',
    assignedTo: '',
    note: ''
  });

  // 담당자 검색 관련 상태
  const [assignedToSearch, setAssignedToSearch] = useState('');
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  // 담당자 검색 필터링
  const handleAssignedToSearch = (searchValue: string) => {
    setAssignedToSearch(searchValue);
    setShowEmployeeSearch(true);
    
    if (searchValue.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchValue.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchValue.toLowerCase()) ||
        emp.code.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  // 담당자 선택
  const handleSelectEmployee = (emp: typeof employees[0]) => {
    setNewAsset({ 
      ...newAsset, 
      assignedTo: emp.name,
      status: '사용중'
    });
    setAssignedToSearch(emp.name);
    setShowEmployeeSearch(false);
  };

  // 담당자 제거
  const handleClearAssignedTo = () => {
    setNewAsset({ 
      ...newAsset, 
      assignedTo: '',
      status: '가용'
    });
    setAssignedToSearch('');
    setShowEmployeeSearch(false);
  };

  // 다음 자산코드 생성 (유형에 따라)
  const generateAssetCode = (typeName: string = '') => {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const prefix = typeName ? getAssetTypePrefix(typeName) : 'AST';
    return `${prefix}-${randomNum}`;
  };

  const [generatedAssetCode, setGeneratedAssetCode] = useState('AST-0000');

  // 신규 유형 등록
  const handleRegisterType = () => {
    if (!newTypeName.trim()) {
      toast.error('유형명을 입력해주세요');
      return;
    }

    // 중복 확인
    const isDuplicate = assetTypes.some(type => type.name === newTypeName.trim());
    if (isDuplicate) {
      toast.error('이미 존재하는 유형명입니다');
      return;
    }

    const newType: AssetType = {
      id: `TYPE-${String(assetTypes.length + 1).padStart(3, '0')}`,
      name: newTypeName.trim(),
      description: newTypeDescription.trim(),
      createdDate: new Date().toISOString().split('T')[0].split('-').join('.'),
      isActive: true
    };

    setAssetTypes([...assetTypes, newType]);
    toast.success(`${newTypeName} 유형이 등록되었습니다`);
    
    // 폼 초기화
    setNewTypeName('');
    setNewTypeDescription('');
  };

  // 유형 초기화
  const handleResetTypeForm = () => {
    setNewTypeName('');
    setNewTypeDescription('');
    toast.success('입력 내용이 초기화되었습니다');
  };

  // 유형 상태 토글
  const handleToggleTypeStatus = (typeId: string) => {
    setAssetTypes(prevTypes => 
      prevTypes.map(type => 
        type.id === typeId 
          ? { ...type, isActive: !type.isActive }
          : type
      )
    );
    
    const toggledType = assetTypes.find(type => type.id === typeId);
    if (toggledType) {
      const newStatus = !toggledType.isActive ? '활성화' : '비활성화';
      toast.success(`${toggledType.name} 유형이 ${newStatus}되었습니다`);
    }
  };

  // 신규 자산 등록
  const handleRegisterAsset = () => {
    // 필수 항목 검증
    if (!newAsset.assetName.trim()) {
      toast.error('자산명을 입력해주세요');
      return;
    }
    if (!newAsset.assetType) {
      toast.error('자산 유형을 선택해주세요');
      return;
    }
    if (!newAsset.manufacturer.trim()) {
      toast.error('제조사를 입력해주세요');
      return;
    }
    if (!newAsset.model.trim()) {
      toast.error('모델명을 입력해주세요');
      return;
    }
    if (!newAsset.purchaseDate) {
      toast.error('구매일을 입력해주세요');
      return;
    }
    if (!newAsset.purchasePrice || parseFloat(newAsset.purchasePrice) <= 0) {
      toast.error('취득가액을 입력해주세요');
      return;
    }
    if (!newAsset.department) {
      toast.error('소속 부서를 선택해주세요');
      return;
    }

    // 등록 성공
    toast.success(`${newAsset.assetName} (${generatedAssetCode}) 자산이 등록되었습니다`);
    
    // 폼 초기화
    setNewAsset({
      assetName: '',
      assetType: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      assetNumber: '',
      specifications: '',
      purchaseDate: '',
      purchasePrice: '',
      warrantyPeriod: '',
      department: '',
      status: '가용',
      assignedTo: '',
      note: ''
    });
    
    setAssignedToSearch('');
    setShowEmployeeSearch(false);
    
    // 새로운 자산코드 생성
    setGeneratedAssetCode(generateAssetCode());
  };

  // 자산 폼 초기화
  const handleResetAssetForm = () => {
    setNewAsset({
      assetName: '',
      assetType: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      assetNumber: '',
      specifications: '',
      purchaseDate: '',
      purchasePrice: '',
      warrantyPeriod: '',
      department: '',
      status: '가용',
      assignedTo: '',
      note: ''
    });
    setAssignedToSearch('');
    setShowEmployeeSearch(false);
    setGeneratedAssetCode(generateAssetCode());
    toast.success('입력 내용이 초기화되었습니다');
  };

  // 취득가액 포맷팅
  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/,/g, ''));
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('ko-KR').format(number);
  };

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setNewAsset({ ...newAsset, purchasePrice: numericValue });
  };

  // 입력 필드 CSS 클래스 결정
  const getInputClassName = (value: string, isRequired: boolean = true) => {
    if (!isRequired) return 'bg-yellow-50 border-yellow-300';
    return 'bg-yellow-50 border-yellow-300';
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1>등록</h1>
        <p className="text-muted-foreground mt-1">새로운 자산 유형을 추가하거나 자산을 등록합니다</p>
      </div>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="asset">
            <Package className="h-4 w-4 mr-2" />
            신규 자산 등록
          </TabsTrigger>
          <TabsTrigger value="type">
            <Tag className="h-4 w-4 mr-2" />
            신규 유형 등록
          </TabsTrigger>
        </TabsList>

        {/* 신규 자산 등록 탭 */}
        <TabsContent value="asset" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              노란색 배경은 필수 입력 항목입니다. 모든 필수 항목을 입력해주세요.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>자산 정보 입력</CardTitle>
                  <CardDescription>새로 구매한 자산의 정보를 입력하세요</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetAssetForm}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  초기화
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 자산코드 (자동생성) */}
              <div className="space-y-2">
                <label className="text-sm flex items-center gap-2">
                  자산코드
                  <Badge variant="secondary" className="text-xs">자동생성</Badge>
                </label>
                <Input
                  value={generatedAssetCode}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">자산코드는 자동으로 생성됩니다</p>
              </div>

              {/* 자산명 */}
              <div className="space-y-2">
                <label className="text-sm">
                  자산명
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  placeholder="예: 삼성 갤럭시북 프로"
                  value={newAsset.assetName}
                  onChange={(e) => setNewAsset({ ...newAsset, assetName: e.target.value })}
                  className={getInputClassName(newAsset.assetName)}
                />
              </div>

              {/* 자산번호 & 자산 유형 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">
                    자산번호
                  </label>
                  <Input
                    placeholder="예: 2025-A-001"
                    value={newAsset.assetNumber}
                    onChange={(e) => setNewAsset({ ...newAsset, assetNumber: e.target.value })}
                    className={getInputClassName(newAsset.assetNumber, false)}
                  />
                  <p className="text-xs text-muted-foreground">사내 자산번호가 있는 경우 입력하세요</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    자산 유형
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Select 
                    value={newAsset.assetType} 
                    onValueChange={(value) => {
                      setNewAsset({ ...newAsset, assetType: value });
                      setGeneratedAssetCode(generateAssetCode(value));
                    }}
                  >
                    <SelectTrigger className={getInputClassName(newAsset.assetType)}>
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.filter(type => type.isActive).map(type => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">유형 선택 시 자산코드가 자동으로 생성됩니다</p>
                </div>
              </div>

              {/* 제조사 & 모델명 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">
                    제조사
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    placeholder="예: 삼성전자"
                    value={newAsset.manufacturer}
                    onChange={(e) => setNewAsset({ ...newAsset, manufacturer: e.target.value })}
                    className={getInputClassName(newAsset.manufacturer)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    모델명
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    placeholder="예: NT950XED-K58A"
                    value={newAsset.model}
                    onChange={(e) => setNewAsset({ ...newAsset, model: e.target.value })}
                    className={getInputClassName(newAsset.model)}
                  />
                </div>
              </div>

              {/* 시리얼번호 & 사양 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">
                    시리얼번호
                  </label>
                  <Input
                    placeholder="예: 1234567890"
                    value={newAsset.serialNumber}
                    onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                    className={getInputClassName(newAsset.serialNumber, false)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    사양
                  </label>
                  <Textarea
                    placeholder="예: 16GB RAM, 512GB SSD"
                    value={newAsset.specifications}
                    onChange={(e) => setNewAsset({ ...newAsset, specifications: e.target.value })}
                    rows={3}
                    className={getInputClassName(newAsset.specifications, false)}
                  />
                </div>
              </div>

              {/* 구매일 & 취득가액 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">
                    구매일
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Input
                    type="date"
                    value={newAsset.purchaseDate}
                    onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                    className={getInputClassName(newAsset.purchaseDate)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    취득가액
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="예: 1,500,000"
                      value={formatCurrency(newAsset.purchasePrice)}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className={getInputClassName(newAsset.purchasePrice)}
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">원</span>
                  </div>
                </div>
              </div>

              {/* 보증 기간 */}
              <div className="space-y-2">
                <label className="text-sm">
                  보증기간
                </label>
                <Input
                  type="date"
                  value={newAsset.warrantyPeriod}
                  onChange={(e) => setNewAsset({ ...newAsset, warrantyPeriod: e.target.value })}
                  className={getInputClassName(newAsset.warrantyPeriod, false)}
                  placeholder="yyyy-mm-dd"
                />
                <p className="text-xs text-muted-foreground">보증 종료일을 선택하세요</p>
              </div>

              {/* 소속 부서 */}
              <div className="space-y-2">
                <label className="text-sm">
                  소속 부서
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select value={newAsset.department} onValueChange={(value) => setNewAsset({ ...newAsset, department: value })}>
                  <SelectTrigger className={getInputClassName(newAsset.department)}>
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

              {/* 상태 */}
              <div className="space-y-2">
                <label className="text-sm">
                  상태
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select value={newAsset.status} onValueChange={(value) => setNewAsset({ ...newAsset, status: value })}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="가용">가용</SelectItem>
                    <SelectItem value="사용중">사용중</SelectItem>
                    <SelectItem value="수리중">수리중</SelectItem>
                    <SelectItem value="폐기예정">폐기예정</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">신규 자산은 기본적으로 '가용' 상태입니다</p>
              </div>

              {/* 담당자 */}
              <div className="space-y-2">
                <label className="text-sm">
                  담당자
                </label>
                <div className="relative">
                  <Input
                    placeholder="담당자 검색"
                    value={assignedToSearch}
                    onChange={(e) => handleAssignedToSearch(e.target.value)}
                    className={getInputClassName(newAsset.assignedTo, false)}
                  />
                  <Search className="absolute right-3 top-2.5 text-sm text-muted-foreground" />
                </div>
                {showEmployeeSearch && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 shadow-md max-h-40 overflow-y-auto">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map(emp => (
                        <div
                          key={emp.code}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelectEmployee(emp)}
                        >
                          {emp.name} ({emp.position}, {emp.department})
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">검색 결과가 없습니다</div>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">담당자 지정 시 상태가 자동으로 '사용중'으로 변경됩니다</p>
                {newAsset.assignedTo && (
                  <div className="flex items-center mt-2">
                    <Badge className="bg-blue-500 text-white">{newAsset.assignedTo}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={handleClearAssignedTo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* 비고 */}
              <div className="space-y-2">
                <label className="text-sm">
                  비고
                </label>
                <Textarea
                  placeholder="추가 정보를 입력하세요 (선택사항)"
                  value={newAsset.note}
                  onChange={(e) => setNewAsset({ ...newAsset, note: e.target.value })}
                  rows={3}
                  className={getInputClassName(newAsset.note, false)}
                />
              </div>

              {/* 등록 버튼 */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleResetAssetForm}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  취소
                </Button>
                <Button onClick={handleRegisterAsset}>
                  <Save className="h-4 w-4 mr-2" />
                  등록
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 신규 유형 등록 탭 */}
        <TabsContent value="type" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              새로운 자산 유형을 추가하면 자산 등록 시 선택할 수 있습니다.
            </AlertDescription>
          </Alert>

          {/* 신규 유형 등록 폼 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>유형 정보 입력</CardTitle>
                  <CardDescription>새로운 자산 유형을 추가하세요</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetTypeForm}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  초기화
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 유형명 */}
              <div className="space-y-2">
                <label className="text-sm">
                  유형명
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  placeholder="예: 태블릿"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className={getInputClassName(newTypeName)}
                />
              </div>

              {/* 설명 */}
              <div className="space-y-2">
                <label className="text-sm">
                  설명
                </label>
                <Textarea
                  placeholder="유형에 대한 설명을 입력하세요 (선택사항)"
                  value={newTypeDescription}
                  onChange={(e) => setNewTypeDescription(e.target.value)}
                  rows={3}
                  className={getInputClassName(newTypeDescription, false)}
                />
              </div>

              {/* 등록 버튼 */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleResetTypeForm}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  취소
                </Button>
                <Button onClick={handleRegisterType}>
                  <Plus className="h-4 w-4 mr-2" />
                  유형 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 등록된 유형 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>등록된 자산 유형</CardTitle>
              <CardDescription>총 {assetTypes.length}개의 유형</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">유형코드</th>
                      <th className="text-left p-3">유형명</th>
                      <th className="text-left p-3">설명</th>
                      <th className="text-left p-3">등록일</th>
                      <th className="text-left p-3">상태</th>
                      <th className="text-left p-3">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assetTypes.map((type) => (
                      <tr key={type.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <Badge variant="outline">{type.id}</Badge>
                        </td>
                        <td className="p-3 font-medium">{type.name}</td>
                        <td className="p-3 text-muted-foreground">
                          {type.description || '-'}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {type.createdDate}
                          </div>
                        </td>
                        <td className="p-3">
                          {type.isActive ? (
                            <Badge className="bg-green-500">사용중</Badge>
                          ) : (
                            <Badge variant="secondary">비활성</Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleTypeStatus(type.id)}
                          >
                            {type.isActive ? '비활성화' : '활성화'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}