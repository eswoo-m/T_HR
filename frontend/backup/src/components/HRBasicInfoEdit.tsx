import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Save, X, Upload, User, Plus, Trash2, Search, CheckCircle2, Lock, Printer, ChevronDown, ChevronUp, Package, Monitor, Smartphone, Keyboard, History } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { allAssets, type Asset } from '../data/assetData';

// 기간 계산 함수 (년/월 형식으로 반환)
const calculateDuration = (period: string): { years: number; months: number } => {
  try {
    // "2020.01 ~ 2021.12" 형식 파싱
    const parts = period.split('~').map(p => p.trim());
    if (parts.length !== 2) return { years: 0, months: 0 };
    
    const start = parts[0].replace(/\s/g, '');
    const end = parts[1].replace(/\s/g, '');
    
    // "진행중" 또는 "현재"인 경우 현재 날짜 사용
    const isOngoing = end.includes('진행중') || end.includes('현재');
    
    const startMatch = start.match(/(\d{4})\.(\d{2})/);
    if (!startMatch) return { years: 0, months: 0 };
    
    const startYear = parseInt(startMatch[1]);
    const startMonth = parseInt(startMatch[2]);
    
    let endYear: number;
    let endMonth: number;
    
    if (isOngoing) {
      const now = new Date();
      endYear = now.getFullYear();
      endMonth = now.getMonth() + 1;
    } else {
      const endMatch = end.match(/(\d{4})\.(\d{2})/);
      if (!endMatch) return { years: 0, months: 0 };
      endYear = parseInt(endMatch[1]);
      endMonth = parseInt(endMatch[2]);
    }
    
    let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    return { years, months };
  } catch (error) {
    return { years: 0, months: 0 };
  }
};

// 여러 경력의 총 기간 계산
const calculateTotalDuration = (careers: { period: string }[]): string => {
  let totalMonths = 0;
  careers.forEach(career => {
    const duration = calculateDuration(career.period);
    totalMonths += duration.years * 12 + duration.months;
  });
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0 && months === 0) return '0개월';
  if (years === 0) return `${months}개월`;
  if (months === 0) return `${years}년`;
  return `${years}년 ${months}개월`;
};

interface Certification {
  id: string;
  name: string;
  type: string; // 취득/수료
  issuer: string;
  issueDate: string;
  note: string;
}

interface PastCareer {
  id: string;
  client: string; // 고객사명
  projectName: string; // 프로젝트명
  description: string; // 수행업무내역
  period: string; // 수행기간
  teamSize: number; // 인력수
  role: string; // 역할
  // 상세 정보
  field?: string; // 과제분야
  location?: string; // 위치
  tools?: string; // 사용도구
  overview?: string; // 과제개요
  detailWork?: string; // 진행업무상세내용
  contribution?: string; // 프로젝트 기여사항
}

interface ProjectCareer {
  id: string;
  client: string; // 고객사명
  projectName: string; // 프로젝트명
  description: string; // 수행업무내역
  period: string; // 수행기간
  teamSize: number; // 인력수
  role: string; // 역할
  // 상세 정보
  field?: string; // 과제분야
  location?: string; // 위치
  tools?: string; // 사용도구
  overview?: string; // 과제개요
  detailWork?: string; // 진행업무상세내용
  contribution?: string; // 프로젝트 기여사항
}

interface ProjectHistory {
  id: string;
  startDate: string; // 시작일 (YYYY.MM.DD)
  endDate?: string; // 종료일 (YYYY.MM.DD) - 현재 진행중이면 없음
  classification: string; // 구분 (투입_정산, 투입_지원, 대기, 관리)
  projectName?: string; // 프로젝트명 (투입_정산, 투입_지원일 때만)
  client?: string; // 고객사 (투입_정산, 투입_지원일 때만)
  note?: string; // 비고
}

interface Employee {
  name: string;
  code: string;
  rank: string;
  position: string;
  department: string;
  team: string;
  gender: string;
  classification?: string; // 구분 (투입_정산, 투입_지원, 대기, 관리)
  experience: number;
  joinYear: string;
  resignDate?: string; // 퇴사일
  age: number;
  certifications: Certification[];
  skills: string[];
  skillLevel: string;
  // 새로운 필드들
  photo?: string;
  englishName?: string;
  chineseName?: string;
  phone?: string;
  email?: string; // 이메일
  birthDate?: string;
  residentNumber?: string;
  userId?: string;
  // 과거경력
  pastCareers?: PastCareer[];
  // 프로젝트 경력
  projectCareers?: ProjectCareer[];
  // 프로젝트 히스토리
  projectHistory?: ProjectHistory[];
  // 상세 정보
  employeeType?: string; // 직원유형
  employmentStatus?: string; // 재직구분
  employmentPeriod?: string; // 재직기간
  finalEducation?: string; // 최종학력
  school?: string; // 최종학교
  major?: string; // 전공
  totalExperience?: number; // 총경력
  swExperience?: number; // 전 SW경력
  married?: string; // 결혼유무
  anniversary?: string; // 결혼기념일
  emergencyContact?: string; // 비상연락처
  emergencyRelation?: string; // 본인과의 관계
  bank?: string; // 은행
  accountNumber?: string; // 계좌번호
  zipCode?: string; // 우편번호
  roadAddress?: string; // 도로명주소
  detailAddress?: string; // 상세주소
  address?: string; // 전체 주소 (레거시)
  // 역량 정보 - 기술능력
  communicationSkill?: string; // 소통능력
  officeSkill?: string; // 오피스 활용능력
  testDesignSkill?: string; // 테스트 설계능력
  testExecutionSkill?: string; // 테스트 수행능력
  // 역량 정보 - 사용 가능 도구
  defectManagementTool?: string; // 결함 관리 시스템
  communicationTool?: string; // 소통수단
  apiTool?: string; // API(해당 시)
  otherTool?: string; // 기타도구
  // 현재 프로젝트 정보
  currentProjectName?: string; // 현재 프로젝트명
  currentClient?: string; // 현재 고객사
  // 예정된 조직 변경
  scheduledOrgChange?: {
    effectiveDate: string; // 적용일
    newDepartment: string; // 변경될 부서
    newTeam: string; // 변경될 ���
    newRank: string; // 변경될 직급
    newPosition: string; // 변경될 직책
  };
}

interface HRBasicInfoEditProps {
  employeeCode: string;
  onBack: () => void;
  initialTab?: string; // 초기 선택될 탭
  onPrintResume?: (code: string) => void; // 경력기술서 출력 콜백
}

