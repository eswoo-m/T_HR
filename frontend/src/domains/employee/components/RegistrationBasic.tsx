import { useState, useRef } from 'react';
import type { Employee } from '../types';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Save, X, Upload, User, Search, ChevronDown, ChevronUp, Plus, Package, Monitor, Smartphone, Keyboard } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';

// 테스트를 위한 전체 자산 샘플 데이터
// 테스트를 위한 전체 자산 샘플 데이터
const allAssets = [
    {
        assetCode: 'AST-2024-001',
        assetName: '맥북 프로 16',
        assetType: '노트북',
        manufacturer: 'Apple',
        model: 'M3 Pro',
        serialNumber: 'SN12345678',
        status: '가용',
        purchaseDate: '2024-01-10',
        assignee: '' // 💡 이 속성이 없어서 에러가 났던 거예요!
    },
    {
        assetCode: 'AST-2024-002',
        assetName: '델 울트라샤프',
        assetType: '모니터',
        manufacturer: 'DELL',
        model: 'U2723QE',
        serialNumber: 'SN87654321',
        status: '가용',
        purchaseDate: '2024-02-15',
        assignee: ''
    },
    {
        assetCode: 'AST-2024-003',
        assetName: '로지텍 키보드',
        assetType: '키보드/마우스',
        manufacturer: 'Logitech',
        model: 'MX Keys',
        serialNumber: 'SN55667788',
        status: '가용',
        purchaseDate: '2024-03-01',
        assignee: ''
    },
    {
        assetCode: 'AST-2024-004',
        assetName: '갤럭시 S24',
        assetType: '휴대폰',
        manufacturer: 'Samsung',
        model: 'S24 Ultra',
        serialNumber: 'SN99001122',
        status: '사용중',
        purchaseDate: '2024-04-20',
        assignee: '홍길동'
    },
];

interface RegistrationBasicProps {
    onSubmit: (formData: Employee) => Promise<void>;
    isLoading: boolean;
}

