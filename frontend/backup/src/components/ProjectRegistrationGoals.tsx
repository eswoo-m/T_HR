import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Save, X, Plus, Trash2, Calendar, Target, Flag, Building2, TrendingUp, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

// 프로젝트 단계 정의
const PROJECT_PHASES = [
  '착수',
  '테스트 분석',
  '테스트 설계',
  '테스트 구현',
  '테스트 수행',
  '결과 분석',
  '종료'
] as const;

interface PhaseGoal {
  id: string;
  phase: string;
  startDate: string;
  endDate: string;
  objectives: string;
  deliverables: string;
  manpower: string;
  qualityTarget: string;
  status: '미시작' | '진행중' | '완료' | '지연';
}

interface KPI {
  id: string;
  category: string;
  metric: string;
  target: string;
  unit: string;
  weight: string;
  criteria: string;
}

const MOCK_PROJECTS = [
  { 
    code: 'PROJ-2025-001', 
    name: 'SKT 챗봇 LLM 평가 시스템', 
    department: 'STE1실', 
    team: 'LG전자 1팀',
    startDate: '2024-10-01',
    endDate: '2025-01-31',
    totalBudget: '50000',
    goalDescription: 'SKT 챗봇 서비스의 LLM 기반 응답 품질을 평가하기 위한 자동화 테스트 시스템 구축. 다양한 시나리오에 대한 응답 정확도, 응답 시간, 사용자 만족도를 측정하고 개선 방안을 도출한다.',
  },
  { 
    code: 'PROJ-2025-002', 
    name: 'LG전자 ADAS 테스트 자동화', 
    department: 'STE1실', 
    team: 'LG전자 2팀',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    totalBudget: '75000',
    goalDescription: '자율주행 보조 시스템(ADAS)의 센서 융합 및 판단 로직에 대한 시뮬레이션 기반 자동화 테스트 환경 구축. 다양한 주행 시나리오에서의 안전성과 신뢰성을 검증한다.',
  },
  { 
    code: 'PROJ-2024-089', 
    name: 'GS리테일 POS 시스템 품질검증', 
    department: 'STE2실', 
    team: 'GS리테일 1팀',
    startDate: '2024-09-01',
    endDate: '2025-02-28',
    totalBudget: '35000',
    goalDescription: 'GS25 편의점 POS 시스템 리뉴얼에 따른 통합 테스트 및 성능 검증. 결제 처리, 재고 관리, 프로모션 적용 등 핵심 기능의 안정성을 확보하고 장애 상황에 대한 대응 시나리오를 검증한다.',
  },
];

const KPI_CATEGORIES = [
  '품질',
  '일정',
  '예산',
  '생산성',
  '고객만족',
  '리스크관리'
] as const;

