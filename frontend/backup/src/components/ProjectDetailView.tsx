import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { useState, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  FolderKanban,
  Users,
  TrendingUp,
  Calendar,
  Trash2,
  Plus,
  Search,
  Building2,
  User
} from 'lucide-react';

interface ProjectDetailViewProps {
  projectCode: string;
  onBack: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  position: string;
  department: string;
  team: string;
  allocation: number; // 투입률 (%)
  startDate: string;
  endDate: string;
  classification: string; // 구분: 투입_정산, 투입_지원, 대기, 관리
  allocationPeriods?: AllocationPeriod[]; // 여러 투입 기간
}

// 투입 기간 인터페이스
interface AllocationPeriod {
  id: string;
  startDate: string;
  endDate: string;
  category: string; // 투입_정산, 투입_지원, 대기, 관리
}

// 프로젝트 데이터 정의
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
  members: string[];
}

//  력 데이터베이스 (조직별로 그룹화)
interface AvailableMember {
  code: string;
  name: string;
  position: string;
  department: string;
  team: string;
}

const availableMembersDatabase: { [key: string]: AvailableMember[] } = {
  'STE1실': [
    { code: 'EMP-001', name: '김광희', position: '수석', department: 'STE1실', team: 'LG전자 1팀' },
    { code: 'EMP-002', name: '이길원', position: '책임', department: 'STE1실', team: 'LG전자 1팀' },
    { code: 'EMP-003', name: '조현균', position: '선임', department: 'STE1실', team: 'LG전자 2팀' },
    { code: 'EMP-004', name: '정홍근', position: '사원', department: 'STE1실', team: 'LG전자 2팀' },
    { code: 'EMP-005', name: '박성호', position: '수석', department: 'STE1실', team: 'LG전자 1팀' },
    { code: 'EMP-015', name: '최준석', position: '책임', department: 'STE1실', team: 'LG전자 4팀' },
    { code: 'EMP-016', name: '강민수', position: '선임', department: 'STE1실', team: 'LG전자 4팀' },
  ],
  'STE2실': [
    { code: 'EMP-006', name: '김종협', position: '실장', department: 'STE2실', team: 'GS리테일 1팀' },
    { code: 'EMP-007', name: '최민호', position: '책임', department: 'STE2실', team: 'GS리테일 1팀' },
    { code: 'EMP-008', name: '이수진', position: '선임', department: 'STE2실', team: 'HDC랩스 1팀' },
    { code: 'EMP-009', name: '강태현', position: '사원', department: 'STE2실', team: 'HDC랩스 1팀' },
    { code: 'EMP-017', name: '박지원', position: '책임', department: 'STE2실', team: 'KT 알파1팀' },
    { code: 'EMP-018', name: '윤성호', position: '선임', department: 'STE2실', team: 'KT 알파1팀' },
  ],
  '경영전략실': [
    { code: 'EMP-010', name: '윤재석', position: '실장', department: '경영전략실', team: '경영지원팀' },
    { code: 'EMP-011', name: '한지민', position: '책임', department: '경영전략실', team: '경영지원팀' },
    { code: 'EMP-019', name: '정수아', position: '선임', department: '경영전략실', team: '사업전략팀' },
    { code: 'EMP-020', name: '이동현', position: '사원', department: '경영전략실', team: '사업전략팀' },
  ],
  '개발연구소': [
    { code: 'EMP-012', name: '송현우', position: '소장', department: '개발연구소', team: '자동화개발팀' },
    { code: 'EMP-013', name: '임수��', position: '책임', department: '개발연구소', team: '자동화개발팀' },
    { code: 'EMP-014', name: '배준영', position: '선임', department: '개발연구소', team: '자동화개발팀' },
  ]
};

// 소속실별 팀 매핑
const departmentTeamsMap: { [key: string]: string[] } = {
  'STE1실': ['LG전자 1팀', 'LG전자 2팀', 'LG전자 4팀'],
  'STE2실': ['GS리테일 1팀', 'HDC랩스 1팀', 'KT 알파1팀'],
  '경영전략실': ['경영지원팀', '사업전략팀'],
  '개발연구소': ['자동화개발팀']
};

