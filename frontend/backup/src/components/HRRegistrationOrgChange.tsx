import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Save, X, Search, User, Building2, ArrowRight, Calendar, Plus, Trash2, Link, Pencil, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

// 샘플 직원 데이터
const employeeList = [
  { code: 'EMP-1111', name: '김광희', department: 'STE1실', team: 'LG전자 1팀', position: '책임', jobTitle: '팀장' },
  { code: 'EMP-1112', name: '정홍근', department: 'STE1실', team: 'LG전자 1팀', position: '사원', jobTitle: '' },
  { code: 'EMP-1121', name: '이길원', department: 'STE1실', team: 'LG전자 2팀', position: '책임', jobTitle: '팀장' },
  { code: 'EMP-1122', name: '이성미', department: 'STE1실', team: 'LG전자 2팀', position: '책임', jobTitle: '' },
  { code: 'EMP-1123', name: '조혜진', department: 'STE1실', team: 'LG전자 2팀', position: '책임', jobTitle: '' },
  { code: 'EMP-1124', name: '이나리', department: 'STE1실', team: 'LG전자 2팀', position: '선임', jobTitle: '' },
  { code: 'EMP-1141', name: '박준수', department: 'STE1실', team: 'LG전자 4팀', position: '책임', jobTitle: '' },
  { code: 'EMP-1142', name: '용상수', department: 'STE1실', team: 'LG전자 4팀', position: '책임', jobTitle: '' },
  { code: 'EMP-1143', name: '김규현', department: 'STE1실', team: 'LG전자 4팀', position: '사원', jobTitle: '' },
  { code: 'EMP-1211', name: '조현균', department: 'STE2실', team: 'GS리테일 1팀', position: '책임', jobTitle: '팀장' },
  { code: 'EMP-1212', name: '조현정', department: 'STE2실', team: 'GS리테일 1팀', position: '책임', jobTitle: '' },
  { code: 'EMP-1213', name: '최현준', department: 'STE2실', team: 'GS리테일 1팀', position: '책임', jobTitle: '' },
  { code: 'EMP-1214', name: '강성희', department: 'STE2실', team: 'GS리테일 1팀', position: '선임', jobTitle: '' },
  { code: 'EMP-1215', name: '강문혁', department: 'STE2실', team: 'GS리테일 1팀', position: '사원', jobTitle: '' },
  { code: 'EMP-2101', name: '김완호', department: '경영전략실', team: '경영지원팀', position: '수석', jobTitle: '부사장' },
  { code: 'EMP-2102', name: '이현직', department: '경영전략실', team: '경영지팀', position: '책임', jobTitle: '실장' },
  { code: 'EMP-2103', name: '김예림', department: '경영전략실', team: '경영지원팀', position: '선임', jobTitle: '파트장' },
  { code: 'EMP-2104', name: '가라현', department: '경영전략실', team: '경영지원팀', position: '사원', jobTitle: '' },
  { code: 'EMP-2105', name: '신소영', department: '경영전략실', team: '경영지원팀', position: '사원', jobTitle: '' },
];

// 샘플 팀 데이터
const initialTeamList = [
  { code: 'ORG-111', name: 'LG전자 1팀', department: 'STE1실', projectName: 'LG전자 스마트홈 플랫폼 고도화', projectPeriod: '2025.04.11 ~ 2025.12.31', memberCount: 2 },
  { code: 'ORG-112', name: 'LG전자 2팀', department: 'STE1실', projectName: 'LG전자 통합 관리 시스템', projectPeriod: '2024.03 ~ 2025.06', memberCount: 4 },
  { code: 'ORG-114', name: 'LG전자 4팀', department: 'STE1실', projectName: '', projectPeriod: '', memberCount: 3 },
  { code: 'ORG-121', name: 'GS리테일 1팀', department: 'STE2실', projectName: 'GS리테일 통합 POS 시스템 구축', projectPeriod: '2024.02 ~ 2025.08', memberCount: 5 },
  { code: 'ORG-122', name: 'HDC랩스 1팀', department: 'STE2실', projectName: 'HDC 디지털 트윈 플랫폼', projectPeriod: '2024.06 ~ 2025.12', memberCount: 1 },
  { code: 'ORG-123', name: 'KT 알파1팀', department: 'STE2실', projectName: 'KT 알파 클라우드 마이그레이션', projectPeriod: '2023.11 ~ 2025.03', memberCount: 3 },
  { code: 'ORG-210', name: '경영지원팀', department: '경영전략실', projectName: '', projectPeriod: '', memberCount: 5 },
  { code: 'ORG-220', name: '사업전략팀', department: '경영전략실', projectName: '', projectPeriod: '', memberCount: 3 },
  { code: 'ORG-310', name: '자동화개발팀', department: '개발연구소', projectName: '', projectPeriod: '', memberCount: 5 },
];

