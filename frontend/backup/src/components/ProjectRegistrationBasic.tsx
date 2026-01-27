import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Save, X, Plus, FolderKanban, Calendar, DollarSign, Building2, ChevronDown, ChevronRight, Users, User, UserCheck, Trash2, TrendingUp, Edit2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

// 조직도 데이터
const initialOrganizationData = {
  name: '티벨',
  code: 'ORG-000',
  level: 0,
  children: [
    {
      name: 'STE그룹',
      code: 'ORG-100',
      level: 1,
      children: [
        {
          name: 'STE1실',
          code: 'ORG-110',
          level: 2,
          children: [
            { 
              name: 'LG전자 1팀', 
              code: 'ORG-111', 
              level: 3, 
              children: [
                { name: '김광희', code: 'EMP-1111', level: 4, headCount: 0, leader: '팀장', children: [] },
                { name: '정홍근', code: 'EMP-1112', level: 4, headCount: 0, leader: '사원', children: [] },
              ]
            },
            { 
              name: 'LG전자 2팀', 
              code: 'ORG-112', 
              level: 3, 
              children: [
                { name: '이길원', code: 'EMP-1121', level: 4, headCount: 0, leader: '팀장', children: [] },
                { name: '조현균', code: 'EMP-1122', level: 4, headCount: 0, leader: '선임', children: [] },
                { name: '권지수', code: 'EMP-1123', level: 4, headCount: 0, leader: '사원', children: [] },
                { name: '김민지', code: 'EMP-1124', level: 4, headCount: 0, leader: '사원', children: [] },
              ]
            },
            { 
              name: 'LG전자 4팀', 
              code: 'ORG-114', 
              level: 3, 
              children: [
                { name: '박진수', code: 'EMP-1141', level: 4, headCount: 0, leader: '사원', children: [] },
                { name: '이수연', code: 'EMP-1142', level: 4, headCount: 0, leader: '사원', children: [] },
              ]
            },
          ],
        },
        {
          name: 'STE2실',
          code: 'ORG-120',
          level: 2,
          children: [
            { 
              name: 'GS리테일 1팀', 
              code: 'ORG-121', 
              level: 3, 
              children: [
                { name: '강민수', code: 'EMP-1211', level: 4, headCount: 0, leader: '선임', children: [] },
                { name: '최유진', code: 'EMP-1212', level: 4, headCount: 0, leader: '사원', children: [] },
              ]
            },
            { 
              name: 'HDC랩스 1팀', 
              code: 'ORG-122', 
              level: 3, 
              children: [
                { name: '송지훈', code: 'EMP-1221', level: 4, headCount: 0, leader: '책임', children: [] },
                { name: '박서연', code: 'EMP-1222', level: 4, headCount: 0, leader: '사원', children: [] },
              ]
            },
            { 
              name: 'KT 알파1팀', 
              code: 'ORG-123', 
              level: 3, 
              children: [
                { name: '정다은', code: 'EMP-1231', level: 4, headCount: 0, leader: '선임', children: [] },
                { name: '한상우', code: 'EMP-1232', level: 4, headCount: 0, leader: '사원', children: [] },
              ]
            },
          ],
        },
      ],
    },
    {
      name: '경영전략실',
      code: 'ORG-200',
      level: 1,
      children: [
        { 
          name: '경영지원팀', 
          code: 'ORG-210', 
          level: 2, 
          children: [
            { name: '안재현', code: 'EMP-2101', level: 3, headCount: 0, leader: '팀장', children: [] },
            { name: '윤서영', code: 'EMP-2102', level: 3, headCount: 0, leader: '파트장', children: [] },
            { name: '김예림', code: 'EMP-2103', level: 3, headCount: 0, leader: '파트장', children: [] },
            { name: '가라현', code: 'EMP-2104', level: 3, headCount: 0, leader: '사원', children: [] },
            { name: '신소영', code: 'EMP-2105', level: 3, headCount: 0, leader: '사원', children: [] },
          ]
        },
        { 
          name: '사업전략팀', 
          code: 'ORG-220', 
          level: 2, 
          children: [
            { name: '이유라', code: 'EMP-2201', level: 3, headCount: 0, leader: '선임', children: [] },
            { name: '주호정', code: 'EMP-2202', level: 3, headCount: 0, leader: '사원', children: [] },
            { name: '김연서', code: 'EMP-2203', level: 3, headCount: 0, leader: '사원', children: [] },
          ]
        },
      ],
    },
    {
      name: '개발연구소',
      code: 'ORG-300',
      level: 1,
      children: [
        { 
          name: '자동화개발팀', 
          code: 'ORG-310', 
          level: 2, 
          children: [
            { name: '김준하', code: 'EMP-3101', level: 3, headCount: 0, leader: '선임', children: [] },
            { name: '이유나', code: 'EMP-3102', level: 3, headCount: 0, leader: '선임', children: [] },
            { name: '유정선', code: 'EMP-3103', level: 3, headCount: 0, leader: '선임', children: [] },
            { name: '손진빈', code: 'EMP-3104', level: 3, headCount: 0, leader: '사원', children: [] },
            { name: '유예진', code: 'EMP-3105', level: 3, headCount: 0, leader: '사원', children: [] },
          ]
        },
      ],
    },
  ],
};