const projectsDatabase: Project[] = [
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

export function ProjectDetailView({ projectCode, onBack }: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 종료일 변경 확인 다이얼로그
  const [showEndDateConfirmDialog, setShowEndDateConfirmDialog] = useState(false);
  const [pendingEndDate, setPendingEndDate] = useState('');
  
  // 인력 추가 다이얼로그 관련 state
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearchFilter, setMemberSearchFilter] = useState('');
  
  // 추가: 공통 투입기간
  const [commonStartDate, setCommonStartDate] = useState('');
  const [commonEndDate, setCommonEndDate] = useState('');
  const [commonClassification, setCommonClassification] = useState('투입_정산');
  
  // 월별 투입 현황 다이얼로그 관련 state
  const [isMonthlyAllocationDialogOpen, setIsMonthlyAllocationDialogOpen] = useState(false);
  const [selectedMemberForAllocation, setSelectedMemberForAllocation] = useState<TeamMember | null>(null);
  const [monthlyAllocations, setMonthlyAllocations] = useState<any[]>([]);
  
  // 추가된 인원 리스트 (투입현황 다이얼로그에서 표시용)
  const [recentlyAddedMembers, setRecentlyAddedMembers] = useState<TeamMember[]>([]);
  const [commonAppliedPeriod, setCommonAppliedPeriod] = useState<{startDate: string, endDate: string, classification: string} | null>(null);
  
  // 투입 기간 추가 관련 state
  const [newPeriodStartDate, setNewPeriodStartDate] = useState('');
  const [newPeriodEndDate, setNewPeriodEndDate] = useState('');
  const [newPeriodCategory, setNewPeriodCategory] = useState('투입_정산');
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  
  // hover 상태 관리
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

  // 현재 년월 (YYYY-MM 형식)
  const currentYearMonth = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }, []);

  // 투입 기간 목록에서 전체 투입 시작일/종료일 계산
  const calculatedMemberDates = useMemo(() => {
    if (!selectedMemberForAllocation) {
      return { startDate: '', endDate: '' };
    }
    
    const periods = selectedMemberForAllocation.allocationPeriods;
    if (!periods || periods.length === 0) {
      return { 
        startDate: selectedMemberForAllocation.startDate, 
        endDate: selectedMemberForAllocation.endDate 
      };
    }
    
    // 모든 기간에서 가장 빠른 시작일과 가장 늦은 종료일 찾기
    const startDates = periods.map(p => p.startDate);
    const endDates = periods.map(p => p.endDate);
    
    return {
      startDate: startDates.sort()[0],
      endDate: endDates.sort().reverse()[0]
    };
  }, [selectedMemberForAllocation]);

  // 특정 period에 대한 평균 투입률 계산 함수
  const calculateAveragePeriodAllocation = (
    period: AllocationPeriod,
    memberAllocation: number,
    projectStartDate: string,
    projectEndDate: string
  ): number => {
    const allocations = generateMonthlyAllocationsFromPeriods(
      [period],
      memberAllocation,
      projectStartDate,
      projectEndDate
    );
    
    if (allocations.length === 0) return 0;
    
    const totalAllocation = allocations.reduce((sum, a) => sum + a.allocation, 0);
    return Math.round(totalAllocation / allocations.length);
  };

  // 월별 데이터를 allocationPeriods로 변환하고 동일 구분 병합
  const convertMonthlyAllocationsToPeriods = (monthlyData: any[]): AllocationPeriod[] => {
    if (!monthlyData || monthlyData.length === 0) return [];
    
    const periods: AllocationPeriod[] = [];
    let currentPeriod: AllocationPeriod | null = null;
    
    monthlyData.forEach((monthData, index) => {
      const monthDate = new Date(monthData.month + '-01');
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      const monthStartDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const monthEndDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
      // 투입일수가 0이면 스킵 (현재 period 종료)
      if (monthData.workDays === 0) {
        // 현재 period가 있으면 종료하고 추가
        if (currentPeriod) {
          periods.push(currentPeriod);
          currentPeriod = null;
        }
        return;
      }
      
      // 새로운 구분이거나 첫 번째 데이터
      if (!currentPeriod || currentPeriod.category !== monthData.category) {
        // 이전 period가 있으면 추가
        if (currentPeriod) {
          periods.push(currentPeriod);
        }
        
        // 새로운 period 시작
        currentPeriod = {
          id: Date.now().toString() + '-' + index,
          startDate: monthStartDate,
          endDate: monthEndDate,
          category: monthData.category
        };
      } else {
        // 같은 구분이면 종료일만 연장
        currentPeriod.endDate = monthEndDate;
      }
    });
    
    // 마지막 period 추가
    if (currentPeriod) {
      periods.push(currentPeriod);
    }
    
    return periods;
  };

  // projectCode로 프로젝트 찾기
  const foundProject = useMemo(() => {
    return projectsDatabase.find(p => p.code === projectCode);
  }, [projectCode]);

  // 프로젝트 기간 중 월별 데이터 생성 함수 (구분별 계산)
  const generateMonthlyAllocationsFromPeriods = (
    periods: AllocationPeriod[], 
    memberAllocation: number,
    projectStartDate: string, 
    projectEndDate: string
  ) => {
    const monthlyDataArray: any[] = [];
    
    const projectStart = new Date(projectStartDate);
    const projectEnd = new Date(projectEndDate);
    
    // 프로젝트 시작월부터 종료월까지 순회
    let currentDate = new Date(projectStart);
    
    while (currentDate <= projectEnd) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      
      // 해당 월의 시작일과 종료일
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      const totalDaysInMonth = monthEnd.getDate();
      
      // 구분별로 투입 기간 그룹화 (시작일/종료일 포함)
      const categoryData: { [key: string]: { workDays: number; startDate: string; endDate: string } } = {};
      
      periods.forEach(period => {
        // 날짜를 정확하게 파싱 (시간대 문제 방지)
        const [pStartYear, pStartMonth, pStartDay] = period.startDate.split('-').map(Number);
        const [pEndYear, pEndMonth, pEndDay] = period.endDate.split('-').map(Number);
        const periodStart = new Date(pStartYear, pStartMonth - 1, pStartDay);
        const periodEnd = new Date(pEndYear, pEndMonth - 1, pEndDay);
        
        // 투입 기간과 해당 월이 겹치는지 확인
        const isInPeriod = periodStart <= monthEnd && periodEnd >= monthStart;
        
        if (isInPeriod) {
          // 실제 투입 시작일과 종료일 계산
          const actualStart = periodStart > monthStart ? periodStart : monthStart;
          const actualEnd = periodEnd < monthEnd ? periodEnd : monthEnd;
          
          // 투입 일수 계산
          const workDays = Math.floor((actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          
          // 날짜를 YYYY-MM-DD 형식으로 변환
          const formatDate = (date: Date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
          };
          
          const actualStartStr = formatDate(actualStart);
          const actualEndStr = formatDate(actualEnd);
          
          // 구분별로 일수 합산 및 시작일/종료일 저장 (해당 월 기준)
          if (!categoryData[period.category]) {
            categoryData[period.category] = {
              workDays: 0,
              startDate: actualStartStr,
              endDate: actualEndStr
            };
          } else {
            // 이미 존재하는 경우, 시작일은 더 이른 날짜로, 종료일은 더 늦은 날짜로 업데이트
            if (actualStartStr < categoryData[period.category].startDate) {
              categoryData[period.category].startDate = actualStartStr;
            }
            if (actualEndStr > categoryData[period.category].endDate) {
              categoryData[period.category].endDate = actualEndStr;
            }
          }
          categoryData[period.category].workDays += workDays;
        }
      });
      
      // 각 구분별로 행 생성
      Object.entries(categoryData).forEach(([category, data]) => {
        // 투입률 계산: (투입일수 / 총일수) * 100
        const calculatedAllocation = ((data.workDays / totalDaysInMonth) * 100).toFixed(1);
        const mm = (data.workDays / totalDaysInMonth).toFixed(2);
        
        // 해당 월과 구분에 해당하는 period 찾기 (periodId 포함)
        const matchingPeriod = periods.find(period => {
          const [pStartYear, pStartMonth, pStartDay] = period.startDate.split('-').map(Number);
          const [pEndYear, pEndMonth, pEndDay] = period.endDate.split('-').map(Number);
          const periodStart = new Date(pStartYear, pStartMonth - 1, pStartDay);
          const periodEnd = new Date(pEndYear, pEndMonth - 1, pEndDay);
          const isInPeriod = periodStart <= monthEnd && periodEnd >= monthStart;
          return isInPeriod && period.category === category;
        });
        
        monthlyDataArray.push({
          month: monthKey,
          monthDisplay: `${year}년 ${month}월`,
          workDays: data.workDays,
          totalDays: totalDaysInMonth,
          allocation: parseFloat(calculatedAllocation),
          mm: mm,
          category: category,
          periodStartDate: data.startDate,
          periodEndDate: data.endDate,
          periodId: matchingPeriod?.id // periodId 추가
        });
      });
      
      // 다음 달로 이��
      currentDate = new Date(year, month, 1);
    }
    
    return monthlyDataArray;
  };

  // 직원 클릭 핸들러
  const handleMemberClick = (member: TeamMember) => {
    setSelectedMemberForAllocation(member);
    
    // 투입 기간이 설정되어 있으면 월별 데이터 생성
    const periods = member.allocationPeriods && member.allocationPeriods.length > 0 
      ? member.allocationPeriods 
      : [{
          id: 'default',
          startDate: member.startDate,
          endDate: member.endDate,
          category: member.classification
        }];
    
    const allocations = generateMonthlyAllocationsFromPeriods(
      periods, 
      member.allocation,
      projectData.startDate, 
      projectData.endDate
    );
    setMonthlyAllocations(allocations);
    
    setIsMonthlyAllocationDialogOpen(true);
    
    // 새 기간 입력 초기화
    setNewPeriodStartDate('');
    setNewPeriodEndDate('');
    setNewPeriodCategory('투입_정산');
    setEditingPeriodId(null);
  };

  // 투입 기간 변경 시 월별 데이터 재생성
  const handleMemberDateChange = (startDate: string, endDate: string) => {
    if (!selectedMemberForAllocation) return;
    
    // 프로젝트 기간 내에서만 선택 가능하도록 검증
    const projectStart = new Date(projectData.startDate);
    const projectEnd = new Date(projectData.endDate);
    const selectedStart = new Date(startDate);
    const selectedEnd = new Date(endDate);
    
    if (selectedStart < projectStart || selectedEnd > projectEnd) {
      alert('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
      return;
    }
    
    if (selectedStart > selectedEnd) {
      alert('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }
    
    // 날짜 업데이트
    setMemberStartDate(startDate);
    setMemberEndDate(endDate);
    
    // 월별 데이터 재생성
    const updatedMember = {
      ...selectedMemberForAllocation,
      startDate,
      endDate
    };
    const allocations = generateMonthlyAllocationsFromPeriods(
      updatedMember.allocationPeriods || [], 
      updatedMember.allocation,
      projectData.startDate, 
      projectData.endDate
    );
    setMonthlyAllocations(allocations);
  };

  // 투입일수 변경 핸들러
  const handleWorkDaysChange = (monthIndex: number, newWorkDays: number) => {
    const updatedAllocations = [...monthlyAllocations];
    const allocation = updatedAllocations[monthIndex];
    
    // 해당 의 총 일수를 초과하 않도록 제한
    const validWorkDays = Math.min(Math.max(0, newWorkDays), allocation.totalDays);
    
    // 투입률 계산 (투입일수 / 총 일수 * 100)
    const calculatedAllocation = Math.round((validWorkDays / allocation.totalDays) * 100);
    
    // M/M 계산 (투입일수 / 총 일수)
    const calculatedMM = (validWorkDays / allocation.totalDays).toFixed(2);
    
    // 투입일수, 투입률, M/M 업데이트
    updatedAllocations[monthIndex] = {
      ...allocation,
      workDays: validWorkDays,
      allocation: calculatedAllocation,
      mm: calculatedMM
    };
    
    setMonthlyAllocations(updatedAllocations);
  };

  // 구분 변경 핸들러
  const handleCategoryChange = (monthIndex: number, newCategory: string) => {
    const updatedAllocations = [...monthlyAllocations];
    updatedAllocations[monthIndex] = {
      ...updatedAllocations[monthIndex],
      category: newCategory
    };
    setMonthlyAllocations(updatedAllocations);
  };

  // 투입 기간 추가/수정 핸들러
  const handleAddOrUpdatePeriod = () => {
    if (!selectedMemberForAllocation) return;
    
    // 유효성 검증
    if (!newPeriodStartDate || !newPeriodEndDate) {
      alert('시작일과 종료일을 모두 입력해주세요.');
      return;
    }
    
    const projectStart = new Date(projectData.startDate);
    const projectEnd = new Date(projectData.endDate);
    const periodStart = new Date(newPeriodStartDate);
    const periodEnd = new Date(newPeriodEndDate);
    
    if (periodStart < projectStart || periodEnd > projectEnd) {
      alert(`투입 기간은 프로젝트 기간(${projectData.startDate} ~ ${projectData.endDate}) 내에서만 설정할 수 있습니다.`);
      return;
    }
    
    if (periodStart > periodEnd) {
      alert('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }
    
    // 추가된 인원이 있으면 전체에 적용, 없으면 선택된 인원에만 적용
    const membersToUpdate = recentlyAddedMembers.length > 0 
      ? recentlyAddedMembers 
      : [selectedMemberForAllocation];
    
    // 전체 teamMembers 업데이트
    const updatedTeamMembers = teamMembers.map(m => {
      const memberToUpdate = membersToUpdate.find(mem => mem.id === m.id);
      if (!memberToUpdate) return m;
      
      const currentPeriods = m.allocationPeriods || [];
      let updatedPeriods;
      
      if (editingPeriodId) {
        // 수정 모드
        updatedPeriods = currentPeriods.map(p => 
          p.id === editingPeriodId
            ? { ...p, startDate: newPeriodStartDate, endDate: newPeriodEndDate, category: newPeriodCategory }
            : p
        );
      } else {
        // 추가 모드
        const newPeriod: AllocationPeriod = {
          id: Date.now().toString(),
          startDate: newPeriodStartDate,
          endDate: newPeriodEndDate,
          category: newPeriodCategory
        };
        updatedPeriods = [...currentPeriods, newPeriod];
      }
      
      return {
        ...m,
        allocationPeriods: updatedPeriods
      };
    });
    
    setTeamMembers(updatedTeamMembers);
    
    // 선택된 멤버와 추가된 인원 목록도 업데이트
    const updatedSelectedMember = updatedTeamMembers.find(m => m.id === selectedMemberForAllocation.id);
    if (updatedSelectedMember) {
      setSelectedMemberForAllocation(updatedSelectedMember);
      
      // 월별 데이터 재생성
      const allocations = generateMonthlyAllocationsFromPeriods(
        updatedSelectedMember.allocationPeriods || [],
        updatedSelectedMember.allocation,
        projectData.startDate,
        projectData.endDate
      );
      setMonthlyAllocations(allocations);
    }
    
    // recentlyAddedMembers 업데이트
    if (recentlyAddedMembers.length > 0) {
      const updatedRecentlyAdded = recentlyAddedMembers.map(ram => {
        const updated = updatedTeamMembers.find(m => m.id === ram.id);
        return updated || ram;
      });
      setRecentlyAddedMembers(updatedRecentlyAdded);
    }
    
    // 입력 초기화
    setNewPeriodStartDate('');
    setNewPeriodEndDate('');
    setNewPeriodCategory('투입_정산');
    setEditingPeriodId(null);
  };

  // 투입 기간 삭제 핸들러
  const handleDeletePeriod = (periodId: string) => {
    if (!selectedMemberForAllocation) return;
    
    const currentPeriods = selectedMemberForAllocation.allocationPeriods || [];
    const periodToDelete = currentPeriods.find(p => p.id === periodId);
    
    // 과거 기간 체크
    if (periodToDelete && isPeriodBeforeCurrentMonth(periodToDelete)) {
      alert('현재 월 이전에 종료된 투입 기간은 삭제할 수 없습니다.');
      return;
    }
    
    // 추가된 인원이 있으면 전체에 적용, 없으면 선택된 인원에만 적용
    const membersToUpdate = recentlyAddedMembers.length > 0 
      ? recentlyAddedMembers 
      : [selectedMemberForAllocation];
    
    // 전체 teamMembers 업데이트
    const updatedTeamMembers = teamMembers.map(m => {
      const memberToUpdate = membersToUpdate.find(mem => mem.id === m.id);
      if (!memberToUpdate) return m;
      
      const updatedPeriods = (m.allocationPeriods || []).filter(p => p.id !== periodId);
      
      return {
        ...m,
        allocationPeriods: updatedPeriods
      };
    });
    
    setTeamMembers(updatedTeamMembers);
    
    // 선택된 멤버와 추가된 인원 목록도 업데이트
    const updatedSelectedMember = updatedTeamMembers.find(m => m.id === selectedMemberForAllocation.id);
    if (updatedSelectedMember) {
      setSelectedMemberForAllocation(updatedSelectedMember);
      
      // 월별 데이터 재생성
      if (updatedSelectedMember.allocationPeriods && updatedSelectedMember.allocationPeriods.length > 0) {
        const allocations = generateMonthlyAllocationsFromPeriods(
          updatedSelectedMember.allocationPeriods,
          updatedSelectedMember.allocation,
          projectData.startDate,
          projectData.endDate
        );
        setMonthlyAllocations(allocations);
      } else {
        setMonthlyAllocations([]);
      }
    }
    
    // recentlyAddedMembers 업데이트
    if (recentlyAddedMembers.length > 0) {
      const updatedRecentlyAdded = recentlyAddedMembers.map(ram => {
        const updated = updatedTeamMembers.find(m => m.id === ram.id);
        return updated || ram;
      });
      setRecentlyAddedMembers(updatedRecentlyAdded);
    }
    
    // 편집 모드 초기화
    setNewPeriodStartDate('');
    setNewPeriodEndDate('');
    setNewPeriodCategory('투입_정산');
    setEditingPeriodId(null);
  };

  // 기간이 현재 월 이전에 종료되는지 확인
  const isPeriodBeforeCurrentMonth = (period: AllocationPeriod) => {
    const periodEndYearMonth = period.endDate.substring(0, 7); // YYYY-MM
    return periodEndYearMonth < currentYearMonth;
  };

  // 월별 M/M row 클릭 핸들러 (편집)
  const handleMonthRowClick = (monthData: any) => {
    console.log('Row clicked:', { monthData, isEditMode, currentYearMonth });
    
    if (!isEditMode) {
      console.log('편집 모드가 아닙니다.');
      return;
    }
    
    if (!selectedMemberForAllocation) {
      console.log('선택된 멤버가 없습니다.');
      return;
    }
    
    // 현재 월 이전이면 수정 불가
    if (monthData.month < currentYearMonth) {
      alert('현재 월 이전의 투입 기간은 수정할 수 없습니다.');
      return;
    }
    
    // periodId가 있으면 직접 사용, 없으면 기존 방식으로 검색
    const periods = selectedMemberForAllocation.allocationPeriods || [];
    let matchingPeriod;
    
    console.log('Searching for period:', { periodId: monthData.periodId, periods });
    
    if (monthData.periodId) {
      // periodId로 직접 찾기
      matchingPeriod = periods.find(period => period.id === monthData.periodId);
    } else {
      // 기존 방식: 월과 구분으로 찾기
      const monthStart = new Date(monthData.month + '-01');
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      matchingPeriod = periods.find(period => {
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);
        const isInMonth = periodStart <= monthEnd && periodEnd >= monthStart;
        const isMatchingCategory = period.category === monthData.category;
        return isInMonth && isMatchingCategory;
      });
    }
    
    console.log('Matching period found:', matchingPeriod);
    
    if (matchingPeriod) {
      // 상단 입력 폼에 값 채우기
      setNewPeriodStartDate(matchingPeriod.startDate);
      setNewPeriodEndDate(matchingPeriod.endDate);
      setNewPeriodCategory(matchingPeriod.category);
      setEditingPeriodId(matchingPeriod.id);
      
      // 입력 폼으로 스크롤 (선택적)
      document.querySelector('.period-edit-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      console.log('No matching period found!');
    }
  };

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

    // 료일 지났는데 완료 아님 = 지연
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

  // 초기 종료일 저장 (��료일 변경 감지용)
  const [initialEndDate, setInitialEndDate] = useState(() => {
    return foundProject ? foundProject.endDate : '';
  });

  // 임시 종료일 저장 (달력 조작 중)
  const [tempEndDate, setTempEndDate] = useState('');

  // 기본 정보 - foundProject 기반으로 초기화
  const [projectData, setProjectData] = useState(() => {
    if (foundProject) {
      return {
        code: foundProject.code,
        name: foundProject.name,
        client: foundProject.client,
        pm: foundProject.pm,
        department: foundProject.department,
        team: foundProject.team,
        status: getProjectStatus(foundProject),
        phase: foundProject.phase,
        startDate: foundProject.startDate,
        endDate: foundProject.endDate,
        budget: foundProject.budget,
        spent: foundProject.spent,
        description: foundProject.description,
        objective: '고객 만족도 95% 이상 달성, 테스트 커버리지 90% 이',
        deliverables: '테스트 계획서, 테스트 케이스, 테스트 결과 보고서, 품질 평가 보고서',
        remarks: ''
      };
    }
    return {
      code: projectCode,
      name: '프로젝트를 찾을 수 없습니다',
      client: '-',
      pm: '-',
      department: '-',
      team: '-',
      status: '계획',
      phase: '-',
      startDate: '',
      endDate: '',
      budget: 0,
      spent: 0,
      description: '',
      objective: '',
      deliverables: '',
      remarks: ''
    };
  });

  // 투입 인력 - foundProject의 members를 기반으로 초기화
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    if (foundProject && foundProject.members && foundProject.members.length > 0) {
      // members 배열의 이름을 TeamMember 객체로 변환
      return foundProject.members.map((memberName, index) => {
        // availableMembersDatabase에서 해당 직원 찾기
        let memberInfo: AvailableMember | undefined;
        Object.values(availableMembersDatabase).forEach(members => {
          const found = members.find(m => m.name === memberName);
          if (found) memberInfo = found;
        });

        return {
          id: `TM-${String(index + 1).padStart(3, '0')}`,
          name: memberName,
          role: '테스트 엔지니어',
          position: memberInfo?.position || '사원',
          department: memberInfo?.department || foundProject.department,
          team: memberInfo?.team || foundProject.team,
          allocation: 100,
          startDate: foundProject.startDate,
          endDate: foundProject.endDate,
          classification: '투입_정산'
        };
      });
    }
    return [];
  });

  const handleSave = () => {
    setIsEditMode(false);
    // TODO: 저장 로직
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // TODO: 데이터 복원 로직
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    if (window.confirm(`${memberName}을(를) 투입 인력에서 삭제하시겠습니까?`)) {
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    }
  };
  
  // 체크박스 토글
  const toggleMemberSelection = (code: string) => {
    setSelectedMembers(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };
  
  // 팀 전체 선택/해제
  const toggleTeamSelection = (teamMembersToSelect: AvailableMember[]) => {
    const teamMemberCodes = teamMembersToSelect.map(m => m.code);
    const allSelected = teamMemberCodes.every(code => selectedMembers.includes(code));
    
    if (allSelected) {
      // 모두 선택되어 있으면 해제
      setSelectedMembers(prev => prev.filter(code => !teamMemberCodes.includes(code)));
    } else {
      // 하나라도 선택되지 않았을 때
      // 기존 투입인력이 있는지 확인
      if (teamMembers.length > 0) {
        // 확인 메시지 띄우기
        const keepExisting = window.confirm(
          '팀 선택 시 기존 투입인력을 유지하시겠습니까?\n\n' +
          '• 예: 기존 투입인력 유지하고 ���로운 팀원 추가\n' +
          '• 아니오: 기존 투입인력 제거하고 새로운 팀원만 추가'
        );
        
        if (keepExisting) {
          // 기존 선택 유지하고 새로운 팀원들 추가
          setSelectedMembers(prev => {
            const newSelection = [...prev];
            teamMemberCodes.forEach(code => {
              if (!newSelection.includes(code)) {
                newSelection.push(code);
              }
            });
            return newSelection;
          });
        } else {
          // 기존 선택 초기화하고 새로운 팀원들만 선택
          setSelectedMembers(teamMemberCodes);
        }
      } else {
        // 기존 투입인력이 없으면 바로 추가
        setSelectedMembers(prev => {
          const newSelection = [...prev];
          teamMemberCodes.forEach(code => {
            if (!newSelection.includes(code)) {
              newSelection.push(code);
            }
          });
          return newSelection;
        });
      }
    }
  };
  
  // 현재 프로젝트의 구성원 코드 목록
  const getCurrentMemberCodes = () => {
    return teamMembers.map(m => m.id);
  };
  
  // 인력 추가 함수 (다중 선택)
  const handleAddMembers = () => {
    if (selectedMembers.length === 0) {
      alert('구성원을 선택해주세요.');
      return;
    }

    // 투입 기간 유효성 검사
    if (!commonStartDate || !commonEndDate) {
      alert('투입 시작일과 종료일을 입력해주세요.');
      return;
    }

    if (new Date(commonStartDate) > new Date(commonEndDate)) {
      alert('투입 시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    // 선택된 구성원들을 찾아서 추가
    const membersToAdd: TeamMember[] = [];
    let nextId = teamMembers.length + 1;
    
    Object.values(availableMembersDatabase).forEach(members => {
      members.forEach(member => {
        if (selectedMembers.includes(member.code)) {
          membersToAdd.push({
            id: `TM-${String(nextId++).padStart(3, '0')}`,
            name: member.name,
            role: '테스트 엔지니어', // 기본값
            position: member.position,
            department: member.department,
            team: member.team,
            allocation: 100, // 기본값
            startDate: commonStartDate, // 공통 시작일 적용
            endDate: commonEndDate, // 공통 종료일 적용
            classification: commonClassification // 공통 구분 적용
          });
        }
      });
    });

    setTeamMembers([...teamMembers, ...membersToAdd]);
    setSelectedMembers([]);
    setMemberSearchFilter('');
    setCommonStartDate('');
    setCommonEndDate('');
    setCommonClassification('투입_정산');
    setIsAddMemberDialogOpen(false);
    
    // 추가된 인력의 투입현황 팝업 열기
    if (membersToAdd.length > 0) {
      const firstMember = membersToAdd[0];
      setSelectedMemberForAllocation(firstMember);
      setMonthlyAllocations([]);
      
      // 추가된 인원 리스트와 공통 적용 기간 저장
      setRecentlyAddedMembers(membersToAdd);
      setCommonAppliedPeriod({
        startDate: commonStartDate,
        endDate: commonEndDate,
        classification: commonClassification
      });
      
      setIsMonthlyAllocationDialogOpen(true);
      alert(`${membersToAdd.length}명의 인력이 추가되었습니다.\n투입기간: ${commonStartDate} ~ ${commonEndDate}`);
    }
  };

  const getInputClassName = (value: string) => {
    if (!isEditMode) return 'bg-gray-100 dark:bg-gray-800';
    return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400';
  };

  // 마지막으로 메시지를 표시한 종료일을 추적 (화살표 클릭 방지)
  const lastCheckedEndDateRef = useRef<string>(foundProject?.endDate || '');

  // 필드별 수정 가능 여부 체크
  const isFieldEditable = (fieldName: string): boolean => {
    if (!isEditMode) return false;
    
    const status = projectData.status;
    
    // 완료 상태: status만 수정 ��능
    if (status === '완료') {
      return fieldName === 'status';
    }
    
    // 진행중 상태: code, name, client, startDate, budget, description, objective 수정불가 (endDate는 수정 가능)
    if (status === '진행중') {
      const uneditable = ['code', 'name', 'client', 'startDate', 'budget', 'description', 'objective'];
      return !uneditable.includes(fieldName);
    }
    
    // 계획 상태: code, name, client 수정불가
    if (status === '계획') {
      const uneditable = ['code', 'name', 'client'];
      return !uneditable.includes(fieldName);
    }
    
    // 기타 상태(지연 등): 모든 필드 수정 가능
    return true;
  };

  // 수정 불가 필드의 CSS 클래스
  const getFieldClassName = (fieldName: string, value: string) => {
    if (!isEditMode) return 'bg-gray-100 dark:bg-gray-800';
    if (!isFieldEditable(fieldName)) return 'bg-gray-100 dark:bg-gray-800';
    return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400';
  };

  // 종료일이 변경되었는지 체크
  const isEndDateChanged = () => {
    return initialEndDate !== projectData.endDate;
  };

  // 종료일 변경 핸들러 - onChange에서는 값만 업데이트
  const handleEndDateChange = (newEndDate: string) => {
    // 입력박스에 바로 반영
    setProjectData({ ...projectData, endDate: newEndDate });
  };

  // 종료일 포커스 해제 핸들러 - 달력이 닫힐 때 메시지 표시
  const handleEndDateBlur = () => {
    const currentEndDate = projectData.endDate;
    
    // 완전한 날짜 형식(YYYY-MM-DD)이고, 진행중이며, 초기값과 다르고, 이미 확인한 날짜가 아닌 경우에만 메시지 표시
    if (
      currentEndDate.length === 10 && 
      projectData.status === '진행중' && 
      currentEndDate !== initialEndDate &&
      currentEndDate !== lastCheckedEndDateRef.current
    ) {
      // ref 업데이트 (중복 메시지 방지)
      lastCheckedEndDateRef.current = currentEndDate;
      
      // 메시지 표시
      setPendingEndDate(currentEndDate);
      setShowEndDateConfirmDialog(true);
    }
  };

  // 종료일 변경 확인
  const confirmEndDateChange = () => {
    // 투입인력의 종료일도 모두 변경 (프로젝트 종료일은 이미 변경됨)
    setTeamMembers(teamMembers.map(member => ({
      ...member,
      endDate: pendingEndDate
    })));
    
    // 초기 종료일 업데이트 (다음 변경 감지를 위해)
    setInitialEndDate(pendingEndDate);
    lastCheckedEndDateRef.current = pendingEndDate;
    
    setShowEndDateConfirmDialog(false);
    setPendingEndDate('');
  };

  // 종료일 변경 취소
  const cancelEndDateChange = () => {
    // 원래 종료일로 되돌림
    setProjectData({ ...projectData, endDate: initialEndDate });
    lastCheckedEndDateRef.current = initialEndDate;
    
    setShowEndDateConfirmDialog(false);
    setPendingEndDate('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0
    }).format(amount) + '원';
  };

  const formatCurrencyShort = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0
    }).format(amount / 100000000) + '억';
  };

  const calculateProgress = (spent: number, budget: number) => {
    return Math.round((spent / budget) * 100);
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

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1>{projectData.name}</h1>
              <Badge className={getStatusColor(projectData.status)}>
                {projectData.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{projectData.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditMode ? (
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
          ) : (
            <Button size="sm" onClick={() => setIsEditMode(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              편집
            </Button>
          )}
        </div>
      </div>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            기본정보
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            투입인력
          </TabsTrigger>
        </TabsList>

        {/* 기본정보 탭 */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 기본정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">프로젝트 코드 *</label>
                  <Input
                    value={projectData.code}
                    onChange={(e) => setProjectData({ ...projectData, code: e.target.value })}
                    className={getFieldClassName('code', projectData.code)}
                    readOnly={!isFieldEditable('code')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">프로젝트명 *</label>
                  <Input
                    value={projectData.name}
                    onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                    className={getFieldClassName('name', projectData.name)}
                    readOnly={!isFieldEditable('name')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">고객사 *</label>
                  <Input
                    value={projectData.client}
                    onChange={(e) => setProjectData({ ...projectData, client: e.target.value })}
                    className={getFieldClassName('client', projectData.client)}
                    readOnly={!isFieldEditable('client')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">프로젝트 상태 *</label>
                  <Select 
                    value={projectData.status} 
                    onValueChange={(value) => setProjectData({ ...projectData, status: value })}
                    disabled={!isFieldEditable('status')}
                  >
                    <SelectTrigger className={getFieldClassName('status', projectData.status)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="계획">계획</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">소속 실 *</label>
                  <Select 
                    value={projectData.department} 
                    onValueChange={(value) => {
                      setProjectData({ ...projectData, department: value, team: '' });
                    }}
                    disabled={!isFieldEditable('department')}
                  >
                    <SelectTrigger className={getFieldClassName('department', projectData.department)}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STE1실">STE1실</SelectItem>
                      <SelectItem value="STE2실">STE2실</SelectItem>
                      <SelectItem value="경영전략실">경영전략실</SelectItem>
                      <SelectItem value="개발연구소">개발연구소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">담당 팀 *</label>
                  <Select 
                    value={projectData.team} 
                    onValueChange={(value) => setProjectData({ ...projectData, team: value })}
                    disabled={!isFieldEditable('team') || !projectData.department}
                  >
                    <SelectTrigger className={getFieldClassName('team', projectData.team)}>
                      <SelectValue placeholder={projectData.department ? "팀을 선택하세요" : "먼저 소속 실을 선택하세요"} />
                    </SelectTrigger>
                    <SelectContent>
                      {projectData.department && departmentTeamsMap[projectData.department]?.map((team) => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">시작일 *</label>
                  <Input
                    type="date"
                    value={projectData.startDate}
                    onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                    className={getFieldClassName('startDate', projectData.startDate)}
                    readOnly={!isFieldEditable('startDate')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">종료일 *</label>
                  <Input
                    type="date"
                    value={projectData.endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    onBlur={handleEndDateBlur}
                    className={getFieldClassName('endDate', projectData.endDate)}
                    readOnly={!isFieldEditable('endDate')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">총 예산 *</label>
                  <Input
                    type="number"
                    value={projectData.budget}
                    onChange={(e) => setProjectData({ ...projectData, budget: Number(e.target.value) })}
                    className={getFieldClassName('budget', String(projectData.budget))}
                    readOnly={!isFieldEditable('budget')}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm">프로젝트 설명</label>
                <Textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  className={getFieldClassName('description', projectData.description)}
                  readOnly={!isFieldEditable('description')}
                  rows={3}
                />
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm">프로젝트 목표</label>
                <Textarea
                  value={projectData.objective}
                  onChange={(e) => setProjectData({ ...projectData, objective: e.target.value })}
                  className={getFieldClassName('objective', projectData.objective)}
                  readOnly={!isFieldEditable('objective')}
                  rows={2}
                />
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm">주요 산출물</label>
                <Textarea
                  value={projectData.deliverables}
                  onChange={(e) => setProjectData({ ...projectData, deliverables: e.target.value })}
                  className={getFieldClassName('deliverables', projectData.deliverables)}
                  readOnly={!isFieldEditable('deliverables')}
                  rows={2}
                />
              </div>

              {/* 종료일 변경 시 비고 필드 표시 */}
              {isEndDateChanged() && (
                <div className="mt-4 space-y-2">
                  <label className="text-sm">비고 *</label>
                  <Textarea
                    value={projectData.remarks}
                    onChange={(e) => setProjectData({ ...projectData, remarks: e.target.value })}
                    className={getFieldClassName('remarks', projectData.remarks)}
                    readOnly={!isEditMode}
                    placeholder="프로젝트 종료일 변경"
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 투입인력 탭 */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    투입 인력 현황
                  </CardTitle>
                </div>
                {isEditMode && projectData.department && projectData.team && (
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedMemberForAllocation(null);
                    setMonthlyAllocations([]);
                    setNewPeriodStartDate('');
                    setNewPeriodEndDate('');
                    setNewPeriodCategory('투입_정산');
                    setEditingPeriodId(null);
                    // 인력 추가 버튼 클릭시에는 추가된 인원 리스트 초기화
                    setRecentlyAddedMembers([]);
                    setCommonAppliedPeriod(null);
                    setIsMonthlyAllocationDialogOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    인력 추가
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!projectData.department || !projectData.team ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    소속실과 담당팀이 설정되지 않았습니다.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    기본정보에서 소속실과 담당팀을 먼저 설정해주세요.
                  </p>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">
                    투입된 인력이 없습니다.
                  </p>
                  {isEditMode && (
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedMemberForAllocation(null);
                      setMonthlyAllocations([]);
                      setNewPeriodStartDate('');
                      setNewPeriodEndDate('');
                      setNewPeriodCategory('투입_정산');
                      setEditingPeriodId(null);
                      setRecentlyAddedMembers([]);
                      setCommonAppliedPeriod(null);
                      setIsMonthlyAllocationDialogOpen(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      인력 추가
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">이름</th>
                      <th className="text-left p-3 font-medium">구분</th>
                      <th className="text-left p-3 font-medium">역할</th>
                      <th className="text-left p-3 font-medium">직책</th>
                      <th className="text-left p-3 font-medium">소속</th>
                      <th className="text-left p-3 font-medium">팀</th>
                      <th className="text-center p-3 font-medium">투입률</th>
                      <th className="text-left p-3 font-medium">투입 기간</th>
                      {isEditMode && <th className="text-center p-3 font-medium">작업</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => {
                      // allocationPeriods가 있으면 그 데이터를 사용, 없으면 기존 데이터 사용
                      const periods = member.allocationPeriods && member.allocationPeriods.length > 0 
                        ? member.allocationPeriods 
                        : [{
                            id: 'default',
                            startDate: member.startDate,
                            endDate: member.endDate,
                            category: member.classification
                          }];
                      
                      // 각 구분별로 행 생성
                      return periods.map((period, periodIndex) => {
                        // 각 period의 평균 투입률 계산
                        const periodAllocation = member.allocationPeriods && member.allocationPeriods.length > 0
                          ? calculateAveragePeriodAllocation(period, member.allocation, projectData.startDate, projectData.endDate)
                          : member.allocation;
                        
                        return (
                          <tr 
                            key={`${member.id}-${periodIndex}`} 
                            className={`border-b transition-colors cursor-pointer ${hoveredMemberId === member.id ? 'bg-accent/30' : ''}`}
                            onClick={() => handleMemberClick(member)}
                            onMouseEnter={() => setHoveredMemberId(member.id)}
                            onMouseLeave={() => setHoveredMemberId(null)}
                          >
                            {/* 이름은 �� 번째 행에만 표시 (rowspan) */}
                            {periodIndex === 0 && (
                              <td className="p-3 border-r" rowSpan={periods.length}>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  {member.name}
                                </span>
                              </td>
                            )}
                            <td className="p-3 border-r">
                              <Badge variant="outline" className={
                                period.category === '투입_정산' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                period.category === '투입_지원' ? 'bg-green-50 text-green-700 border-green-300' :
                                period.category === '대기' ? 'bg-gray-50 text-gray-700 border-gray-300' :
                                'bg-purple-50 text-purple-700 border-purple-300'
                              }>
                                {period.category}
                              </Badge>
                            </td>
                            {periodIndex === 0 && (
                              <>
                                <td className="p-3 border-r" rowSpan={periods.length}>{member.role}</td>
                                <td className="p-3 border-r" rowSpan={periods.length}>{member.position}</td>
                                <td className="p-3 border-r" rowSpan={periods.length}>{member.department}</td>
                                <td className="p-3 text-sm text-muted-foreground border-r" rowSpan={periods.length}>{member.team}</td>
                              </>
                            )}
                            <td className="p-3 text-center border-r">
                              <Badge variant="outline">{periodAllocation}%</Badge>
                            </td>
                            <td className="p-3 text-sm border-r">
                              <div>{period.startDate}</div>
                              <div className="text-muted-foreground">~ {period.endDate}</div>
                            </td>
                            {isEditMode && periodIndex === 0 && (
                              <td className="p-3 text-center" rowSpan={periods.length} onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteMember(member.id, member.name)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">총 투입 인력</span>
                    </div>
                    <p className="text-2xl font-semibold">{teamMembers.length}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">평균 투입률</span>
                    </div>
                    <p className="text-2xl font-semibold">
                      {Math.round(teamMembers.reduce((sum, m) => sum + m.allocation, 0) / teamMembers.length)}%
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-muted-foreground">총 투입 M/M</span>
                    </div>
                    <p className="text-2xl font-semibold">24 M/M</p>
                  </div>
                </div>
              </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 인력 추가 다이얼로그 */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>인력 추가</DialogTitle>
            <DialogDescription>
              {projectData.name}에 구성원을 추가합니다. 조직별로 구성원을 선택하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto flex-1 min-h-0">
            {/* 선택된 인원이 1명 이상일 때 안내 메시지 및 투입 기간 입력 */}
            {selectedMembers.length > 0 && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">!</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      선택된 {selectedMembers.length}명의 인력에게 공통으로 적용될 투입 기간을 설정하세요
                    </p>
                    <p className="text-xs text-muted-foreground">
                      아래에서 설정하는 투입 시작일, 종료일, 구분은 선택된 모든 인력에게 동일하게 적용됩니다.
                    </p>
                    
                    {/* 선택된 인원 목록 표시 */}
                    <div className="pt-2 border-t border-primary/20">
                      <p className="text-xs font-medium text-foreground mb-2">선택된 인원:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.values(availableMembersDatabase).flatMap(members => members).filter(m => selectedMembers.includes(m.code)).map((member, index) => (
                          <span key={member.code} className="text-xs text-primary font-medium">
                            {member.name}({member.position}){index < selectedMembers.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 투입 기간 입력 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1">
                      투입 시작일 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="date"
                      value={commonStartDate}
                      onChange={(e) => setCommonStartDate(e.target.value)}
                      className={`text-sm ${!commonStartDate ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' : 'bg-white dark:bg-background'}`}
                      placeholder="시작일 선택"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1">
                      투입 종료일 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="date"
                      value={commonEndDate}
                      onChange={(e) => setCommonEndDate(e.target.value)}
                      className={`text-sm ${!commonEndDate ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' : 'bg-white dark:bg-background'}`}
                      placeholder="종료일 선택"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1">
                      구분 <span className="text-destructive">*</span>
                    </label>
                    <Select value={commonClassification} onValueChange={setCommonClassification}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
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
              </div>
            )}

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
                  {Object.values(availableMembersDatabase).flatMap(members => members).filter(m => selectedMembers.includes(m.code)).map((member) => (
                    <Badge 
                      key={member.code} 
                      variant="secondary" 
                      className="gap-1 pr-1"
                    >
                      <span>{member.name}</span>
                      <span className="text-xs text-muted-foreground">({member.position})</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMemberSelection(member.code);
                        }}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 조직별 구성원 목록 */}
            <div className="border border-border rounded-lg overflow-hidden">
              {Object.entries(availableMembersDatabase).map(([dept, members]) => {
                const currentMemberNames = teamMembers.map(m => m.name);
                const filteredMembers = members.filter((member) => {
                  // 이미 현재 프로젝트에 속한 구성원은 제외
                  if (currentMemberNames.includes(member.name)) return false;
                  
                  // 검색 필터 적용
                  if (memberSearchFilter) {
                    return (
                      member.name.toLowerCase().includes(memberSearchFilter.toLowerCase()) ||
                      member.position.toLowerCase().includes(memberSearchFilter.toLowerCase()) ||
                      member.team.toLowerCase().includes(memberSearchFilter.toLowerCase())
                    );
                  }
                  return true;
                });

                if (filteredMembers.length === 0) return null;

                return (
                  <div key={dept} className="border-b border-border last:border-b-0">
                    {/* 조직 헤더 (실) */}
                    <div className="p-3 bg-background border-b border-border sticky top-0 z-10">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{dept}</span>
                        <Badge variant="secondary" className="text-xs">
                          {filteredMembers.length}명
                        </Badge>
                      </div>
                    </div>
                    
                    {/* 팀별로 그룹화된 구성원 목록 */}
                    <div>
                      {(() => {
                        // 팀별로 그룹화
                        const teamGrouped: { [key: string]: AvailableMember[] } = {};
                        filteredMembers.forEach(member => {
                          if (!teamGrouped[member.team]) {
                            teamGrouped[member.team] = [];
                          }
                          teamGrouped[member.team].push(member);
                        });

                        return Object.entries(teamGrouped).map(([teamName, teamMembers]) => {
                          const teamMemberCodes = teamMembers.map(m => m.code);
                          const allTeamMembersSelected = teamMemberCodes.every(code => selectedMembers.includes(code));
                          const someTeamMembersSelected = teamMemberCodes.some(code => selectedMembers.includes(code));
                          
                          return (
                            <div key={teamName} className="border-b border-border last:border-b-0">
                            {/* 팀 헤더 - 클릭 시 팀 전체 선택/해제 */}
                            <div 
                              className="px-6 py-2 bg-muted/50 flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors"
                              onClick={() => toggleTeamSelection(teamMembers)}
                            >
                              {/* 팀 전체 선택 체크박스 */}
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                                    allTeamMembersSelected
                                      ? 'bg-primary border-primary'
                                      : someTeamMembersSelected
                                      ? 'bg-primary/50 border-primary'
                                      : 'border-border'
                                  }`}
                                >
                                  {allTeamMembersSelected ? (
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
                                  ) : someTeamMembersSelected ? (
                                    <svg
                                      className="w-3 h-3 text-primary-foreground"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                  ) : null}
                                </div>
                              </div>
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm font-medium text-muted-foreground">{teamName}</span>
                              <Badge variant="outline" className="text-xs">
                                {teamMembers.length}명
                              </Badge>
                              {someTeamMembersSelected && (
                                <Badge variant="default" className="text-xs ml-auto">
                                  {teamMemberCodes.filter(code => selectedMembers.includes(code)).length}명 선택됨
                                </Badge>
                              )}
                            </div>
                            
                            {/* 구성원 목록 */}
                            <div className="divide-y divide-border">
                              {teamMembers.map((member) => {
                                const isSelected = selectedMembers.includes(member.code);
                                
                                return (
                                  <div
                                    key={member.code}
                                    className={`p-3 pl-9 flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                                      isSelected ? 'bg-accent/70' : ''
                                    }`}
                                    onClick={() => toggleMemberSelection(member.code)}
                                  >
                                    {/* 체크박스 */}
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
                                    
                                    {/* 구성원 정보 */}
                                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium">{member.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {member.position}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                        });
                      })()}
                    </div>
                  </div>
                );
              })}
              
              {Object.entries(availableMembersDatabase).every(([dept, members]) => {
                const currentMemberNames = teamMembers.map(m => m.name);
                return members.every(m => currentMemberNames.includes(m.name));
              }) && (
                <div className="p-8 text-center text-muted-foreground">
                  추가할 수 있는 구성원이 없습니다
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => {
              setIsAddMemberDialogOpen(false);
              setSelectedMembers([]);
              setMemberSearchFilter('');
              setCommonStartDate('');
              setCommonEndDate('');
              setCommonClassification('투입_정산');
            }}>
              취소
            </Button>
            <Button 
              onClick={handleAddMembers} 
              disabled={selectedMembers.length === 0 || !commonStartDate || !commonEndDate}
            >
              <Save className="h-4 w-4 mr-2" />
              {selectedMembers.length}명 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 투입 상세 설정 다이얼로그 */}
      <Dialog open={isMonthlyAllocationDialogOpen} onOpenChange={(open) => {
        setIsMonthlyAllocationDialogOpen(open);
        if (!open) {
          // 다이얼로그 닫을 때 추가된 인원 리스트 초기화
          setRecentlyAddedMembers([]);
          setCommonAppliedPeriod(null);
        }
      }}>
        <DialogContent className="max-w-[900px] max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              투입 상세 설정
            </DialogTitle>
            <DialogDescription asChild>
              {selectedMemberForAllocation ? (
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-medium">
                      {selectedMemberForAllocation.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {selectedMemberForAllocation.position} / {selectedMemberForAllocation.department} {selectedMemberForAllocation.team}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{projectData.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({projectData.startDate} ~ {projectData.endDate})
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  투입 인력의 구분별 투입 기간을 설정합니다.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 min-h-0 py-4">
            {selectedMemberForAllocation ? (
              <div className="space-y-4">
                {/* 투입 기간 목록 */}
                {(() => {
                  // teamMembers에서 최신 데이터 가져오기
                  const currentMember = teamMembers.find(m => m.id === selectedMemberForAllocation.id);
                  const allocationPeriods = currentMember?.allocationPeriods;
                  
                  // allocationPeriods가 없으면 기본 투입 정보로 표시
                  if (!allocationPeriods || allocationPeriods.length === 0) {
                    // 기본 투입 정보가 있는지 확인
                    if (currentMember && currentMember.startDate && currentMember.endDate) {
                      return (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">구분별 투입 기간</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {isEditMode ? (
                              <div className="space-y-3">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b bg-muted/50">
                                        <th className="text-left p-2 font-medium w-[140px]">구분</th>
                                        <th className="text-left p-2 font-medium">시작일</th>
                                        <th className="text-left p-2 font-medium">종료일</th>
                                        <th className="text-center p-2 font-medium w-[80px]">작업</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="border-b">
                                        <td className="p-2">
                                          <Select
                                            value={currentMember.classification || '투입_정산'}
                                            onValueChange={(value) => {
                                              const updatedMembers = teamMembers.map(m => {
                                                if (m.id === selectedMemberForAllocation.id) {
                                                  return { ...m, classification: value };
                                                }
                                                return m;
                                              });
                                              setTeamMembers(updatedMembers);
                                              const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                              if (updatedMember) {
                                                setSelectedMemberForAllocation(updatedMember);
                                              }
                                            }}
                                          >
                                            <SelectTrigger className="h-8">
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
                                        <td className="p-2">
                                          <Input
                                            type="date"
                                            value={currentMember.startDate}
                                            onChange={(e) => {
                                              const newStartDate = e.target.value;
                                              if (newStartDate > currentMember.endDate) {
                                                alert('시작일은 종료일보다 이전이어야 합니다.');
                                                return;
                                              }
                                              if (newStartDate < projectData.startDate || newStartDate > projectData.endDate) {
                                                alert('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
                                                return;
                                              }
                                              const updatedMembers = teamMembers.map(m => {
                                                if (m.id === selectedMemberForAllocation.id) {
                                                  return { ...m, startDate: newStartDate };
                                                }
                                                return m;
                                              });
                                              setTeamMembers(updatedMembers);
                                              const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                              if (updatedMember) {
                                                setSelectedMemberForAllocation(updatedMember);
                                                const periods = [{
                                                  id: 'default',
                                                  startDate: updatedMember.startDate,
                                                  endDate: updatedMember.endDate,
                                                  category: updatedMember.classification
                                                }];
                                                const allocations = generateMonthlyAllocationsFromPeriods(
                                                  periods,
                                                  updatedMember.allocation,
                                                  projectData.startDate,
                                                  projectData.endDate
                                                );
                                                setMonthlyAllocations(allocations);
                                              }
                                            }}
                                            min={projectData.startDate}
                                            max={currentMember.endDate}
                                            className="h-8"
                                          />
                                        </td>
                                        <td className="p-2">
                                          <Input
                                            type="date"
                                            value={currentMember.endDate}
                                            onChange={(e) => {
                                              const newEndDate = e.target.value;
                                              if (newEndDate < currentMember.startDate) {
                                                alert('종료일은 시작일보다 이후여야 합니다.');
                                                return;
                                              }
                                              if (newEndDate < projectData.startDate || newEndDate > projectData.endDate) {
                                                alert('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
                                                return;
                                              }
                                              const updatedMembers = teamMembers.map(m => {
                                                if (m.id === selectedMemberForAllocation.id) {
                                                  return { ...m, endDate: newEndDate };
                                                }
                                                return m;
                                              });
                                              setTeamMembers(updatedMembers);
                                              const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                              if (updatedMember) {
                                                setSelectedMemberForAllocation(updatedMember);
                                                const periods = [{
                                                  id: 'default',
                                                  startDate: updatedMember.startDate,
                                                  endDate: updatedMember.endDate,
                                                  category: updatedMember.classification
                                                }];
                                                const allocations = generateMonthlyAllocationsFromPeriods(
                                                  periods,
                                                  updatedMember.allocation,
                                                  projectData.startDate,
                                                  projectData.endDate
                                                );
                                                setMonthlyAllocations(allocations);
                                              }
                                            }}
                                            min={currentMember.startDate}
                                            max={projectData.endDate}
                                            className="h-8"
                                          />
                                        </td>
                                        <td className="p-2 text-center">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                              if (window.confirm('기본 투입 정보를 삭제하시겠습니까?')) {
                                                const updatedMembers = teamMembers.map(m => {
                                                  if (m.id === selectedMemberForAllocation.id) {
                                                    return { ...m, startDate: '', endDate: '', classification: '투입_정산' };
                                                  }
                                                  return m;
                                                });
                                                setTeamMembers(updatedMembers);
                                                const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                                if (updatedMember) {
                                                  setSelectedMemberForAllocation(updatedMember);
                                                  setMonthlyAllocations([]);
                                                }
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    // 기본 투입 정보의 종료일 + 1일을 시작일로 설정
                                    const baseEndDate = new Date(currentMember.endDate);
                                    baseEndDate.setDate(baseEndDate.getDate() + 1);
                                    const newStartDate = baseEndDate.toISOString().split('T')[0];
                                    
                                    const basePeriod: AllocationPeriod = {
                                      id: 'base-period',
                                      startDate: currentMember.startDate,
                                      endDate: currentMember.endDate,
                                      category: currentMember.classification || '투입_정산'
                                    };
                                    
                                    const newPeriod: AllocationPeriod = {
                                      id: `period-${Date.now()}`,
                                      startDate: newStartDate,
                                      endDate: projectData.endDate,
                                      category: '투입_정산'
                                    };
                                    
                                    const updatedMembers = teamMembers.map(m => {
                                      if (m.id === selectedMemberForAllocation.id) {
                                        return {
                                          ...m,
                                          allocationPeriods: [basePeriod, newPeriod]
                                        };
                                      }
                                      return m;
                                    });
                                    setTeamMembers(updatedMembers);
                                    const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                    if (updatedMember) {
                                      setSelectedMemberForAllocation(updatedMember);
                                      const periods = updatedMember.allocationPeriods || [];
                                      const allocations = generateMonthlyAllocationsFromPeriods(
                                        periods,
                                        updatedMember.allocation,
                                        projectData.startDate,
                                        projectData.endDate
                                      );
                                      setMonthlyAllocations(allocations);
                                    }
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  투입 기간 추가
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="default">
                                      {currentMember.classification || '투입_정산'}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span>{currentMember.startDate} ~ {currentMember.endDate}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    }
                    
                    return (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <Calendar className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-sm">투입 기간이 설정되지 않았습니다.</p>
                        {isEditMode && <p className="text-xs mt-1">위에서 투입 기간을 추가해주세요.</p>}
                      </div>
                    );
                  }
                  
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">구분별 투입 기간</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditMode ? (
                          // 편집 모드: 테이블 형식
                          <div className="space-y-3">
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b bg-muted/50">
                                    <th className="text-left p-2 font-medium w-[140px]">구분</th>
                                    <th className="text-left p-2 font-medium">시작일</th>
                                    <th className="text-left p-2 font-medium">종료일</th>
                                    <th className="text-center p-2 font-medium w-[80px]">작업</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allocationPeriods.map((period) => (
                                    <tr key={period.id} className="border-b">
                                      <td className="p-2">
                                        <Select
                                          value={period.category}
                                          onValueChange={(value) => {
                                            const updatedMembers = teamMembers.map(m => {
                                              if (m.id === selectedMemberForAllocation.id) {
                                                return {
                                                  ...m,
                                                  allocationPeriods: m.allocationPeriods?.map(p => 
                                                    p.id === period.id ? { ...p, category: value } : p
                                                  )
                                                };
                                              }
                                              return m;
                                            });
                                            setTeamMembers(updatedMembers);
                                            const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                            if (updatedMember) {
                                              setSelectedMemberForAllocation(updatedMember);
                                              const periods = updatedMember.allocationPeriods || [];
                                              const allocations = generateMonthlyAllocationsFromPeriods(
                                                periods,
                                                updatedMember.allocation,
                                                projectData.startDate,
                                                projectData.endDate
                                              );
                                              setMonthlyAllocations(allocations);
                                            }
                                          }}
                                        >
                                          <SelectTrigger className="h-8">
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
                                      <td className="p-2">
                                        <Input
                                          type="date"
                                          value={period.startDate}
                                          onChange={(e) => {
                                            const newStartDate = e.target.value;
                                            if (newStartDate > period.endDate) {
                                              alert('시작일은 종료일보다 이전이어야 합니다.');
                                              return;
                                            }
                                            if (newStartDate < projectData.startDate || newStartDate > projectData.endDate) {
                                              alert('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
                                              return;
                                            }
                                            const updatedMembers = teamMembers.map(m => {
                                              if (m.id === selectedMemberForAllocation.id) {
                                                return {
                                                  ...m,
                                                  allocationPeriods: m.allocationPeriods?.map(p => 
                                                    p.id === period.id ? { ...p, startDate: newStartDate } : p
                                                  )
                                                };
                                              }
                                              return m;
                                            });
                                            setTeamMembers(updatedMembers);
                                            const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                            if (updatedMember) {
                                              setSelectedMemberForAllocation(updatedMember);
                                              const periods = updatedMember.allocationPeriods || [];
                                              const allocations = generateMonthlyAllocationsFromPeriods(
                                                periods,
                                                updatedMember.allocation,
                                                projectData.startDate,
                                                projectData.endDate
                                              );
                                              setMonthlyAllocations(allocations);
                                            }
                                          }}
                                          min={projectData.startDate}
                                          max={period.endDate}
                                          className="h-8"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <Input
                                          type="date"
                                          value={period.endDate}
                                          onChange={(e) => {
                                            const newEndDate = e.target.value;
                                            if (newEndDate < period.startDate) {
                                              alert('종료일은 시작일보다 이후여야 합니다.');
                                              return;
                                            }
                                            if (newEndDate < projectData.startDate || newEndDate > projectData.endDate) {
                                              alert('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
                                              return;
                                            }
                                            const updatedMembers = teamMembers.map(m => {
                                              if (m.id === selectedMemberForAllocation.id) {
                                                return {
                                                  ...m,
                                                  allocationPeriods: m.allocationPeriods?.map(p => 
                                                    p.id === period.id ? { ...p, endDate: newEndDate } : p
                                                  )
                                                };
                                              }
                                              return m;
                                            });
                                            setTeamMembers(updatedMembers);
                                            const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                            if (updatedMember) {
                                              setSelectedMemberForAllocation(updatedMember);
                                              const periods = updatedMember.allocationPeriods || [];
                                              const allocations = generateMonthlyAllocationsFromPeriods(
                                                periods,
                                                updatedMember.allocation,
                                                projectData.startDate,
                                                projectData.endDate
                                              );
                                              setMonthlyAllocations(allocations);
                                            }
                                          }}
                                          min={period.startDate}
                                          max={projectData.endDate}
                                          className="h-8"
                                        />
                                      </td>
                                      <td className="p-2 text-center">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                          onClick={() => {
                                            if (window.confirm('이 투입 기간을 삭제하시겠습니까?')) {
                                              const updatedMembers = teamMembers.map(m => {
                                                if (m.id === selectedMemberForAllocation.id) {
                                                  return {
                                                    ...m,
                                                    allocationPeriods: m.allocationPeriods?.filter(p => p.id !== period.id)
                                                  };
                                                }
                                                return m;
                                              });
                                              setTeamMembers(updatedMembers);
                                              const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                              if (updatedMember) {
                                                setSelectedMemberForAllocation(updatedMember);
                                                const periods = updatedMember.allocationPeriods || [];
                                                const allocations = generateMonthlyAllocationsFromPeriods(
                                                  periods,
                                                  updatedMember.allocation,
                                                  projectData.startDate,
                                                  projectData.endDate
                                                );
                                                setMonthlyAllocations(allocations);
                                              }
                                            }
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                const currentPeriods = currentMember?.allocationPeriods || [];
                                // 마지막 period의 종료일 + 1일을 시작일로 설정
                                let newStartDate = projectData.startDate;
                                if (currentPeriods.length > 0) {
                                  const lastPeriod = currentPeriods[currentPeriods.length - 1];
                                  const lastEndDate = new Date(lastPeriod.endDate);
                                  lastEndDate.setDate(lastEndDate.getDate() + 1);
                                  newStartDate = lastEndDate.toISOString().split('T')[0];
                                }
                                
                                const newPeriod: AllocationPeriod = {
                                  id: `period-${Date.now()}`,
                                  startDate: newStartDate,
                                  endDate: projectData.endDate,
                                  category: '투입_정산'
                                };
                                const updatedMembers = teamMembers.map(m => {
                                  if (m.id === selectedMemberForAllocation.id) {
                                    return {
                                      ...m,
                                      allocationPeriods: [...(m.allocationPeriods || []), newPeriod]
                                    };
                                  }
                                  return m;
                                });
                                setTeamMembers(updatedMembers);
                                const updatedMember = updatedMembers.find(m => m.id === selectedMemberForAllocation.id);
                                if (updatedMember) {
                                  setSelectedMemberForAllocation(updatedMember);
                                  const periods = updatedMember.allocationPeriods || [];
                                  const allocations = generateMonthlyAllocationsFromPeriods(
                                    periods,
                                    updatedMember.allocation,
                                    projectData.startDate,
                                    projectData.endDate
                                  );
                                  setMonthlyAllocations(allocations);
                                }
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              투입 기간 추가
                            </Button>
                          </div>
                        ) : (
                          // 읽기 모드: 카드 형식
                          <div className="space-y-2">
                            {allocationPeriods.map((period) => (
                              <div
                                key={period.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Badge variant={
                                    period.category === '투입_정산' ? 'default' :
                                    period.category === '투입_지원' ? 'secondary' :
                                    period.category === '대기' ? 'outline' : 'destructive'
                                  }>
                                    {period.category}
                                  </Badge>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{period.startDate} ~ {period.endDate}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })()}

                {/* 월별 M/M 현황 */}
                {monthlyAllocations.length > 0 && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-sm">월별 M/M 현황</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="text-left p-2 font-medium">년월</th>
                              <th className="text-left p-2 font-medium">구분</th>
                              <th className="text-left p-2 font-medium">시작일</th>
                              <th className="text-left p-2 font-medium">종료일</th>
                              <th className="text-center p-2 font-medium">투입률</th>
                              <th className="text-center p-2 font-medium">M/M</th>
                            </tr>
                          </thead>
                          <tbody>
                            {monthlyAllocations.map((monthData, index) => {
                              // 같은 월의 첫 번째 행인지 확인
                              const isFirstOfMonth = index === 0 || monthlyAllocations[index - 1].month !== monthData.month;
                              // 같은 월의 행이 몇 개인지 계산
                              const rowSpan = isFirstOfMonth 
                                ? monthlyAllocations.filter(m => m.month === monthData.month).length 
                                : 0;
                              // 같은 월의 M/M 합계 계산
                              const monthTotalMM = isFirstOfMonth
                                ? monthlyAllocations
                                    .filter(m => m.month === monthData.month)
                                    .reduce((sum, m) => sum + parseFloat(m.mm), 0)
                                    .toFixed(2)
                                : '0';
                              
                              return (
                                <tr key={index} className="border-b hover:bg-muted/30">
                                  {isFirstOfMonth && (
                                    <td className="p-2 align-middle" rowSpan={rowSpan}>{monthData.month}</td>
                                  )}
                                  <td className="p-2">
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        monthData.category === '투입_정산' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                        monthData.category === '투입_지원' ? 'bg-green-50 text-green-700 border-green-300' :
                                        monthData.category === '대기' ? 'bg-gray-50 text-gray-700 border-gray-300' :
                                        'bg-purple-50 text-purple-700 border-purple-300'
                                      }
                                    >
                                      {monthData.category}
                                    </Badge>
                                  </td>
                                  <td className="p-2 text-muted-foreground">{monthData.periodStartDate}</td>
                                  <td className="p-2 text-muted-foreground">{monthData.periodEndDate}</td>
                                  <td className="p-2 text-center">
                                    <Badge variant="outline">{monthData.allocation}%</Badge>
                                  </td>
                                  {isFirstOfMonth && (
                                    <td className="p-2 text-center font-medium align-middle" rowSpan={rowSpan}>{monthTotalMM}</td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="border-t-2 bg-muted/30 font-medium">
                              <td className="p-2" colSpan={5}>총 M/M</td>
                              <td className="p-2 text-center text-primary font-bold">
                                {monthlyAllocations.reduce((sum, m) => sum + parseFloat(m.mm), 0).toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <User className="h-16 w-16 mb-4 text-muted-foreground opacity-50" />
                <h4 className="text-lg font-medium mb-2">투입 인력을 선택해주세요</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  투입인력 탭에서 인력을 추가하거나 선택하세요.
                </p>
              </div>
            )}
            {/* 1명 이상의 인력이 추가되었을 때 안내 메시지 (숨김 처리) */}
            {false && recentlyAddedMembers.length >= 1 && commonAppliedPeriod && (
              <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">!</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {recentlyAddedMembers.length}명의 인력에게 공통 투입 기간이 적용되었습니다
                      </p>
                      {isEditMode && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setCommonStartDate(projectData.startDate);
                            setCommonEndDate(projectData.endDate);
                            setCommonClassification('투입_정산');
                            setIsAddMemberDialogOpen(true);
                          }}
                        >
                          <User className="h-3 w-3 mr-1" />
                          인력 변경
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      투입 시작일: {commonAppliedPeriod.startDate} | 투입 종료일: {commonAppliedPeriod.endDate} | 구분: {commonAppliedPeriod.classification}
                    </p>
                    
                    {/* 추가된 인원 목록 */}
                    <div className="pt-2 border-t border-primary/20">
                      <p className="text-xs font-medium text-foreground mb-2">추가된 인원:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {recentlyAddedMembers.map((member, index) => (
                          <Badge 
                            key={member.id} 
                            variant="secondary"
                            className={`cursor-pointer transition-colors ${selectedMemberForAllocation?.id === member.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                            onClick={() => {
                              setSelectedMemberForAllocation(member);
                              const allocations = generateMonthlyAllocationsFromPeriods(
                                member.allocationPeriods || [], 
                                member.allocation,
                                projectData.startDate, 
                                projectData.endDate
                              );
                              setMonthlyAllocations(allocations);
                            }}
                          >
                            {member.name}({member.position})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => {
              setIsMonthlyAllocationDialogOpen(false);
              setRecentlyAddedMembers([]);
              setCommonAppliedPeriod(null);
            }}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 종료일 변경 확인 다이얼로그 */}
      <Dialog open={showEndDateConfirmDialog} onOpenChange={setShowEndDateConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>종료일 변경 확인</DialogTitle>
            <DialogDescription>
              투입인력의 종료일도 변경됩니다. 진행하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelEndDateChange}>
              아니오
            </Button>
            <Button onClick={confirmEndDateChange}>
              예
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}