// 샘플 프로젝트 데이터
const projectList = [
  { code: 'PRJ-001', name: 'LG전자 스마트홈 플랫폼 고도화', client: 'LG전자', period: '2025.04.11 ~ 2025.12.31', status: '진행중' },
  { code: 'PRJ-002', name: 'LG전자 통합 관리 시스템', client: 'LG전자', period: '2024.03 ~ 2025.06', status: '진행중' },
  { code: 'PRJ-003', name: 'GS리테일 통합 POS 시스템 구축', client: 'GS리테일', period: '2024.02 ~ 2025.08', status: '진행중' },
  { code: 'PRJ-004', name: 'HDC 디지털 트윈 플랫폼', client: 'HDC랩스', period: '2024.06 ~ 2025.12', status: '진행중' },
  { code: 'PRJ-005', name: 'KT 알파 클라우드 마이그레이션', client: 'KT', period: '2023.11 ~ 2025.03', status: '진행중' },
  { code: 'PRJ-006', name: 'SK텔레콤 5G 서비스 개발', client: 'SK텔레콤', period: '2025.01 ~ 2025.12', status: '대기중' },
  { code: 'PRJ-007', name: '삼성전자 IoT 플랫폼', client: '삼성전자', period: '2025.03 ~ 2025.09', status: '대기중' },
];