export function ProjectRegistrationGoals() {
  const [isEditing, setIsEditing] = useState(false);
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [isPhaseDialogOpen, setIsPhaseDialogOpen] = useState(false);
  const [isKPIDialogOpen, setIsKPIDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    projectCode: '',
    projectName: '',
    department: '',
    team: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    goalDescription: '',
  });

  const [phaseGoals, setPhaseGoals] = useState<PhaseGoal[]>([]);

  const [kpis, setKPIs] = useState<KPI[]>([
    {
      id: '1',
      category: '품질',
      metric: '결함검출율',
      target: '95',
      unit: '% 이상',
      weight: '30',
      criteria: '테스트 수행 시 발견된 결함 수 / 전체 잠재 결함 수',
    },
    {
      id: '2',
      category: '일정',
      metric: '일정준수율',
      target: '100',
      unit: '% 이상',
      weight: '25',
      criteria: '계획 대비 실제 진행률',
    },
  ]);

  const [newPhase, setNewPhase] = useState<Partial<PhaseGoal>>({
    phase: '',
    startDate: '',
    endDate: '',
    objectives: '',
    deliverables: '',
    manpower: '',
    qualityTarget: '',
    status: '미시작',
  });

  const [newKPI, setNewKPI] = useState<Partial<KPI>>({
    category: '',
    metric: '',
    target: '',
    unit: '',
    weight: '',
    criteria: '',
  });

  const handleProjectSelect = (project: typeof MOCK_PROJECTS[0]) => {
    setFormData({
      ...formData,
      projectCode: project.code,
      projectName: project.name,
      department: project.department,
      team: project.team,
      startDate: project.startDate,
      endDate: project.endDate,
      totalBudget: project.totalBudget,
      goalDescription: project.goalDescription,
    });
    setIsOrgDialogOpen(false);
    toast.success(`"${project.name}" 프로젝트가 선택되었습니다.`);
  };

  const handleAddPhase = () => {
    if (!newPhase.phase || !newPhase.startDate || !newPhase.endDate) {
      toast.error('단계, 시작일, 종료일은 필수 입력 항목입니다.');
      return;
    }

    // 날짜 검증
    if (formData.startDate && formData.endDate) {
      const phaseStart = new Date(newPhase.startDate);
      const phaseEnd = new Date(newPhase.endDate);
      const projectStart = new Date(formData.startDate);
      const projectEnd = new Date(formData.endDate);

      if (phaseStart < projectStart || phaseEnd > projectEnd) {
        toast.error('단계 기간은 프로젝트 기간 내에 설정해야 합니다.');
        return;
      }

      if (phaseStart >= phaseEnd) {
        toast.error('종료일은 시작일보다 이후여야 합니다.');
        return;
      }
    }

    const phase: PhaseGoal = {
      id: Date.now().toString(),
      phase: newPhase.phase!,
      startDate: newPhase.startDate!,
      endDate: newPhase.endDate!,
      objectives: newPhase.objectives || '',
      deliverables: newPhase.deliverables || '',
      manpower: newPhase.manpower || '',
      qualityTarget: newPhase.qualityTarget || '',
      status: '미시작',
    };

    setPhaseGoals([...phaseGoals, phase]);
    setNewPhase({
      phase: '',
      startDate: '',
      endDate: '',
      objectives: '',
      deliverables: '',
      manpower: '',
      qualityTarget: '',
      status: '미시작',
    });
    setIsPhaseDialogOpen(false);
    toast.success('단계별 목표가 추가되었습니다.');
  };

  const handleRemovePhase = (id: string) => {
    if (!isEditing) return;
    if (confirm('이 단계를 삭제하시겠습니까?')) {
      setPhaseGoals(phaseGoals.filter(p => p.id !== id));
      toast.success('단계가 삭제되었습니다.');
    }
  };

  const handleAddKPI = () => {
    if (!newKPI.category || !newKPI.metric || !newKPI.target || !newKPI.unit) {
      toast.error('카테고리, 지표명, 목표값, 단위는 필수 입력 항목입니다.');
      return;
    }

    // 가중치 합계 검증
    const currentWeight = kpis.reduce((sum, kpi) => sum + parseFloat(kpi.weight || '0'), 0);
    const newWeight = parseFloat(newKPI.weight || '0');
    
    if (currentWeight + newWeight > 100) {
      toast.error(`가중치 합계가 100을 초과할 수 없습니다. (현재: ${currentWeight})`);
      return;
    }

    const kpi: KPI = {
      id: Date.now().toString(),
      category: newKPI.category!,
      metric: newKPI.metric!,
      target: newKPI.target!,
      unit: newKPI.unit!,
      weight: newKPI.weight || '0',
      criteria: newKPI.criteria || '',
    };

    setKPIs([...kpis, kpi]);
    setNewKPI({
      category: '',
      metric: '',
      target: '',
      unit: '',
      weight: '',
      criteria: '',
    });
    setIsKPIDialogOpen(false);
    toast.success('KPI가 추가되었습니다.');
  };

  const handleRemoveKPI = (id: string) => {
    if (!isEditing) return;
    if (confirm('이 KPI를 삭제하시겠습니까?')) {
      setKPIs(kpis.filter(k => k.id !== id));
      toast.success('KPI가 삭제되었습니다.');
    }
  };

  const handleSave = () => {
    // 필수 필드 검증
    if (!formData.projectCode || !formData.projectName) {
      toast.error('프로젝트를 선택해주세요.');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('프로젝트 기간을 입력해주세요.');
      return;
    }

    if (phaseGoals.length === 0) {
      toast.error('최소 1개 이상의 단계별 목표를 설정해야 합니다.');
      return;
    }

    if (kpis.length === 0) {
      toast.error('최소 1개 이상의 KPI를 설정해야 합니다.');
      return;
    }

    // 가중치 합계 검증
    const totalWeight = kpis.reduce((sum, kpi) => sum + parseFloat(kpi.weight || '0'), 0);
    if (totalWeight !== 100) {
      toast.warning(`KPI 가중치 합계가 100이 아닙니다. (현재: ${totalWeight}%)`);
    }

    toast.success('프로젝트 목표설정 정보가 저장되었습니다.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (confirm('편집 중인 내용이 저장되지 않습니다. 취소하시겠습니까?')) {
      setIsEditing(false);
      // 원래 데이터로 복원하는 로직 추가 가능
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const getInputClassName = (value: string, isRequired: boolean = false) => {
    if (!isEditing) {
      return 'bg-gray-100 dark:bg-gray-800';
    }
    if (isRequired && !value) {
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400';
    }
    return 'bg-white dark:bg-gray-950';
  };

  const getTotalWeight = () => {
    return kpis.reduce((sum, kpi) => sum + parseFloat(kpi.weight || '0'), 0);
  };

  const getStatusBadgeVariant = (status: PhaseGoal['status']) => {
    switch (status) {
      case '완료':
        return 'default';
      case '진행중':
        return 'secondary';
      case '지연':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>프로젝트 목표설정</h1>
          <p className="text-muted-foreground">프로젝트의 단계별 목표와 성과지표(KPI)를 설정합니다.</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Target className="h-4 w-4 mr-2" />
              편집
            </Button>
          )}
        </div>
      </div>

      {/* 프로젝트 기본정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            프로젝트 기본정보
          </CardTitle>
          <CardDescription>
            목표를 설정할 프로젝트를 선택하고 기본 정보를 입력합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                프로젝트명 <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={formData.projectName}
                  readOnly
                  className={getInputClassName(formData.projectName, true)}
                  placeholder="프로젝트를 선택하세요"
                />
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOrgDialogOpen(true)}
                  >
                    선택
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>프로젝트 코드</Label>
              <Input
                value={formData.projectCode}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label>소속 부서</Label>
              <Input
                value={formData.department}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label>소속 팀</Label>
              <Input
                value={formData.team}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label>
                프로젝트 시작일 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.startDate}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label>
                프로젝트 종료일 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.endDate}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label>총 예산 (만원)</Label>
              <Input
                type="number"
                value={formData.totalBudget}
                readOnly
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>목표 개요</Label>
            <Textarea
              value={formData.goalDescription}
              readOnly
              className="bg-gray-100 dark:bg-gray-800"
              placeholder="프로젝트의 전반적인 목표와 방향성을 입력하세요"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* 단계별 목표 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                단계별 목표 (Phase Goals)
              </CardTitle>
              <CardDescription>
                프로젝트 단계별 세부 목표와 일정을 설정합니다.
              </CardDescription>
            </div>
            {isEditing && (
              <Button onClick={() => setIsPhaseDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                단계 추가
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">단계</TableHead>
                <TableHead className="w-[100px]">시작일</TableHead>
                <TableHead className="w-[100px]">종료일</TableHead>
                <TableHead>목표 및 주요활동</TableHead>
                <TableHead>산출물</TableHead>
                <TableHead className="w-[80px]">투입M/M</TableHead>
                <TableHead className="w-[100px]">품질목표</TableHead>
                <TableHead className="w-[80px]">상태</TableHead>
                {isEditing && <TableHead className="w-[60px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {phaseGoals.length > 0 ? (
                phaseGoals.map((phase) => (
                  <TableRow key={phase.id}>
                    <TableCell>
                      <Badge variant="outline">{phase.phase}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {phase.startDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {phase.endDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{phase.objectives || '-'}</TableCell>
                    <TableCell className="text-sm">{phase.deliverables || '-'}</TableCell>
                    <TableCell className="text-sm text-center">{phase.manpower || '-'}</TableCell>
                    <TableCell className="text-sm">{phase.qualityTarget || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(phase.status)}>
                        {phase.status}
                      </Badge>
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePhase(phase.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isEditing ? 9 : 8}
                    className="text-center text-muted-foreground h-32"
                  >
                    단계별 목표가 없습니다. '단계 추가' 버튼을 클릭하여 추가하세요.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* KPI 관리 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                KPI (핵심성과지표)
              </CardTitle>
              <CardDescription>
                프로젝트의 성공을 측정할 수 있는 정량적 지표를 설정합니다.
                <span className="ml-2 text-primary font-medium">
                  (가중치 합계: {getTotalWeight()}%)
                </span>
              </CardDescription>
            </div>
            {isEditing && (
              <Button onClick={() => setIsKPIDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                KPI 추가
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">카테고리</TableHead>
                <TableHead>지표명</TableHead>
                <TableHead className="w-[80px]">목표값</TableHead>
                <TableHead className="w-[80px]">단위</TableHead>
                <TableHead className="w-[80px]">가중치</TableHead>
                <TableHead>산출기준</TableHead>
                {isEditing && <TableHead className="w-[60px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.length > 0 ? (
                kpis.map((kpi) => (
                  <TableRow key={kpi.id}>
                    <TableCell>
                      <Badge>{kpi.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{kpi.metric}</TableCell>
                    <TableCell className="text-center font-medium text-primary">
                      {kpi.target}
                    </TableCell>
                    <TableCell className="text-sm">{kpi.unit}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{kpi.weight}%</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {kpi.criteria || '-'}
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveKPI(kpi.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isEditing ? 7 : 6}
                    className="text-center text-muted-foreground h-32"
                  >
                    KPI가 없습니다. 'KPI 추가' 버튼을 클릭하여 추가하세요.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 안내 메시지 */}
      {isEditing && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-blue-600 dark:text-blue-400">💡</div>
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-2">목표설정 가이드</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                  <li><strong>단계별 목표:</strong> 프로젝트 단계(착수→테스트 분석→설계→구현→수행→분석→종료)에 따라 구체적인 목표를 설정하세요.</li>
                  <li><strong>투입 M/M:</strong> 각 단계별 투입 인력(Man-Month)을 산정하여 입력하세요.</li>
                  <li><strong>KPI 가중치:</strong> 전체 합계가 100%가 되도록 설정하는 것을 권장합니다.</li>
                  <li><strong>산출기준:</strong> KPI 측정 방법을 명확히 정의하여 객관적 평가가 가능하도록 하세요.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 프로젝트 선택 다이얼로그 */}
      <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>프로젝트 선택</DialogTitle>
            <DialogDescription>목표를 설정할 프로젝트를 선택하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {MOCK_PROJECTS.map((project) => (
              <div
                key={project.code}
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleProjectSelect(project)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">코드: {project.code}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-muted-foreground">{project.department}</p>
                    <p className="text-primary">{project.team}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 단계 추가 다이얼로그 */}
      <Dialog open={isPhaseDialogOpen} onOpenChange={setIsPhaseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>단계별 목표 추가</DialogTitle>
            <DialogDescription>새로운 프로젝트 단계의 목표를 추가합니다.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  단계 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newPhase.phase}
                  onValueChange={(value) => setNewPhase({ ...newPhase, phase: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_PHASES.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {phase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  시작일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={newPhase.startDate}
                  onChange={(e) => setNewPhase({ ...newPhase, startDate: e.target.value })}
                  min={formData.startDate}
                  max={formData.endDate}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  종료일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={newPhase.endDate}
                  onChange={(e) => setNewPhase({ ...newPhase, endDate: e.target.value })}
                  min={newPhase.startDate || formData.startDate}
                  max={formData.endDate}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>목표 및 주요활동</Label>
              <Textarea
                value={newPhase.objectives}
                onChange={(e) => setNewPhase({ ...newPhase, objectives: e.target.value })}
                placeholder="예: 요구사항 분석, 테스트 계획 수립, 테스트 환경 구축"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>산출물</Label>
              <Input
                value={newPhase.deliverables}
                onChange={(e) => setNewPhase({ ...newPhase, deliverables: e.target.value })}
                placeholder="예: 요구사항 정의서, 테스트 계획서"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>투입 M/M (Man-Month)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newPhase.manpower}
                  onChange={(e) => setNewPhase({ ...newPhase, manpower: e.target.value })}
                  placeholder="예: 2.5"
                />
              </div>

              <div className="space-y-2">
                <Label>품질목표</Label>
                <Input
                  value={newPhase.qualityTarget}
                  onChange={(e) => setNewPhase({ ...newPhase, qualityTarget: e.target.value })}
                  placeholder="예: 결함율 5% 이하"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPhaseDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddPhase}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* KPI 추가 다이얼로그 */}
      <Dialog open={isKPIDialogOpen} onOpenChange={setIsKPIDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>KPI 추가</DialogTitle>
            <DialogDescription>
              새로운 핵심성과지표를 추가합니다.
              <span className="ml-2 text-primary font-medium">
                (현재 가중치 합계: {getTotalWeight()}%)
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  카테고리 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newKPI.category}
                  onValueChange={(value) => setNewKPI({ ...newKPI, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {KPI_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  지표명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={newKPI.metric}
                  onChange={(e) => setNewKPI({ ...newKPI, metric: e.target.value })}
                  placeholder="예: 결함검출율, 일정준수율"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  목표값 <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={newKPI.target}
                  onChange={(e) => setNewKPI({ ...newKPI, target: e.target.value })}
                  placeholder="예: 95"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  단위 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newKPI.unit}
                  onValueChange={(value) => setNewKPI({ ...newKPI, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="% 이상">% 이상</SelectItem>
                    <SelectItem value="% 이하">% 이하</SelectItem>
                    <SelectItem value="건">건</SelectItem>
                    <SelectItem value="일">일</SelectItem>
                    <SelectItem value="점">점</SelectItem>
                    <SelectItem value="회">회</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>가중치 (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newKPI.weight}
                  onChange={(e) => setNewKPI({ ...newKPI, weight: e.target.value })}
                  placeholder="예: 30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>산출기준</Label>
              <Textarea
                value={newKPI.criteria}
                onChange={(e) => setNewKPI({ ...newKPI, criteria: e.target.value })}
                placeholder="예: 테스트 수행 시 발견된 결함 수 / 전체 잠재 결함 수 × 100"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKPIDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddKPI}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}