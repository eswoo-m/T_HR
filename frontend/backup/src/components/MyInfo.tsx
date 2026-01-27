import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { AcademicEducationDialog } from './AcademicEducationDialog';
import { 
  User, 
  Save, 
  Edit, 
  X,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  FolderOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Building2,
  Users,
  FileText,
  Search,
  Upload
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

// 사용도구 목록 (CodeManagement에서 관리되는 도구들)
const AVAILABLE_TOOLS = [
  'JIRA',
  'Git',
  'Docker',
  'Kubernetes',
  'AWS',
  'GCP',
  'Azure',
  'Jenkins',
  'GitLab',
  'Selenium',
  'TestNG',
  'JMeter',
  'Postman',
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Angular',
  'Spring Boot',
  'Node.js',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Oracle',
  'Redis',
];

// 자격증 정보
interface Certification {
  id: string;
  name: string;
  category: string; // 구분
  issuer: string;
  issueDate: string;
  note: string; // 비고
  certNumber?: string; // 자격증번호
  expiryDate?: string; // 만료일
  attachmentFile?: File | null; // 자격증 사본 파일
  attachmentFileName?: string; // 파일명 (저장용)
}

// 교육 이수 정보
interface Education {
  id: string;
  courseName: string;
  institution: string;
  startDate: string;
  endDate: string;
  hours: number;
  description: string;
}

// 학력 정보
interface AcademicEducation {
  id: string;
  level: string; // 학력 (박사, 석사, 학사 등)
  school: string; // 학교명
  major: string; // 전공
  admissionDate: string; // 입학일
  graduationDate: string; // 졸업일
  status: string; // 상태 (졸업, 수료, 재학)
}

// 과거 경력 정보
interface PastCareer {
  id: string;
  client: string; // 고객사명
  projectName: string;
  description: string; // 수행업무내역
  period: string; // 수행기간
  role: string;
  teamSize?: number; // 인력수
  field?: string; // 과제분야 (상세정보)
  location?: string; // 위치 (상세정보)
  tools?: string; // 사용도구 (상세정보)
  overview?: string; // 과제개요 (상세정보)
  detailWork?: string; // 진행업무상세내용 (상세정보)
  contribution?: string; // 프로젝트 기��사항 (상세정보)
}

// 회사 경력 정보 (전직장 경력)
interface CompanyCareer {
  id: string;
  company: string; // 회사명
  position: string; // 직위/직급
  department: string; // 부서
  startDate: string; // 입사일
  endDate: string; // 퇴사일
  responsibilities: string; // 담당업무
  relevance: string; // 업무 관련성 (유관, 무관, 유사)
}

// 프로젝트 경력 정보
interface ProjectCareer {
  id: string;
  client: string; // 고객사
  projectName: string;
  role: string;
  period: string; // 수행기간
  description: string;
  teamSize?: number; // 인력수
  field?: string; // 과제분야 (상세정보)
  location?: string; // 위치 (상세정보)
  tools?: string; // 사용도구 (상세정보)
  overview?: string; // 과제개요 (상세정보)
  detailWork?: string; // 진행업무상세내용 (상세정보)
  contribution?: string; // 프로젝트 기여사항 (상세정보)
}

export function MyInfo() {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  
  // 샘플 주소 데이터
  const sampleAddresses = [
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
    setBasicInfo({
      ...basicInfo,
      postalCode: zipCode,
      roadAddress: address,
    });
    setIsAddressModalOpen(false);
    setAddressSearchQuery('');
  };
  
  // 기본 정보
  const [basicInfo, setBasicInfo] = useState({
    employeeCode: 'EMP-015',
    id: 'EMP-015',
    name: '홍길동',
    nameHanja: '洪吉童',
    nameEng: 'Hong Gil-dong',
    ssn: '900515-1234567',
    gender: '남',
    email: 'EMP-015@tebell.co.kr',
    phone: '010-1234-5678',
    mobile: '010-1234-5678',
    postalCode: '06234',
    roadAddress: '서울특별시 강남구 테헤란로 123',
    detailAddress: '티벨빌딩 5층',
    birthDate: '1990-05-15',
    isLunarBirthDate: true, // 음력 여부
    joinDate: '2020-03-01',
    resignDate: '',
    department: 'STE1실',
    team: 'LG전자 1팀',
    position: '선임',
    role: '-',
    emergencyContact: '010-9876-5432',
    emergencyName: '김영희',
    emergencyRelation: '배우자',
    maritalStatus: '기혼',
    anniversaryDate: '2015-06-20',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', // 프로필 사진
  });

  // 자격증 목록
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 'CERT-001',
      name: '정보처리기사',
      category: '취득',
      issuer: '한국산업인력공단',
      issueDate: '2018.08.17',
      note: '기본 자격증',
      certNumber: '18-1234567',
      expiryDate: '',
      attachmentFile: null,
      attachmentFileName: '',
    },
    {
      id: 'CERT-002',
      name: 'SQLD',
      category: '취득',
      issuer: '한국데이터산업진흥원',
      issueDate: '2019.12.06',
      note: '데이터베이스 관리',
      certNumber: 'SQLD-2019-12345',
      expiryDate: '2024-12-06',
      attachmentFile: null,
      attachmentFileName: 'sqld_certificate.pdf',
    },
  ]);

  // 학력 목록
  const [academicEducations, setAcademicEducations] = useState<AcademicEducation[]>([
    {
      id: 'AEDU-001',
      level: '학사',
      school: '서울대학교',
      major: '컴퓨터공학',
      admissionDate: '2014-03-02',
      graduationDate: '2018-02-28',
      status: '졸업',
    },
  ]);
  const [isAcademicEducationDialogOpen, setIsAcademicEducationDialogOpen] = useState(false);
  const [editingAcademicEducation, setEditingAcademicEducation] = useState<AcademicEducation | null>(null);

  // 교육 이수 목록
  const [educations, setEducations] = useState<Education[]>([
    {
      id: 'EDU-001',
      courseName: 'AWS 클라우드 아키텍처 과정',
      institution: 'AWS Training',
      startDate: '2023.01.10',
      endDate: '2023.01.20',
      hours: 40,
      description: 'AWS 클라우드 서비스 설계 및 구축',
    },
    {
      id: 'EDU-002',
      courseName: '소프트웨어 테스팅 전문가 과정',
      institution: '한국정보통신기술협회',
      startDate: '2022.06.01',
      endDate: '2022.06.30',
      hours: 80,
      description: '소프트웨어 테스팅 방법론 및 자동화',
    },
  ]);

  // 과거 경력 목록
  const [pastCareers, setPastCareers] = useState<PastCareer[]>([
    {
      id: 'PAST-001',
      client: 'LG전자',
      projectName: '품질관리 시스템 구축',
      description: 'ERP 시스템 개발 및 유지보수 담당',
      period: '2017.01.02 ~ 2020.02.28',
      role: '사원',
      teamSize: 5,
      field: '품질관리 시스템',
      location: '서울특별시 강남구',
      tools: 'Java, Selenium, TestNG, Jenkins',
      overview: 'LG전자 품질관리 시스템 구축 프로젝트',
      detailWork: 'ERP 시스템 개발 및 유지보수 담당',
      contribution: '품질관리 시스템 개발 및 유지보수에 기여',
    },
  ]);

  // 프로젝트 경력 목록
  const [projectCareers, setProjectCareers] = useState<ProjectCareer[]>([
    {
      id: 'PROJ-001',
      client: 'LG전자',
      projectName: '품질관리 시스템 구축',
      role: '테스트 엔지니어',
      period: '2023.03.01 ~ 2023.12.31',
      description: '품질관리 시스템 테스트 설계 및 수행',
      teamSize: 5,
      field: '품질관리 시스템',
      location: '서울특별시 강남구',
      tools: 'Java, Selenium, TestNG, Jenkins',
      overview: 'LG전자 품질관리 시스템 구축 프로젝트',
      detailWork: 'ERP 시스템 개발 및 유지보수 담당',
      contribution: '품질관리 시스템 개발 및 유지보수에 기여',
    },
    {
      id: 'PROJ-002',
      client: '삼성SDS',
      projectName: '클라우드 마이그레이션',
      role: '테스트 리드',
      period: '2022.01.01 ~ 2022.12.31',
      description: '온프레미스에서 AWS 클라우드로 마이그레이션 테스트',
      teamSize: 10,
      field: '클라우드 마이그레이션',
      location: '서울특별시 강남구',
      tools: 'AWS, Python, JMeter, Docker',
      overview: '삼성SDS 클라우드 마이그레이션 프로젝트',
      detailWork: '온프레미스에서 AWS 클라우드로 마이그레이션 테스트 수행',
      contribution: '클라우드 마이그레이션 테스트에 기여',
    },
  ]);

  // 회사 경력 목록 (전직장 경력)
  const [companyCareers, setCompanyCareers] = useState<CompanyCareer[]>([
    {
      id: 'COM-001',
      company: '삼성전자',
      position: '과장',
      department: '개발1팀',
      startDate: '2015-03-01',
      endDate: '2020-02-28',
      responsibilities: '웹 애플리케이션 개발, 서버 관리',
      relevance: '유관',
    },
  ]);

  // 다이얼로그 상태
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [isEduDialogOpen, setIsEduDialogOpen] = useState(false);
  const [isPastCareerDialogOpen, setIsPastCareerDialogOpen] = useState(false);
  const [isCompanyCareerDialogOpen, setIsCompanyCareerDialogOpen] = useState(false);
  const [isProjectCareerDialogOpen, setIsProjectCareerDialogOpen] = useState(false);
  
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [editingPastCareer, setEditingPastCareer] = useState<PastCareer | null>(null);
  const [editingCompanyCareer, setEditingCompanyCareer] = useState<CompanyCareer | null>(null);
  const [editingProjectCareer, setEditingProjectCareer] = useState<ProjectCareer | null>(null);

  // 입력 필드 CSS
  const getInputClassName = (value: string, isRequired: boolean = false) => {
    if (!isEditing) return 'bg-muted/30';
    return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
  };

  const getSelectClassName = (value: string) => {
    if (!isEditing) return 'bg-muted/30';
    if (!value || value.trim() === '') return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
    return 'bg-white';
  };

  // 기본정보 저장
  const handleSaveBasicInfo = () => {
    toast.success('기본 정보가 저장되었습니다');
    setIsEditing(false);
  };

  // 프로필 사진 업로드
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다');
        return;
      }
      
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 크기는 5MB 이하여야 합니다');
        return;
      }

      // 파일을 읽어서 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setBasicInfo({ ...basicInfo, photoUrl: reader.result as string });
        toast.success('프로필 사진이 업로드되었습니다');
      };
      reader.readAsDataURL(file);
    }
  };

  // 자격증 추가/수정
  const handleSaveCert = (cert: Certification) => {
    if (editingCert) {
      setCertifications(certifications.map(c => c.id === cert.id ? cert : c));
      toast.success('자격증 정보가 수정되었습니다');
    } else {
      setCertifications([...certifications, { ...cert, id: `CERT-${String(certifications.length + 1).padStart(3, '0')}` }]);
      toast.success('자격증이 추가되었습니다');
    }
    setIsCertDialogOpen(false);
    setEditingCert(null);
  };

  // 자격증 삭제
  const handleDeleteCert = (id: string) => {
    if (confirm('자격증을 삭제하시겠습니까?')) {
      setCertifications(certifications.filter(c => c.id !== id));
      toast.success('자격증이 삭제되었습니다');
    }
  };

  // 교육 추가/수정
  const handleSaveEdu = (edu: Education) => {
    if (editingEdu) {
      setEducations(educations.map(e => e.id === edu.id ? edu : e));
      toast.success('교육 이수 정보가 수정되었습니다');
    } else {
      setEducations([...educations, { ...edu, id: `EDU-${String(educations.length + 1).padStart(3, '0')}` }]);
      toast.success('교육 이수가 추가되었습니다');
    }
    setIsEduDialogOpen(false);
    setEditingEdu(null);
  };

  // 교육 삭제
  const handleDeleteEdu = (id: string) => {
    if (confirm('교육 이수를 삭제하시겠습니까?')) {
      setEducations(educations.filter(e => e.id !== id));
      toast.success('교육 이수가 삭제되었습니다');
    }
  };

  // 과거경력 추가/수정
  const handleSavePastCareer = (career: PastCareer) => {
    if (editingPastCareer) {
      setPastCareers(pastCareers.map(c => c.id === career.id ? career : c));
      toast.success('과거 경력이 수정되었습니다');
    } else {
      setPastCareers([...pastCareers, { ...career, id: `PAST-${String(pastCareers.length + 1).padStart(3, '0')}` }]);
      toast.success('과거 경력이 추가되었습니다');
    }
    setIsPastCareerDialogOpen(false);
    setEditingPastCareer(null);
  };

  // 과거프로젝트경력 삭제
  const handleDeletePastCareer = (id: string) => {
    if (confirm('과거 프로젝트 경력을 삭제하시겠습니까?')) {
      setPastCareers(pastCareers.filter(c => c.id !== id));
      toast.success('과거 프로젝트 경력이 삭제되었습니다');
    }
  };

  // 회사경력 추가/수정
  const handleSaveCompanyCareer = (career: CompanyCareer) => {
    if (editingCompanyCareer) {
      setCompanyCareers(companyCareers.map(c => c.id === career.id ? career : c));
      toast.success('경력 정보가 수정되었습니다');
    } else {
      setCompanyCareers([...companyCareers, { ...career, id: `COM-${String(companyCareers.length + 1).padStart(3, '0')}` }]);
      toast.success('경력 정보가 추가되었습니다');
    }
    setIsCompanyCareerDialogOpen(false);
    setEditingCompanyCareer(null);
  };

  // 회사경력 삭제
  const handleDeleteCompanyCareer = (id: string) => {
    if (confirm('이 경력 정보를 삭제하시겠습니까?')) {
      setCompanyCareers(companyCareers.filter(c => c.id !== id));
      toast.success('경력 정보가 삭제되었습니다');
    }
  };

  // 총 경력 계산 (년 단위, 소수점 1자리)
  const calculateTotalCareer = (): string => {
    if (companyCareers.length === 0) return '0';
    
    let totalDays = 0;
    
    companyCareers.forEach(career => {
      if (career.startDate && career.endDate) {
        const start = new Date(career.startDate);
        const end = new Date(career.endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      }
    });
    
    const totalYears = totalDays / 365;
    return totalYears.toFixed(1);
  };

  // 전 SW경력 계산 (업무 관련성이 "유관"인 경력만 계산)
  const calculateSWCareer = (): string => {
    if (companyCareers.length === 0) return '0';
    
    let totalDays = 0;
    
    companyCareers.forEach(career => {
      if (career.startDate && career.endDate && career.relevance === '유관') {
        const start = new Date(career.startDate);
        const end = new Date(career.endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDays += diffDays;
      }
    });
    
    const totalYears = totalDays / 365;
    return totalYears.toFixed(1);
  };

  // 프로젝트 경력 추가/수정
  const handleSaveProjectCareer = (career: ProjectCareer) => {
    if (editingProjectCareer) {
      setProjectCareers(projectCareers.map(c => c.id === career.id ? career : c));
      toast.success('프로젝트 경력이 수정되었습니다');
    } else {
      setProjectCareers([...projectCareers, { ...career, id: `PROJ-${String(projectCareers.length + 1).padStart(3, '0')}` }]);
      toast.success('프로젝트 경력이 추가되었습니다');
    }
    setIsProjectCareerDialogOpen(false);
    setEditingProjectCareer(null);
  };

  // 프로젝트 경력 삭제
  const handleDeleteProjectCareer = (id: string) => {
    if (confirm('프로젝트 경력을 삭제하시겠습니까?')) {
      setProjectCareers(projectCareers.filter(c => c.id !== id));
      toast.success('프로젝트 경력이 삭제되었습니다');
    }
  };

  // 학력 추가/수정
  const handleSaveAcademicEducation = (education: AcademicEducation) => {
    if (editingAcademicEducation) {
      setAcademicEducations(academicEducations.map(e => e.id === education.id ? education : e));
      toast.success('학력 정보가 수정되었습니다');
    } else {
      setAcademicEducations([...academicEducations, { ...education, id: `AEDU-${String(academicEducations.length + 1).padStart(3, '0')}` }]);
      toast.success('학력 정보가 추가되었습니다');
    }
    setIsAcademicEducationDialogOpen(false);
    setEditingAcademicEducation(null);
  };

  // 학력 삭제
  const handleDeleteAcademicEducation = (id: string) => {
    if (confirm('이 학력 정보를 삭제하시겠습니까?')) {
      setAcademicEducations(academicEducations.filter(e => e.id !== id));
      toast.success('학력 정보가 삭제되었습니다');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1>내정보관리</h1>
        <p className="text-muted-foreground mt-1">나의 기본정보, 역량, 경력 정보를 관리합니다</p>
      </div>

      {/* 사용자 프로필 카드 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {basicInfo.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{basicInfo.name}</h2>
                <Badge variant="outline">{basicInfo.employeeCode}</Badge>
                <Badge className="bg-blue-500">{basicInfo.position}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {basicInfo.department}
                </div>
                {basicInfo.team && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {basicInfo.team}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  입사일: {basicInfo.joinDate}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="basic" className="flex-col sm:flex-row gap-1 px-2">
            <User className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm">기본정보</span>
          </TabsTrigger>
          <TabsTrigger value="competency" className="flex-col sm:flex-row gap-1 px-2">
            <Award className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm whitespace-nowrap">자격증/교육</span>
          </TabsTrigger>
          <TabsTrigger value="company-career" className="flex-col sm:flex-row gap-1 px-2">
            <Building2 className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm">과거경력</span>
          </TabsTrigger>
          <TabsTrigger value="past-career" className="flex-col sm:flex-row gap-1 px-2">
            <Briefcase className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm whitespace-nowrap">과거PJT</span>
          </TabsTrigger>
          <TabsTrigger value="project-career" className="flex-col sm:flex-row gap-1 px-2">
            <FolderOpen className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm whitespace-nowrap">PJT경력</span>
          </TabsTrigger>
        </TabsList>

        {/* 기본정보 탭 */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>기본 정보</CardTitle>
                  <CardDescription>개인 정보 및 연락처</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      취소
                    </Button>
                    <Button onClick={handleSaveBasicInfo}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* 사진 업로드 */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center">
                    {basicInfo.photoUrl ? (
                      <img src={basicInfo.photoUrl} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById('photo-upload')?.click()}
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
                      value={basicInfo.employeeCode}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">ID <span className="text-destructive">*</span></label>
                    <Input
                      value={basicInfo.id}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">성명 <span className="text-destructive">*</span></label>
                    <Input
                      value={basicInfo.name}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">주민번호 <span className="text-destructive">*</span></label>
                    <Input
                      value={basicInfo.ssn}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">한자이름</label>
                    <Input
                      value={basicInfo.nameHanja}
                      onChange={(e) => setBasicInfo({ ...basicInfo, nameHanja: e.target.value })}
                      disabled={!isEditing}
                      placeholder="漢字명"
                      className={getInputClassName(basicInfo.nameHanja, false)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">영문이름</label>
                    <Input
                      value={basicInfo.nameEng}
                      onChange={(e) => setBasicInfo({ ...basicInfo, nameEng: e.target.value })}
                      disabled={!isEditing}
                      placeholder="English Name"
                      className={getInputClassName(basicInfo.nameEng, false)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">입사일 <span className="text-destructive">*</span></label>
                    <Input
                      type="date"
                      value={basicInfo.joinDate}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">퇴사일</label>
                    <Input
                      type="date"
                      value={basicInfo.resignDate}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">연락처 <span className="text-destructive">*</span></label>
                    <Input
                      value={basicInfo.phone}
                      onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="010-0000-0000"
                      className={getInputClassName(basicInfo.phone, true)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">이메일 <span className="text-destructive">*</span></label>
                    <Input
                      type="email"
                      value={basicInfo.email}
                      disabled
                      placeholder="example@tebell.co.kr"
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">생년월일</label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={basicInfo.birthDate}
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                      />
                      <label className="flex items-center gap-2 px-3 border rounded-md bg-muted cursor-not-allowed">
                        <input
                          type="checkbox"
                          checked={basicInfo.isLunarBirthDate}
                          disabled
                          className="w-4 h-4"
                        />
                        <span className="text-sm whitespace-nowrap">음력</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">성별</label>
                    <Input
                      value={basicInfo.gender}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 조직 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>조직 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">부서 <span className="text-destructive">*</span></label>
                  <Input
                    value={basicInfo.department}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">팀</label>
                  <Input
                    value={basicInfo.team}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">직급 <span className="text-destructive">*</span></label>
                  <Input
                    value={basicInfo.position}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">직책</label>
                  <Input
                    value={basicInfo.role}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상세 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>상세 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 주소 정보 */}
              <div>
                <h3 className="text-sm mb-3 text-foreground opacity-80">주소 정보</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">주소</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={basicInfo.postalCode}
                        disabled
                        placeholder="우편번호"
                        className="w-32 bg-muted"
                      />
                      <Input
                        value={basicInfo.roadAddress}
                        disabled
                        placeholder="주소 검색 버튼을 클릭하세요"
                        className="flex-1 bg-muted"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setIsAddressModalOpen(true)}
                        className="shrink-0"
                        disabled={!isEditing}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        주소 검색
                      </Button>
                    </div>
                    <Input
                      value={basicInfo.detailAddress}
                      onChange={(e) => setBasicInfo({ ...basicInfo, detailAddress: e.target.value })}
                      disabled={!isEditing}
                      className={getInputClassName(basicInfo.detailAddress, false)}
                      placeholder="상세주소를 입력하세요"
                    />
                  </div>
                </div>
              </div>

              {/* 개인 정보 */}
              <div>
                <h3 className="text-sm mb-3 text-foreground opacity-80">개인 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 결혼유무 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">결혼유무</label>
                  {isEditing ? (
                    <Select
                      value={basicInfo.maritalStatus}
                      onValueChange={(value) => {
                        setBasicInfo({ 
                          ...basicInfo, 
                          maritalStatus: value,
                          // 미혼 선택 시 결혼기념일 초기화
                          anniversaryDate: value === '미혼' ? '' : basicInfo.anniversaryDate
                        });
                      }}
                    >
                      <SelectTrigger className="border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20">
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="미혼">미혼</SelectItem>
                        <SelectItem value="기혼">기혼</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={basicInfo.maritalStatus}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  )}
                </div>

                {/* 결혼기념일 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">결혼기념일</label>
                  <Input
                    type="date"
                    value={basicInfo.anniversaryDate?.replace(/\./g, '-') || ''}
                    onChange={(e) => setBasicInfo({ ...basicInfo, anniversaryDate: e.target.value.replace(/-/g, '.') })}
                    disabled={!isEditing || basicInfo.maritalStatus === '미혼'}
                    className={
                      !isEditing || basicInfo.maritalStatus === '미혼'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : getInputClassName(basicInfo.anniversaryDate || '', false)
                    }
                  />
                </div>

                {/* 비상연락처 이름 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">비상연락처 이름</label>
                  <Input
                    value={basicInfo.emergencyName}
                    onChange={(e) => setBasicInfo({ ...basicInfo, emergencyName: e.target.value })}
                    disabled={!isEditing}
                    className={getInputClassName(basicInfo.emergencyName, false)}
                  />
                </div>

                {/* 비상연락처 관계 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">관계</label>
                  <Input
                    value={basicInfo.emergencyRelation}
                    onChange={(e) => setBasicInfo({ ...basicInfo, emergencyRelation: e.target.value })}
                    disabled={!isEditing}
                    className={getInputClassName(basicInfo.emergencyRelation, false)}
                  />
                </div>

                  <div className="md:col-span-2">
                    <label className="text-sm mb-1.5 block text-muted-foreground">연락처</label>
                    <Input
                      value={basicInfo.emergencyContact}
                      onChange={(e) => setBasicInfo({ ...basicInfo, emergencyContact: e.target.value })}
                      disabled={!isEditing}
                      placeholder="010-0000-0000"
                      className={getInputClassName(basicInfo.emergencyContact, false)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 학력 정보 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>학력 정보</CardTitle>
                  <CardDescription>학력 사항 ({academicEducations.length}개)</CardDescription>
                </div>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingAcademicEducation(null);
                      setIsAcademicEducationDialogOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    학력 추가
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {academicEducations.length > 0 ? (
                <div className="space-y-3">
                  {academicEducations.map((edu) => (
                    <div key={edu.id} className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">학력</p>
                            <p className="font-medium">{edu.level}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">학교</p>
                            <p className="font-medium">{edu.school}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">전공</p>
                            <p className="font-medium">{edu.major}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">입학일</p>
                            <p className="text-sm">{edu.admissionDate || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">졸업일</p>
                            <p className="text-sm">{edu.graduationDate || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">상태</p>
                            <Badge variant="secondary">{edu.status}</Badge>
                          </div>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingAcademicEducation(edu);
                                setIsAcademicEducationDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAcademicEducation(edu.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center border rounded-lg bg-muted/20">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground text-sm">등록된 학력 정보가 없습니다</p>
                  {isEditing && (
                    <p className="text-xs text-muted-foreground mt-1">상단의 '학력 추가' 버튼을 클릭하세요</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </TabsContent>

        {/* 역량정보 탭 */}
        <TabsContent value="competency" className="space-y-6">
          {/* 자격증 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>자격증</CardTitle>
                  <CardDescription>보유 자격증 목록 ({certifications.length}개)</CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingCert(null);
                  setIsCertDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  자격증 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="h-4 w-4 text-blue-500" />
                          <h3 className="font-medium text-sm">{cert.name}</h3>
                          <Badge variant="outline" className="text-xs">{cert.issuer}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5 ml-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>취득일: {cert.issueDate}</span>
                            {cert.expiryDate && <span className="ml-2">| 만료일: {cert.expiryDate}</span>}
                          </div>
                          <div>
                            구분: {cert.category}
                            {cert.certNumber && <span className="ml-2">| 자격증번호: {cert.certNumber}</span>}
                          </div>
                          <div>비고: {cert.note}</div>
                          {cert.attachmentFileName && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <FileText className="h-3 w-3" />
                              <span>첨부파일: {cert.attachmentFileName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCert(cert);
                            setIsCertDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCert(cert.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {certifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    등록된 자격증이 없습니다
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 교육 이수 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>교육 이수</CardTitle>
                  <CardDescription>교육 이수 내역 ({educations.length}개)</CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingEdu(null);
                  setIsEduDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  교육 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {educations.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <GraduationCap className="h-4 w-4 text-green-500" />
                          <h3 className="font-medium text-sm">{edu.courseName}</h3>
                          <Badge variant="outline" className="text-xs">{edu.institution}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5 ml-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{edu.startDate} ~ {edu.endDate}</span>
                            <Badge className="bg-purple-500 text-xs">{edu.hours}시간</Badge>
                          </div>
                          <div>{edu.description}</div>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingEdu(edu);
                            setIsEduDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEdu(edu.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {educations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    등록된 교육 이수가 없습니다
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 회사 경력 탭 (과거경력) */}
        <TabsContent value="company-career" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>경력 정보</CardTitle>
                  <CardDescription>전직장 경력 사항 ({companyCareers.length}개)</CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingCompanyCareer(null);
                  setIsCompanyCareerDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  경력 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {companyCareers.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">회사명</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">직위/직급</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">부서</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">근무기간</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">담당업무</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">업무관련성</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground w-24">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {companyCareers.map((career) => (
                        <tr key={career.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium">{career.company}</td>
                          <td className="px-4 py-3 text-sm">{career.position}</td>
                          <td className="px-4 py-3 text-sm">{career.department || '-'}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{career.startDate} ~ {career.endDate}</td>
                          <td className="px-4 py-3 text-sm max-w-xs truncate" title={career.responsibilities}>{career.responsibilities || '-'}</td>
                          <td className="px-4 py-3">
                            <Badge 
                              variant={
                                career.relevance === '유관' ? 'default' : 
                                career.relevance === '유사' ? 'secondary' : 
                                'outline'
                              }
                              className={
                                career.relevance === '유관' ? 'bg-green-500 hover:bg-green-600' : 
                                career.relevance === '유사' ? 'bg-blue-500 hover:bg-blue-600' : 
                                ''
                              }
                            >
                              {career.relevance}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingCompanyCareer(career);
                                  setIsCompanyCareerDialogOpen(true);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteCompanyCareer(career.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground text-sm">등록된 경력 정보가 없습니다</p>
                  <p className="text-xs text-muted-foreground mt-1">상단의 '경력 추가' 버튼을 클릭하세요</p>
                </div>
              )}

              {/* 총경력 자동 계산 표시 */}
              {companyCareers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">총 경력 (년)</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={calculateTotalCareer()}
                        className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 font-semibold"
                        disabled
                      />
                      <Badge variant="secondary" className="shrink-0">자동계산</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">* 등록된 경력을 기준으로 자동 계산됩니다</p>
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">전 SW경력 (년)</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={calculateSWCareer()}
                        className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100 font-semibold"
                        disabled
                      />
                      <Badge variant="secondary" className="shrink-0">자동계산</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">* 업무 관련성이 '유관'인 경력만 계산됩니다</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 과거프로젝트 경력 탭 */}
        <TabsContent value="past-career" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>과거 프로젝트 경력</CardTitle>
                  <CardDescription>이전 회사 프로젝트 경력 사항 ({pastCareers.length}개)</CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingPastCareer(null);
                  setIsPastCareerDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  프로젝트 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastCareers.map((career) => (
                  <div key={career.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-5 w-5 text-orange-500" />
                          <h3 className="font-semibold">{career.projectName}</h3>
                          <Badge variant="outline">{career.role}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>고객사: {career.client}</div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{career.period}</span>
                          </div>
                          <div className="mt-2">{career.description}</div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {career.tools && career.tools.split(',').map((tool, idx) => (
                              <Badge key={idx} className="bg-blue-500">{tool.trim()}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPastCareer(career);
                            setIsPastCareerDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePastCareer(career.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {pastCareers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    등록된 과거 경력이 없습니다
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 프로젝트 경력 탭 */}
        <TabsContent value="project-career" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>프로젝트 경력</CardTitle>
                  <CardDescription>수행한 프로젝트 내역 ({projectCareers.length}개)</CardDescription>
                </div>
                <Button onClick={() => {
                  setEditingProjectCareer(null);
                  setIsProjectCareerDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  프로젝트 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectCareers.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderOpen className="h-5 w-5 text-indigo-500" />
                          <h3 className="font-semibold">{project.projectName}</h3>
                          <Badge variant="outline">{project.client}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <div>역할: {project.role}</div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{project.period}</span>
                          </div>
                          <div className="mt-2">{project.description}</div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.tools && project.tools.split(',').map((tool, idx) => (
                              <Badge key={idx} className="bg-blue-500">{tool.trim()}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingProjectCareer(project);
                            setIsProjectCareerDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProjectCareer(project.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {projectCareers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    등록된 프로젝트 경력이 없습니다
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 자격증 추가/수정 다이얼로그 */}
      <CertificationDialog
        open={isCertDialogOpen}
        onOpenChange={setIsCertDialogOpen}
        certification={editingCert}
        onSave={handleSaveCert}
      />

      {/* 교육 추가/수정 다이얼로그 */}
      <EducationDialog
        open={isEduDialogOpen}
        onOpenChange={setIsEduDialogOpen}
        education={editingEdu}
        onSave={handleSaveEdu}
      />

      {/* 회사경력 추가/수정 다이얼로그 */}
      <CompanyCareerDialog
        open={isCompanyCareerDialogOpen}
        onOpenChange={setIsCompanyCareerDialogOpen}
        career={editingCompanyCareer}
        onSave={handleSaveCompanyCareer}
      />

      {/* 과거프로젝트경력 추가/수정 다이얼로그 */}
      <PastCareerDialog
        open={isPastCareerDialogOpen}
        onOpenChange={setIsPastCareerDialogOpen}
        career={editingPastCareer}
        onSave={handleSavePastCareer}
      />

      {/* 프로젝트경력 추가/수정 다이얼로그 */}
      <ProjectCareerDialog
        open={isProjectCareerDialogOpen}
        onOpenChange={setIsProjectCareerDialogOpen}
        career={editingProjectCareer}
        onSave={handleSaveProjectCareer}
      />

      {/* 학력 추가/수정 다이얼로그 */}
      <AcademicEducationDialog
        open={isAcademicEducationDialogOpen}
        onOpenChange={setIsAcademicEducationDialogOpen}
        education={editingAcademicEducation}
        onSave={handleSaveAcademicEducation}
      />

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
              * 실제 운영 환경에서는 Daum 우편번호 서비스와 연동됩니다.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 자격증 다이얼로그 컴포넌트
function CertificationDialog({ 
  open, 
  onOpenChange, 
  certification, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  certification: Certification | null;
  onSave: (cert: Certification) => void;
}) {
  const [formData, setFormData] = useState<Certification>(
    certification || {
      id: '',
      name: '',
      category: '',
      issuer: '',
      issueDate: '',
      note: '',
      certNumber: '',
      expiryDate: '',
      attachmentFile: null,
      attachmentFileName: '',
    }
  );

  const getInputClassName = (value: string, isRequired: boolean = true) => {
    if (!value || value.trim() === '') {
      return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
    }
    return 'bg-white';
  };

  const getSelectClassName = (value: string) => {
    if (!value || value.trim() === '') return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
    return 'bg-white';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ 
        ...formData, 
        attachmentFile: file,
        attachmentFileName: file.name 
      });
    }
  };

  const handleRemoveFile = () => {
    setFormData({ 
      ...formData, 
      attachmentFile: null,
      attachmentFileName: '' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{certification ? '자격증 수정' : '자격증 추가'}</DialogTitle>
          <DialogDescription>자격증 정보를 입력하세요</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              자격증명 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={getInputClassName(formData.name)}
              placeholder="정보처리기사"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                구분 <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className={getSelectClassName(formData.category)}>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="취득">취득</SelectItem>
                  <SelectItem value="수료">수료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                취득일 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className={getInputClassName(formData.issueDate)}
                placeholder="2024.01.01"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              발급기관 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              className={getInputClassName(formData.issuer)}
              placeholder="한국산업인력공단"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                자격증번호
              </label>
              <Input
                value={formData.certNumber || ''}
                onChange={(e) => setFormData({ ...formData, certNumber: e.target.value })}
                className="border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20"
                placeholder="자격증번호 입력"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                만료일
              </label>
              <Input
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              비고 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className={getInputClassName(formData.note)}
              placeholder="기본 자격증"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              자격증 사본
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cert-file-upload"
                />
                <label
                  htmlFor="cert-file-upload"
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted/50 transition-colors">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formData.attachmentFileName || '파일을 선택하세요'}
                    </span>
                  </div>
                </label>
                {formData.attachmentFileName && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-9 px-3"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                * PDF, JPG, PNG 파일만 업로드 가능합니다
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={() => onSave(formData)}>
            {certification ? '수정' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 교육 다이얼로그 컴포넌트
function EducationDialog({ 
  open, 
  onOpenChange, 
  education, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  education: Education | null;
  onSave: (edu: Education) => void;
}) {
  const [formData, setFormData] = useState<Education>(
    education || {
      id: '',
      courseName: '',
      institution: '',
      startDate: '',
      endDate: '',
      hours: 0,
      description: '',
    }
  );

  const getInputClassName = (value: string | number, isRequired: boolean = true) => {
    return 'bg-yellow-50 border-yellow-300';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{education ? '교육 수정' : '교육 추가'}</DialogTitle>
          <DialogDescription>교육 이수 정보를 입력하세요</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              교육명 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className={getInputClassName(formData.courseName)}
              placeholder="AWS 클라우드 아키텍처 과정"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              교육기관 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className={getInputClassName(formData.institution)}
              placeholder="AWS Training"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                시작일 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={getInputClassName(formData.startDate)}
                placeholder="2024.01.01"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                종료일 <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={getInputClassName(formData.endDate)}
                placeholder="2024.01.31"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                시간 <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
                className={getInputClassName(formData.hours)}
                placeholder="40"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              설명 <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={getInputClassName(formData.description)}
              placeholder="교육 내용을 입력하세요"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={() => onSave(formData)}>
            {education ? '수정' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 사용도구 입력 컴포넌트 (자동완성 기능 포함)
function ToolsInput({ 
  value, 
  onChange, 
  className 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // 현재 입력된 도구들을 배열로 변환
  const getToolsArray = (str: string) => {
    return str.split(',').map(t => t.trim()).filter(t => t);
  };

  // 도구 추가
  const addTool = (tool: string) => {
    const currentTools = getToolsArray(inputValue);
    if (!currentTools.includes(tool)) {
      const newValue = currentTools.length > 0 
        ? `${inputValue.trim()}, ${tool}` 
        : tool;
      setInputValue(newValue);
      onChange(newValue);
    }
    setOpen(false);
  };

  // Input 값 변경
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  // 필터링된 도구 목록
  const currentTools = getToolsArray(inputValue);
  const lastInput = inputValue.split(',').pop()?.trim() || '';
  const filteredTools = AVAILABLE_TOOLS.filter(tool => 
    !currentTools.includes(tool) && 
    tool.toLowerCase().includes(lastInput.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            className={className}
            placeholder="도구명을 입력하거나 선택하세요 (예: Java, Git, AWS)"
          />
          {filteredTools.length > 0 && open && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredTools.slice(0, 10).map((tool) => (
                <div
                  key={tool}
                  className="px-3 py-2 cursor-pointer hover:bg-muted"
                  onClick={() => addTool(tool)}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{tool}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverTrigger>
    </Popover>
  );
}

// 회사경력 다이얼로그 컴포넌트
function CompanyCareerDialog({ 
  open, 
  onOpenChange, 
  career, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  career: CompanyCareer | null;
  onSave: (career: CompanyCareer) => void;
}) {
  const [formData, setFormData] = useState<CompanyCareer>(
    career || {
      id: '',
      company: '',
      position: '',
      department: '',
      startDate: '',
      endDate: '',
      responsibilities: '',
      relevance: '',
    }
  );

  const handleSave = () => {
    // 필수 필드 검증
    if (!formData.company) {
      toast.error('회사명을 입력해주세요.');
      return;
    }

    if (!formData.position) {
      toast.error('직위/직급을 입력해주세요.');
      return;
    }

    if (!formData.startDate) {
      toast.error('입사일을 입력해주세요.');
      return;
    }

    if (!formData.endDate) {
      toast.error('퇴사일을 입력해주세요.');
      return;
    }

    if (!formData.relevance) {
      toast.error('업무 관련성을 선택해주세요.');
      return;
    }

    // 날짜 유효성 검증
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        toast.error('퇴사일은 입사일보다 이후여야 합니다.');
        return;
      }
    }

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{career ? '경력 수정' : '경력 추가'}</DialogTitle>
          <DialogDescription>
            전직장 근무이력을 입력하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">
                회사명 <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="예: 삼성전자"
              />
            </div>

            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">
                직위/직급 <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="예: 과장, 선임연구원"
              />
            </div>

            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">부서</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="예: 개발1팀"
              />
            </div>

            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">
                업무 관련성 <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.relevance}
                onValueChange={(value) => setFormData({ ...formData, relevance: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="유관">유관</SelectItem>
                  <SelectItem value="유사">유사</SelectItem>
                  <SelectItem value="무관">무관</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">
                입사일 <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm mb-1.5 block text-muted-foreground">
                퇴사일 <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm mb-1.5 block text-muted-foreground">담당업무</label>
              <Input
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="예: 웹 애플리케이션 개발, 서버 관리"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button onClick={handleSave}>
            {career ? '수정' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 과거프로젝트경력 다이얼로그 컴포넌트
function PastCareerDialog({ 
  open, 
  onOpenChange, 
  career, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  career: PastCareer | null;
  onSave: (career: PastCareer) => void;
}) {
  const [formData, setFormData] = useState<PastCareer>(
    career || {
      id: '',
      client: '',
      projectName: '',
      description: '',
      period: '',
      role: '',
      teamSize: 0,
      field: '',
      location: '',
      tools: '',
      overview: '',
      detailWork: '',
      contribution: '',
    }
  );

  const getInputClassName = (value: string | number, isRequired: boolean = true) => {
    return 'bg-yellow-50 border-yellow-300';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{career ? '경력 수정' : '경력 추가'}</DialogTitle>
          <DialogDescription>과거 경력 정보를 입력하세요</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {/* 기본 정보 */}
          <div className="border-b pb-3">
            <h4 className="text-sm font-semibold mb-3 text-primary">기본 정보</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    고객사명 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className={getInputClassName(formData.client)}
                    placeholder="LG전자"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    프로젝트명 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className={getInputClassName(formData.projectName)}
                    placeholder="품질관리 시스템 구축"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  수행업무내역 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={getInputClassName(formData.description)}
                  placeholder="수행한 업무 내용을 입력하세요"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    수행기간 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className={getInputClassName(formData.period)}
                    placeholder="2017.01.02 ~ 2020.02.28"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    인력수 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 0 })}
                    className={getInputClassName(formData.teamSize)}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    역할 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={getInputClassName(formData.role)}
                    placeholder="테스트 엔지니어"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-primary">상세 정보</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    과제분야 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className={getInputClassName(formData.field)}
                    placeholder="품질관리"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    위치 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={getInputClassName(formData.location)}
                    placeholder="서울 강남구"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  사용도구 <span className="text-red-500">*</span>
                </label>
                <ToolsInput
                  value={formData.tools || ''}
                  onChange={(value) => setFormData({ ...formData, tools: value })}
                  className={getInputClassName(formData.tools)}
                />
                <p className="text-xs text-muted-foreground">
                  도구명을 입력하면 자동완성 목록이 표시됩니다. 여러 도구는 쉼표(,)로 구분하세요.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  과제개요 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className={getInputClassName(formData.overview)}
                  placeholder="프로젝트 개요"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  진행업무상세 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.detailWork}
                  onChange={(e) => setFormData({ ...formData, detailWork: e.target.value })}
                  className={getInputClassName(formData.detailWork)}
                  placeholder="진행한 업무의 상세 내용"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  기여사항 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.contribution}
                  onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                  className={getInputClassName(formData.contribution)}
                  placeholder="프로젝트 기여사항"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={() => onSave(formData)}>
            {career ? '수정' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 프로젝트경력 다이얼로그 컴포넌트
function ProjectCareerDialog({ 
  open, 
  onOpenChange, 
  career, 
  onSave 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  career: ProjectCareer | null;
  onSave: (career: ProjectCareer) => void;
}) {
  const [formData, setFormData] = useState<ProjectCareer>(
    career || {
      id: '',
      client: '',
      projectName: '',
      role: '',
      period: '',
      description: '',
      teamSize: 0,
      field: '',
      location: '',
      tools: '',
      overview: '',
      detailWork: '',
      contribution: '',
    }
  );

  const getInputClassName = (value: string | number, isRequired: boolean = true) => {
    return 'bg-yellow-50 border-yellow-300';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{career ? '프로젝트 수정' : '프로젝트 추가'}</DialogTitle>
          <DialogDescription>프로젝트 경력 정보를 입력하세요</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {/* 기본 정보 */}
          <div className="border-b pb-3">
            <h4 className="text-sm font-semibold mb-3 text-primary">프로젝트 경력</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    고객사 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className={getInputClassName(formData.client)}
                    placeholder="LG전자"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    프로젝트명 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className={getInputClassName(formData.projectName)}
                    placeholder="품질관리 시스템 구축"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  수행업무내역 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={getInputClassName(formData.description)}
                  placeholder="수행한 업무 내용을 입력하세요"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    수행기간 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className={getInputClassName(formData.period)}
                    placeholder="2023.01.01 ~ 2023.12.31"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    인력수 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 0 })}
                    className={getInputClassName(formData.teamSize)}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    역할 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={getInputClassName(formData.role)}
                    placeholder="테스트 엔지니어"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-primary">상세 정보</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    과제분야 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className={getInputClassName(formData.field)}
                    placeholder="품질관리"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    위치 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={getInputClassName(formData.location)}
                    placeholder="서울 강남구"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  사용도구 <span className="text-red-500">*</span>
                </label>
                <ToolsInput
                  value={formData.tools || ''}
                  onChange={(value) => setFormData({ ...formData, tools: value })}
                  className={getInputClassName(formData.tools)}
                />
                <p className="text-xs text-muted-foreground">
                  도구명을 입력하면 자동완성 목록이 표시됩니다. 여러 도구는 쉼표(,)로 구분하세요.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  과제개요 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className={getInputClassName(formData.overview)}
                  placeholder="프로젝트 개요"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  진행업무상세 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.detailWork}
                  onChange={(e) => setFormData({ ...formData, detailWork: e.target.value })}
                  className={getInputClassName(formData.detailWork)}
                  placeholder="진행한 업무의 상세 내용"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  기여사항 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.contribution}
                  onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                  className={getInputClassName(formData.contribution)}
                  placeholder="프로젝트 기여사항"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={() => onSave(formData)}>
            {career ? '수정' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}