export function ProjectRegistrationBasic() {
  const [isEditing, setIsEditing] = useState(true);
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ORG-000', 'ORG-100', 'ORG-110', 'ORG-120', 'ORG-200', 'ORG-300']));
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [isCreateMemberDialogOpen, setIsCreateMemberDialogOpen] = useState(false);
  const [selectedDeptForCreate, setSelectedDeptForCreate] = useState<any>(null);
  const [newTeamData, setNewTeamData] = useState({ name: '', code: '' });
  const [newMemberData, setNewMemberData] = useState({ name: '', code: '', position: '사원' });
  const [organizationData, setOrganizationData] = useState(initialOrganizationData);
  const [selectedTeamForMember, setSelectedTeamForMember] = useState<any>(null);
  const [selectedMemberCode, setSelectedMemberCode] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]); // 다중 선택을 위한 state

  // 오늘 날짜를 YYYY-MM-DD 형식으로
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    client: '',
    team: '', // "부서 > 팀" 형식으로 저장
    startDate: today,
    endDate: '',
    budget: '',
    phase: '계획',
    description: '',
    contractAmount: '', // 계약 금액
    location: '', // 작업 장소
    deliverables: '', // 산출물
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 투입 인력 정보
  const [assignedMembers, setAssignedMembers] = useState<Array<{
    code: string;
    name: string;
    position: string;
    role: string;
    startDate: string;
    endDate: string;
    allocationRate: string;
    dept: string;
    team: string;
    classification: string; // 구분: 투입_정산, 투입_지원, 대기, 관리
    isTeamLeader?: boolean; // 팀장 여부 플래그
  }>>([]);

  // 월별 투입 현황 다이얼로그 관련 state
  const [isMonthlyAllocationDialogOpen, setIsMonthlyAllocationDialogOpen] = useState(false);
  const [selectedMemberForAllocation, setSelectedMemberForAllocation] = useState<any | null>(null);
  const [monthlyAllocations, setMonthlyAllocations] = useState<any[]>([]);
  const [memberStartDate, setMemberStartDate] = useState('');
  const [memberEndDate, setMemberEndDate] = useState('');
  
  // 투입 기간 추가/수정 관련 state
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [newPeriodStartDate, setNewPeriodStartDate] = useState('');
  const [newPeriodEndDate, setNewPeriodEndDate] = useState('');
  const [newPeriodCategory, setNewPeriodCategory] = useState('투입_정산');

  // 현재 년월 (YYYY-MM 형식)
  const currentYearMonth = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }, []);

  // 투입인력 상세 다이얼로그 관련 state
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<any | null>(null);
  const [detailStartDate, setDetailStartDate] = useState('');
  const [detailEndDate, setDetailEndDate] = useState('');
  const [monthlyDetails, setMonthlyDetails] = useState<Array<{
    month: string;
    monthDisplay: string;
    classification: string;
    workDays: number;
    totalDays: number;
    allocation: number;
    mm: string;
  }>>([]);

  // 투입일수 변경 핸들러
  const handleDetailWorkDaysChange = (monthIndex: number, newWorkDays: number) => {
    const updatedDetails = [...monthlyDetails];
    const detail = updatedDetails[monthIndex];
    
    // 해당 월의 총 일수를 초과하지 않도록 제한
    const validWorkDays = Math.min(Math.max(0, newWorkDays), detail.totalDays);
    
    // 투입률 계산 (투입일수 / 총 일수 * 100)
    const calculatedAllocation = Math.round((validWorkDays / detail.totalDays) * 100);
    
    // M/M 계산 (투입일수 / 총 일수)
    const calculatedMM = (validWorkDays / detail.totalDays).toFixed(2);
    
    // 투입일수, 투입률, M/M 업데이트
    updatedDetails[monthIndex] = {
      ...detail,
      workDays: validWorkDays,
      allocation: calculatedAllocation,
      mm: calculatedMM
    };
    
    setMonthlyDetails(updatedDetails);
  };

  // 구분 변경 핸들러
  const handleDetailCategoryChange = (monthIndex: number, newCategory: string) => {
    const updatedDetails = [...monthlyDetails];
    updatedDetails[monthIndex] = {
      ...updatedDetails[monthIndex],
      classification: newCategory
    };
    setMonthlyDetails(updatedDetails);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 프로젝트 기간 변경 시 투입인력의 기간도 자동 업데이트
    if ((field === 'startDate' || field === 'endDate') && assignedMembers.length > 0) {
      const newStartDate = field === 'startDate' ? value : formData.startDate;
      const newEndDate = field === 'endDate' ? value : formData.endDate;
      
      if (newStartDate && newEndDate) {
        const updatedMembers = assignedMembers.map(member => {
          // 기존 투입 기간 업데이트
          const updatedPeriods = (member.allocationPeriods || []).map((period: any) => ({
            ...period,
            startDate: newStartDate,
            endDate: newEndDate
          }));
          
          return {
            ...member,
            startDate: newStartDate,
            endDate: newEndDate,
            allocationPeriods: updatedPeriods.length > 0 ? updatedPeriods : [{
              id: Date.now().toString() + '-' + member.code,
              startDate: newStartDate,
              endDate: newEndDate,
              category: member.classification || '투입_정산'
            }]
          };
        });
        
        setAssignedMembers(updatedMembers);
        toast.success('투입 인력의 기간이 프로젝트 기간에 맞춰 업데이트되었습니다.');
      }
    }
  };

  // 프로젝트 기간 중 월별 데이터 생성 함수
  const generateMonthlyAllocations = (member: any, projectStartDate: string, projectEndDate: string) => {
    const monthlyData = [];
    
    const memberStart = new Date(member.startDate);
    const memberEnd = new Date(member.endDate || projectEndDate);
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
      
      // 직원 투입 기간과 해당 월이 겹치는지 확인
      const isInPeriod = memberStart <= monthEnd && memberEnd >= monthStart;
      
      if (isInPeriod) {
        // 실제 투입 시작일과 종료일 계산
        const actualStart = memberStart > monthStart ? memberStart : monthStart;
        const actualEnd = memberEnd < monthEnd ? memberEnd : monthEnd;
        
        // 해당 월 총 일수
        const totalDaysInMonth = monthEnd.getDate();
        
        // 투입 일수 계산
        const workDays = Math.floor((actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        monthlyData.push({
          month: monthKey,
          monthDisplay: `${year}년 ${month}월`,
          startDate: actualStart.toISOString().split('T')[0],
          endDate: actualEnd.toISOString().split('T')[0],
          workDays: workDays,
          totalDays: totalDaysInMonth,
          allocation: parseInt(member.allocationRate) || 100,
          mm: (workDays / totalDaysInMonth * (parseInt(member.allocationRate) || 100) / 100).toFixed(2),
          category: member.classification || '투입_정산'
        });
      }
      
      // 다음 달로 이동
      currentDate = new Date(year, month, 1);
    }
    
    return monthlyData;
  };

  // 투입 기간 배열 기반 월별 데이터 생성 함수
  const generateMonthlyAllocationsFromPeriods = (
    periods: any[], 
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
      
      // 구분별로 투입 기간 그룹화
      const categoryData: { [key: string]: { workDays: number; startDate: string; endDate: string; periodId?: string } } = {};
      
      periods.forEach(period => {
        const [pStartYear, pStartMonth, pStartDay] = period.startDate.split('-').map(Number);
        const [pEndYear, pEndMonth, pEndDay] = period.endDate.split('-').map(Number);
        const periodStart = new Date(pStartYear, pStartMonth - 1, pStartDay);
        const periodEnd = new Date(pEndYear, pEndMonth - 1, pEndDay);
        
        const isInPeriod = periodStart <= monthEnd && periodEnd >= monthStart;
        
        if (isInPeriod) {
          const actualStart = periodStart > monthStart ? periodStart : monthStart;
          const actualEnd = periodEnd < monthEnd ? periodEnd : monthEnd;
          
          const workDays = Math.floor((actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          
          const formatDate = (date: Date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
          };
          
          const actualStartStr = formatDate(actualStart);
          const actualEndStr = formatDate(actualEnd);
          
          if (!categoryData[period.category]) {
            categoryData[period.category] = {
              workDays: 0,
              startDate: actualStartStr,
              endDate: actualEndStr,
              periodId: period.id
            };
          } else {
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
      
      Object.entries(categoryData).forEach(([category, data]) => {
        const calculatedAllocation = ((data.workDays / totalDaysInMonth) * 100).toFixed(1);
        const mm = (data.workDays / totalDaysInMonth).toFixed(2);
        
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
          periodId: data.periodId
        });
      });
      
      currentDate = new Date(year, month, 1);
    }
    
    return monthlyDataArray;
  };

  // 직원 클릭 핸들러
  const handleMemberClick = (member: any) => {
    if (!formData.startDate || !formData.endDate) {
      toast.error('프로젝트 시작일과 종료일을 먼저 입력해주세요.');
      return;
    }
    
    // allocationPeriods가 없으면 자동으로 생성하여 member 업데이트
    let updatedMember = member;
    if (!member.allocationPeriods || member.allocationPeriods.length === 0) {
      const defaultPeriod = {
        id: Date.now().toString() + '-' + member.code,
        startDate: member.startDate || formData.startDate,
        endDate: member.endDate || formData.endDate,
        category: member.classification || '투입_정산'
      };
      
      // assignedMembers 업데이트
      const updatedAssignedMembers = assignedMembers.map(m => {
        if (m.code === member.code) {
          return { ...m, allocationPeriods: [defaultPeriod] };
        }
        return m;
      });
      setAssignedMembers(updatedAssignedMembers);
      
      // updatedMember에 반영
      updatedMember = { ...member, allocationPeriods: [defaultPeriod] };
    }
    
    setSelectedMemberForAllocation(updatedMember);
    
    // 월별 데이터 생성
    const allocations = generateMonthlyAllocationsFromPeriods(
      updatedMember.allocationPeriods, 
      parseInt(updatedMember.allocationRate) || 100,
      formData.startDate, 
      formData.endDate
    );
    console.log('Generated monthly allocations:', allocations);
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
    const projectStart = new Date(formData.startDate);
    const projectEnd = new Date(formData.endDate);
    const selectedStart = new Date(startDate);
    const selectedEnd = new Date(endDate);
    
    if (selectedStart < projectStart || selectedEnd > projectEnd) {
      toast.error('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
      return;
    }
    
    if (selectedStart > selectedEnd) {
      toast.error('시작일은 종료일보다 이전이어야 합니다.');
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
    const allocations = generateMonthlyAllocations(updatedMember, formData.startDate, formData.endDate);
    setMonthlyAllocations(allocations);
  };

  // 투입 기간 추가/수정 핸들러
  const handleAddOrUpdatePeriod = () => {
    if (!selectedMemberForAllocation) return;
    
    if (!newPeriodStartDate || !newPeriodEndDate) {
      toast.error('시작일과 종료일을 모두 입력해주세요.');
      return;
    }
    
    const projectStart = new Date(formData.startDate);
    const projectEnd = new Date(formData.endDate);
    const periodStart = new Date(newPeriodStartDate);
    const periodEnd = new Date(newPeriodEndDate);
    
    if (periodStart < projectStart || periodEnd > projectEnd) {
      toast.error(`투입 기간은 프로젝트 기간(${formData.startDate} ~ ${formData.endDate}) 내에서만 설정할 수 있습니다.`);
      return;
    }
    
    if (periodStart > periodEnd) {
      toast.error('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }
    
    // assignedMembers에서 현재 멤버 찾기
    const updatedAssignedMembers = assignedMembers.map(m => {
      if (m.code !== selectedMemberForAllocation.code) return m;
      
      const currentPeriods = m.allocationPeriods || [];
      let updatedPeriods;
      
      if (editingPeriodId) {
        // 수정 모드
        updatedPeriods = currentPeriods.map((p: any) => 
          p.id === editingPeriodId
            ? { ...p, startDate: newPeriodStartDate, endDate: newPeriodEndDate, category: newPeriodCategory }
            : p
        );
      } else {
        // 추가 모드
        const newPeriod = {
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
    
    setAssignedMembers(updatedAssignedMembers);
    
    // 선택된 멤버 업데이트
    const updatedSelectedMember = updatedAssignedMembers.find(m => m.code === selectedMemberForAllocation.code);
    if (updatedSelectedMember) {
      setSelectedMemberForAllocation(updatedSelectedMember);
      
      // 월별 데이터 재생성
      const allocations = generateMonthlyAllocationsFromPeriods(
        updatedSelectedMember.allocationPeriods || [],
        parseInt(updatedSelectedMember.allocationRate) || 100,
        formData.startDate,
        formData.endDate
      );
      setMonthlyAllocations(allocations);
    }
    
    // 입력 초기화
    setNewPeriodStartDate('');
    setNewPeriodEndDate('');
    setNewPeriodCategory('투입_정산');
    setEditingPeriodId(null);
    
    toast.success(editingPeriodId ? '투입 기간이 수정되었습니다.' : '투입 기간이 추가되었습니다.');
  };

  // 투입 기간 삭제 핸들러
  const handleDeletePeriod = (periodId: string) => {
    if (!selectedMemberForAllocation) return;
    
    const updatedAssignedMembers = assignedMembers.map(m => {
      if (m.code !== selectedMemberForAllocation.code) return m;
      
      const updatedPeriods = (m.allocationPeriods || []).filter((p: any) => p.id !== periodId);
      
      return {
        ...m,
        allocationPeriods: updatedPeriods
      };
    });
    
    setAssignedMembers(updatedAssignedMembers);
    
    // 선택된 멤버 업데이트
    const updatedSelectedMember = updatedAssignedMembers.find(m => m.code === selectedMemberForAllocation.code);
    if (updatedSelectedMember) {
      setSelectedMemberForAllocation(updatedSelectedMember);
      
      // 월별 데이터 재생성
      const allocations = generateMonthlyAllocationsFromPeriods(
        updatedSelectedMember.allocationPeriods || [],
        parseInt(updatedSelectedMember.allocationRate) || 100,
        formData.startDate,
        formData.endDate
      );
      setMonthlyAllocations(allocations);
    }
    
    // 입력 초기화
    setNewPeriodStartDate('');
    setNewPeriodEndDate('');
    setNewPeriodCategory('투입_정산');
    setEditingPeriodId(null);
    
    toast.success('투입 기간이 삭제되었습니다.');
  };

  // 투입현황 다이얼로그 닫기 핸들러 - 월별 데이터로 투입인력 리스트 업데이트
  const handleCloseMonthlyAllocationDialog = () => {
    if (!selectedMemberForAllocation || monthlyAllocations.length === 0) {
      setIsMonthlyAllocationDialogOpen(false);
      return;
    }
    
    // 월별 데이터를 monthlyDetails 형식으로 변환
    const monthlyDetails = monthlyAllocations.map(data => ({
      month: data.month,
      monthDisplay: data.monthDisplay,
      classification: data.category,
      workDays: data.workDays,
      totalDays: data.totalDays,
      allocation: data.allocation,
      mm: data.mm
    }));
    
    // 평균 투입률 계산
    const avgAllocationRate = monthlyAllocations.length > 0
      ? Math.round(monthlyAllocations.reduce((sum, data) => sum + data.allocation, 0) / monthlyAllocations.length)
      : 100;
    
    // 총 M/M 계산
    const totalMM = monthlyAllocations.reduce((sum, data) => sum + parseFloat(data.mm), 0).toFixed(2);
    
    // 투입 시작일과 종료일 찾기
    const allDates = monthlyAllocations.map(m => ({
      start: new Date(m.periodStartDate || m.startDate),
      end: new Date(m.periodEndDate || m.endDate)
    }));
    const minStartDate = new Date(Math.min(...allDates.map(d => d.start.getTime())));
    const maxEndDate = new Date(Math.max(...allDates.map(d => d.end.getTime())));
    
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    
    // assignedMembers 업데이트
    const updatedAssignedMembers = assignedMembers.map(member => {
      if (member.code === selectedMemberForAllocation.code) {
        return {
          ...member,
          startDate: formatDate(minStartDate),
          endDate: formatDate(maxEndDate),
          allocationRate: String(avgAllocationRate),
          classification: monthlyAllocations[0]?.category || member.classification,
          monthlyDetails: monthlyDetails
        };
      }
      return member;
    });
    
    setAssignedMembers(updatedAssignedMembers);
    setIsMonthlyAllocationDialogOpen(false);
    
    toast.success(`투입 정보가 업데이트되었습니다. 평균 투입률: ${avgAllocationRate}%, 총 M/M: ${totalMM}`);
  };

  // 월별 M/M row 클릭 핸들러 (편집)
  const handleMonthRowClick = (monthData: any) => {
    if (!isEditing) {
      return;
    }
    
    if (!selectedMemberForAllocation) {
      return;
    }
    
    // 현재 월 이전이면 수정 불가
    if (monthData.month < currentYearMonth) {
      toast.error('현재 월 이전의 투입 기간은 수정할 수 없습니다.');
      return;
    }
    
    // periodId가 있으면 직접 사용, 없으면 기존 방식으로 검색
    const periods = selectedMemberForAllocation.allocationPeriods || [];
    let matchingPeriod;
    
    if (monthData.periodId) {
      // periodId로 직접 찾기
      matchingPeriod = periods.find((period: any) => period.id === monthData.periodId);
    } else {
      // 기존 방식: 월과 구분으로 찾기
      const monthStart = new Date(monthData.month + '-01');
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      matchingPeriod = periods.find((period: any) => {
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);
        const isInMonth = periodStart <= monthEnd && periodEnd >= monthStart;
        const isMatchingCategory = period.category === monthData.category;
        return isInMonth && isMatchingCategory;
      });
    }
    
    if (matchingPeriod) {
      // 상단 입력 폼에 값 채우기
      setNewPeriodStartDate(matchingPeriod.startDate);
      setNewPeriodEndDate(matchingPeriod.endDate);
      setNewPeriodCategory(matchingPeriod.category);
      setEditingPeriodId(matchingPeriod.id);
      
      // 입력 폼으로 스크롤
      setTimeout(() => {
        document.querySelector('.period-edit-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  // 투입일수 변경 핸들러
  const handleWorkDaysChange = (monthIndex: number, newWorkDays: number) => {
    const updatedAllocations = [...monthlyAllocations];
    const allocation = updatedAllocations[monthIndex];
    
    // 해당 월의 총 일수를 초과하지 않도록 제한
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

  // 부서 변경   초기화
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value, team: '' }));
    setTouched(prev => ({ ...prev, department: true }));
  };

  const handleSave = () => {
    // 필수 항목 검증
    const requiredFields = ['code', 'name', 'client', 'startDate', 'endDate', 'budget'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (emptyFields.length > 0) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 날짜 검증
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('종료일은 시작일보다 이후여야 합니다.');
      return;
    }

    toast.success('프로젝트 정보가 저장되었습니다.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (confirm('입력한 내용이 모두 삭제됩니다. 계속하시겠습니까?')) {
      setFormData({
        code: '',
        name: '',
        client: '',
        team: '',
        startDate: today,
        endDate: '',
        budget: '',
        phase: '계획',
        description: '',
        contractAmount: '',
        location: '',
        deliverables: '',
      });
      setTouched({});
      toast.info('입력 내용이 초기화되었습니다.');
    }
  };

  const getInputClassName = (fieldName: string, value: string) => {
    if (!isEditing) {
      return 'bg-muted';
    }
    if (touched[fieldName] && value) {
      return 'bg-white dark:bg-background';
    }
    if (touched[fieldName] && !value) {
      return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700';
    }
    return '';
  };

  // 필수 항목
  const requiredFields = ['code', 'name', 'client', 'team', 'startDate', 'endDate', 'budget'];

  // 조직도 노드 토글
  const toggleNode = (code: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  // 조직도에 팀 추가 (재귀적으로 부서를 찾아서 추가)
  const addTeamToOrganization = (code: string, name: string, parentCode: string) => {
    const addTeamRecursive = (node: any): any => {
      // 현재 노드가 부모 부서인 경우
      if (node.code === parentCode) {
        // 새 팀의 level 계산
        const newTeamLevel = node.level + 1;
        
        // 새 팀 객체
        const newTeam = {
          name,
          code,
          level: newTeamLevel,
          children: [],
        };
        
        // children 배열에 새 팀 추가
        return {
          ...node,
          children: [...(node.children || []), newTeam],
        };
      }
      
      // 자식이 있으면 재귀적으로 탐색
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map((child: any) => addTeamRecursive(child)),
        };
      }
      
      return node;
    };

    // 조직도 업데이트
    setOrganizationData(prev => addTeamRecursive(prev));
    
    // 부모 노드 자동 확장
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.add(parentCode);
      return newSet;
    });
  };

  // 조직도에 구성원 추가 (재귀적으로 팀을 찾아서 추가)
  const addMemberToOrganization = (memberCode: string, memberName: string, position: string, teamCode: string) => {
    const addMemberRecursive = (node: any): any => {
      // 현재 노드가 대상 팀인 경우
      if (node.code === teamCode) {
        // 새 구성원 객체 (level은 팀 + 1)
        const newMember = {
          name: memberName,
          code: memberCode,
          level: node.level + 1,
          leader: position,
          headCount: 0,
          children: [],
        };
        
        // children 배열에 새 성 추가
        return {
          ...node,
          children: [...(node.children || []), newMember],
        };
      }
      
      // 자식이 있으면 재귀적으로 탐색
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map((child: any) => addMemberRecursive(child)),
        };
      }
      
      return node;
    };

    // 조직도 업데이트
    setOrganizationData(prev => addMemberRecursive(prev));
    
    // 팀 노드 자동 확장
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.add(teamCode);
      return newSet;
    });
  };

  // 조직도에서 모든 구성원 추출 (headCount: 0, leader 있는 사람들)
  const getAllMembers = () => {
    const members: Array<{code: string, name: string, position: string, team: string, dept: string}> = [];
    
    const extractMembers = (node: any, teamName: string = '', deptName: string = '') => {
      // 구성원�� 경우 (headCount: 0, leader 있음)
      if (node.headCount === 0 && node.leader) {
        members.push({
          code: node.code,
          name: node.name,
          position: node.leader,
          team: teamName,
          dept: deptName
        });
      }
      
      // 팀 레벨 감지 (level 2나 3)
      const isTeam = (node.level === 3) || (node.level === 2 && (node.code?.startsWith('ORG-2') || node.code?.startsWith('ORG-3')));
      // 부서 레벨 감지
      const isDept = (node.level === 2 && node.code?.startsWith('ORG-1')) || (node.level === 1 && (node.code?.startsWith('ORG-2') || node.code?.startsWith('ORG-3')));
      
      // 자식 노드 탐색
      if (node.children) {
        for (const child of node.children) {
          extractMembers(
            child, 
            isTeam ? node.name : teamName,
            isDept ? node.name : deptName
          );
        }
      }
    };
    
    extractMembers(organizationData);
    return members;
  };

  // 조직별로 구성원 그룹화
  const getAllMembersGrouped = () => {
    const allMembers = getAllMembers();
    const grouped: { [key: string]: any[] } = {};
    
    allMembers.forEach(member => {
      const key = `${member.dept} > ${member.team}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(member);
    });
    
    return grouped;
  };

  // 체크박스 토글
  const toggleMemberSelection = (memberCode: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberCode)) {
        return prev.filter(code => code !== memberCode);
      } else {
        return [...prev, memberCode];
      }
    });
  };

  // 조직도에서 부서/팀 선택
  const handleOrgSelect = (node: any) => {
    // 팀만 선택 가능 (level 2는 경영전략실/개발연구소 하위 팀, level 3은 STE그룹 하위 팀)
    const isTeam = (node.level === 3) || (node.level === 2 && (node.code.startsWith('ORG-2') || node.code.startsWith('ORG-3')));
    
    // 상위 부서인지 확인 (팀 생성 가능한 레벨)
    const isDeptForTeamCreate = (
      (node.level === 2 && node.code.startsWith('ORG-1')) || // STE1실, STE2실
      (node.level === 1 && (node.code.startsWith('ORG-2') || node.code.startsWith('ORG-3'))) // 경영전략실, 개발연구소
    );

    // 상위 부서 클릭 시 - 팀 생성 버튼 활성화를 위해 저장
    if (isDeptForTeamCreate) {
      setSelectedDeptForCreate(node);
      toast.info(`"${node.name}"이(가) 선되었습니다. 팀 생�� 버튼을 클릭하세요.`);
      return;
    }

    // 팀 클릭 시
    if (!isTeam) return;

    // 부모 부서 찾기
    const findParentDept = (orgNode: any, targetNode: any): string | null => {
      if (orgNode.children) {
        for (const child of orgNode.children) {
          if (child.code === targetNode.code) {
            return orgNode.name;
          }
          if (child.children) {
            const found = findParentDept(child, targetNode);
            if (found) return found;
          }
        }
      }
      return null;
    };

    let parentDept = '';
    
    // level 2인 경우 (경영전략실, 개발연구소 하위 팀)
    if (node.level === 2 && (node.code.startsWith('ORG-2') || node.code.startsWith('ORG-3'))) {
      // 부모가 곧 부서 (경영전략실, 개발연구소)
      for (const topNode of organizationData.children) {
        if (topNode.children) {
          for (const child of topNode.children) {
            if (child.code === node.code) {
              parentDept = topNode.name;
              break;
            }
          }
        }
        if (parentDept) break;
      }
    }
    // level 3인 경우 (STE그룹 하위 팀)
    else if (node.level === 3) {
      for (const topNode of organizationData.children) {
        const dept = findParentDept(topNode, node);
        if (dept) {
          parentDept = dept;
          break;
        }
      }
    }

    if (parentDept) {
      // "부서 > 팀" 형식으로 저장
      const fullTeamPath = `${parentDept} > ${node.name}`;
      setFormData(prev => ({ ...prev, team: fullTeamPath }));
      setTouched(prev => ({ ...prev, team: true }));
      
      // 팀의 구성원을 투입 인력으로 자동 추가
      if (node.children && node.children.length > 0) {
        const members = node.children
          .filter((child: any) => child.headCount === 0 && child.leader) // 구성원만 필터링
          .map((child: any) => ({
            code: child.code,
            name: child.name,
            position: child.leader,
            role: '',
            startDate: formData.startDate,
            endDate: formData.endDate,
            allocationRate: '100',
            dept: parentDept,
            team: node.name,
            classification: '투입_정산', // 기본값
            allocationPeriods: [{
              id: Date.now().toString() + '-' + child.code,
              startDate: formData.startDate,
              endDate: formData.endDate,
              category: '투입_정산'
            }]
          }));
        
        // 기존 투입인력이 있으면 팀만 업데이트, 없으면 새로 추가
        if (assignedMembers.length > 0) {
          const updatedMembers = assignedMembers.map(member => ({
            ...member,
            dept: parentDept,
            team: node.name
          }));
          setAssignedMembers(updatedMembers);
        } else {
          setAssignedMembers(members);
        }
      }
      
      toast.success(`팀이 선택되었습니다: ${fullTeamPath}. 투입 인력의 소속이 업데이트되었습니다.`);
      setIsOrgDialogOpen(false);
    }
  };

  // 조직도 렌더링 (재귀)
  const renderOrgNode = (node: any): JSX.Element => {
    const isExpanded = expandedNodes.has(node.code);
    const hasChildren = node.children && node.children.length > 0;
    
    // 팀만 선택 가능 (level 3은 STE그룹 하위 팀, level 2는 경영전략실/개발연구소 하위 팀)
    const isTeam = (node.level === 3) || (node.level === 2 && (node.code.startsWith('ORG-2') || node.code.startsWith('ORG-3')));
    
    // 팀 생성 가능한 부서 (실/소)
    const isDeptForTeamCreate = (
      (node.level === 2 && node.code.startsWith('ORG-1')) || // STE1실, STE2실
      (node.level === 1 && (node.code.startsWith('ORG-2') || node.code.startsWith('ORG-3'))) // 경영전략실, 개발연구소
    );
    
    const isSelectable = isTeam;
    const isClickable = (hasChildren && !isTeam) || isDeptForTeamCreate; // 팀이 아니거나 부서인 경우 클릭 가능

    // 현재 선택된 부서인지 확인
    const isSelectedDept = selectedDeptForCreate?.code === node.code;
    
    // 구성원 추가를 위해 선택된 팀인지 확인
    const isSelectedTeamForMember = selectedTeamForMember?.code === node.code;

    return (
      <div key={node.code}>
        <div 
          className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${
            node.level === 0 ? 'bg-accent/50' : ''
          } ${
            isClickable ? 'cursor-pointer hover:bg-accent' : ''
          } ${
            isTeam && formData.team.includes(node.name)
              ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'
              : ''
          } ${
            isSelectedDept
              ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700'
              : ''
          } ${
            isSelectedTeamForMember
              ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
              : ''
          }`}
          onClick={() => {
            if (hasChildren && !isTeam) {
              toggleNode(node.code);
            }
            if (isSelectable || isDeptForTeamCreate) {
              handleOrgSelect(node);
            }
          }}
          onContextMenu={(e) => {
            if (isTeam) {
              e.preventDefault();
              setSelectedTeamForMember(node);
              toast.info(`"${node.name}"이(가) 구성원 추가 대상으로 선택되었습니다.`);
            }
            if (isDeptForTeamCreate) {
              e.preventDefault();
              setSelectedDeptForCreate(node);
              setNewTeamData({ name: '', code: '' });
              setIsCreateTeamDialogOpen(true);
              toast.info(`"${node.name}"에 새 팀을 생성합니다.`);
            }
          }}
          style={{ paddingLeft: `${node.level * 24 + 12}px` }}
        >
          {hasChildren && !isTeam ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )
          ) : (
            <div className="w-4 h-4 flex-shrink-0" />
          )}
          
          <Building2 className={`h-4 w-4 flex-shrink-0 ${
            node.level === 0 ? 'text-primary' : isTeam ? 'text-green-500' : isDeptForTeamCreate ? 'text-amber-500' : 'text-muted-foreground'
          }`} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={node.level === 0 ? 'font-semibold' : isTeam || isDeptForTeamCreate ? 'font-medium' : ''}>
                {node.name}
              </span>
            </div>
          </div>

          {isSelectable && (
            <Badge variant="outline" className="text-xs flex-shrink-0 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
              선택 가능
            </Badge>
          )}
          
          {isDeptForTeamCreate && !isSelectedDept && (
            <Badge variant="outline" className="text-xs flex-shrink-0 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
              팀 생성
            </Badge>
          )}
          
          {isSelectedDept && (
            <Badge className="text-xs flex-shrink-0 bg-amber-500 text-white">
              선택됨
            </Badge>
          )}
          
          {isSelectedTeamForMember && (
            <Badge className="text-xs flex-shrink-0 bg-blue-500 text-white">
              구성원 추가 대상
            </Badge>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child: any) => renderOrgNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>기본정보</h1>
          <p className="text-muted-foreground">새로운 프로젝트를 등록하세요.</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
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
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              신규 등록
            </Button>
          )}
        </div>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            기본 정보
          </CardTitle>
          <CardDescription>프로젝트의 기본 정보를 입력하세요. (필수 항목 포함)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 프로젝트 코드 */}
            <div className="space-y-2">
              <Label htmlFor="code">
                프로젝트 코드 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="예: PRJ-2025-001"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('code', formData.code)}
              />
            </div>

            {/* 프로젝트명 */}
            <div className="space-y-2">
              <Label htmlFor="name">
                프로젝트명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="프로젝트명을 입력하세요"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('name', formData.name)}
              />
            </div>

            {/* 고객사 */}
            <div className="space-y-2">
              <Label htmlFor="client">
                고객사 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="client"
                placeholder="고객사명을 입력하세요"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('client', formData.client)}
              />
            </div>

            {/* 팀 (부서 > 팀 형식) */}
            <div className="space-y-2">
              <Label htmlFor="team">
                팀
              </Label>
              <div className="flex gap-2">
                <Input
                  id="team"
                  value={formData.team}
                  disabled
                  placeholder="조직도에서 팀 선택 (예: STE1실 > LG전자 1팀)"
                  className={getInputClassName('team', formData.team)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOrgDialogOpen(true)}
                  disabled={!isEditing}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  조직 선택
                </Button>
              </div>
            </div>

            {/* 시작일 */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                시작일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('startDate', formData.startDate)}
              />
            </div>

            {/* 종료일 */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                종료일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('endDate', formData.endDate)}
              />
            </div>

            {/* 예산 */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                예산 (원) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="예: 450000000"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('budget', formData.budget)}
              />
              {formData.budget && (
                <p className="text-sm text-muted-foreground">
                  {(parseInt(formData.budget) / 100000000).toFixed(2)}억원
                </p>
              )}
            </div>

            {/* 진행 단계 */}
            <div className="space-y-2">
              <Label htmlFor="phase">진행 단계</Label>
              <Select
                value={formData.phase}
                onValueChange={(value) => handleInputChange('phase', value)}
                disabled={!isEditing}
              >
                <SelectTrigger className={getInputClassName('phase', formData.phase)}>
                  <SelectValue placeholder="진행 단계를 선택하���요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="계획">계획</SelectItem>
                  <SelectItem value="진행">진행</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 투입 인력 */}
      {formData.team && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  투입 인력
                </CardTitle>
                <CardDescription>
                  선택된 팀: <span className="text-primary font-medium">{formData.team}</span> ({assignedMembers.length}명)
                  {/* 부서 이동 인력 표시 */}
                  {(() => {
                    const selectedTeamName = formData.team.split(' > ')[1];
                    const otherDeptMembers = assignedMembers.filter(m => m.team !== selectedTeamName);
                    if (otherDeptMembers.length > 0) {
                      return (
                        <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                          · 부서 이동 {otherDeptMembers.length}명 ({otherDeptMembers.map(m => m.name).join(', ')})
                        </span>
                      );
                    }
                    return null;
                  })()}
                </CardDescription>
              </div>
              {isEditing && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setMemberSearchQuery('');
                    setSelectedMemberCode('');
                    setSelectedMembers([]);
                    setNewMemberData({ name: '', code: '', position: '사원' });
                    setIsAddMemberDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  인력 추가
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">이름</th>
                      <th className="text-left p-3 font-medium">구분</th>
                      <th className="text-left p-3 font-medium">직급</th>
                      <th className="text-left p-3 font-medium">소속</th>
                      <th className="text-left p-3 font-medium">팀</th>
                      <th className="text-center p-3 font-medium">투입률</th>
                      <th className="text-left p-3 font-medium">투입 기간</th>
                      {isEditing && <th className="text-center p-3 font-medium">작업</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {assignedMembers.length === 0 ? (
                      <tr>
                        <td colSpan={isEditing ? 8 : 7} className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <UserCheck className="h-8 w-8 opacity-50" />
                            <p>투입 인력을 추가해주세요.</p>
                            {isEditing && (
                              <p className="text-sm">우측 상단의 '+ 인력 추가' 버튼을 클릭하세요.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      assignedMembers.flatMap((member, index) => {
                        // allocationPeriods가 있으면 그 데이터를 사용, 없으면 기존 데이터로 period 생성
                        const periods = member.allocationPeriods && member.allocationPeriods.length > 0
                          ? member.allocationPeriods
                          : [{
                              id: `default-${index}`,
                              startDate: member.startDate,
                              endDate: formData.endDate,
                              category: member.classification,
                              allocation: member.allocationRate
                            }];

                        const selectedTeamName = formData.team.split(' > ')[1];
                        const isDifferentTeam = member.team !== selectedTeamName;

                        // 각 구분별로 행 생성
                        return periods.map((period, periodIndex) => (
                          <tr
                            key={`${member.code}-${periodIndex}`}
                            className="border-b cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => handleMemberClick(member)}
                          >
                            {/* 이름은 첫 번째 행에만 표시 (rowspan) */}
                            {periodIndex === 0 && (
                              <td className="p-3 border-r" rowSpan={periods.length}>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  {member.name}
                                </span>
                                {isDifferentTeam && (
                                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                    부서 이동({member.dept} &gt; {member.team} → {formData.team})
                                  </div>
                                )}
                              </td>
                            )}
                            
                            {/* 구분 - 각 행마다 표시 */}
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
                            
                            {/* 직급 */}
                            {periodIndex === 0 && (
                              <td className="p-3 border-r" rowSpan={periods.length}>
                                <span className="text-sm">{member.position || '-'}</span>
                              </td>
                            )}
                            
                            {/* 소속 */}
                            {periodIndex === 0 && (
                              <td className="p-3 border-r" rowSpan={periods.length}>
                                <span className="text-sm">{member.dept}</span>
                              </td>
                            )}
                            
                            {/* 팀 */}
                            {periodIndex === 0 && (
                              <td className="p-3 border-r" rowSpan={periods.length}>
                                <span className="text-sm">{member.team}</span>
                              </td>
                            )}
                            
                            {/* 투입률 */}
                            <td className="p-3 border-r text-center">
                              <span className="text-sm">{member.allocationRate || '100'}%</span>
                            </td>
                            
                            {/* 투입기간 */}
                            <td className="p-3 border-r">
                              <span className="text-sm">
                                {period.startDate} ~ {period.endDate || formData.endDate}
                              </span>
                            </td>
                            
                            {isEditing && periodIndex === 0 && (
                              <td className="p-3 text-center border-r" rowSpan={periods.length} onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const selectedTeamName = formData.team.split(' > ')[1];
                                    const isDifferentTeam = member.team !== selectedTeamName;
                                    
                                    if (isDifferentTeam) {
                                      // 부서 이동 인력 삭제 시
                                      const updated = assignedMembers.filter((_, i) => i !== index);
                                      setAssignedMembers(updated);
                                      toast.success(`${member.name} 님이 투입 인력에서 제외되었습니다. 부서 이동(${formData.team} → 기타)`);
                                    } else {
                                      // 선택된 팀의 인력 삭제 시 확인
                                      if (confirm(`${member.name} 님은 선택된 팀(${formData.team})의 구성원입니다.\n투입 인력에서 제외하시겠습니까?`)) {
                                        const updated = assignedMembers.filter((_, i) => i !== index);
                                        setAssignedMembers(updated);
                                        toast.info(`${member.name} 님이 투입 인력에서 제외되었습니다.`);
                                      }
                                    }
                                  }}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))
                      })
                    )
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 계약 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>계약 정보</CardTitle>
          <CardDescription>프로젝트 계약 관련 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 계약 금액 */}
            <div className="space-y-2">
              <Label htmlFor="contractAmount">계약 금액 (원)</Label>
              <Input
                id="contractAmount"
                type="number"
                placeholder="예: 450000000"
                value={formData.contractAmount}
                onChange={(e) => handleInputChange('contractAmount', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('contractAmount', formData.contractAmount)}
              />
              {formData.contractAmount && (
                <p className="text-sm text-muted-foreground">
                  {(parseInt(formData.contractAmount) / 100000000).toFixed(2)}억원
                </p>
              )}
            </div>

            {/* 작업 장소 */}
            <div className="space-y-2">
              <Label htmlFor="location">작업 장소</Label>
              <Input
                id="location"
                placeholder="예: 고객사 사무실, 자사 사무실"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('location', formData.location)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프로젝트 상세 */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 상세</CardTitle>
          <CardDescription>프로젝트에 대한 상세 설명을 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 프로젝트 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">프로젝트 설명(과제개요)</Label>
              <Textarea
                id="description"
                placeholder="프로젝트에 대한 상세한 설명을 입력하세요..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('description', formData.description)}
                rows={4}
              />
            </div>

            {/* 산출물 */}
            <div className="space-y-2">
              <Label htmlFor="deliverables">주요 산출물</Label>
              <Textarea
                id="deliverables"
                placeholder="프로젝트에서 생산될 주요 산출물을 입력하세요..."
                value={formData.deliverables}
                onChange={(e) => handleInputChange('deliverables', e.target.value)}
                disabled={!isEditing}
                className={getInputClassName('deliverables', formData.deliverables)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 pb-6">
        {isEditing ? (
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
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="h-4 w-4 mr-2" />
            신규 등록
          </Button>
        )}
      </div>

      {/* 조직도 선택 다이얼로그 */}
      <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              조직도에서 부서/팀 선택
            </DialogTitle>
            <DialogDescription>
              부서 또는 팀을 클릭하여 선택하세요.
            </DialogDescription>
          </DialogHeader>
          
          {/* 고정 영역 */}
          <div className="flex-shrink-0 space-y-3">
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                💡 <span className="text-green-600 dark:text-green-400">팀(초록색)</span>을 클릭하면 부서와 팀이 자동으로 선택됩니다.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                🖱️ <span className="text-amber-600 dark:text-amber-400">부서(주황색)</span>를 우클릭하면 팀 생성 팝업이 열립니다.
              </p>
            </div>

            {/* 현재 선택 표시 */}
            {formData.team && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                <p className="text-sm font-medium mb-1">현재 선택:</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-700 dark:text-green-300">
                    {formData.team}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* 스크롤 가능한 조직도 트 영역 */}
          <div className="flex-1 overflow-y-auto border rounded-md p-3 mt-3">
            {renderOrgNode(organizationData)}
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => setIsOrgDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 팀 생성 다이얼로그 */}
      <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              새 팀 생성
            </DialogTitle>
            <DialogDescription>
              {selectedDeptForCreate && (
                <span className="text-primary font-medium">
                  {selectedDeptForCreate.name}
                </span>
              )} 하위에 새로운 팀을 생성합니��.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* 상위 부서 표시 */}
            <div className="space-y-2">
              <Label htmlFor="newTeamDept">
                상위 부서 <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2 p-3 border rounded-md bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700">
                <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-amber-900 dark:text-amber-100">
                  {selectedDeptForCreate?.name || '부서를 선택하세요'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                💡 이 부서 하위에 팀이 생성됩니다
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newTeamCode">
                팀 코드 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newTeamCode"
                placeholder="예: ORG-115"
                value={newTeamData.code}
                onChange={(e) => setNewTeamData(prev => ({ ...prev, code: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newTeamName">
                팀 이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newTeamName"
                placeholder="예: 삼성전자 1팀"
                value={newTeamData.name}
                onChange={(e) => setNewTeamData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateTeamDialogOpen(false);
                setNewTeamData({ name: '', code: '' });
                setSelectedDeptForCreate(null);
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!newTeamData.code || !newTeamData.name || !selectedDeptForCreate) {
                  toast.error('모든 필드를 입력해주세요.');
                  return;
                }
                toast.success(`${selectedDeptForCreate.name} 하위에 팀 "${newTeamData.name}"이(가) 생성되었습니다.`);
                addTeamToOrganization(newTeamData.code, newTeamData.name, selectedDeptForCreate.code);
                setIsCreateTeamDialogOpen(false);
                setNewTeamData({ name: '', code: '' });
                setSelectedDeptForCreate(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 구성원 성 다이얼로그 */}
      <Dialog open={isCreateMemberDialogOpen} onOpenChange={setIsCreateMemberDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              기존 구성원 추가
            </DialogTitle>
            <DialogDescription>
              {selectedTeamForMember && (
                <span className="text-primary font-medium">
                  {selectedTeamForMember.name}
                </span>
              )}에 다른 부서의 기존 구성원을 추가합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* 소속 팀 표시 */}
            <div className="space-y-2">
              <Label htmlFor="newMemberTeam">
                추가할 팀 <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2 p-3 border rounded-md bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {selectedTeamForMember?.name || '팀을 선택��세���'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                💡 이 팀에 구성원이 추가됩니다
              </p>
            </div>

            {/* 구성원 선택 */}
            <div className="space-y-2">
              <Label htmlFor="memberSearch">
                구성원 검색 및 선택 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  id="memberSearch"
                  placeholder="이름을 입력하세요 (예: 김광희)"
                  value={memberSearchQuery}
                  onChange={(e) => {
                    setMemberSearchQuery(e.target.value);
                    setShowMemberDropdown(true);
                  }}
                  onFocus={() => setShowMemberDropdown(true)}
                  className="pl-10"
                  autoComplete="off"
                />
                
                {/* 실시간 검색 결과 레이어 */}
                {showMemberDropdown && memberSearchQuery && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                    {getAllMembers()
                      .filter(member => member.name.includes(memberSearchQuery))
                      .length > 0 ? (
                      <>
                        <div className="sticky top-0 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            🔍 "{memberSearchQuery}" 검색 결과: {getAllMembers().filter(m => m.name.includes(memberSearchQuery)).length}명
                          </p>
                        </div>
                        {getAllMembers()
                          .filter(member => member.name.includes(memberSearchQuery))
                          .map(member => (
                            <div
                              key={member.code}
                              className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                              onClick={() => {
                                setSelectedMemberCode(member.code);
                                setNewMemberData({
                                  code: member.code,
                                  name: member.name,
                                  position: member.position
                                });
                                setMemberSearchQuery(member.name);
                                setShowMemberDropdown(false);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{member.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {member.position}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {member.dept} &gt; {member.team}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </>
                    ) : (
                      <div className="px-3 py-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          "{memberSearchQuery}" 검색 결과가 없습니다
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                💡 이름을 입력하면 실시간으로 검색 결과가 표시됩니다
              </p>
            </div>

            {/* 선택된 구성원 정보 미리보기 */}
            {selectedMemberCode && newMemberData.name && (
              <div className="bg-muted/50 p-3 rounded-md space-y-1">
                <p className="text-sm font-medium">선택된 구성원 정보:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">사원 코드:</div>
                  <div>{newMemberData.code}</div>
                  <div className="text-muted-foreground">이름:</div>
                  <div>{newMemberData.name}</div>
                  <div className="text-muted-foreground">직급:</div>
                  <div>{newMemberData.position}</div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateMemberDialogOpen(false);
                setNewMemberData({ name: '', code: '', position: '사원' });
                setSelectedMemberCode('');
                setSelectedTeamForMember(null);
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!selectedMemberCode || !selectedTeamForMember) {
                  toast.error('구성원을 선택해주세요.');
                  return;
                }
                toast.success(`${selectedTeamForMember.name}에 구성원 "${newMemberData.name}"이(가) 추가되었습니다.`);
                addMemberToOrganization(newMemberData.code, newMemberData.name, newMemberData.position, selectedTeamForMember.code);
                setIsCreateMemberDialogOpen(false);
                setNewMemberData({ name: '', code: '', position: '사원' });
                setSelectedMemberCode('');
                setSelectedTeamForMember(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 투입 인력 추가 다이얼로그 */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              투입 인력 추가
            </DialogTitle>
            <DialogDescription>
              프로젝트에 투입할 인력을 선택하세요. 조직별로 구성원을 선택할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto flex-1 min-h-0">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 직급으로 검색..."
                className="pl-9"
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
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
                  {(() => {
                    const allMembers = getAllMembers();
                    const selectedMemberDetails: any[] = [];
                    allMembers.forEach(member => {
                      if (selectedMembers.includes(member.code)) {
                        selectedMemberDetails.push(member);
                      }
                    });
                    return selectedMemberDetails.map((member: any) => (
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
                    ));
                  })()}
                </div>
              )}
            </div>

            {/* 조직별 구성원 목록 */}
            <div className="border border-border rounded-lg overflow-hidden">
              {Object.entries(getAllMembersGrouped())
                .map(([dept, members]) => {
                  const filteredMembers = members.filter((member: any) => {
                    // 이미 투입된 인력은 제외
                    if (assignedMembers.some(am => am.code === member.code)) return false;
                    
                    // 검색 필터 적용
                    if (memberSearchQuery) {
                      return (
                        member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                        member.position.toLowerCase().includes(memberSearchQuery.toLowerCase())
                      );
                    }
                    return true;
                  });

                  if (filteredMembers.length === 0) return null;

                  return (
                    <div key={dept} className="border-b border-border last:border-b-0">
                      {/* 조직 헤더 */}
                      <div className="p-3 bg-background border-b border-border sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{dept}</span>
                          <Badge variant="secondary" className="text-xs">
                            {filteredMembers.length}명
                          </Badge>
                        </div>
                      </div>
                      
                      {/* 구성원 목록 */}
                      <div className="divide-y divide-border">
                        {filteredMembers.map((member: any) => {
                          const isSelected = selectedMembers.includes(member.code);
                          
                          return (
                            <div
                              key={member.code}
                              className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${
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
                })}
              
              {Object.entries(getAllMembersGrouped()).filter(([dept, members]) => {
                return members.filter((member: any) => {
                  if (assignedMembers.some(am => am.code === member.code)) return false;
                  if (memberSearchQuery) {
                    return (
                      member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                      member.position.toLowerCase().includes(memberSearchQuery.toLowerCase())
                    );
                  }
                  return true;
                }).length > 0;
              }).length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  {memberSearchQuery ? `"${memberSearchQuery}" 검색 결과가 없거나 이미 추가된 인력입니다` : '추가할 수 있는 구성원이 없습니다'}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddMemberDialogOpen(false);
                setSelectedMembers([]);
                setMemberSearchQuery('');
              }}
            >
              취소
            </Button>
            <Button 
              onClick={() => {
                if (selectedMembers.length === 0) {
                  toast.error('구성원을 선택해주세요.');
                  return;
                }
                
                const allMembers = getAllMembers();
                const selectedTeamName = formData.team.split(' > ')[1];
                let departureCount = 0;
                
                // 선택된 구성원들을 투입 인력에 추가
                selectedMembers.forEach(memberCode => {
                  const memberInfo = allMembers.find(m => m.code === memberCode);
                  if (memberInfo) {
                    // 부서 이동 여부 확인
                    const isDeparture = memberInfo.team !== selectedTeamName;
                    if (isDeparture) {
                      departureCount++;
                    }
                    
                    // 팀장 직책 여부 확인
                    const isTeamLeader = memberInfo.role === '팀장';
                    
                    const newAssignment = {
                      code: memberInfo.code,
                      name: memberInfo.name,
                      position: memberInfo.position,
                      role: isDeparture ? '' : (memberInfo.role || ''), // 부서 이동 시 직책 회수
                      startDate: formData.startDate,
                      endDate: formData.endDate,
                      allocationRate: '100',
                      dept: memberInfo.dept || '',
                      team: memberInfo.team || '',
                      classification: '투입_정산', // 기본값
                      isTeamLeader: isTeamLeader, // 팀장 여부 플래그
                      allocationPeriods: [{
                        id: Date.now().toString() + '-' + memberInfo.code,
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        category: '투입_정산'
                      }]
                    };
                    
                    setAssignedMembers(prev => [...prev, newAssignment]);
                  }
                });
                
                // 토스트 메시지
                if (departureCount > 0) {
                  toast.warning(`${selectedMembers.length}명이 투입 인력에 추가되었습니다. (부서 이동 ${departureCount}명 - 직책 회수됨)`);
                } else {
                  toast.success(`${selectedMembers.length}명이 투입 인력에 추가되었습니다.`);
                }
                
                setIsAddMemberDialogOpen(false);
                setSelectedMembers([]);
                setMemberSearchQuery('');
              }}
              disabled={selectedMembers.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {selectedMembers.length}명 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 투입 현황 다이얼로그 */}
      <Dialog open={isMonthlyAllocationDialogOpen} onOpenChange={setIsMonthlyAllocationDialogOpen}>
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
                      {selectedMemberForAllocation.position} / {selectedMemberForAllocation.dept} {selectedMemberForAllocation.team}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{formData.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formData.startDate} ~ {formData.endDate})
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
            {selectedMemberForAllocation && (
              <div className="space-y-4">{/* 구분별 투입 기간 */}
                {(() => {
                  const allocationPeriods = selectedMemberForAllocation.allocationPeriods;
                  
                  // allocationPeriods가 없으면 기본 투입 정보로 표시
                  if (!allocationPeriods || allocationPeriods.length === 0) {
                    // 기본 투입 정보가 있는지 확인
                    if (selectedMemberForAllocation && selectedMemberForAllocation.startDate && selectedMemberForAllocation.endDate) {
                      return (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">구분별 투입 기간</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {isEditing ? (
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
                                            value={selectedMemberForAllocation.classification || '투입_정산'}
                                            onValueChange={(value) => {
                                              const updatedMembers = assignedMembers.map(m => {
                                                if (m.code === selectedMemberForAllocation.code) {
                                                  return { ...m, classification: value };
                                                }
                                                return m;
                                              });
                                              setAssignedMembers(updatedMembers);
                                              const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
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
                                            value={selectedMemberForAllocation.startDate}
                                            onChange={(e) => {
                                              const newStartDate = e.target.value;
                                              if (newStartDate > selectedMemberForAllocation.endDate) {
                                                toast.error('시작일은 종료일보다 이전이어야 합니다.');
                                                return;
                                              }
                                              if (newStartDate < formData.startDate || newStartDate > formData.endDate) {
                                                toast.error('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
                                                return;
                                              }
                                              const updatedMembers = assignedMembers.map(m => {
                                                if (m.code === selectedMemberForAllocation.code) {
                                                  return { ...m, startDate: newStartDate };
                                                }
                                                return m;
                                              });
                                              setAssignedMembers(updatedMembers);
                                              const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                              if (updatedMember) {
                                                setSelectedMemberForAllocation(updatedMember);
                                              }
                                            }}
                                            min={formData.startDate}
                                            max={selectedMemberForAllocation.endDate}
                                            className="h-8"
                                          />
                                        </td>
                                        <td className="p-2">
                                          <Input
                                            type="date"
                                            value={selectedMemberForAllocation.endDate}
                                            onChange={(e) => {
                                              const newEndDate = e.target.value;
                                              if (newEndDate < selectedMemberForAllocation.startDate) {
                                                toast.error('종료일은 시작일보다 이후여야 합니다.');
                                                return;
                                              }
                                              if (newEndDate < formData.startDate || newEndDate > formData.endDate) {
                                                toast.error('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
                                                return;
                                              }
                                              const updatedMembers = assignedMembers.map(m => {
                                                if (m.code === selectedMemberForAllocation.code) {
                                                  return { ...m, endDate: newEndDate };
                                                }
                                                return m;
                                              });
                                              setAssignedMembers(updatedMembers);
                                              const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                              if (updatedMember) {
                                                setSelectedMemberForAllocation(updatedMember);
                                              }
                                            }}
                                            min={selectedMemberForAllocation.startDate}
                                            max={formData.endDate}
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
                                                const updatedMembers = assignedMembers.map(m => {
                                                  if (m.code === selectedMemberForAllocation.code) {
                                                    return { ...m, startDate: '', endDate: '', classification: '투입_정산' };
                                                  }
                                                  return m;
                                                });
                                                setAssignedMembers(updatedMembers);
                                                const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                                if (updatedMember) {
                                                  setSelectedMemberForAllocation(updatedMember);
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
                                    const baseEndDate = new Date(selectedMemberForAllocation.endDate);
                                    baseEndDate.setDate(baseEndDate.getDate() + 1);
                                    const newStartDate = baseEndDate.toISOString().split('T')[0];
                                    
                                    const basePeriod = {
                                      id: 'base-period',
                                      startDate: selectedMemberForAllocation.startDate,
                                      endDate: selectedMemberForAllocation.endDate,
                                      category: selectedMemberForAllocation.classification || '투입_정산'
                                    };
                                    
                                    const newPeriod = {
                                      id: `period-${Date.now()}`,
                                      startDate: newStartDate,
                                      endDate: formData.endDate,
                                      category: '투입_정산'
                                    };
                                    
                                    const updatedMembers = assignedMembers.map(m => {
                                      if (m.code === selectedMemberForAllocation.code) {
                                        return {
                                          ...m,
                                          allocationPeriods: [basePeriod, newPeriod]
                                        };
                                      }
                                      return m;
                                    });
                                    setAssignedMembers(updatedMembers);
                                    const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                    if (updatedMember) {
                                      setSelectedMemberForAllocation(updatedMember);
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
                                      {selectedMemberForAllocation.classification || '투입_정산'}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <span>{selectedMemberForAllocation.startDate} ~ {selectedMemberForAllocation.endDate}</span>
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
                        {isEditing && <p className="text-xs mt-1">위에서 투입 기간을 추가해주세요.</p>}
                      </div>
                    );
                  }
                  
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">구분별 투입 기간</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
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
                                  {allocationPeriods.map((period: any) => (
                                    <tr key={period.id} className="border-b">
                                      <td className="p-2">
                                        <Select
                                          value={period.category}
                                          onValueChange={(value) => {
                                            const updatedMembers = assignedMembers.map(m => {
                                              if (m.code === selectedMemberForAllocation.code) {
                                                return {
                                                  ...m,
                                                  allocationPeriods: m.allocationPeriods?.map((p: any) => 
                                                    p.id === period.id ? { ...p, category: value } : p
                                                  )
                                                };
                                              }
                                              return m;
                                            });
                                            setAssignedMembers(updatedMembers);
                                            const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                            if (updatedMember) {
                                              setSelectedMemberForAllocation(updatedMember);
                                              // 월별 데이터 재생성
                                              const allocations = generateMonthlyAllocationsFromPeriods(
                                                updatedMember.allocationPeriods || [],
                                                parseInt(updatedMember.allocationRate) || 100,
                                                formData.startDate,
                                                formData.endDate
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
                                              toast.error('시작일은 종료일보다 이전이어야 합니다.');
                                              return;
                                            }
                                            if (newStartDate < formData.startDate || newStartDate > formData.endDate) {
                                              toast.error('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
                                              return;
                                            }
                                            const updatedMembers = assignedMembers.map(m => {
                                              if (m.code === selectedMemberForAllocation.code) {
                                                return {
                                                  ...m,
                                                  allocationPeriods: m.allocationPeriods?.map((p: any) => 
                                                    p.id === period.id ? { ...p, startDate: newStartDate } : p
                                                  )
                                                };
                                              }
                                              return m;
                                            });
                                            setAssignedMembers(updatedMembers);
                                            const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                            if (updatedMember) {
                                              setSelectedMemberForAllocation(updatedMember);
                                              // 월별 데이터 재생성
                                              const allocations = generateMonthlyAllocationsFromPeriods(
                                                updatedMember.allocationPeriods || [],
                                                parseInt(updatedMember.allocationRate) || 100,
                                                formData.startDate,
                                                formData.endDate
                                              );
                                              setMonthlyAllocations(allocations);
                                            }
                                          }}
                                          min={formData.startDate}
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
                                              toast.error('종료일은 시작일보다 이후여야 합니다.');
                                              return;
                                            }
                                            if (newEndDate < formData.startDate || newEndDate > formData.endDate) {
                                              toast.error('투입 기간은 프로젝트 기간 내에서만 설정할 수 있습니다.');
                                              return;
                                            }
                                            const updatedMembers = assignedMembers.map(m => {
                                              if (m.code === selectedMemberForAllocation.code) {
                                                return {
                                                  ...m,
                                                  allocationPeriods: m.allocationPeriods?.map((p: any) => 
                                                    p.id === period.id ? { ...p, endDate: newEndDate } : p
                                                  )
                                                };
                                              }
                                              return m;
                                            });
                                            setAssignedMembers(updatedMembers);
                                            const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                            if (updatedMember) {
                                              setSelectedMemberForAllocation(updatedMember);
                                              // 월별 데이터 재생성
                                              const allocations = generateMonthlyAllocationsFromPeriods(
                                                updatedMember.allocationPeriods || [],
                                                parseInt(updatedMember.allocationRate) || 100,
                                                formData.startDate,
                                                formData.endDate
                                              );
                                              setMonthlyAllocations(allocations);
                                            }
                                          }}
                                          min={period.startDate}
                                          max={formData.endDate}
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
                                              const updatedMembers = assignedMembers.map(m => {
                                                if (m.code === selectedMemberForAllocation.code) {
                                                  const updatedPeriods = m.allocationPeriods?.filter((p: any) => p.id !== period.id);
                                                  return {
                                                    ...m,
                                                    allocationPeriods: updatedPeriods
                                                  };
                                                }
                                                return m;
                                              });
                                              setAssignedMembers(updatedMembers);
                                              const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                              if (updatedMember) {
                                                setSelectedMemberForAllocation(updatedMember);
                                                // 월별 데이터 재생성
                                                const allocations = generateMonthlyAllocationsFromPeriods(
                                                  updatedMember.allocationPeriods || [],
                                                  parseInt(updatedMember.allocationRate) || 100,
                                                  formData.startDate,
                                                  formData.endDate
                                                );
                                                setMonthlyAllocations(allocations);
                                              }
                                              toast.success('투입 기간이 삭제되었습니다.');
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
                                // 마지막 투입 기간의 종료일 + 1일을 시작일로 설정
                                const lastPeriod = allocationPeriods[allocationPeriods.length - 1];
                                const lastEndDate = new Date(lastPeriod.endDate);
                                lastEndDate.setDate(lastEndDate.getDate() + 1);
                                const newStartDate = lastEndDate.toISOString().split('T')[0];
                                
                                if (newStartDate > formData.endDate) {
                                  toast.error('프로젝트 종료일을 초과하여 투입 기간을 추가할 수 없습니다.');
                                  return;
                                }
                                
                                const newPeriod = {
                                  id: `period-${Date.now()}`,
                                  startDate: newStartDate,
                                  endDate: formData.endDate,
                                  category: '투입_정산'
                                };
                                
                                const updatedMembers = assignedMembers.map(m => {
                                  if (m.code === selectedMemberForAllocation.code) {
                                    return {
                                      ...m,
                                      allocationPeriods: [...(m.allocationPeriods || []), newPeriod]
                                    };
                                  }
                                  return m;
                                });
                                setAssignedMembers(updatedMembers);
                                const updatedMember = updatedMembers.find(m => m.code === selectedMemberForAllocation.code);
                                if (updatedMember) {
                                  setSelectedMemberForAllocation(updatedMember);
                                }
                                toast.success('투입 기간이 추가되었습니다.');
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              투입 기간 추가
                            </Button>
                          </div>
                        ) : (
                          // 조회 모드: 카드 형식
                          <div className="space-y-2">
                            {allocationPeriods.map((period: any) => (
                              <div key={period.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                                <div className="flex items-center gap-3">
                                  <Badge variant="default">
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
                {selectedMemberForAllocation && monthlyAllocations.length > 0 && (
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
            )}
          </div>
          
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setIsMonthlyAllocationDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 투입인력 상세 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-[70vw] sm:max-w-[70vw] w-[70vw] max-h-[92vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              투입인력 상세
            </DialogTitle>
            <DialogDescription>
              {selectedMemberForDetail?.name}님의 투입 정보를 월별로 설정하세요.
            </DialogDescription>
          </DialogHeader>
          
          {selectedMemberForDetail && (
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {/* 기본 정보 표시 */}
              <div className="p-3 bg-accent/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{selectedMemberForDetail.name}</span>
                  <Badge variant="outline">{selectedMemberForDetail.position}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedMemberForDetail.dept} &gt; {selectedMemberForDetail.team}
                </div>
              </div>

              {/* 프로젝트 기간 */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">프로젝트 기간:</span>
                  <span>{formData.startDate} ~ {formData.endDate}</span>
                </div>
              </div>

              {/* 투입 기간 설정 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>투입 시작일 *</Label>
                  <Input
                    type="date"
                    value={detailStartDate}
                    onChange={(e) => {
                      setDetailStartDate(e.target.value);
                      
                      // 월별 데이터 재생성
                      if (e.target.value && detailEndDate && selectedMemberForDetail) {
                        const memberStart = new Date(e.target.value);
                        const memberEnd = new Date(detailEndDate);
                        const projectStart = new Date(formData.startDate);
                        const projectEnd = new Date(formData.endDate);
                        const months: typeof monthlyDetails = [];
                        
                        let currentDate = new Date(projectStart);
                        
                        while (currentDate <= projectEnd) {
                          const year = currentDate.getFullYear();
                          const month = currentDate.getMonth() + 1;
                          const monthKey = `${year}-${String(month).padStart(2, '0')}`;
                          
                          const monthStart = new Date(year, month - 1, 1);
                          const monthEnd = new Date(year, month, 0);
                          
                          const isInPeriod = memberStart <= monthEnd && memberEnd >= monthStart;
                          
                          if (isInPeriod) {
                            const actualStart = memberStart > monthStart ? memberStart : monthStart;
                            const actualEnd = memberEnd < monthEnd ? memberEnd : monthEnd;
                            const totalDaysInMonth = monthEnd.getDate();
                            const workDays = Math.floor((actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                            
                            const existing = monthlyDetails.find(m => m.month === monthKey);
                            const allocationRate = existing?.allocation || parseInt(selectedMemberForDetail.allocationRate) || 0;
                            
                            months.push({
                              month: monthKey,
                              monthDisplay: monthKey,
                              classification: existing?.classification || selectedMemberForDetail.classification || '투입_정산',
                              workDays: workDays,
                              totalDays: totalDaysInMonth,
                              allocation: allocationRate,
                              mm: (workDays / totalDaysInMonth * allocationRate / 100).toFixed(2)
                            });
                          }
                          
                          currentDate = new Date(year, month, 1);
                        }
                        
                        setMonthlyDetails(months);
                      }
                    }}
                    min={formData.startDate}
                    max={formData.endDate}
                    disabled={!isEditing}
                    className={isEditing && !detailStartDate ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700' : isEditing ? 'bg-white dark:bg-background' : 'bg-muted'}
                  />
                </div>

                <div className="space-y-2">
                  <Label>투입 종료일 *</Label>
                  <Input
                    type="date"
                    value={detailEndDate}
                    onChange={(e) => {
                      setDetailEndDate(e.target.value);
                      
                      // 월별 데이터 재생성
                      if (detailStartDate && e.target.value && selectedMemberForDetail) {
                        const memberStart = new Date(detailStartDate);
                        const memberEnd = new Date(e.target.value);
                        const projectStart = new Date(formData.startDate);
                        const projectEnd = new Date(formData.endDate);
                        const months: typeof monthlyDetails = [];
                        
                        let currentDate = new Date(projectStart);
                        
                        while (currentDate <= projectEnd) {
                          const year = currentDate.getFullYear();
                          const month = currentDate.getMonth() + 1;
                          const monthKey = `${year}-${String(month).padStart(2, '0')}`;
                          
                          const monthStart = new Date(year, month - 1, 1);
                          const monthEnd = new Date(year, month, 0);
                          
                          const isInPeriod = memberStart <= monthEnd && memberEnd >= monthStart;
                          
                          if (isInPeriod) {
                            const actualStart = memberStart > monthStart ? memberStart : monthStart;
                            const actualEnd = memberEnd < monthEnd ? memberEnd : monthEnd;
                            const totalDaysInMonth = monthEnd.getDate();
                            const workDays = Math.floor((actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                            
                            const existing = monthlyDetails.find(m => m.month === monthKey);
                            const allocationRate = existing?.allocation || parseInt(selectedMemberForDetail.allocationRate) || 0;
                            
                            months.push({
                              month: monthKey,
                              monthDisplay: monthKey,
                              classification: existing?.classification || selectedMemberForDetail.classification || '투입_정산',
                              workDays: workDays,
                              totalDays: totalDaysInMonth,
                              allocation: allocationRate,
                              mm: (workDays / totalDaysInMonth * allocationRate / 100).toFixed(2)
                            });
                          }
                          
                          currentDate = new Date(year, month, 1);
                        }
                        
                        setMonthlyDetails(months);
                      }
                    }}
                    min={formData.startDate}
                    max={formData.endDate}
                    disabled={!isEditing}
                    className={isEditing && !detailEndDate ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-700' : isEditing ? 'bg-white dark:bg-background' : 'bg-muted'}
                  />
                </div>
              </div>

              {/* 월별 투입 정보 테이블 */}
              {monthlyDetails.length > 0 && (
                <div className="space-y-4">
                  {/* 월별 투입 데이터 테이블 */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">기간</th>
                          <th className="text-center p-3 font-medium">구분</th>
                          <th className="text-center p-3 font-medium">투입 일수</th>
                          <th className="text-center p-3 font-medium">투입률</th>
                          <th className="text-center p-3 font-medium">M/M</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyDetails.map((detail, index) => (
                          <tr key={detail.month} className="border-b last:border-b-0 hover:bg-accent/30 transition-colors">
                            <td className="p-3 font-medium">{detail.monthDisplay}</td>
                            <td className="p-3 text-center">
                              {isEditing ? (
                                <Select
                                  value={detail.classification}
                                  onValueChange={(value) => handleDetailCategoryChange(index, value)}
                                >
                                  <SelectTrigger className="w-32 mx-auto bg-white dark:bg-gray-950">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="투입_정산">투입_정산</SelectItem>
                                    <SelectItem value="투입_지원">투입_지원</SelectItem>
                                    <SelectItem value="대기">대기</SelectItem>
                                    <SelectItem value="관리">관리</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge variant={
                                  detail.classification === '투입_정산' ? 'default' :
                                  detail.classification === '투입_지원' ? 'secondary' :
                                  detail.classification === '대기' ? 'outline' : 'destructive'
                                }>
                                  {detail.classification}
                                </Badge>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                <input
                                  type="number"
                                  value={detail.workDays}
                                  onChange={(e) => handleDetailWorkDaysChange(index, Number(e.target.value))}
                                  className={`w-16 px-2 py-1 text-center border rounded ${
                                    isEditing ? 'bg-white dark:bg-gray-950' : 'bg-gray-100 dark:bg-gray-800'
                                  }`}
                                  min="0"
                                  max={detail.totalDays}
                                  readOnly={!isEditing}
                                />
                                <span className="text-xs text-muted-foreground">/ {detail.totalDays}일</span>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant="outline">{detail.allocation}%</Badge>
                            </td>
                            <td className="p-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                              {detail.mm}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/50 border-t-2">
                        <tr>
                          <td className="p-3 font-semibold text-right">합계</td>
                          <td className="p-3 text-center">-</td>
                          <td className="p-3 text-center font-semibold">
                            {monthlyDetails.reduce((sum, detail) => sum + detail.workDays, 0)}일
                          </td>
                          <td className="p-3 text-center">-</td>
                          <td className="p-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                            {monthlyDetails.reduce((sum, detail) => sum + parseFloat(detail.mm), 0).toFixed(2)} M/M
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* 요약 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">총 투입 기간</span>
                      </div>
                      <p className="text-2xl font-semibold">
                        {monthlyDetails.length}개월
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">평균 투입률</span>
                      </div>
                      <p className="text-2xl font-semibold">
                        {monthlyDetails.length > 0 
                          ? (monthlyDetails.reduce((sum, detail) => sum + detail.allocation, 0) / monthlyDetails.length).toFixed(0) 
                          : 0}%
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-muted-foreground">총 M/M</span>
                      </div>
                      <p className="text-2xl font-semibold">
                        {monthlyDetails.reduce((sum, detail) => sum + parseFloat(detail.mm), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-shrink-0">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => {
                  setIsDetailDialogOpen(false);
                }}>
                  취소
                </Button>
                <Button onClick={() => {
                  if (!detailStartDate || !detailEndDate) {
                    toast.error('투입 시작일과 종료일을 모두 입력해주세요.');
                    return;
                  }
                  
                  if (selectedMemberForDetail) {
                    const updatedMembers = assignedMembers.map(m => {
                      if (m.code === selectedMemberForDetail.code) {
                        return {
                          ...m,
                          startDate: detailStartDate,
                          endDate: detailEndDate,
                          monthlyDetails: monthlyDetails
                        };
                      }
                      return m;
                    });
                    setAssignedMembers(updatedMembers);
                    toast.success('투입 정보가 저장되었습니다.');
                    setIsDetailDialogOpen(false);
                  }
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsDetailDialogOpen(false)}>
                닫기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}