// 임시 데이터 (실제로는 props나 API에서 가져옴)
const mockEmployees: Record<string, Employee> = {
  'EMP-001': { 
    name: '김종균', 
    code: 'EMP-001', 
    rank: '임원급', 
    position: '대표이사', 
    department: '대표이사', 
    team: '대표이사', 
    gender: '남', 
    experience: 25, 
    joinYear: '2010-01-15', 
    age: 55, 
    certifications: [
      { id: '1', name: '정보처리기사', type: '취득', issuer: '한국산업기���시험원', issueDate: '2008-05-01', note: 'IT 기술에 대한 전문성을 인정받은 자격증' },
      { id: '2', name: 'PMP', type: '취득', issuer: 'Project Management Institute', issueDate: '2010-03-15', note: '프로젝트 관리 전문가 자격증' }
    ], 
    skills: ['경영전략', '리더십'], 
    skillLevel: '고급',
    zipCode: '06234',
    roadAddress: '서울특별시 강남구 테헤란로 152',
    detailAddress: '10층',
    pastCareers: [
      { 
        id: '1', 
        client: 'ABC 컨설팅', 
        projectName: 'IT 컨설팅 및 전략 수립', 
        description: 'IT 컨설팅 및 전략 수립', 
        period: '2005.01 ~ 2009.12', 
        teamSize: 5, 
        role: '이사',
        field: 'IT 컨설팅',
        location: '서울',
        tools: 'MS Project, Excel',
        overview: '기업 IT 전략 수립 및 컨설팅',
        detailWork: 'IT 전략 수립, 프로세스 개선, 시스템 분석',
        contribution: '5개 대기업 IT 전략 수립 완료'
      }
    ],
    projectCareers: [
      { 
        id: '1', 
        client: 'LG전자', 
        projectName: 'ERP 구축', 
        description: '전사 ERP 시스템 구축', 
        period: '2015.01 ~ 2016.12', 
        teamSize: 10, 
        role: 'PM',
        field: 'ERP 시스템',
        location: '서울',
        tools: 'SAP, Oracle DB',
        overview: 'LG전자 전사 ERP 시스템 구축 프로젝트',
        detailWork: '프로젝트 총괄 관리, 일정 및 예산 관리, 고객사 협의, 시스템 구축 감독',
        contribution: '예산 대비 95% 수준으로 프로젝트 완료, 성공적인 ERP 시스템 오픈'
      }
    ],
    projectHistory: [
      { id: '1', startDate: '2010.01.15', endDate: '2024.12.31', classification: '관리', note: '대표이사로 회사 경영 총괄' }
    ]
  },
  'EMP-101': { 
    name: '박성호', 
    code: 'EMP-101', 
    rank: '임원급', 
    position: '사장', 
    department: 'STE그룹', 
    team: 'STE그룹', 
    gender: '남', 
    experience: 22, 
    joinYear: '2010-03-01', 
    age: 52, 
    zipCode: '13529',
    roadAddress: '경기도 성남시 분당구 판교역로 235',
    detailAddress: 'B동 501호',
    certifications: [
      { id: '1', name: '정보처리기사', type: '취득', issuer: '한국산업기술시험원', issueDate: '2008-05-01', note: 'IT 기술에 대한 전문성을 인정받은 자격증' },
      { id: '2', name: 'PMP', type: '취득', issuer: 'Project Management Institute', issueDate: '2010-03-15', note: '프로젝트 관리 전문가 자격증' }
    ], 
    skills: ['Java', 'JIRA'], 
    skillLevel: '고급',
    totalExperience: 22,
    swExperience: 20,
    pastCareers: [],
    projectCareers: [
      {
        id: '1',
        client: '삼성전자',
        projectName: '삼성전자 갤럭시 테스트',
        description: '갤럭시 스마트폰 품질 검증',
        period: '2010.03 ~ 2015.12',
        teamSize: 15,
        role: '프로젝트 총괄',
        field: '모바일 디바이스',
        location: '수원',
        tools: 'JIRA, Jenkins, Appium',
        overview: '삼성 갤럭시 시리즈 품질 검증 및 테스트 자동화',
        detailWork: '테스트 전략 수립, 품질 관리, 팀 관리, 테스트 자동화 프레임워크 구축',
        contribution: '테스트 자동화율 80% 달성, 출시 전 결함 발견율 95% 유지'
      },
      {
        id: '2',
        client: 'LG전자',
        projectName: 'LG전자 스마트TV 검증',
        description: '스마트TV webOS 플랫폼 테스트',
        period: '2016.01 ~ 2020.12',
        teamSize: 20,
        role: '사업 총괄',
        field: '스마트 디바이스',
        location: '서울',
        tools: 'JIRA, Redmine, Python',
        overview: 'webOS 기반 스마트TV 품질 검증 프로젝트',
        detailWork: '사업 총괄, 고객사 관리, 프로젝트 관리, 품질 전략 수립',
        contribution: '매년 20% 매출 성장, 고객사 만족도 최상위 등급 유지'
      }
    ]
  },
  'EMP-1111': { 
    name: '전광희', 
    code: 'EMP-1111', 
    rank: '책임', 
    position: '팀장', 
    department: 'STE1실', 
    team: 'LG전자 1팀', 
    gender: '남', 
    experience: 12, 
    joinYear: '2019-06-01', 
    age: 42, 
    zipCode: '06236',
    roadAddress: '���울특별시 강남구 테헤란로 211',
    detailAddress: '3층',
    certifications: [
      { id: '1', name: '정보처리기사', type: '취득', issuer: '한국산업기술시험원', issueDate: '2008-05-01', note: 'IT 기술에 대한 전문성을 인정받은 자격증' }
    ], 
    skills: ['Java', 'Python', 'JIRA', 'Redmine'], 
    skillLevel: '고급',
    totalExperience: 12,
    swExperience: 12,
    currentProjectName: 'LG전자 웹OS 테스트',
    currentClient: 'LG전자',
    pastCareers: [],
    projectCareers: [
      {
        id: '1',
        client: 'LG전자',
        projectName: 'LG전자 스마트TV 테스트',
        description: '스마트TV 플랫폼 품질 검증 및 테스트 수행',
        period: '2019.06 ~ 2021.12',
        teamSize: 8,
        role: '테스트 팀장',
        field: '스마트 디바이스',
        location: '서울',
        tools: 'JIRA, TestLink, Jenkins',
        overview: 'LG전자 스마트TV의 webOS 플랫폼 품질 검증 및 테스트 자동화 프로젝트',
        detailWork: '테스트 계획 수립 및 시나리오 작성, 테스트 케이스 설계 및 수행, 결함 관리 및 추적, 테스트 자동화 스크립트 개발 및 유지보수',
        contribution: '테스트 자동화 도입으로 테스트 효율성 40% 향상, 결함 발견율 25% 개선'
      },
      {
        id: '2',
        client: 'LG전자',
        projectName: 'LG전자 모바일 테스트',
        description: 'LG 스마트폰 앱 및 시스템 테스트',
        period: '2022.03 ~ 2023.12',
        teamSize: 6,
        role: '테스트 팀장',
        field: '모바일 애플리케이션',
        location: '서울',
        tools: 'JIRA, Appium, Android Studio',
        overview: 'LG 스마트폰의 시스템 앱 및 기본 기능 품질 검증 프로젝트',
        detailWork: '안드로이드 기반 앱 테스트 수행, UI/UX 검증, 성능 테스트, 회귀 테스트 자동화',
        contribution: '앱 출시 전 치명적 결함 100% 사전 발견, 고객 만족도 향상'
      },
      {
        id: '3',
        client: 'LG전자',
        projectName: 'LG전자 웹OS 테스트',
        description: 'webOS 플랫폼 업그레이드 검증 및 품질 테스트',
        period: '2024.02 ~ 진행중',
        teamSize: 10,
        role: '테스트 팀장',
        field: '스마트 디바이스',
        location: '서울',
        tools: 'JIRA, Redmine, Python, Selenium',
        overview: 'webOS 6.0 업그레이드 버전에 대한 품질 검증 및 테스트 프로젝트',
        detailWork: '플랫폼 업그레이드 테스트 계획 수립, 시스템 안정성 검증, 통합 테스트 수행, 자동화 프레임워크 구축',
        contribution: '테스트 커버리지 95% 달성, 플랫폼 안정성 확보 및 성공적인 업그레이드 진행'
      }
    ],
    projectHistory: [
      { id: '1', startDate: '2019.06.01', endDate: '2021.12.31', classification: '투입_정산', projectName: 'LG전자 스마트TV 테스트', client: 'LG전자', note: '팀장' },
      { id: '2', startDate: '2022.01.01', endDate: '2022.02.28', classification: '대기', note: '프로젝트 대기' },
      { id: '3', startDate: '2022.03.01', endDate: '2023.12.31', classification: '투입_정산', projectName: 'LG전자 모바일 테스트', client: 'LG전자', note: '팀장' },
      { id: '4', startDate: '2024.01.01', endDate: '2024.01.31', classification: '대기', note: '프로젝트 전환 대기' },
      { id: '5', startDate: '2024.02.01', classification: '투입_정산', projectName: 'LG전자 웹OS 테스트', client: 'LG전자', note: '팀장, 진행중' }
    ],
    scheduledOrgChange: {
      effectiveDate: '2026-02-01',
      newDepartment: 'STE2실',
      newTeam: '현대자동차��',
      newRank: '수석',
      newPosition: '팀장'
    }
  },
};