export function HRRegistrationOrgChange() {
  const [activeTab, setActiveTab] = useState('personnel');
  const [isEditing, setIsEditing] = useState(true);
  const [isEmployeeSearchOpen, setIsEmployeeSearchOpen] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [teamList, setTeamList] = useState(initialTeamList);
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [deletingTeam, setDeletingTeam] = useState<any>(null);
  const [deleteMode, setDeleteMode] = useState<'rename' | 'delete'>('rename');
  const [teamNewName, setTeamNewName] = useState('');

  // 오늘 날짜를 YYYY-MM-DD 형식으로
  const today = new Date().toISOString().split('T')[0];

  // 인사발령 폼 데이터
  const [formData, setFormData] = useState({
    employeeCode: '',
    employeeName: '',
    // 현재 정보
    currentDepartment: '',
    currentTeam: '',
    currentPosition: '',
    currentJobTitle: '',
    // 변경 정보
    changeType: '', // 조직이동, 직급변경, 직책변경, 승진, 겸임발령
    changeDate: today,
    newDepartment: '',
    newTeam: '',
    newPosition: '',
    newJobTitle: '',
  });

  // 팀 생성 폼 데이터
  const [teamFormData, setTeamFormData] = useState({
    teamCode: '',
    teamName: '',
    department: '',
    description: '',
    createdDate: today,
  });

  // 프로젝트 연결 폼 데이터
  const [projectFormData, setProjectFormData] = useState({
    teamCode: '',
    teamName: '',
    department: '',
    projectCode: '',
    projectName: '',
    projectPeriod: '',
    linkDate: today,
    note: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [teamTouched, setTeamTouched] = useState<Record<string, boolean>>({});
  const [projectTouched, setProjectTouched] = useState<Record<string, boolean>>({});

  // 부서별 팀 목록
  const departmentTeams: Record<string, string[]> = {
    'STE1실': ['LG전자 1팀', 'LG전자 2팀', 'LG전자 4팀'],
    'STE2실': ['GS리테일 1팀', 'HDC랩스 1팀', 'KT 알파1팀'],
    '경영전략실': ['경영지원팀', '사업전략팀'],
    '개발연구소': ['자동화개발팀']
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleTeamInputChange = (field: string, value: string) => {
    setTeamFormData(prev => ({ ...prev, [field]: value }));
    setTeamTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleProjectInputChange = (field: string, value: string) => {
    setProjectFormData(prev => ({ ...prev, [field]: value }));
    setProjectTouched(prev => ({ ...prev, [field]: true }));
  };

  // 부서 변경 핸들러
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      newDepartment: value,
      newTeam: '' // 부서 변경 시 팀 초기화
    }));
    setTouched(prev => ({ ...prev, newDepartment: true, newTeam: false }));
  };

  // 직원 검색 필터링
  const filteredEmployees = employeeList.filter(emp =>
    emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.code.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.team.toLowerCase().includes(employeeSearchQuery.toLowerCase())
  );

  // 직원 선택
  const handleSelectEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setFormData(prev => ({
      ...prev,
      employeeCode: employee.code,
      employeeName: employee.name,
      currentDepartment: employee.department,
      currentTeam: employee.team || '소속 없음',
      currentPosition: employee.position,
      currentJobTitle: employee.jobTitle || '직책 없음',
    }));
    setTouched(prev => ({
      ...prev,
      employeeCode: true,
      employeeName: true,
      currentDepartment: true,
      currentTeam: true,
      currentPosition: true,
      currentJobTitle: true,
    }));
    setIsEmployeeSearchOpen(false);
    setEmployeeSearchQuery('');
  };

  // 팀 선택 (프로젝트 연결용)
  const handleSelectTeam = (team: any) => {
    setProjectFormData(prev => ({
      ...prev,
      teamCode: team.code,
      teamName: team.name,
      department: team.department,
    }));
    setProjectTouched(prev => ({
      ...prev,
      teamCode: true,
      teamName: true,
      department: true,
    }));
  };

  // 프로젝트 선택
  const handleSelectProject = (project: any) => {
    setProjectFormData(prev => ({
      ...prev,
      projectCode: project.code,
      projectName: project.name,
      projectPeriod: project.period,
    }));
    setProjectTouched(prev => ({
      ...prev,
      projectCode: true,
      projectName: true,
      projectPeriod: true,
    }));
  };

  // 인사발령 저장
  const handleSavePersonnel = () => {
    // 필수 필드 검증
    const requiredFields = ['employeeCode', 'employeeName', 'changeType', 'changeDate'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 변경 유형에 따른 필드 검증
    if (formData.changeType === '조직이동' && !formData.newDepartment) {
      toast.error('이동할 부서를 선택해주세요.');
      return;
    }

    if (formData.changeType === '직급변경' && !formData.newPosition) {
      toast.error('변경할 직급을 선택해주세요.');
      return;
    }

    if (formData.changeType === '직책변경' && !formData.newJobTitle) {
      toast.error('변경할 직책을 선택해주세요.');
      return;
    }

    // 저장 확인
    if (confirm(`${formData.employeeName}님의 ${formData.changeType} 정보를 저장하시겠습니까?`)) {
      // 여기서 실제 저장 로직 수행
      toast.success(`${formData.employeeName}님의 ${formData.changeType} 정보가 등록되었습니다.`);

      // 폼 초기화
      setTimeout(() => {
        if (confirm('다른 직원의 발령을 등록하시겠습니까?')) {
          resetPersonnelForm();
        } else {
          setIsEditing(false);
        }
      }, 500);
    }
  };

  // 팀 생성 저장
  const handleSaveTeam = () => {
    const requiredFields = ['teamName', 'department', 'createdDate'];
    const missingFields = requiredFields.filter(field => !teamFormData[field as keyof typeof teamFormData]);

    if (missingFields.length > 0) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 저장 확인
    if (confirm(`${teamFormData.teamName}을(를) 생성하시겠습니까?`)) {
      // 팀 코드 자동 생성 (실제로는 서버에서 생성)
      const newTeamCode = `ORG-${Math.floor(Math.random() * 900) + 100}`;
      const newTeam = {
        code: newTeamCode,
        name: teamFormData.teamName,
        department: teamFormData.department,
        projectName: '',
        projectPeriod: '',
        memberCount: 0,
      };

      setTeamList(prev => [...prev, newTeam]);
      toast.success(`${teamFormData.teamName}이(가) 생성되었습니다.`);

      setTimeout(() => {
        if (confirm('다른 팀을 생성하시겠습니까?')) {
          resetTeamForm();
        }
      }, 500);
    }
  };

  // 팀 삭제 아이콘 클릭 핸들러
  const handleDeleteTeamClick = (team: any) => {
    setDeletingTeam(team);
    setTeamNewName(team.name);
    setDeleteMode('rename');
    setIsDeleteTeamDialogOpen(true);
  };

  // 팀명 변경 처리
  const handleRenameTeam = () => {
    if (!teamNewName.trim()) {
      toast.error('새 팀명을 입력해주세요.');
      return;
    }

    const updatedTeamList = teamList.map(team => {
      if (team.code === deletingTeam.code) {
        return { ...team, name: teamNewName };
      }
      return team;
    });

    setTeamList(updatedTeamList);
    toast.success(`팀명이 "${teamNewName}"(으)로 변경되었습니다.`);
    setIsDeleteTeamDialogOpen(false);
    setDeleteMode('rename');
    setTeamNewName('');
  };

  // 팀 삭제 처리
  const handleDeleteTeamConfirm = () => {
    if (deletingTeam.memberCount > 0) {
      toast.error('소속 팀원이 있어 삭제할 수 없습니다.');
      return;
    }

    setTeamList(prev => prev.filter(t => t.code !== deletingTeam.code));
    toast.success(`${deletingTeam.name}이(가) 삭제되었습니다.`);
    setIsDeleteTeamDialogOpen(false);
    setDeleteMode('rename');
    setTeamNewName('');
  };

  // 팀 수정
  const handleEditTeam = (team: any) => {
    setEditingTeam(team);
    setIsEditTeamDialogOpen(true);
  };

  // 프로젝트 연결 저장
  const handleSaveProjectLink = () => {
    const requiredFields = ['teamCode', 'projectCode', 'linkDate'];
    const missingFields = requiredFields.filter(field => !projectFormData[field as keyof typeof projectFormData]);

    if (missingFields.length > 0) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 저장 확인
    if (confirm(`${projectFormData.teamName}에 ${projectFormData.projectName} 프로젝트를 연결하시겠습니까?`)) {
      // 팀 목록 업데이트 (프로젝트 연결)
      setTeamList(prev => prev.map(team => {
        if (team.code === projectFormData.teamCode) {
          return {
            ...team,
            projectName: projectFormData.projectName,
            projectPeriod: projectFormData.projectPeriod,
          };
        }
        return team;
      }));

      toast.success(`${projectFormData.teamName}에 ${projectFormData.projectName} 프로젝트가 연결되었습니다.`);

      setTimeout(() => {
        if (confirm('다른 프로젝트를 연결하시겠습니까?')) {
          resetProjectForm();
        }
      }, 500);
    }
  };

  // 폼 초기화 함수들
  const resetPersonnelForm = () => {
    setFormData({
      employeeCode: '',
      employeeName: '',
      currentDepartment: '',
      currentTeam: '',
      currentPosition: '',
      currentJobTitle: '',
      changeType: '',
      changeDate: today,
      newDepartment: '',
      newTeam: '',
      newPosition: '',
      newJobTitle: '',
    });
    setSelectedEmployee(null);
    setTouched({});
    setIsEditing(true);
  };

  const resetTeamForm = () => {
    setTeamFormData({
      teamCode: '',
      teamName: '',
      department: '',
      description: '',
      createdDate: today,
    });
    setTeamTouched({});
  };

  const resetProjectForm = () => {
    setProjectFormData({
      teamCode: '',
      teamName: '',
      department: '',
      projectCode: '',
      projectName: '',
      projectPeriod: '',
      linkDate: today,
      note: '',
    });
    setProjectTouched({});
  };

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 있습니다. 취소하시겠습니까?')) {
      resetPersonnelForm();
      resetTeamForm();
      resetProjectForm();
    }
  };

  const getInputClassName = (field: string, touchedState: Record<string, boolean>, dataObj: any) => {
    if (!isEditing) return 'bg-muted/30';
    return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>조직변경</h1>
          <p className="text-muted-foreground mt-1">인사발령, 팀 생성/삭제, 프로젝트 연결을 관리하세요.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            취소
          </Button>
        </div>
      </div>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personnel">인사발령</TabsTrigger>
          <TabsTrigger value="team">팀 관리</TabsTrigger>
          <TabsTrigger value="project">프로젝트 연결</TabsTrigger>
        </TabsList>

        {/* 인사발령 탭 */}
        <TabsContent value="personnel" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSavePersonnel}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </div>

          {/* 직원 선택 */}
          <Card>
            <CardHeader>
              <CardTitle>직원 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={formData.employeeName}
                    disabled
                    placeholder="직원 검색 버튼을 클릭하세요"
                    className="flex-1 bg-muted"
                  />
                  <Input
                    value={formData.employeeCode}
                    disabled
                    placeholder="사번"
                    className="w-40 bg-muted"
                  />
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEmployeeSearchOpen(true)}
                      className="shrink-0"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      직원 검색
                    </Button>
                  )}
                </div>

                {/* 현재 소속 정보 */}
                {selectedEmployee && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">현재 부서</label>
                      <p className="text-sm">{formData.currentDepartment}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">현재 팀</label>
                      <p className="text-sm">{formData.currentTeam}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">현재 직급</label>
                      <p className="text-sm">{formData.currentPosition}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">현재 직책</label>
                      <p className="text-sm">{formData.currentJobTitle}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 발령 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>발령 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">
                    발령 유형 <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.changeType}
                    onValueChange={(value) => handleInputChange('changeType', value)}
                    disabled={!isEditing || !selectedEmployee}
                  >
                    <SelectTrigger className={getInputClassName('changeType', touched, formData)}>
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="조직이동">조직이동</SelectItem>
                      <SelectItem value="직급변경">직급변경</SelectItem>
                      <SelectItem value="직책변경">직책변경</SelectItem>
                      <SelectItem value="승진">승진</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">
                    발령일자 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.changeDate}
                    onChange={(e) => handleInputChange('changeDate', e.target.value)}
                    className={getInputClassName('changeDate', touched, formData)}
                    disabled={!isEditing || !selectedEmployee}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 변경 후 정보 */}
          {selectedEmployee && formData.changeType && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>변경 후 정보</CardTitle>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 조직이동인 경우 */}
                {formData.changeType === '조직이동' && (
                  <div>
                    <h3 className="text-sm mb-3 text-foreground opacity-80">조직 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm mb-1.5 block text-muted-foreground">
                          부서 <span className="text-destructive">*</span>
                        </label>
                        <Select
                          value={formData.newDepartment}
                          onValueChange={handleDepartmentChange}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={getInputClassName('newDepartment', touched, formData)}>
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
                        {departmentTeams[formData.newDepartment]?.length > 0 ? (
                          <Select
                            value={formData.newTeam}
                            onValueChange={(value) => handleInputChange('newTeam', value)}
                            disabled={!isEditing || !formData.newDepartment}
                          >
                            <SelectTrigger className={getInputClassName('newTeam', touched, formData)}>
                              <SelectValue placeholder="팀을 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="소속 없음">소속 없음</SelectItem>
                              {departmentTeams[formData.newDepartment].map((team) => (
                                <SelectItem key={team} value={team}>{team}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={formData.newDepartment ? "소속 없음" : ""}
                            disabled
                            placeholder="부서를 먼저 선택하세요"
                            className="bg-muted"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 직급변경, 승진인 경우 */}
                {(formData.changeType === '직급변경' || formData.changeType === '승진') && (
                  <div>
                    <h3 className="text-sm mb-3 text-foreground opacity-80">직급 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm mb-1.5 block text-muted-foreground">
                          직급 <span className="text-destructive">*</span>
                        </label>
                        <Select
                          value={formData.newPosition}
                          onValueChange={(value) => handleInputChange('newPosition', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={getInputClassName('newPosition', touched, formData)}>
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
                    </div>
                  </div>
                )}

                {/* 직책변경인 경우 */}
                {formData.changeType === '직책변경' && (
                  <div>
                    <h3 className="text-sm mb-3 text-foreground opacity-80">직책 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm mb-1.5 block text-muted-foreground">
                          직책 <span className="text-destructive">*</span>
                        </label>
                        <Select
                          value={formData.newJobTitle}
                          onValueChange={(value) => handleInputChange('newJobTitle', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className={getInputClassName('newJobTitle', touched, formData)}>
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
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 팀 관리 탭 */}
        <TabsContent value="team" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSaveTeam}>
              <Save className="h-4 w-4 mr-2" />
              팀 생성
            </Button>
          </div>

          {/* 팀 생성 */}
          <Card>
            <CardHeader>
              <CardTitle>새 팀 생성</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">
                    팀명 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={teamFormData.teamName}
                    onChange={(e) => handleTeamInputChange('teamName', e.target.value)}
                    placeholder="예: LG전자 5팀"
                    className={getInputClassName('teamName', teamTouched, teamFormData)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">
                    상위 부서 <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={teamFormData.department}
                    onValueChange={(value) => handleTeamInputChange('department', value)}
                  >
                    <SelectTrigger className={getInputClassName('department', teamTouched, teamFormData)}>
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
                  <label className="text-sm mb-1.5 block text-muted-foreground">
                    생성일자 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="date"
                    value={teamFormData.createdDate}
                    onChange={(e) => handleTeamInputChange('createdDate', e.target.value)}
                    className={getInputClassName('createdDate', teamTouched, teamFormData)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">설명</label>
                  <Input
                    value={teamFormData.description}
                    onChange={(e) => handleTeamInputChange('description', e.target.value)}
                    placeholder="팀 설명을 입력하세요"
                    className={getInputClassName('description', teamTouched, teamFormData)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 팀 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>팀 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {teamList.map((team) => (
                  <div key={team.code} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{team.name}</span>
                        <Badge variant="outline" className="text-xs">{team.code}</Badge>
                        <Badge variant="secondary" className="text-xs">{team.department}</Badge>
                      </div>
                      {team.projectName && (
                        <div className="text-sm text-muted-foreground ml-6">
                          <Link className="h-3 w-3 inline mr-1" />
                          {team.projectName} ({team.projectPeriod})
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground ml-6 mt-1">
                        소속 인원: {team.memberCount}명
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTeamClick(team)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTeam(team)}
                        className="text-primary hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 프로젝트 연결 탭 */}
        <TabsContent value="project" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSaveProjectLink}>
              <Save className="h-4 w-4 mr-2" />
              프로젝트 연결
            </Button>
          </div>

          {/* 팀 선택 - 프로젝트 미연결/종료된 팀만 표시 */}
          <Card>
            <CardHeader>
              <CardTitle>팀 선택 (프로젝트 미연결 팀)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamList.filter(team => !team.projectName || team.projectName === '').map((team) => (
                  <button
                    key={team.code}
                    onClick={() => handleSelectTeam(team)}
                    className={`p-4 border rounded-lg text-left hover:border-primary transition-colors ${
                      projectFormData.teamCode === team.code ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{team.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{team.department}</div>
                    <div className="text-xs text-green-600 mt-2">
                      연결 가능
                    </div>
                  </button>
                ))}
              </div>
              {teamList.filter(team => !team.projectName || team.projectName === '').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  모든 팀이 프로젝트에 연결되어 있습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 팀에 연결되지 않은 프로젝트 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>팀 연결 안된 프로젝트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectList.filter(project => 
                  !teamList.some(team => team.projectName === project.name)
                ).map((project) => (
                  <button
                    key={project.code}
                    onClick={() => handleSelectProject(project)}
                    className={`w-full p-4 border rounded-lg text-left hover:border-primary transition-colors ${
                      projectFormData.projectCode === project.code 
                        ? 'border-primary bg-primary/5' 
                        : 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{project.name}</span>
                        <Badge variant="outline" className="text-xs">{project.code}</Badge>
                      </div>
                      <Badge variant={project.status === '진행중' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      고객사: {project.client} • 기간: {project.period}
                    </div>
                    {projectFormData.projectCode !== project.code && (
                      <div className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                        ⚠️ 팀에 연결되지 않은 프로젝트
                      </div>
                    )}
                  </button>
                ))}
                {projectList.filter(project => 
                  !teamList.some(team => team.projectName === project.name)
                ).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    모든 프로젝트가 팀에 연결되어 있습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 연결 정보 */}
          {projectFormData.teamCode && projectFormData.projectCode && (
            <Card>
              <CardHeader>
                <CardTitle>연결 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">팀</label>
                    <p className="text-sm font-medium">{projectFormData.teamName}</p>
                    <p className="text-xs text-muted-foreground">{projectFormData.department}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">프로젝트</label>
                    <p className="text-sm font-medium">{projectFormData.projectName}</p>
                    <p className="text-xs text-muted-foreground">{projectFormData.projectPeriod}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm mb-1.5 block text-muted-foreground">
                      연결일자 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="date"
                      value={projectFormData.linkDate}
                      onChange={(e) => handleProjectInputChange('linkDate', e.target.value)}
                      className={getInputClassName('linkDate', projectTouched, projectFormData)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm mb-1.5 block text-muted-foreground">비고</label>
                  <Textarea
                    value={projectFormData.note}
                    onChange={(e) => handleProjectInputChange('note', e.target.value)}
                    placeholder="추가 정보를 입력하세요"
                    className={getInputClassName('note', projectTouched, projectFormData)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 직원 검색 모달 */}
      <Dialog open={isEmployeeSearchOpen} onOpenChange={setIsEmployeeSearchOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>직원 검색</DialogTitle>
            <DialogDescription>
              이름, 사번, 부서, 팀으로 검색할 수 있습니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Search className="h-5 w-5 text-muted-foreground mt-2" />
              <Input
                placeholder="검색어를 입력하세요"
                value={employeeSearchQuery}
                onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {filteredEmployees.length > 0 ? (
                <div className="divide-y">
                  {filteredEmployees.map((employee) => (
                    <button
                      key={employee.code}
                      onClick={() => handleSelectEmployee(employee)}
                      className="w-full text-left p-4 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{employee.name}</p>
                            <Badge variant="outline" className="text-xs">{employee.code}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{employee.department}</span>
                            {employee.team && (
                              <>
                                <span>•</span>
                                <span>{employee.team}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{employee.position}</span>
                            {employee.jobTitle && (
                              <>
                                <span>•</span>
                                <span>{employee.jobTitle}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  {employeeSearchQuery ? '검색 결과가 없습니다.' : '검색어를 입력하세요.'}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 팀 수정 모달 - 조직 구조 관리와 동일한 디자인 */}
      <Dialog open={isEditTeamDialogOpen} onOpenChange={setIsEditTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>팀 수정</DialogTitle>
            <DialogDescription>
              팀 정보를 수정합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-team-name">팀명</Label>
              <Input 
                id="edit-team-name" 
                defaultValue={editingTeam?.name || ''} 
                key={editingTeam?.code}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-team-code">팀 코드</Label>
              <Input 
                id="edit-team-code" 
                defaultValue={editingTeam?.code || ''} 
                readOnly 
                key={`code-${editingTeam?.code}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-team-description">설명</Label>
              <Input 
                id="edit-team-description" 
                defaultValue=""
                key={`desc-${editingTeam?.code}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-team-department">상위 부서</Label>
              <Input
                id="edit-team-department"
                defaultValue={editingTeam?.department || ''}
                readOnly
                key={`dept-${editingTeam?.code}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTeamDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => {
              const nameInput = document.getElementById('edit-team-name') as HTMLInputElement;
              const descInput = document.getElementById('edit-team-description') as HTMLInputElement;
              
              const updatedTeamList = teamList.map(team => {
                if (team.code === editingTeam.code) {
                  return {
                    ...team,
                    name: nameInput?.value || team.name,
                  };
                }
                return team;
              });
              setTeamList(updatedTeamList);
              toast.success(`${nameInput?.value} 팀 정보가 수정되었습니다.`);
              setIsEditTeamDialogOpen(false);
            }}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 팀 삭제/변경 모달 - 조직 구조 관리와 동일한 디자인 */}
      <Dialog open={isDeleteTeamDialogOpen} onOpenChange={(open) => {
        setIsDeleteTeamDialogOpen(open);
        if (!open) {
          setDeleteMode('rename');
          setTeamNewName('');
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>팀 관리</DialogTitle>
            <DialogDescription>
              팀명을 변경하거나 팀을 삭제할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {/* 탭 선택 */}
          <div className="flex gap-2 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                deleteMode === 'rename'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                setDeleteMode('rename');
                setTeamNewName(deletingTeam?.name || '');
              }}
            >
              팀명 변경
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                deleteMode === 'delete'
                  ? 'border-b-2 border-destructive text-destructive'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setDeleteMode('delete')}
            >
              팀 삭제
            </button>
          </div>

          {/* 내용 영역 */}
          <div className="py-4">
            {deleteMode === 'rename' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">팀명 변경</p>
                      <p className="text-blue-700">
                        현재 팀: <span className="font-semibold">{deletingTeam?.name}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">새 팀명</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="새로운 부서명을 입력해주세요"
                    value={teamNewName}
                    onChange={(e) => setTeamNewName(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive mb-1">경고</p>
                      <p className="text-muted-foreground">
                        팀을 삭제하면 소속 인원 배치 정보가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    삭제할 팀: <span className="font-semibold text-foreground">{deletingTeam?.name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    소속 인원: <span className="font-semibold text-foreground">{deletingTeam?.memberCount}명</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDeleteTeamDialogOpen(false);
              setDeleteMode('rename');
              setTeamNewName('');
            }}>
              취소
            </Button>
            {deleteMode === 'rename' ? (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleRenameTeam}
                disabled={!teamNewName.trim()}
              >
                <Building2 className="h-4 w-4 mr-2" />
                변경
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={handleDeleteTeamConfirm}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}