export function RegistrationBasic({ onSubmit, isLoading }: RegistrationBasicProps) {
  const [isEditing, setIsEditing] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');

  // 섹션 접기/펼치기 상태
  const [isOrgInfoExpanded, setIsOrgInfoExpanded] = useState(true);
  const [isDetailInfoExpanded, setIsDetailInfoExpanded] = useState(true);
  const [isAssetInfoExpanded, setIsAssetInfoExpanded] = useState(true);

  // 자산 관련 상태 - 자산 코드로 관리
  const [assignedAssetCodes, setAssignedAssetCodes] = useState<string[]>([]);
  const [isAssetAssignDialogOpen, setIsAssetAssignDialogOpen] = useState(false);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('전체');
  const [selectedAssetsToAdd, setSelectedAssetsToAdd] = useState<string[]>([]);

  // 오늘 날짜를 YYYY-MM-DD 형식으로
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    id: '',
    employeeCode: '',
    name: '',
    nameHanja: '',
    nameEng: '',
    birthDate: '',
    ssn: '', // 주민번호
    gender: '',
    email: '',
    phone: '',
    zipCode: '',
    roadAddress: '',
    detailAddress: '',
    joinDate: today, // 오늘 날짜로 디폴트
    department: '',
    team: '',
    position: '',
    jobTitle: '',
    classification: '', // 구분 (투입_정산, 투입_지원, 대기, 관리)
    employmentType: '', // 직무유형
    employmentStatus: '', // 재직구분
    job: '', // 직무구분
    education: '', // 최종학력
    school: '', // 최종학교
    major: '', // 전공
    totalCareer: '', // 총경력 (년)
    swCareer: '', // 전SW경력 (년)
    married: '', // 결혼유무
    marriageAnniversary: '', // 결혼기념일
    emergencyContact: '', // 비상 연락처
    emergencyRelation: '', // 본인과의 관계
    bank: '', // 은행
    accountNumber: '', // 계좌번호
    isLunarBirthDate: false, // 음력 여부
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 부서별 팀 목록
  const departmentTeams: Record<string, string[]> = {
    'STE1실': ['LG전자 1팀', 'LG전자 2팀', '삼성전자 1팀'],
    'STE2실': ['현대자동차 1팀', 'SK하이닉스 1팀'],
    '경영전략실': ['경영지원팀', '사업전략팀'],
    '개발연구소': ['플랫폼개발팀', 'AI연구팀']
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // ID 입력 시 이메일 자동 설정
  const handleIdChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      id: id,
      email: id ? `${id}@tebell.co.kr` : ''
    }));
    setTouched(prev => ({ ...prev, id: true, email: true }));
  };

  // 부서 변경 핸들러
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      department: value,
      team: '' // 부서 변경 시 팀 초기화
    }));
    setTouched(prev => ({ ...prev, department: true, team: false }));
  };

  // 연락처 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 주민번호 포맷팅 함수
  const formatSSN = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');

    if (numbers.length <= 6) {
      return numbers;
    } else if (numbers.length <= 13) {
      return `${numbers.slice(0, 6)}-${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
    }
  };

  // 락처 변경 핸들러
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    setTouched(prev => ({ ...prev, phone: true }));
  };

  // 비상연락처 변경 핸들러
  const handleEmergencyContactChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, emergencyContact: formatted }));
    setTouched(prev => ({ ...prev, emergencyContact: true }));
  };

  // 주민번호 변경 핸들러
  const handleSSNChange = (value: string) => {
    const formatted = formatSSN(value);
    setFormData(prev => ({ ...prev, ssn: formatted }));
    setTouched(prev => ({ ...prev, ssn: true }));
  };

    const handleSave = async () => {
    // 필수 필드 검증
    const requiredFields = ['id', 'employeeCode', 'name', 'ssn', 'email', 'phone', 'joinDate', 'department', 'position'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 주민번호 형식 검증 (간단한 형식 체크)
    const ssnRegex = /^\d{6}-\d{7}$/;
    if (!ssnRegex.test(formData.ssn)) {
      toast.error('올바른 주민번호 형식을 입력해주세요. (예: 123456-1234567)');
      return;
    }

    // 저장할 데이터 준비
    const employeeData = {
      ...formData,
      profileImage: profileImage,
      registeredAt: new Date().toISOString(),
      registeredBy: 'admin', // 실제로는 로그인한 사용자 정보
    };

    // 실제 환경에서는 API 호출
    console.log('=== 저장할 직원 정보 ===');
    console.log(JSON.stringify(employeeData, null, 2));

    // API 호출 예시 (실제 구현 시 주석 해제)
    /*
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error('저장에 실패했습니다.');
      }

      const result = await response.json();
      console.log('저장 성공:', result);
    } catch (error) {
      console.error('저장 오류:', error);
      toast.error('저장 중 오류가 발생했습니다.');
      return;
    }
    */

    try {
      // 💡 2. 여기가 핵심! 부모가 내려준 onSubmit을 실행합니다.
      // formData를 Employee 타입으로 변환해서 보냅니다.
      await onSubmit(formData as unknown as Employee);

      // 3. 저장 성공 처리 (기존 코드...)
      toast.success(`${formData.name}님의 정보가 등록되었습니다.`);

      // 이후 폼 초기화 로직...
    } catch (error) {
        console.error('저장 중 발생한 상세 에러:', error); // 💡 여기서 error를 사용함!
        toast.error('저장 중 오류가 발생했습니다.');
    }

    // 폼 초기화 (다음 등록을 위해)
    setTimeout(() => {
      if (confirm('정보가 등록되었습니다. 다른 직원을 등록하시겠습니까?')) {
        // 폼 초기화
        setFormData({
          id: '',
          employeeCode: '',
          name: '',
          nameHanja: '',
          nameEng: '',
          birthDate: '',
          ssn: '',
          gender: '',
          email: '',
          phone: '',
          zipCode: '',
          roadAddress: '',
          detailAddress: '',
          joinDate: today,
          department: '',
          team: '',
          position: '',
          jobTitle: '',
          classification: '',
          employmentType: '',
          employmentStatus: '',
          job: '',
          education: '',
          school: '',
          major: '',
          totalCareer: '',
          swCareer: '',
          married: '',
          marriageAnniversary: '',
          emergencyContact: '',
          emergencyRelation: '',
          bank: '',
          accountNumber: '',
          isLunarBirthDate: false,
        });
        setProfileImage(null);
        setTouched({});
        setIsEditing(true);
      } else {
        // 등록 완료 후 조회 모드로 전환
        setIsEditing(false);
      }
    }, 500);
  };

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 있습니다. 취소하시겠습니까?')) {
      // 폼 초기화
      setFormData({
        id: '',
        employeeCode: '',
        name: '',
        nameHanja: '',
        nameEng: '',
        birthDate: '',
        ssn: '',
        gender: '',
        email: '',
        phone: '',
        zipCode: '',
        roadAddress: '',
        detailAddress: '',
        joinDate: today,
        department: '',
        team: '',
        position: '',
        jobTitle: '',
        classification: '',
        employmentType: '',
        employmentStatus: '',
        job: '',
        education: '',
        school: '',
        major: '',
        totalCareer: '',
        swCareer: '',
        married: '',
        marriageAnniversary: '',
        emergencyContact: '',
        emergencyRelation: '',
        bank: '',
        accountNumber: '',
        isLunarBirthDate: false,
      });
      setProfileImage(null);
      setTouched({});
    }
  };

    const getInputClassName = (field: string) => {
        if (!isEditing) return 'bg-muted/30';

        // 필수 항목인데 사용자가 건드렸고(touched), 현재 비어있다면 빨간색 테두리 표시
        const isRequired = ['id', 'employeeCode', 'name', 'ssn', 'email', 'phone', 'joinDate', 'department', 'position'].includes(field);
        const isError = isRequired && touched[field] && !formData[field as keyof typeof formData];

        if (isError) {
            return 'border-destructive bg-destructive/5 ring-destructive'; // 빨간색 에러 스타일
        }

        // 기본 스타일
        return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
    };

  // 샘플 주소 목록
  const sampleAddresses = [
    { zipCode: '06234', roadAddress: '서울특별시 강남구 테헤란로 152' },
    { zipCode: '13529', roadAddress: '경기도 성남시 분당구 판교역로 235' },
    { zipCode: '06236', roadAddress: '서울특별시 강남구 테헤란로 211' },
    { zipCode: '06177', roadAddress: '서울특별시 강남구 영동대로 513' },
    { zipCode: '06164', roadAddress: '서울특별시 강남구 테헤란로 78길 14-9' },
    { zipCode: '13494', roadAddress: '경기도 성남시 분당구 대왕판교로645번길 12' },
    { zipCode: '06292', roadAddress: '서울특별시 강남구 역삼로 180' },
    { zipCode: '06178', roadAddress: '서울특별시 강남구 테헤란로 322' },
  ];

  // 주소 검색 필터링
  const filteredAddresses = sampleAddresses.filter(addr =>
    addr.roadAddress.toLowerCase().includes(addressSearchQuery.toLowerCase()) ||
    addr.zipCode.includes(addressSearchQuery)
  );

  // 주소 선택
  const handleSelectAddress = (address: string, zipCode: string) => {
    setFormData(prev => ({
      ...prev,
      zipCode: zipCode,
      roadAddress: address,
    }));
    setTouched(prev => ({ ...prev, zipCode: true, roadAddress: true }));
    setIsAddressModalOpen(false);
    setAddressSearchQuery('');
  };

  // 필터링된 자산 목록 가져오기
  const getFilteredAssets = () => {
    let availableAssets = allAssets.filter(asset =>
      !assignedAssetCodes.includes(asset.assetCode) &&
      (asset.status === '가용' || !asset.assignee || asset.assignee === '')
    );

    if (assetSearchQuery) {
      const query = assetSearchQuery.toLowerCase();
      availableAssets = availableAssets.filter(asset =>
        asset.assetName.toLowerCase().includes(query) ||
        asset.model.toLowerCase().includes(query) ||
        asset.serialNumber.toLowerCase().includes(query) ||
        asset.assetCode.toLowerCase().includes(query)
      );
    }

    if (selectedAssetType !== '전체') {
      availableAssets = availableAssets.filter(asset =>
        asset.assetType === selectedAssetType
      );
    }

    return availableAssets;
  };

  // 자산 선택 토글
  const toggleAssetSelection = (assetCode: string) => {
    setSelectedAssetsToAdd(prev =>
      prev.includes(assetCode)
        ? prev.filter(code => code !== assetCode)
        : [...prev, assetCode]
    );
  };

  // 전체 선택/해제
  const toggleAllAssets = () => {
    const filteredAssets = getFilteredAssets();
    const filteredCodes = filteredAssets.map(a => a.assetCode);

    if (selectedAssetsToAdd.length === filteredCodes.length && filteredCodes.length > 0) {
      setSelectedAssetsToAdd([]);
    } else {
      setSelectedAssetsToAdd(filteredCodes);
    }
  };

  // 자산 할당
  const handleBatchAssignAssets = () => {
    if (selectedAssetsToAdd.length === 0) {
      toast.error('할당할 자산을 선택해주세요.');
      return;
    }

    setAssignedAssetCodes(prev => [...prev, ...selectedAssetsToAdd]);
    toast.success(`${selectedAssetsToAdd.length}개의 자산이 할당되었습니다.`);
    setSelectedAssetsToAdd([]);
    setIsAssetAssignDialogOpen(false);
  };

  // 자산 할당 해제
  const handleUnassignAsset = (assetCode: string) => {
    if (confirm('이 자산의 할당을 해제하시겠습니까?')) {
      setAssignedAssetCodes(assignedAssetCodes.filter(code => code !== assetCode));
      toast.success('자산 할당이 해제되었습니다.');
    }
  };

  // 자산 할당 다이얼로그 열기
  const handleOpenAssetAssignDialog = () => {
    setAssetSearchQuery('');
    setSelectedAssetType('전체');
    setSelectedAssetsToAdd([]);
    setIsAssetAssignDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>기본정보</h1>
          <p className="text-muted-foreground mt-1">새로운 직원의 기본 정보를 입력하세요.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            취소
          </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className="animate-spin mr-2">⏳</span>
                        저장 중...
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4 mr-2" />
                        저장
                    </>
                )}
            </Button>
        </div>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {/* 사진 업로드 */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    사진 업로드
                  </Button>
                </>
              )}
            </div>

            {/* 기본 정보 입력 필드 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">사번 <span className="text-destructive">*</span></label>
                <Input
                  value={formData.employeeCode}
                  onChange={(e) => handleInputChange('employeeCode', e.target.value)}
                  placeholder="사번"
                  className={getInputClassName('employeeCode')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">ID <span className="text-destructive">*</span></label>
                <Input
                  value={formData.id}
                  onChange={(e) => handleIdChange(e.target.value)}
                  placeholder="로그인 ID"
                  className={getInputClassName('id')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">성명 <span className="text-destructive">*</span></label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="홍길동"
                  className={getInputClassName('name')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">주민번호 <span className="text-destructive">*</span></label>
                <Input
                  value={formData.ssn}
                  onChange={(e) => handleSSNChange(e.target.value)}
                  placeholder="000000-0000000"
                  className={getInputClassName('ssn')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">한자이름</label>
                <Input
                  value={formData.nameHanja}
                  onChange={(e) => handleInputChange('nameHanja', e.target.value)}
                  placeholder="漢字명"
                  className={getInputClassName('nameHanja')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">영문이름</label>
                <Input
                  value={formData.nameEng}
                  onChange={(e) => handleInputChange('nameEng', e.target.value)}
                  placeholder="English Name"
                  className={getInputClassName('nameEng')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">입사일 <span className="text-destructive">*</span></label>
                <Input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  className={getInputClassName('joinDate')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">연락처 <span className="text-destructive">*</span></label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="010-0000-0000"
                  className={getInputClassName('phone')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">이메일 <span className="text-destructive">*</span></label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@tebell.co.kr"
                  className={getInputClassName('email')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">생년월일</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={getInputClassName('birthDate')}
                    disabled={!isEditing}
                  />
                  <label className="flex items-center gap-2 px-3 border rounded-md bg-background cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isLunarBirthDate}
                      onChange={(e) => handleInputChange('isLunarBirthDate', e.target.checked)}
                      disabled={!isEditing}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm whitespace-nowrap">음력</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">성별</label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: string) => handleInputChange('gender', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={getInputClassName('gender')}>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="남">남</SelectItem>
                    <SelectItem value="여">여</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 조직 정보 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>조직 정보</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsOrgInfoExpanded(!isOrgInfoExpanded)}
          >
            {isOrgInfoExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className={isOrgInfoExpanded ? '' : 'hidden'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">부서 <span className="text-destructive">*</span></label>
              <Select
                value={formData.department}
                onValueChange={handleDepartmentChange}
                disabled={!isEditing}
              >
                <SelectTrigger className={getInputClassName('department')}>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STE1실">STE1실</SelectItem>
                  <SelectItem value="STE2실">STE2실</SelectItem>
                  <SelectItem value="경영전략실">경영전략실</SelectItem>
                  <SelectItem value="개발연구소">개발연구소</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">팀</label>
              {departmentTeams[formData.department]?.length > 0 ? (
                <Select
                  value={formData.team}
                  onValueChange={(value: string) => handleInputChange('gender', value)}
                  disabled={!isEditing || !formData.department}
                >
                  <SelectTrigger className={getInputClassName('team')}>
                    <SelectValue placeholder="팀을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="소속 없음">소속 없음</SelectItem>
                    {departmentTeams[formData.department].map((team) => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={formData.department ? "소속 없음" : ""}
                  disabled
                  placeholder="부서를 먼저 선택하세요"
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">직급 <span className="text-destructive">*</span></label>
              <Select
                value={formData.position}
                onValueChange={(value: string) => handleInputChange('position', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={getInputClassName('position')}>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="사원">사원</SelectItem>
                  <SelectItem value="선임">선임</SelectItem>
                  <SelectItem value="책임">책임</SelectItem>
                  <SelectItem value="수석">수석</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">직책</label>
              <Select
                value={formData.jobTitle}
                onValueChange={(value: string) => handleInputChange('jobTitle', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={getInputClassName('jobTitle')}>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="직책 없음">직책 없음</SelectItem>
                  <SelectItem value="파트장">파트장</SelectItem>
                  <SelectItem value="팀장">팀장</SelectItem>
                  <SelectItem value="실장">실장</SelectItem>
                  <SelectItem value="이사">이사</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">구분 <span className="text-destructive">*</span></label>
              <Select
                value={formData.classification}
                onValueChange={(value: string) => handleInputChange('classification', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={getInputClassName('classification')}>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="투입_정산">투입_정산</SelectItem>
                  <SelectItem value="투입_지원">투입_지원</SelectItem>
                  <SelectItem value="대기">대기</SelectItem>
                  <SelectItem value="관리">관리</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상세 정보 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>상세 정보</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsDetailInfoExpanded(!isDetailInfoExpanded)}
          >
            {isDetailInfoExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className={isDetailInfoExpanded ? 'space-y-6' : 'hidden'}>
          {/* 고용 정보 */}
          <div>
            <h3 className="text-sm mb-3 text-foreground opacity-80">고용 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">직원유형</label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value: string) => handleInputChange('employmentType', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={getInputClassName('employmentType')}>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="정규직">정규직</SelectItem>
                    <SelectItem value="계약직">계약직</SelectItem>
                    <SelectItem value="프리랜서">프리랜서</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">재직구</label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value: string) => handleInputChange('employmentStatus', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={getInputClassName('employmentStatus')}>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="재직">재직</SelectItem>
                    <SelectItem value="휴직">휴직</SelectItem>
                    <SelectItem value="퇴직">퇴직</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">직무구분</label>
                <Input
                  value={formData.job}
                  onChange={(e) => handleInputChange('job', e.target.value)}
                  placeholder="예: 프론트엔드 개발"
                  className={getInputClassName('job')}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* 학력 및 경력 정보 */}
          <div>
            <h3 className="text-sm mb-3 text-foreground opacity-80">학력 및 경력</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">최종학력</label>
                <Select
                  value={formData.education}
                  onValueChange={(value: string) => handleInputChange('education', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={getInputClassName('education')}>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="박사">박사</SelectItem>
                    <SelectItem value="석사">석사</SelectItem>
                    <SelectItem value="학사">학사</SelectItem>
                    <SelectItem value="전문학사">전문학사</SelectItem>
                    <SelectItem value="고졸">고졸</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">최종학교</label>
                <Input
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  placeholder="학교명을 입력하세요"
                  className={getInputClassName('school')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">전공</label>
                <Input
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  placeholder="전공을 입력하세요"
                  className={getInputClassName('major')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">총 경력 (년)</label>
                <Input
                  type="number"
                  value={formData.totalCareer}
                  onChange={(e) => handleInputChange('totalCareer', e.target.value)}
                  placeholder="0"
                  className={getInputClassName('totalCareer')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">전 SW경력 (년)</label>
                <Input
                  type="number"
                  value={formData.swCareer}
                  onChange={(e) => handleInputChange('swCareer', e.target.value)}
                  placeholder="0"
                  className={getInputClassName('swCareer')}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* 개인 정보 */}
          <div>
            <h3 className="text-sm mb-3 text-foreground opacity-80">개인 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">결혼유무</label>
                <Select
                  value={formData.married}
                  onValueChange={(value: string) => handleInputChange('married', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={getInputClassName('married')}>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="기혼">기혼</SelectItem>
                    <SelectItem value="미혼">미혼</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">결혼기념일</label>
                <Input
                  type="date"
                  value={formData.marriageAnniversary}
                  onChange={(e) => handleInputChange('marriageAnniversary', e.target.value)}
                  className={getInputClassName('marriageAnniversary')}
                  disabled={!isEditing || formData.married !== '기혼'}
                />
              </div>
            </div>
          </div>

          {/* 비상연락망 */}
          <div>
            <h3 className="text-sm mb-3 text-foreground opacity-80">비상연락망</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">비상연락처</label>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => handleEmergencyContactChange(e.target.value)}
                  placeholder="010-0000-0000"
                  className={getInputClassName('emergencyContact')}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">본인과의 관계</label>
                <Input
                  value={formData.emergencyRelation}
                  onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                  placeholder="예: 배우자, 부모 등"
                  className={getInputClassName('emergencyRelation')}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* 급여 정보 */}
          <div>
            <h3 className="text-sm mb-3 text-foreground opacity-80">급여 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">은행</label>
                <Select
                  value={formData.bank}
                  onValueChange={(value: string) => handleInputChange('bank', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={getInputClassName('bank')}>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KB국민은행">KB국민은행</SelectItem>
                    <SelectItem value="신한은행">신한은행</SelectItem>
                    <SelectItem value="우리은행">우리은행</SelectItem>
                    <SelectItem value="하나은행">하나은행</SelectItem>
                    <SelectItem value="NH농협은행">NH농협은행</SelectItem>
                    <SelectItem value="IBK기업은행">IBK기업은행</SelectItem>
                    <SelectItem value="SC제일은행">SC제일은행</SelectItem>
                    <SelectItem value="카카오뱅크">카카오뱅크</SelectItem>
                    <SelectItem value="토스뱅크">토스뱅크</SelectItem>
                    <SelectItem value="케이뱅크">케이뱅크</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1.5 block text-muted-foreground">좌번호</label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="계좌번호를 입력하세요"
                  className={getInputClassName('accountNumber')}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* 주소 정보 */}
          <div>
            <h3 className="text-sm mb-3 text-foreground opacity-80">주소 정보</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={formData.zipCode}
                  disabled
                  placeholder="우편번호"
                  className="w-32 bg-muted"
                />
                <Input
                  value={formData.roadAddress}
                  disabled
                  placeholder="주소 검색 버튼을 클릭하세요"
                  className="flex-1 bg-muted"
                />
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="shrink-0"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    주소 검색
                  </Button>
                )}
              </div>
              <div>
                <Input
                  value={formData.detailAddress}
                  onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                  placeholder="상세주소를 입력하세요"
                  className={getInputClassName('detailAddress')}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 자산 정보 */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsAssetInfoExpanded(!isAssetInfoExpanded)}>
          <div className="flex items-center justify-between">
            <CardTitle>자산 정보</CardTitle>
            {isAssetInfoExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {isAssetInfoExpanded && (() => {
          // 현재 할당된 자산 목록 필터링
          const assignedAssets = allAssets.filter(asset => assignedAssetCodes.includes(asset.assetCode));

          // 자산 타입별 아이콘 반환
          const getAssetIcon = (type: string) => {
            if (type.includes('노트북') || type.includes('데스크탑')) {
              return <Package className="h-5 w-5 text-blue-600" />;
            } else if (type.includes('모니터')) {
              return <Monitor className="h-5 w-5 text-green-600" />;
            } else if (type.includes('휴대폰')) {
              return <Smartphone className="h-5 w-5 text-purple-600" />;
            } else if (type.includes('키보드') || type.includes('마우스')) {
              return <Keyboard className="h-5 w-5 text-orange-600" />;
            }
            return <Package className="h-5 w-5 text-gray-600" />;
          };

          // 자산 상태별 배지 색상
          const getStatusColor = (status: string) => {
            switch (status) {
              case '사용중':
                return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400';
              case '가용':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
              case '수리중':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400';
              case '폐기예정':
                return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400';
              default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400';
            }
          };

          return (
            <CardContent className="space-y-4">
              {assignedAssets.length > 0 ? (
                <>
                  {/* 자산 요약 */}
                  <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">총 할당 자산</span>
                      <Badge variant="default" className="text-lg px-3 py-1">
                        {assignedAssets.length}개
                      </Badge>
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        onClick={handleOpenAssetAssignDialog}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        자산 할당
                      </Button>
                    )}
                  </div>

                  {/* 자산 목록 테이블 */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">자산코드</th>
                          <th className="text-left p-3 font-medium">자산명</th>
                          <th className="text-left p-3 font-medium">유형</th>
                          <th className="text-left p-3 font-medium">제조사</th>
                          <th className="text-left p-3 font-medium">모델명</th>
                          <th className="text-left p-3 font-medium">시리얼번호</th>
                          <th className="text-center p-3 font-medium">상태</th>
                          <th className="text-left p-3 font-medium">구매일</th>
                          {isEditing && <th className="text-center p-3 font-medium">작업</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {assignedAssets.map((asset) => (
                          <tr
                            key={asset.assetCode}
                            className="border-b last:border-b-0 hover:bg-accent/30 transition-colors"
                          >
                            <td className="p-3">
                              <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                                {asset.assetCode}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {getAssetIcon(asset.assetType)}
                                <span className="font-medium">{asset.assetName}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">{asset.assetType}</td>
                            <td className="p-3 text-sm">{asset.manufacturer}</td>
                            <td className="p-3 text-sm">{asset.model}</td>
                            <td className="p-3">
                              <span className="text-xs font-mono text-muted-foreground">
                                {asset.serialNumber}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <Badge className={getStatusColor(asset.status)}>
                                {asset.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {asset.purchaseDate}
                            </td>
                            {isEditing && (
                              <td className="p-3 text-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUnassignAsset(asset.assetCode)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 자산 유형별 요약 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    {(() => {
                      const assetTypeCounts: { [key: string]: number } = {};
                      assignedAssets.forEach(asset => {
                        assetTypeCounts[asset.assetType] = (assetTypeCounts[asset.assetType] || 0) + 1;
                      });

                      return Object.entries(assetTypeCounts).map(([type, count]) => (
                        <div key={type} className="p-3 bg-muted/30 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">{type}</div>
                          <div className="text-lg font-semibold">{count}개</div>
                        </div>
                      ));
                    })()}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground text-lg mb-1">할당된 자산이 없습니다</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isEditing ? '아래 버튼을 클릭하여 자산을 할당하세요' : '자산관리 메뉴에서 자산을 할당할 수 있습니다'}
                  </p>
                  {isEditing && (
                    <Button
                      onClick={handleOpenAssetAssignDialog}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      자산 할당
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          );
        })()}
      </Card>

      {/* 주소 검색 모달 */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>주소 검색</DialogTitle>
            <DialogDescription>
              검색어를 입력하거나 아래 목록에서 주소를 선택하세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="도로명, 건물명 등을 입력하세요"
              value={addressSearchQuery}
              onChange={(e) => setAddressSearchQuery(e.target.value)}
              className="w-full"
            />
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredAddresses.length > 0 ? (
                <div className="divide-y">
                  {filteredAddresses.map((addr, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAddress(addr.roadAddress, addr.zipCode)}
                      className="w-full text-left p-4 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-0.5">{addr.zipCode}</Badge>
                        <div className="flex-1">
                          <p className="text-sm">{addr.roadAddress}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  {addressSearchQuery ? '검색 결과가 없습니다.' : '검색어를 입력하세요.'}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              * 실제 운영 환경에서는 Daum 우편���호 서비스와 연동됩니다.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 자산 할당 모달 */}
      <Dialog open={isAssetAssignDialogOpen} onOpenChange={setIsAssetAssignDialogOpen}>
        <DialogContent className="w-[90vw] sm:max-w-[1600px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>자산 할당</DialogTitle>
            <DialogDescription>
              할당할 자산을 선택하세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {/* 검색 및 필터 */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="자산명, 모델명, 시리얼번호로 검색..."
                  value={assetSearchQuery}
                  onChange={(e) => setAssetSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="노트북">노트북</SelectItem>
                  <SelectItem value="데스크탑">데스크탑</SelectItem>
                  <SelectItem value="모니터">모니터</SelectItem>
                  <SelectItem value="휴대폰">휴대폰</SelectItem>
                  <SelectItem value="키보드/마우스">키보드/마우스</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 할당 가능한 자산 목록 */}
            <div className="border rounded-lg overflow-hidden flex-1 overflow-y-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-background border-b sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="text-center p-3 font-medium whitespace-nowrap w-12 bg-muted/80">
                      <Checkbox
                        checked={(() => {
                          const filteredAssets = getFilteredAssets();
                          return filteredAssets.length > 0 && selectedAssetsToAdd.length === filteredAssets.length;
                        })()}
                        onCheckedChange={toggleAllAssets}
                      />
                    </th>
                    <th className="text-left p-3 font-medium whitespace-nowrap bg-muted/80">자산코드</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap bg-muted/80">자산명</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap bg-muted/80">유형</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap bg-muted/80">제조사</th>
                    <th className="text-left p-3 font-medium whitespace-nowrap bg-muted/80">모델명</th>
                    <th className="text-center p-3 font-medium whitespace-nowrap bg-muted/80">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const availableAssets = getFilteredAssets();

                    if (availableAssets.length === 0) {
                      return (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            할당 가능한 자산이 없습니다
                          </td>
                        </tr>
                      );
                    }

                    return availableAssets.map(asset => (
                      <tr key={asset.assetCode} className="border-b last:border-b-0 hover:bg-accent/30">
                        <td className="p-3 text-center">
                          <Checkbox
                            checked={selectedAssetsToAdd.includes(asset.assetCode)}
                            onCheckedChange={() => toggleAssetSelection(asset.assetCode)}
                          />
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                            {asset.assetCode}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-medium">{asset.assetName}</span>
                        </td>
                        <td className="p-3 text-sm">{asset.assetType}</td>
                        <td className="p-3 text-sm">{asset.manufacturer}</td>
                        <td className="p-3 text-sm">{asset.model}</td>
                        <td className="p-3 text-center">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400">
                            {asset.status}
                          </Badge>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              {selectedAssetsToAdd.length > 0 && (
                <span>{selectedAssetsToAdd.length}개의 자산 선택됨</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAssetsToAdd([]);
                  setIsAssetAssignDialogOpen(false);
                }}
              >
                취소
              </Button>
              <Button
                onClick={handleBatchAssignAssets}
                disabled={selectedAssetsToAdd.length === 0}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                할당 ({selectedAssetsToAdd.length})
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}