export function HRBasicInfoEdit({ employeeCode, onBack, initialTab = 'basic', onPrintResume }: HRBasicInfoEditProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [originalEmployee, setOriginalEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [newCert, setNewCert] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // 섹션 접기/펼치기 상태
  const [isOrganizationOpen, setIsOrganizationOpen] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [isAssetOpen, setIsAssetOpen] = useState(true);
  const isShowingConfirm = useRef(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [expandedPastCareer, setExpandedPastCareer] = useState<string | null>(null);
  const [expandedProjectCareer, setExpandedProjectCareer] = useState<string | null>(null);
  
  // 자산 할당 관련 상태
  const [isAssetAssignDialogOpen, setIsAssetAssignDialogOpen] = useState(false);
  const [assignedAssetCodes, setAssignedAssetCodes] = useState<string[]>([]);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState<string>('전체');
  const [selectedAssetsToAdd, setSelectedAssetsToAdd] = useState<string[]>([]); // 선택된 자산들
  
  // 히스토리 팝업 상태
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [historyList, setHistoryList] = useState<ProjectHistory[]>([]);
  
  // 조직정보 변경 추적 및 적용일
  const [orgChangeEffectiveDate, setOrgChangeEffectiveDate] = useState('');
  const [hasOrgChange, setHasOrgChange] = useState(false);

  // 부서별 팀 목록
  const departmentTeams: Record<string, string[]> = {
    '대표이사': [],
    'STE그룹': [],
    'STE1실': ['LG전자 1팀', 'LG전자 2팀', 'LG전자 4팀'],
    'STE2실': ['GS리테일 1팀', 'HDC랩스 1팀', 'KT 알파1팀'],
    '경영지원실': ['경영지원팀', '사업전략팀'],
    '기술연구소': ['자동화개발팀', '개발연구']
  };

  // 입력 필드 CSS 클래스 결정 함수
  const getInputClassName = (fieldValue: any) => {
    if (!isEditing) return 'bg-muted/30';
    
    if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
      return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
    }
    return 'bg-background';
  };

  // 조직정보 변경 확인
  const checkOrgChange = (updatedEmployee: Employee) => {
    if (!originalEmployee) return false;
    
    return updatedEmployee.department !== originalEmployee.department ||
           updatedEmployee.team !== originalEmployee.team ||
           updatedEmployee.rank !== originalEmployee.rank ||
           updatedEmployee.position !== originalEmployee.position;
  };

  // 부서 변경 핸들러
  const handleDepartmentChange = (value: string) => {
    const updated = { 
      ...employee!, 
      department: value,
      team: '' // 부서 변경 시 팀 초기화
    };
    setEmployee(updated);
    setHasOrgChange(checkOrgChange(updated));
  };
  
  // 조직정보 변경 핸들러
  const handleOrgChange = (field: keyof Employee, value: any) => {
    const updated = { ...employee!, [field]: value };
    setEmployee(updated);
    setHasOrgChange(checkOrgChange(updated));
  };

  // 연락처 포맷팅 함수 (숫자만 입력, 자동 하이픈 추가)
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      // 11자리 초과 시 11자리까지만
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 연락처 변경 핸들러
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setEmployee({ ...employee!, phone: formatted });
  };

  // 비상연락처 변경 핸들러
  const handleEmergencyContactChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setEmployee({ ...employee!, emergencyContact: formatted });
  };

  // ���이터 변경 여부 확인
  const hasChanges = () => {
    if (!employee || !originalEmployee) return false;
    return JSON.stringify(employee) !== JSON.stringify(originalEmployee);
  };

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    if (value === activeTab) return;
    
    // 이미 경고를 표시 중이면 추가 호출 무시
    if (isShowingConfirm.current) return;
    
    if (isEditing && hasChanges()) {
      isShowingConfirm.current = true;
      
      // setTimeout으로 비동기 처리하여 중복 방지
      setTimeout(() => {
        const confirmed = confirm('수정 중인 내용이 있습니다. 저장하지 않고 이동하시겠습니까?');
        
        if (confirmed) {
          // 확인 선택: 원본 데이터로 복구하고 수정 모드 해제 후 탭 이동
          setEmployee({ ...originalEmployee! });
          setIsEditing(false);
          setActiveTab(value);
        }
        // 취소 선택: 아무것도 하지 않음 (현재 탭 유지, 수정 중인 내용도 유지)
        
        // 플래그 리셋
        setTimeout(() => {
          isShowingConfirm.current = false;
        }, 100);
      }, 0);
    } else {
      // 수정 모드가 아니거나 변경사항이 없으면 바로 탭 이동
      setActiveTab(value);
    }
  };

  useEffect(() => {
    // 실제로는 API 호출이나 전역 상태에서 데이터를 가져옴
    const foundEmployee = mockEmployees[employeeCode];
    if (foundEmployee) {
      setEmployee({ 
        ...foundEmployee,
        pastCareers: foundEmployee.pastCareers || [],
        projectCareers: foundEmployee.projectCareers || []
      });
      setOriginalEmployee({ 
        ...foundEmployee,
        pastCareers: foundEmployee.pastCareers || [],
        projectCareers: foundEmployee.projectCareers || []
      });
      
      // 할당된 자산 코드 초기화
      const assignedAssets = allAssets.filter(asset => asset.assignee === foundEmployee.name);
      setAssignedAssetCodes(assignedAssets.map(asset => asset.assetCode));
    }
  }, [employeeCode]);

  const handleSave = () => {
    // 조직정보 변경 시 적용일 확인
    if (hasOrgChange && !orgChangeEffectiveDate) {
      toast.error('조직정보가 변경되었습니다. 적용일을 입력해주세요.');
      return;
    }
    
    // 실제로는 API 호출로 데이터 저장
    console.log('저장:', employee);
    if (hasOrgChange) {
      console.log('조직정보 변경 적용일:', orgChangeEffectiveDate);
    }
    
    // 저장 후 원본 데이터를 현재 데이터로 업데이트
    setOriginalEmployee({ ...employee! });
    setIsEditing(false);
    setHasOrgChange(false);
    setOrgChangeEffectiveDate('');
    toast.success('저장되었습니다.');
  };

  const handleCancel = () => {
    // 확인 없이 바로 원본 데이터로 복구하고 수정 모드 해제
    setEmployee({ ...originalEmployee! });
    setIsEditing(false);
    setHasOrgChange(false);
    setOrgChangeEffectiveDate('');
    
    // 자산 할당도 원래대로 복구
    if (originalEmployee) {
      const assignedAssets = allAssets.filter(asset => asset.assignee === originalEmployee.name);
      setAssignedAssetCodes(assignedAssets.map(asset => asset.assetCode));
    }
  };
  
  // 자산 할당 핸들러
  const handleAssignAsset = (assetCode: string) => {
    if (!assignedAssetCodes.includes(assetCode)) {
      setAssignedAssetCodes([...assignedAssetCodes, assetCode]);
      toast.success('자산이 할당되었습니다.');
    }
  };
  
  // 여러 자산 일괄 할당 핸들러
  const handleBatchAssignAssets = () => {
    const newAssets = selectedAssetsToAdd.filter(code => !assignedAssetCodes.includes(code));
    if (newAssets.length > 0) {
      setAssignedAssetCodes([...assignedAssetCodes, ...newAssets]);
      toast.success(`${newAssets.length}개의 자산이 할당되었습니다.`);
      setSelectedAssetsToAdd([]);
      setIsAssetAssignDialogOpen(false);
    } else {
      toast.error('할당할 자산을 선택해주세요.');
    }
  };
  
  // 자산 선택 토글
  const toggleAssetSelection = (assetCode: string) => {
    setSelectedAssetsToAdd(prev => 
      prev.includes(assetCode) 
        ? prev.filter(code => code !== assetCode)
        : [...prev, assetCode]
    );
  };
  
  // 히스토리 추가 핸들러
  const handleAddHistory = () => {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    // 마지막 row의 종료일을 오늘 날짜로 설정
    const updatedList = historyList.map((h, idx) => 
      idx === historyList.length - 1 ? { ...h, endDate: formattedToday } : h
    );
    
    // 새 row 추가 (시작일은 오늘, 종료일은 빈칸)
    const newHistory: ProjectHistory = {
      id: `new-${Date.now()}`,
      startDate: formattedToday,
      endDate: '',
      classification: '대기',
      projectName: '',
      client: '',
      note: ''
    };
    
    setHistoryList([...updatedList, newHistory]);
  };
  
  // 히스토리 삭제 핸들러
  const handleRemoveHistory = (id: string) => {
    if (confirm('이 히스토리를 삭제하시겠습니까?')) {
      setHistoryList(historyList.filter(h => h.id !== id));
      toast.success('히스토리가 삭제되었습니다.');
    }
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
  
  // 자산 할당 해제 핸들러
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

  const handleApprove = () => {
    if (!employee) return;
    
    if (isApproved) {
      toast.error('이미 승인된 정보입니다.');
      return;
    }

    if (isEditing) {
      toast.error('수정 모드를 종료한 후 승인해주세요.');
      return;
    }

    const confirmMessage = `${employee.name}님의 인사정보를 최종 승인하시겠습니까?\n\n승인 후에는 더 이상 수정할 수 없습니다.`;
    
    if (confirm(confirmMessage)) {
      setIsApproved(true);
      toast.success(`${employee.name}님의 인사정보가 최종 승인되었습니다.`);
      console.log('���인된 직원 정보:', employee);
      // 실제로는 API 호출로 승인 상태 저장
    }
  };

  const handlePrintResume = () => {
    if (!employee) return;
    if (onPrintResume) {
      onPrintResume(employee.code);
    }
  };

  const handleAddCertification = () => {
    if (employee) {
      setEmployee({
        ...employee,
        certifications: [...employee.certifications, {
          id: Date.now().toString(),
          name: '',
          type: '취득',
          issuer: '',
          issueDate: '',
          note: ''
        }]
      });
    }
  };

  const handleRemoveCertification = (id: string) => {
    if (employee) {
      setEmployee({
        ...employee,
        certifications: employee.certifications.filter((cert) => cert.id !== id)
      });
    }
  };

  const handleUpdateCertification = (id: string, field: keyof Certification, value: string) => {
    if (employee) {
      setEmployee({
        ...employee,
        certifications: employee.certifications.map(cert => 
          cert.id === id ? { ...cert, [field]: value } : cert
        )
      });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && employee) {
      setEmployee({
        ...employee,
        skills: [...employee.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    if (employee) {
      setEmployee({
        ...employee,
        skills: employee.skills.filter((_, i) => i !== index)
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && employee) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployee({
          ...employee,
          photo: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 과거경력 추가
  const handleAddPastCareer = () => {
    if (employee) {
      const newCareer: PastCareer = {
        id: Date.now().toString(),
        client: '',
        projectName: '',
        description: '',
        period: '',
        teamSize: 0,
        role: ''
      };
      setEmployee({
        ...employee,
        pastCareers: [...(employee.pastCareers || []), newCareer]
      });
    }
  };

  // 과거경력 삭제
  const handleRemovePastCareer = (id: string) => {
    if (employee) {
      setEmployee({
        ...employee,
        pastCareers: employee.pastCareers?.filter(c => c.id !== id) || []
      });
    }
  };

  // 과거경력 수정
  const handleUpdatePastCareer = (id: string, field: keyof PastCareer, value: any) => {
    if (employee) {
      setEmployee({
        ...employee,
        pastCareers: employee.pastCareers?.map(c => 
          c.id === id ? { ...c, [field]: value } : c
        ) || []
      });
    }
  };

  // 프로젝트 경력 추가
  const handleAddProjectCareer = () => {
    if (employee) {
      const newProject: ProjectCareer = {
        id: Date.now().toString(),
        client: '',
        projectName: '',
        description: '',
        period: '',
        teamSize: 0,
        role: ''
      };
      setEmployee({
        ...employee,
        projectCareers: [...(employee.projectCareers || []), newProject]
      });
    }
  };

  // 프로젝트 경력 삭제
  const handleRemoveProjectCareer = (id: string) => {
    if (employee) {
      setEmployee({
        ...employee,
        projectCareers: employee.projectCareers?.filter(p => p.id !== id) || []
      });
    }
  };

  // 프로젝트 경력 수정
  const handleUpdateProjectCareer = (id: string, field: keyof ProjectCareer, value: any) => {
    if (employee) {
      setEmployee({
        ...employee,
        projectCareers: employee.projectCareers?.map(p => 
          p.id === id ? { ...p, [field]: value } : p
        ) || []
      });
    }
  };

  // 샘플 주소 목록 (실제로는 Daum API 사용)
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
    addr.roadAddress.toLowerCase().includes(addressSearchQuery.toLowerCase())
  );

  // 주소 검색 모달 열기
  const handleAddressSearch = () => {
    setIsAddressModalOpen(true);
    setAddressSearchQuery('');
  };

  // 주소 선택
  const handleSelectAddress = (address: string, zipCode: string) => {
    setEmployee({ 
      ...employee!, 
      zipCode: zipCode,
      roadAddress: address,
    });
    setIsAddressModalOpen(false);
  };

  // 히스토리 초기화
  useEffect(() => {
    if (employee?.projectHistory) {
      setHistoryList([...employee.projectHistory]);
    }
  }, [employee?.projectHistory]);

  if (!employee) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">직원 정보를 찾을 수 없습니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
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

      <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1>인사정보</h1>
          </div>
          <p className="text-muted-foreground mt-1">{employee.name} ({employee.code})</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{employee.rank}</Badge>
            <Badge 
              className={
                employee.skillLevel === '고급' ? 'bg-purple-500' :
                employee.skillLevel === '중급' ? 'bg-blue-500' :
                'bg-green-500'
              }
            >
              {employee.skillLevel}
            </Badge>
            <Badge variant="outline">{employee.experience}년차</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsHistoryDialogOpen(true)}>
            <History className="h-4 w-4 mr-2" />
            히스토리
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintResume}>
            <Printer className="h-4 w-4 mr-2" />
            경력기술서 출력
          </Button>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          {!isEditing ? (
            <>
              <Button 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                수정
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 탭 구조 */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">기본정보</TabsTrigger>
          <TabsTrigger value="competency">역량정보</TabsTrigger>
          <TabsTrigger value="past-career">과거경력</TabsTrigger>
          <TabsTrigger value="project-career">프젝트 경력</TabsTrigger>
        </TabsList>

        {/* 기본정보 탭 */}
        <TabsContent value="basic" className="space-y-4 min-h-[600px]">
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
                    {employee.photo ? (
                      <img src={employee.photo} alt={employee.name} className="w-full h-full object-cover" />
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
                        onChange={handleFileChange}
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
                      value={employee.code}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">ID <span className="text-destructive">*</span></label>
                    <Input
                      value={employee.userId || ''}
                      disabled
                      placeholder="사용자 ID"
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">성명 <span className="text-destructive">*</span></label>
                    <Input
                      value={employee.name}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">주민번호 <span className="text-destructive">*</span></label>
                    <Input
                      value={employee.residentNumber || ''}
                      disabled
                      placeholder="000000-0000000"
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">한자이름</label>
                    <Input
                      value={employee.chineseName || ''}
                      disabled={!isEditing}
                      onChange={(e) => setEmployee({ ...employee, chineseName: e.target.value })}
                      placeholder="漢자명"
                      className={getInputClassName(employee.chineseName)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">영문이름</label>
                    <Input
                      value={employee.englishName || ''}
                      disabled={!isEditing}
                      onChange={(e) => setEmployee({ ...employee, englishName: e.target.value })}
                      placeholder="English Name"
                      className={getInputClassName(employee.englishName)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">입사일 <span className="text-destructive">*</span></label>
                    <Input
                      type="date"
                      value={employee.joinYear}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">퇴사일</label>
                    <Input
                      type="date"
                      value={employee.resignDate || ''}
                      disabled={!isEditing}
                      onChange={(e) => setEmployee({ ...employee, resignDate: e.target.value })}
                      className={getInputClassName(employee.resignDate)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">연락처 <span className="text-destructive">*</span></label>
                    <Input
                      value={employee.phone || ''}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      disabled={!isEditing}
                      placeholder="010-0000-0000"
                      className={getInputClassName(employee.phone)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">이메일 <span className="text-destructive">*</span></label>
                    <Input
                      type="email"
                      value={employee.email || ''}
                      disabled={!isEditing}
                      onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                      placeholder="example@tebell.co.kr"
                      className={getInputClassName(employee.email)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">생년월일</label>
                    <Input
                      type="date"
                      value={employee.birthDate || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">성별</label>
                    <Select
                      value={employee.gender}
                      disabled
                    >
                      <SelectTrigger className="bg-muted">
                        <SelectValue />
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
            <CardHeader className="cursor-pointer" onClick={() => setIsOrganizationOpen(!isOrganizationOpen)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>조직 정보</CardTitle>
                  {employee.scheduledOrgChange && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                      예정된 변경 있음
                    </Badge>
                  )}
                </div>
                {isOrganizationOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            {isOrganizationOpen && (
              <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">부서 <span className="text-destructive">*</span></label>
                  <Select
                    value={employee.department}
                    onValueChange={handleDepartmentChange}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={getInputClassName(employee.department)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="대표이사">대표이사</SelectItem>
                      <SelectItem value="STE그룹">STE그룹</SelectItem>
                      <SelectItem value="STE1실">STE1실</SelectItem>
                      <SelectItem value="STE2실">STE2실</SelectItem>
                      <SelectItem value="경영지원실">경영지원실</SelectItem>
                      <SelectItem value="기술연구소">개발연구소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">팀</label>
                  {departmentTeams[employee.department]?.length > 0 ? (
                    <Select
                      value={employee.team}
                      onValueChange={(value) => handleOrgChange('team', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={getInputClassName(employee.team)}>
                        <SelectValue placeholder="팀을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="소속 없음">소속 없음</SelectItem>
                        {departmentTeams[employee.department].map((team) => (
                          <SelectItem key={team} value={team}>{team}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value="소속 없음"
                      disabled
                      className="bg-muted"
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">직급 <span className="text-destructive">*</span></label>
                  <Select
                    value={employee.rank}
                    onValueChange={(value) => handleOrgChange('rank', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={getInputClassName(employee.rank)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="임원급">임원급</SelectItem>
                      <SelectItem value="수석">수석</SelectItem>
                      <SelectItem value="책임">책임</SelectItem>
                      <SelectItem value="선임">선임</SelectItem>
                      <SelectItem value="사원">사원</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">직책 <span className="text-destructive">*</span></label>
                  <Select
                    value={employee.position}
                    onValueChange={(value) => handleOrgChange('position', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={getInputClassName(employee.position)}>
                      <SelectValue placeholder="직책을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="직책 없음">직책 없음</SelectItem>
                      <SelectItem value="파트장">파트장</SelectItem>
                      <SelectItem value="팀장">팀장</SelectItem>
                      <SelectItem value="실장">실장</SelectItem>
                      <SelectItem value="이사">이사</SelectItem>
                      <SelectItem value="부사장">부사장</SelectItem>
                      <SelectItem value="사장">사장</SelectItem>
                      <SelectItem value="대표이사">대표이사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">구분</label>
                  <Select
                    value={employee.classification || ''}
                    onValueChange={(value) => setEmployee({ ...employee, classification: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={getInputClassName(employee.classification)}>
                      <SelectValue placeholder="구분 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="투입_정산">투입_정산</SelectItem>
                      <SelectItem value="투입_지원">투입_지원</SelectItem>
                      <SelectItem value="대기">대기</SelectItem>
                      <SelectItem value="관리">관리</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {hasOrgChange && isEditing && (
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">적용일 <span className="text-destructive">*</span></label>
                    <Input
                      type="date"
                      value={orgChangeEffectiveDate}
                      onChange={(e) => setOrgChangeEffectiveDate(e.target.value)}
                      className={!orgChangeEffectiveDate ? 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20' : 'bg-background'}
                    />
                  </div>
                )}
              </div>
              
              {/* 예정된 조직 변경 정보 */}
              {employee.scheduledOrgChange && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                      예정된 조직 변경
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      적용일: {employee.scheduledOrgChange.effectiveDate}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">부서</label>
                      <p className="text-sm font-medium">{employee.scheduledOrgChange.newDepartment}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">팀</label>
                      <p className="text-sm font-medium">{employee.scheduledOrgChange.newTeam || '소속 없음'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">직급</label>
                      <p className="text-sm font-medium">{employee.scheduledOrgChange.newRank}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">직책</label>
                      <p className="text-sm font-medium">{employee.scheduledOrgChange.newPosition || '직책 없음'}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            )}
          </Card>

          {/* 상세 정보 */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setIsDetailOpen(!isDetailOpen)}>
              <div className="flex items-center justify-between">
                <CardTitle>상세 정보</CardTitle>
                {isDetailOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            {isDetailOpen && (
              <CardContent className="space-y-6">
              {/* 고용 정보 */}
              <div>
                <h3 className="text-sm mb-3 text-foreground opacity-80">고용 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">직무유형</label>
                    <Select
                      value={employee.employeeType || ''}
                      onValueChange={(value) => setEmployee({ ...employee, employeeType: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={getInputClassName(employee.employeeType)}>
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
                    <label className="text-sm mb-1.5 block text-muted-foreground">재직구분</label>
                    <Select
                      value={employee.employmentStatus || ''}
                      onValueChange={(value) => setEmployee({ ...employee, employmentStatus: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={getInputClassName(employee.employmentStatus)}>
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
                    <label className="text-sm mb-1.5 block text-muted-foreground">재직기간</label>
                    <Input
                      value={employee.employmentPeriod || ''}
                      disabled
                      className="bg-muted"
                      placeholder="자동 계산"
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
                      value={employee.finalEducation || ''}
                      disabled
                    >
                      <SelectTrigger className="bg-muted">
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
                      value={employee.school || ''}
                      disabled
                      placeholder="학교명을 입력하세요"
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">전공</label>
                    <Input
                      value={employee.major || ''}
                      disabled
                      placeholder="전공을 입력하세요"
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">총 경력 (년)</label>
                    <Input
                      type="number"
                      value={employee.totalExperience || ''}
                      disabled
                      placeholder="0"
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">전 SW경력 (년)</label>
                    <Input
                      type="number"
                      value={employee.swExperience || ''}
                      disabled
                      placeholder="0"
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>

              {/* 전직장(과거경력) 리스트 */}
              <div>
                <h3 className="text-sm mb-3 text-foreground opacity-80">전직장 경력</h3>
                {employee.pastCareers && employee.pastCareers.length > 0 ? (
                  <div className="space-y-2">
                    {employee.pastCareers.map((career, index) => (
                      <div 
                        key={career.id} 
                        className="p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                              <span className="font-medium">{career.client || '고객사명 미입력'}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {career.projectName || '프로젝트명 미입력'}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{career.period || '기간 미입력'}</span>
                              <span>•</span>
                              <span>{career.role || '역할 미입력'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-2">
                      * 상세한 전직장 경력 정보는 '과거경력' 탭에서 확인하실 수 있습니다.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 border border-dashed rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">등록된 전직장 경력이 없습니다.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      전직장 경력은 '과거경력' 탭에서 추가할 수 있습니다.
                    </p>
                  </div>
                )}
              </div>

              {/* 개인 정보 */}
              <div>
                <h3 className="text-sm mb-3 text-foreground opacity-80">개인 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">결혼유무</label>
                    <Select
                      value={employee.married || ''}
                      onValueChange={(value) => setEmployee({ ...employee, married: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={getInputClassName(employee.married)}>
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
                      value={employee.anniversary || ''}
                      onChange={(e) => setEmployee({ ...employee, anniversary: e.target.value })}
                      disabled={!isEditing}
                      className={getInputClassName(employee.anniversary)}
                    />
                  </div>
                </div>
              </div>

              {/* 비상연락처 */}
              <div>
                <h3 className="text-sm mb-3 text-foreground opacity-80">비상연락망</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">비상연락처</label>
                    <Input
                      value={employee.emergencyContact || ''}
                      onChange={(e) => handleEmergencyContactChange(e.target.value)}
                      disabled={!isEditing}
                      placeholder="010-0000-0000"
                      className={getInputClassName(employee.emergencyContact)}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">본인과의 관계</label>
                    <Input
                      value={employee.emergencyRelation || ''}
                      onChange={(e) => setEmployee({ ...employee, emergencyRelation: e.target.value })}
                      disabled={!isEditing}
                      placeholder="예: 배우자, 부모 등"
                      className={getInputClassName(employee.emergencyRelation)}
                    />
                  </div>
                </div>
              </div>

              {/* 주소 */}
              <div>
                <h3 className="text-sm mb-3 text-foreground opacity-80">거주지 정보</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">도로명주소</label>
                    <div className="flex gap-2">
                      <Input
                        value={employee.zipCode || ''}
                        disabled
                        placeholder="우편번호"
                        className="w-32 bg-muted"
                      />
                      <Input
                        value={employee.roadAddress || ''}
                        disabled
                        placeholder="주소 검색 버튼을 클릭하세요"
                        className="flex-1 bg-muted"
                      />
                      {isEditing && (
                        <Button
                          variant="outline"
                          onClick={handleAddressSearch}
                          className="shrink-0"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          주소 검색
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">상세주소</label>
                    <Input
                      value={employee.detailAddress || ''}
                      onChange={(e) => setEmployee({ ...employee, detailAddress: e.target.value })}
                      disabled={!isEditing}
                      placeholder="상세주소를 입력하세요 (예: 101동 1001호)"
                      className={getInputClassName(employee.detailAddress)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            )}
          </Card>

          {/* 자산 정보 */}
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setIsAssetOpen(!isAssetOpen)}>
              <div className="flex items-center justify-between">
                <CardTitle>자산 정보</CardTitle>
                {isAssetOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
{isAssetOpen && employee && (() => {
              // 현재 직원에게 할당된 자산 목록 필터링 (assignedAssetCodes 상태 사용)
              const assignedAssets = allAssets.filter(asset => assignedAssetCodes.includes(asset.assetCode));
              
              // 자산 타입별 아이콘 반환
              const getAssetIcon = (type: string) => {
                if (type.includes('노트북') || type.includes('데스크탑')) {
                  return <Package className="h-5 w-5 text-blue-600" />;
                } else if (type.includes('모니터')) {
                  return <Monitor className="h-5 w-5 text-green-600" />;
                } else if (type.includes('휴대���')) {
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
                      {/* 자��� 요약 */}
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
                            {assignedAssets.map((asset, index) => (
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
        </TabsContent>

        {/* 역량정보 탭 */}
        <TabsContent value="competency" className="space-y-4 min-h-[600px]">
          {/* 기술능력 */}
          <Card>
            <CardHeader>
              <CardTitle>기술능력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">소통능력</label>
                  <Textarea
                    value={employee.communicationSkill || ''}
                    onChange={(e) => setEmployee({ ...employee, communicationSkill: e.target.value })}
                    disabled={!isEditing}
                    placeholder="소통능력을 입력하세요"
                    rows={3}
                    className={!isEditing ? 'bg-muted/30' : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">오피스 활용능력</label>
                  <Textarea
                    value={employee.officeSkill || ''}
                    onChange={(e) => setEmployee({ ...employee, officeSkill: e.target.value })}
                    disabled={!isEditing}
                    placeholder="오피스 활용능력을 입력하세요"
                    rows={3}
                    className={!isEditing ? 'bg-muted/30' : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">테스트 설계능력</label>
                  <Textarea
                    value={employee.testDesignSkill || ''}
                    onChange={(e) => setEmployee({ ...employee, testDesignSkill: e.target.value })}
                    disabled={!isEditing}
                    placeholder="테스트 설계능력을 입력하세요"
                    rows={3}
                    className={!isEditing ? 'bg-muted/30' : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">테스트 수행능력</label>
                  <Textarea
                    value={employee.testExecutionSkill || ''}
                    onChange={(e) => setEmployee({ ...employee, testExecutionSkill: e.target.value })}
                    disabled={!isEditing}
                    placeholder="테스트 수행능력을 입력하세요"
                    rows={3}
                    className={!isEditing ? 'bg-muted/30' : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 사용 가능 도구 */}
          <Card>
            <CardHeader>
              <CardTitle>사용 가능 도구</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">결함 관리 시스템</label>
                  <Textarea
                    value={employee.defectManagementTool || ''}
                    onChange={(e) => setEmployee({ ...employee, defectManagementTool: e.target.value })}
                    disabled={!isEditing}
                    placeholder="예: JIRA, Redmine 등"
                    rows={3}
                    className={!isEditing ? 'bg-muted/30' : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">소통수단</label>
                  <Textarea
                    value={employee.communicationTool || ''}
                    onChange={(e) => setEmployee({ ...employee, communicationTool: e.target.value })}
                    disabled={!isEditing}
                    placeholder="예: Slack, Teams, Email 등"
                    rows={3}
                    className={!isEditing ? 'bg-muted/30' : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">API (해당 시)</label>
                  <Textarea
                    value={employee.apiTool || ''}
                    onChange={(e) => setEmployee({ ...employee, apiTool: e.target.value })}
                    disabled={!isEditing}
                    placeholder="예: Postman, Swagger 등"
                    rows={3}
                    className={!isEditing ? 'bg-muted/30' : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">기타도구</label>
                  <Textarea
                    value={employee.otherTool || ''}
                    onChange={(e) => setEmployee({ ...employee, otherTool: e.target.value })}
                    disabled={!isEditing}
                    placeholder="기타 사용 가능한 도구를 입력하세요"
                    rows={3}
                    className={!isEditing ? 'bg-muted/30' : 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 자격증 정보 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>자격증 정보</CardTitle>
                {isEditing && (
                  <Button size="sm" onClick={handleAddCertification}>
                    <Plus className="h-4 w-4 mr-2" />
                    자격증 추가
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {employee.certifications && employee.certifications.length > 0 ? (
                employee.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-3 p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div>
                        <label className="text-xs mb-1.5 block text-muted-foreground">자격증명</label>
                        <Input
                          value={cert.name}
                          onChange={(e) => handleUpdateCertification(cert.id, 'name', e.target.value)}
                          disabled={!isEditing}
                          placeholder="자격증명"
                          className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-muted-foreground">구분</label>
                        <Select
                          value={cert.type}
                          onValueChange={(value) => handleUpdateCertification(cert.id, 'type', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="취득">취득</SelectItem>
                            <SelectItem value="수료">수료</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-muted-foreground">발행기관</label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => handleUpdateCertification(cert.id, 'issuer', e.target.value)}
                          disabled={!isEditing}
                          placeholder="발행기관"
                          className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-muted-foreground">취득일</label>
                        <Input
                          type="date"
                          value={cert.issueDate}
                          onChange={(e) => handleUpdateCertification(cert.id, 'issueDate', e.target.value)}
                          disabled={!isEditing}
                          className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-muted-foreground">비고</label>
                        <Input
                          value={cert.note}
                          onChange={(e) => handleUpdateCertification(cert.id, 'note', e.target.value)}
                          disabled={!isEditing}
                          placeholder="비고"
                          className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-6"
                        onClick={() => handleRemoveCertification(cert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">등록된 자격증이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 과거경력 탭 */}
        <TabsContent value="past-career" className="space-y-4 min-h-[600px]">
          <div className="space-y-4">
            {/* 경력 요약 */}
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">경력 요약</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">총경력</p>
                    <p className="text-lg">{employee.totalExperience || employee.experience || 0}년</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">과거경력</p>
                    <p className="text-lg">{calculateTotalDuration(employee.pastCareers || [])}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">프로젝트 수</p>
                    <p className="text-lg">{employee.projectCareers?.length || 0}개</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 위: 경력 리스트 */}
            <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>과거 경력</CardTitle>
                {isEditing && (
                  <Button size="sm" onClick={handleAddPastCareer}>
                    <Plus className="h-4 w-4 mr-2" />
                    경력 추가
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {employee.pastCareers && employee.pastCareers.length > 0 ? (
                employee.pastCareers.map((career) => (
                  <div 
                    key={career.id} 
                    className={`flex items-start gap-3 p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors cursor-pointer ${
                      expandedPastCareer === career.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setExpandedPastCareer(career.id)}
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">경력 정보</span>
                        {(!career.field || !career.teamSize || !career.location || !career.tools || !career.overview || !career.detailWork || !career.contribution) ? (
                          <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-full border border-yellow-500/20">
                            상세정보 미입력
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-500 rounded-full border border-green-500/20">
                            입력완료
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">고객사명</label>
                          <Input
                            value={career.client}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUpdatePastCareer(career.id, 'client', e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={!isEditing}
                            placeholder="고객사명"
                            className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">프로젝트명</label>
                          <Input
                            value={career.projectName}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUpdatePastCareer(career.id, 'projectName', e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={!isEditing}
                            placeholder="프로젝트명"
                            className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-muted-foreground">수행업무내역</label>
                        <Input
                          value={career.description}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleUpdatePastCareer(career.id, 'description', e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={!isEditing}
                          placeholder="수행업무내역"
                          className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">수행기간</label>
                          <Input
                            value={career.period}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUpdatePastCareer(career.id, 'period', e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={!isEditing}
                            placeholder="예: 2015.01 ~ 2019.12"
                            className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">역할</label>
                          <Input
                            value={career.role}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUpdatePastCareer(career.id, 'role', e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={!isEditing}
                            placeholder="역할"
                            className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">인력수</label>
                          <Input
                            type="number"
                            value={career.teamSize || ''}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleUpdatePastCareer(career.id, 'teamSize', parseInt(e.target.value) || 0);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            disabled={!isEditing}
                            placeholder="0"
                            className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                          />
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePastCareer(career.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">등록된 과거 경력이 없습니다.</p>
              )}
            </CardContent>
          </Card>

          {/* 아래: 상세 정보 */}
          {expandedPastCareer && employee.pastCareers && employee.pastCareers.find(c => c.id === expandedPastCareer) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>상세 정보</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedPastCareer(null)}
                  >
                    닫기
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(() => {
                  const career = employee.pastCareers.find(c => c.id === expandedPastCareer);
                  if (!career) return null;
                  return (
                    <div className="space-y-4">
                      {/* 기본 정보 - 읽기 전용 */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">프로젝트명</label>
                          <Input
                            value={career.projectName}
                            disabled
                            className="h-9 bg-muted/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">수��기간</label>
                          <Input
                            value={career.period}
                            disabled
                            className="h-9 bg-muted/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">역할</label>
                          <Input
                            value={career.role}
                            disabled
                            className="h-9 bg-muted/30"
                          />
                        </div>
                      </div>

                      {/* 상세 정보 - 편집 가능 */}
                      <div className="border-t pt-4">
                        <h4 className="text-sm mb-3 flex items-center gap-2">
                          <span className="w-1 h-4 bg-primary rounded-full"></span>
                          상세 정보 입력
                        </h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs mb-1.5 block text-muted-foreground">과제분야 <span className="text-destructive">*</span></label>
                              <Input
                                value={career.field || ''}
                                onChange={(e) => handleUpdatePastCareer(career.id, 'field', e.target.value)}
                                disabled={!isEditing}
                                placeholder="예: 웹 개발"
                                className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                              />
                            </div>
                            <div>
                              <label className="text-xs mb-1.5 block text-muted-foreground">인력수 <span className="text-destructive">*</span></label>
                              <Input
                                type="number"
                                value={career.teamSize || ''}
                                onChange={(e) => handleUpdatePastCareer(career.id, 'teamSize', parseInt(e.target.value) || 0)}
                                disabled={!isEditing}
                                placeholder="0"
                                className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                              />
                            </div>
                            <div>
                              <label className="text-xs mb-1.5 block text-muted-foreground">위치 <span className="text-destructive">*</span></label>
                              <Input
                                value={career.location || ''}
                                onChange={(e) => handleUpdatePastCareer(career.id, 'location', e.target.value)}
                                disabled={!isEditing}
                                placeholder="예: 서울시 강남구"
                                className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs mb-1.5 block text-muted-foreground">사용도구 <span className="text-destructive">*</span></label>
                            <Input
                              value={career.tools || ''}
                              onChange={(e) => handleUpdatePastCareer(career.id, 'tools', e.target.value)}
                              disabled={!isEditing}
                              placeholder="예: Java, Spring, MySQL"
                              className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                            />
                          </div>
                          <div>
                            <label className="text-xs mb-1.5 block text-muted-foreground">과제개요 <span className="text-destructive">*</span></label>
                            <textarea
                              value={career.overview || ''}
                              onChange={(e) => handleUpdatePastCareer(career.id, 'overview', e.target.value)}
                              disabled={!isEditing}
                              placeholder="과제에 대한 전반적인 개요를 작성해주세요"
                              className={!isEditing ? 'w-full min-h-[60px] px-3 py-2 text-sm rounded-md border resize-none border-input bg-muted/30' : 'w-full min-h-[60px] px-3 py-2 text-sm rounded-md border resize-none border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                            />
                          </div>
                          <div>
                            <label className="text-xs mb-1.5 block text-muted-foreground">진행업무상세내용 <span className="text-destructive">*</span></label>
                            <textarea
                              value={career.detailWork || ''}
                              onChange={(e) => handleUpdatePastCareer(career.id, 'detailWork', e.target.value)}
                              disabled={!isEditing}
                              placeholder="진행한 업무의 상세 내용을 작성해주세요"
                              className={!isEditing ? 'w-full min-h-[80px] px-3 py-2 text-sm rounded-md border resize-none border-input bg-muted/30' : 'w-full min-h-[80px] px-3 py-2 text-sm rounded-md border resize-none border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                            />
                          </div>
                          <div>
                            <label className="text-xs mb-1.5 block text-muted-foreground">프로젝트 기여사항 <span className="text-destructive">*</span></label>
                            <textarea
                              value={career.contribution || ''}
                              onChange={(e) => handleUpdatePastCareer(career.id, 'contribution', e.target.value)}
                              disabled={!isEditing}
                              placeholder="프로젝트에 대한 기여사항을 작성해주세요"
                              className={!isEditing ? 'w-full min-h-[80px] px-3 py-2 text-sm rounded-md border resize-none border-input bg-muted/30' : 'w-full min-h-[80px] px-3 py-2 text-sm rounded-md border resize-none border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
        </TabsContent>

        {/* 프로젝트 경력 탭 */}
        <TabsContent value="project-career" className="space-y-4 min-h-[600px]">
          <div className="space-y-4">
            {/* 경력 요약 */}
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-base">경력 요약</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">총경력</p>
                    <p className="text-lg">{employee.totalExperience || employee.experience || 0}년</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">프로젝트경력</p>
                    <p className="text-lg">{calculateTotalDuration(employee.projectCareers || [])}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">프로젝트 수</p>
                    <p className="text-lg">{employee.projectCareers?.length || 0}개</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">진행중 프로젝트</p>
                    <p className="text-lg">{employee.projectCareers?.filter(p => p.period?.includes('진행중') || p.period?.includes('현재')).length || 0}개</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 프로젝트 경력 리스트 */}
            <Card>
            <CardHeader>
              <CardTitle>프로젝트 경력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {employee.projectCareers && employee.projectCareers.length > 0 ? (
                employee.projectCareers.map((project) => (
                  <div 
                    key={project.id} 
                    className="border rounded-lg bg-card"
                  >
                    {/* 기본 정보 - 읽기 전용 */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">프로젝트 기본 정보</span>
                        <div className="flex items-center gap-2">
                          {(!project.field || !project.location || !project.tools || !project.overview || !project.detailWork || !project.contribution) ? (
                            <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-full border border-yellow-500/20">
                              상세정보 미입력
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-500 rounded-full border border-green-500/20">
                              입력완료
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedProjectCareer(expandedProjectCareer === project.id ? null : project.id)}
                          >
                            {expandedProjectCareer === project.id ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                상세정보 닫기
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                상세정보 보기
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">고객사명</label>
                          <Input
                            value={project.client}
                            disabled
                            placeholder="고객사명"
                            className="h-9 bg-muted/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">프로젝트명</label>
                          <Input
                            value={project.projectName}
                            disabled
                            placeholder="프로젝트명"
                            className="h-9 bg-muted/30"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs mb-1.5 block text-muted-foreground">수행업무내역</label>
                        <Input
                          value={project.description}
                          disabled
                          placeholder="수행업무내역"
                          className="h-9 bg-muted/30"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">수행기간</label>
                          <Input
                            value={project.period}
                            disabled
                            placeholder="예: 2020.01 ~ 2021.12"
                            className="h-9 bg-muted/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">역할</label>
                          <Input
                            value={project.role}
                            disabled
                            placeholder="역할"
                            className="h-9 bg-muted/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs mb-1.5 block text-muted-foreground">인력수</label>
                          <Input
                            type="number"
                            value={project.teamSize || ''}
                            disabled
                            placeholder="0"
                            className="h-9 bg-muted/30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 상세 정보 - 펼침/접힘 */}
                    {expandedProjectCareer === project.id && (
                      <div className="border-t p-4">
                        <h4 className="text-sm mb-3 flex items-center gap-2">
                          <span className="w-1 h-4 bg-primary rounded-full"></span>
                          상세 정보 입력
                        </h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs mb-1.5 block text-muted-foreground">과제분야 <span className="text-destructive">*</span></label>
                              <Input
                                value={project.field || ''}
                                onChange={(e) => handleUpdateProjectCareer(project.id, 'field', e.target.value)}
                                disabled={!isEditing}
                                placeholder="예: 웹 개발"
                                className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                              />
                            </div>
                            <div>
                              <label className="text-xs mb-1.5 block text-muted-foreground">위치 <span className="text-destructive">*</span></label>
                              <Input
                                value={project.location || ''}
                                onChange={(e) => handleUpdateProjectCareer(project.id, 'location', e.target.value)}
                                disabled={!isEditing}
                                placeholder="예: 서울시 강남구"
                                className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                              />
                            </div>
                            <div>
                              <label className="text-xs mb-1.5 block text-muted-foreground">사용도구 <span className="text-destructive">*</span></label>
                              <Input
                                value={project.tools || ''}
                                onChange={(e) => handleUpdateProjectCareer(project.id, 'tools', e.target.value)}
                                disabled={!isEditing}
                                placeholder="예: Java, Spring, MySQL"
                                className={!isEditing ? 'h-9 bg-muted/30' : 'h-9 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs mb-1.5 block text-muted-foreground">과제개요 <span className="text-destructive">*</span></label>
                            <textarea
                              value={project.overview || ''}
                              onChange={(e) => handleUpdateProjectCareer(project.id, 'overview', e.target.value)}
                              disabled={!isEditing}
                              placeholder="과제에 ���한 전반적인 개요를 작성해주세요"
                              className={!isEditing ? 'w-full min-h-[60px] px-3 py-2 text-sm rounded-md border resize-none border-input bg-muted/30' : 'w-full min-h-[60px] px-3 py-2 text-sm rounded-md border resize-none border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                            />
                          </div>
                          <div>
                            <label className="text-xs mb-1.5 block text-muted-foreground">진행업무상세내용 <span className="text-destructive">*</span></label>
                            <textarea
                              value={project.detailWork || ''}
                              onChange={(e) => handleUpdateProjectCareer(project.id, 'detailWork', e.target.value)}
                              disabled={!isEditing}
                              placeholder="진행한 업무의 상세 내용을 작성해주세요"
                              className={!isEditing ? 'w-full min-h-[80px] px-3 py-2 text-sm rounded-md border resize-none border-input bg-muted/30' : 'w-full min-h-[80px] px-3 py-2 text-sm rounded-md border resize-none border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                            />
                          </div>
                          <div>
                            <label className="text-xs mb-1.5 block text-muted-foreground">프로젝트 기여사항 <span className="text-destructive">*</span></label>
                            <textarea
                              value={project.contribution || ''}
                              onChange={(e) => handleUpdateProjectCareer(project.id, 'contribution', e.target.value)}
                              disabled={!isEditing}
                              placeholder="프로젝트에 대한 기여사항을 작성해주세요"
                              className={!isEditing ? 'w-full min-h-[80px] px-3 py-2 text-sm rounded-md border resize-none border-input bg-muted/30' : 'w-full min-h-[80px] px-3 py-2 text-sm rounded-md border resize-none border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20'}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">등록된 프로젝트 경력이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
        </TabsContent>
      </Tabs>
      </div>
      
      {/* 자산 할당 다이얼로그 */}
      <Dialog open={isAssetAssignDialogOpen} onOpenChange={setIsAssetAssignDialogOpen}>
        <DialogContent className="w-[90vw] sm:max-w-[1600px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>자산 할당</DialogTitle>
            <DialogDescription>
              {employee?.name}님에게 할당할 자산을 선택하세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {/* 검색 및 필터 */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="자산명, 모델명, 시리얼번호로 ��색..."
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

      {/* 프로젝트 히스토리 팝업 */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="!max-w-[1200px] w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>히스토리</DialogTitle>
            <DialogDescription>
              {employee?.name}님의 입사부터 현재까지의 구분 변동 이력을 확인하세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {historyList && historyList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="bg-muted/30">
                      <th className="text-center p-3 w-32">시작일</th>
                      <th className="text-center p-3 w-32">종료일</th>
                      <th className="text-center p-3 w-28">구분</th>
                      <th className="text-left p-3">프로젝트명</th>
                      <th className="text-center p-3 w-32">고객사</th>
                      <th className="text-left p-3">비고</th>
                      <th className="text-center p-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.map((history) => (
                      <tr key={history.id} className="border-b last:border-b-0 hover:bg-accent/30">
                        <td className="p-3 text-center">
                          <Input
                            type="date"
                            value={history.startDate.replace(/\./g, '-')}
                            onChange={(e) => {
                              const formatted = e.target.value.split('-').join('.');
                              const updated = historyList.map(h => 
                                h.id === history.id ? { ...h, startDate: formatted } : h
                              );
                              setHistoryList(updated);
                            }}
                            className={`text-xs text-center h-8 ${history.startDate ? 'bg-white' : 'bg-yellow-50'}`}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="date"
                            value={history.endDate ? history.endDate.replace(/\./g, '-') : ''}
                            onChange={(e) => {
                              const formatted = e.target.value.split('-').join('.');
                              const updated = historyList.map(h => 
                                h.id === history.id ? { ...h, endDate: formatted } : h
                              );
                              setHistoryList(updated);
                            }}
                            className={`text-xs text-center h-8 ${history.endDate ? 'bg-white' : 'bg-yellow-50'}`}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Select
                            value={history.classification}
                            onValueChange={(value) => {
                              const updated = historyList.map(h => {
                                if (h.id === history.id) {
                                  // 투입_정산 또는 투입_지원 선택 시 현재 프로젝트명과 고객사 자동 입력
                                  if ((value === '투입_정산' || value === '투입_지원') && employee) {
                                    return {
                                      ...h,
                                      classification: value,
                                      projectName: employee.currentProjectName || '',
                                      client: employee.currentClient || ''
                                    };
                                  } else if (value === '대기' || value === '관리') {
                                    // 대기 또는 관리 선택 시 프로젝트명과 고객사 초기화
                                    return {
                                      ...h,
                                      classification: value,
                                      projectName: '',
                                      client: ''
                                    };
                                  }
                                  return { ...h, classification: value };
                                }
                                return h;
                              });
                              setHistoryList(updated);
                            }}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="투입_정산">투입_정산</SelectItem>
                              <SelectItem value="투입_지원">투입_지원</SelectItem>
                              <SelectItem value="대기">대기</SelectItem>
                              <SelectItem value="관리">관리</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Input
                            type="text"
                            value={history.projectName || ''}
                            onChange={(e) => {
                              const updated = historyList.map(h => 
                                h.id === history.id ? { ...h, projectName: e.target.value } : h
                              );
                              setHistoryList(updated);
                            }}
                            className={`text-xs h-8 ${
                              history.classification === '투입_정산' || history.classification === '투입_지원'
                                ? 'bg-gray-100 cursor-not-allowed'
                                : history.classification === '대기' || history.classification === '관리'
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-white'
                            }`}
                            placeholder="프로젝트명"
                            disabled={history.classification === '투입_정산' || history.classification === '투입_지원' || history.classification === '대기' || history.classification === '관리'}
                            readOnly={history.classification === '투입_정산' || history.classification === '투입_지원'}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="text"
                            value={history.client || ''}
                            onChange={(e) => {
                              const updated = historyList.map(h => 
                                h.id === history.id ? { ...h, client: e.target.value } : h
                              );
                              setHistoryList(updated);
                            }}
                            className={`text-xs text-center h-8 ${
                              history.classification === '투입_정산' || history.classification === '투입_지원'
                                ? 'bg-gray-100 cursor-not-allowed'
                                : history.classification === '대기' || history.classification === '관리'
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-white'
                            }`}
                            placeholder="고객사"
                            disabled={history.classification === '투입_정산' || history.classification === '투입_지원' || history.classification === '대기' || history.classification === '관리'}
                            readOnly={history.classification === '투입_정산' || history.classification === '투입_지원'}
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="text"
                            value={history.note || ''}
                            onChange={(e) => {
                              const updated = historyList.map(h => 
                                h.id === history.id ? { ...h, note: e.target.value } : h
                              );
                              setHistoryList(updated);
                            }}
                            className="text-xs h-8 bg-white"
                            placeholder="비고"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveHistory(history.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                히스토리가 없습니다
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button onClick={handleAddHistory} className="gap-2">
              <Plus className="h-4 w-4" />
              추가
            </Button>
            <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}