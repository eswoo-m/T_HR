import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Building2, Plus, Edit, Trash2, Users, Search, ChevronRight, ChevronDown, User, Save, AlertTriangle, GitBranch, X, PlayCircle, FolderKanban, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

// 조직도 조회와 동일한 구조 데이터
const organizationData = {
  name: '티벨',
  code: 'ORG-000',
  level: 0,
  headCount: 120,
  leader: '',
  description: '티벨 주식회사',
  createdDate: '2010-03-15',
  children: [
    {
      name: '김종균',
      code: 'EMP-001',
      level: 1,
      headCount: 0,
      leader: '대표이사',
      description: '',
      children: [],
    },
    {
      name: 'STE그룹',
      code: 'ORG-100',
      level: 1,
      headCount: 17,
      leader: '',
      description: '솔루션 기술 엔지니어링 그룹',
      createdDate: '2015-06-01',
      children: [
        {
          name: '박성호',
          code: 'EMP-101',
          level: 2,
          headCount: 0,
          leader: '사장',
          description: '',
          children: [],
        },
        {
          name: '김종협',
          code: 'EMP-102',
          level: 2,
          headCount: 0,
          leader: '실장',
          description: '',
          children: [],
        },
        {
          name: 'STE1실',
          code: 'ORG-110',
          level: 2,
          headCount: 8,
          leader: '',
          description: 'LG전자 프로젝트 전담 조직',
          createdDate: '2018-01-10',
          children: [
            {
              name: '강현규',
              code: 'EMP-111',
              level: 3,
              headCount: 0,
              leader: '이사',
              description: '',
              children: [],
            },
            { 
              name: 'LG전자 1팀', 
              code: 'ORG-111',
              level: 3, 
              headCount: 2, 
              leader: '',
              description: 'LG전자 백엔드 개발 팀',
              createdDate: '2024-01-05',
              projectName: 'LG전자 스마트홈 플랫폼 고도화',
              projectPeriod: '2024.03.01 ~ 2026.01.31',
              children: [
                { name: '전광희', code: 'EMP-1111', level: 4, headCount: 0, leader: '팀장', description: '', children: [] },
                { name: '정홍근', code: 'EMP-1112', level: 4, headCount: 0, leader: '사원', description: '', children: [] },
              ]
            },
            { 
              name: 'LG전자 2팀', 
              code: 'ORG-112',
              level: 3, 
              headCount: 4, 
              leader: '',
              description: 'LG전자 프론트엔드 개발 팀',
              createdDate: '2024-03-10',
              projectName: 'LG전자 통합 관리 시스템',
              projectPeriod: '2024.03 ~ 2025.06',
              children: [
                { name: '이길원', code: 'EMP-1121', level: 4, headCount: 0, leader: '팀장', description: '', children: [] },
                { name: '이성미', code: 'EMP-1122', level: 4, headCount: 0, leader: '책임', description: '', children: [] },
                { name: '조혜진', code: 'EMP-1123', level: 4, headCount: 0, leader: '책임', description: '', children: [] },
                { name: '이나리', code: 'EMP-1124', level: 4, headCount: 0, leader: '선임', description: '', children: [] },
              ]
            },
            { 
              name: 'LG전자 4팀', 
              code: 'ORG-114',
              level: 3, 
              headCount: 3, 
              leader: '',
              description: 'LG전자 플랫폼 개발 팀',
              createdDate: '2024-05-20',
              projectName: '',
              projectPeriod: '',
              children: [
                { name: '박준수', code: 'EMP-1141', level: 4, headCount: 0, leader: '책임', description: '', children: [] },
                { name: '용상수', code: 'EMP-1142', level: 4, headCount: 0, leader: '책임', description: '', children: [] },
                { name: '김규현', code: 'EMP-1143', level: 4, headCount: 0, leader: '사원', description: '', children: [] },
              ]
            },
          ],
        },
        {
          name: 'STE2실',
          code: 'ORG-120',
          level: 2,
          headCount: 8,
          leader: '',
          description: '다양한 프로젝트 전담 조직',
          children: [
            { 
              name: 'GS리테일 1팀', 
              code: 'ORG-121',
              level: 3, 
              headCount: 5, 
              leader: '',
              description: 'GS리테일 프로젝트 팀',
              projectName: 'GS리테일 통합 POS 시스템 구축',
              projectPeriod: '2024.02 ~ 2025.08',
              children: [
                { name: '조현균', code: 'EMP-1211', level: 4, headCount: 0, leader: '팀장', description: '', children: [] },
                { name: '조현정', code: 'EMP-1212', level: 4, headCount: 0, leader: '책임', description: '', children: [] },
                { name: '최현준', code: 'EMP-1213', level: 4, headCount: 0, leader: '책임', description: '', children: [] },
                { name: '강성희', code: 'EMP-1214', level: 4, headCount: 0, leader: '선임', description: '', children: [] },
                { name: '강문혁', code: 'EMP-1215', level: 4, headCount: 0, leader: '사원', description: '', children: [] },
              ]
            },
            { 
              name: 'HDC랩스 1팀', 
              code: 'ORG-122',
              level: 3, 
              headCount: 1, 
              leader: '',
              description: 'HDC랩스 프로젝트 팀',
              projectName: 'HDC 디지털 트윈 플랫폼',
              projectPeriod: '2024.06 ~ 2025.12',
              children: [
                { name: '장대열', code: 'EMP-1221', level: 4, headCount: 0, leader: '선임', description: '', children: [] },
              ]
            },
            { 
              name: 'KT 알파1팀', 
              code: 'ORG-123',
              level: 3, 
              headCount: 3, 
              leader: '',
              description: 'KT 알파 프로젝트 팀',
              projectName: 'KT 알파 클라우드 마이그레이션',
              projectPeriod: '2023.11 ~ 2025.03',
              children: [
                { name: '윤제진', code: 'EMP-1231', level: 4, headCount: 0, leader: '수석', description: '', children: [] },
                { name: '신진욱', code: 'EMP-1232', level: 4, headCount: 0, leader: '수석', description: '', children: [] },
                { name: '이영택', code: 'EMP-1233', level: 4, headCount: 0, leader: '책임', description: '', children: [] },
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
      headCount: 9,
      leader: '',
      description: '경영 전략 및 지원 업무',
      children: [
        {
          name: '경영지원팀',
          code: 'ORG-210',
          level: 2,
          headCount: 5,
          leader: '',
          description: '인사/총무/회계 업무',
          children: [
            { name: '김완수', code: 'EMP-2101', level: 3, headCount: 0, leader: '부사장', description: '', children: [] },
            { name: '이현직', code: 'EMP-2102', level: 3, headCount: 0, leader: '실장', description: '', children: [] },
            { name: '김예림', code: 'EMP-2103', level: 3, headCount: 0, leader: '파트장', description: '', children: [] },
            { name: '가라현', code: 'EMP-2104', level: 3, headCount: 0, leader: '사원', description: '', children: [] },
            { name: '신소영', code: 'EMP-2105', level: 3, headCount: 0, leader: '사원', description: '', children: [] },
          ],
        },
        {
          name: '사업전략팀',
          code: 'ORG-220',
          level: 2,
          headCount: 3,
          leader: '',
          description: '사업 전략 및 기획',
          children: [
            { name: '이유라', code: 'EMP-2201', level: 3, headCount: 0, leader: '선임', description: '', children: [] },
            { name: '주호정', code: 'EMP-2202', level: 3, headCount: 0, leader: '사원', description: '', children: [] },
            { name: '김연서', code: 'EMP-2203', level: 3, headCount: 0, leader: '사원', description: '', children: [] },
          ],
        },
      ],
    },
    {
      name: '개발연구소',
      code: 'ORG-300',
      level: 1,
      headCount: 10,
      leader: '',
      description: 'R&D 및 자동화 개발',
      children: [
        {
          name: '김태영',
          code: 'EMP-301',
          level: 2,
          headCount: 0,
          leader: '부사장',
          description: '',
          children: [],
        },
        {
          name: '이혜진',
          code: 'EMP-302',
          level: 2,
          headCount: 0,
          leader: '이사',
          description: '',
          children: [],
        },
        {
          name: '우은순',
          code: 'EMP-303',
          level: 2,
          headCount: 0,
          leader: '팀장',
          description: '',
          children: [],
        },
        {
          name: '김지연',
          code: 'EMP-304',
          level: 2,
          headCount: 0,
          leader: '사원',
          description: '',
          children: [],
        },
        {
          name: '추경운',
          code: 'EMP-305',
          level: 2,
          headCount: 0,
          leader: '사원',
          description: '',
          children: [],
        },
        {
          name: '자동화개발팀',
          code: 'ORG-310',
          level: 2,
          headCount: 5,
          leader: '',
          description: '자동화 솔루션 개발',
          children: [
            { name: '김준하', code: 'EMP-3101', level: 3, headCount: 0, leader: '선임', description: '', children: [] },
            { name: '이유나', code: 'EMP-3102', level: 3, headCount: 0, leader: '선임', description: '', children: [] },
            { name: '유정선', code: 'EMP-3103', level: 3, headCount: 0, leader: '선임', description: '', children: [] },
            { name: '손진빈', code: 'EMP-3104', level: 3, headCount: 0, leader: '사원', description: '', children: [] },
            { name: '유예진', code: 'EMP-3105', level: 3, headCount: 0, leader: '사원', description: '', children: [] },
          ],
        },
      ],
    },
    {
      name: '기타',
      code: 'ORG-900',
      level: 1,
      headCount: 0,
      leader: '',
      description: '기타 조직',
      children: [],
    },
  ],
};

interface TreeNodeProps {
  name: string;
  code: string;
  leader: string;
  headCount: number;
  children?: Array<any>;
  level: number;
  onEdit?: (node: any) => void;
  onDelete?: () => void;
  onSelect?: (node: any) => void;
  nodeData?: any;
  selectedOrg?: any;
  parentCode?: string;
  parentName?: string;
}

function TreeNode({ name, code, leader, headCount, children = [], level, onEdit, onDelete, onSelect, nodeData, selectedOrg, parentCode, parentName }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 3);
  const hasChildren = children.length > 0;
  const isEmployee = headCount === 0 && leader;
  const [isHovered, setIsHovered] = useState(false);
  
  // 현재 노드가 선택된 노드인지 확인
  const isSelected = selectedOrg && nodeData && selectedOrg.code === nodeData.code;

  // selectedOrg의 상위 경로에 현재 노드가 포함되어 있는지 확인
  const isInSelectedPath = (node: any, selected: any): boolean => {
    if (!node || !selected) return false;
    if (node.code === selected.code) return true;
    if (node.children) {
      return node.children.some((child: any) => isInSelectedPath(child, selected));
    }
    return false;
  };

  // selectedOrg가 변경될 때 자동으로 펼치기
  useEffect(() => {
    if (selectedOrg && nodeData && hasChildren) {
      const shouldExpand = isInSelectedPath(nodeData, selectedOrg);
      if (shouldExpand && !isSelected) {
        setIsExpanded(true);
      }
    }
  }, [selectedOrg]);

  const handleClick = () => {
    // 개인이 아닌 조직만 선택 가능
    if (!isEmployee && nodeData) {
      onSelect?.(nodeData);
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors relative group cursor-pointer ${
          level === 0 ? 'bg-accent/50' : 
          isSelected ? 'bg-accent' : 'hover:bg-accent'
        }`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        <div onClick={handleToggleExpand} className="flex-shrink-0">
          {!isEmployee ? (
            hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )
          ) : (
            <div className="w-4 h-4 flex-shrink-0" />
          )}
        </div>
        
        {isEmployee ? (
          <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        ) : (
          <Building2 className={`h-4 w-4 flex-shrink-0 ${level === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={level === 0 ? 'font-semibold' : isEmployee ? 'text-sm' : ''}>{name}</span>
            {leader && <span className="text-xs text-muted-foreground">({leader})</span>}
          </div>
        </div>
        
        {headCount > 0 && (
          <Badge variant={level === 0 ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
            {headCount}명
          </Badge>
        )}

        {/* 관리 버튼 - 개인이 아닌 조직에만 표시, absolute 포지셔닝 */}
        {!isEmployee && level > 0 && (
          <div 
            className={`absolute right-2 flex gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 w-7 p-0 bg-background/95 hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.({ ...nodeData, parentCode, parentName });
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 w-7 p-0 bg-background/95 hover:bg-background text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {children
            .filter((child: any) => !(child.headCount === 0 && child.leader)) // 개인 제외 (조직만 표시)
            .map((child: any, index: number) => (
            <TreeNode
              key={child.code}
              name={child.name}
              code={child.code}
              leader={child.leader}
              headCount={child.headCount}
              children={child.children}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
              nodeData={child}
              selectedOrg={selectedOrg}
              parentCode={code}
              parentName={name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 조직 계층 통계 계산 함수
function calculateOrgStats(data: any): { total: number; byLevel: { [key: number]: number } } {
  let total = 0;
  let byLevel: { [key: number]: number } = {};

  function traverse(node: any) {
    // 개인이 아닌 조직만 카운트
    if (node.headCount > 0 || node.children?.length > 0) {
      total++;
      byLevel[node.level] = (byLevel[node.level] || 0) + 1;
    }
    
    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(data);
  return { total, byLevel };
}

// 전체 구성원 수 계산 함수
function calculateTotalHeadCount(data: any): number {
  let total = 0;

  function traverse(node: any) {
    // 개인 구성원만 카운트 (headCount가 0이고 leader가 있는 경우)
    if (node.headCount === 0 && node.leader) {
      total++;
    }
    
    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(data);
  return total;
}

interface OrganizationStructureProps {
  selectedOrganization?: any;
  onClearSelection?: () => void;
}

export function OrganizationStructure({ selectedOrganization, onClearSelection }: OrganizationStructureProps = {}) {
  console.log('OrganizationStructure rendering', selectedOrganization);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'rename' | 'delete'>('rename'); // 삭제 다이얼로그 모드
  const [orgNewName, setOrgNewName] = useState(''); // 조직명 변경 시 사용
  const [orgNewCode, setOrgNewCode] = useState(''); // 새 조직 코드
  const [orgNewCreatedDate, setOrgNewCreatedDate] = useState(''); // 새 부서 생성일
  const [orgNewDescription, setOrgNewDescription] = useState(''); // 새 조직 설명
  const [orgNewProjectName, setOrgNewProjectName] = useState(''); // 새 프로젝트명
  const [orgNewProjectPeriod, setOrgNewProjectPeriod] = useState(''); // 새 프로젝트 기간
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [parentOrgForAdd, setParentOrgForAdd] = useState<any>(null);
  const [orgData, setOrgData] = useState(organizationData);
  const [isSaving, setIsSaving] = useState(false);
  
  // 새 조직 추가 폼 데이터
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgCode, setNewOrgCode] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [newOrgParent, setNewOrgParent] = useState('');
  const [newOrgCreatedDate, setNewOrgCreatedDate] = useState('');

  // 구성원 관리 관련 state
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  // 새 구성원 추가 폼 데이터
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPosition, setNewMemberPosition] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // 프로젝트 추가 관련 state
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectPeriod, setNewProjectPeriod] = useState('');
  const [selectedProjectCode, setSelectedProjectCode] = useState('');
  
  // 전체 프로젝트 목록 (프로젝트 관리에서 가져온 데이터)
  const allProjects = [
    { code: 'PRJ-001', name: 'LG전자 스마트홈 플랫폼 고도화', client: 'LG전자', period: '2025.04.11 ~ 2025.12.31', status: '진행중', team: 'LG전자 1팀' },
    { code: 'PRJ-002', name: 'LG전자 통합 관리 시스템', client: 'LG전자', period: '2024.03 ~ 2025.06', status: '진행중', team: 'LG전자 2팀' },
    { code: 'PRJ-003', name: 'GS리테일 통합 POS 시스템 구축', client: 'GS리테일', period: '2024.02 ~ 2025.08', status: '진행중', team: 'GS리테일 1팀' },
    { code: 'PRJ-004', name: 'HDC 디지털 트윈 플랫폼', client: 'HDC현대산업개발', period: '2024.06 ~ 2025.12', status: '진행중', team: 'HDC랩스 1팀' },
    { code: 'PRJ-005', name: 'KT 알파 클라우드 마이그레이션', client: 'KT', period: '2023.11 ~ 2025.03', status: '진행중', team: 'KT 알파1팀' },
    { code: 'PRJ-006', name: '삼성전자 IoT 플랫폼 구축', client: '삼성전자', period: '2025.02 ~ 2025.10', status: '대기중', team: '' },
    { code: 'PRJ-007', name: '현대자동차 차량관제 시스템', client: '현대자동차', period: '2025.03 ~ 2025.11', status: '대기중', team: '' },
    { code: 'PRJ-008', name: 'SK하이닉스 ERP 고도화', client: 'SK하이닉스', period: '2025.05 ~ 2025.12', status: '계획중', team: '' },
    { code: 'PRJ-009', name: '롯데마트 O2O 플랫폼 구축', client: '롯데쇼핑', period: '2025.04 ~ 2025.09', status: '대기중', team: '' },
    { code: 'PRJ-010', name: 'CJ물류 통합관제 시스템', client: 'CJ대한통운', period: '2025.06 ~ 2026.01', status: '계획중', team: '' },
  ];
  
  // 프로젝트 종료일이 현재 날짜보다 이후인지 확인
  const isProjectActive = (period: string): boolean => {
    if (!period) return false;
    
    // 프로젝트 기간 형식: "2024.01.15 ~ 2025.12.31" 또는 "2024.01 ~ 2025.12"
    const match = period.match(/~\s*(\d{4})\.(\d{2})(?:\.(\d{2}))?/);
    if (!match) return false;
    
    const endYear = parseInt(match[1]);
    const endMonth = parseInt(match[2]);
    const endDay = match[3] ? parseInt(match[3]) : 31; // 일자가 없으면 월말로 간주
    
    const today = new Date();
    const endDate = new Date(endYear, endMonth - 1, endDay);
    
    // 종료일이 오늘보다 미래인 경우에만 true
    return endDate >= today;
  };
  
  // 팀이 지정되지 않고 종료일이 미래인 프로젝트 필터��
  const getUnassignedProjects = () => {
    return allProjects.filter(project => 
      (!project.team || project.team === '') && isProjectActive(project.period)
    );
  };

  // 다중 선택 관련 state
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberSearchFilter, setMemberSearchFilter] = useState('');
  
  // 구성원 제거 타입 (부서이동 / 퇴사)
  const [removeType, setRemoveType] = useState<'transfer' | 'resignation'>('transfer');
  const [targetDepartment, setTargetDepartment] = useState('');

  const stats = calculateOrgStats(orgData);
  const totalHeadCount = calculateTotalHeadCount(orgData);
  const projectTeamCount = 9; // LG전자 1,2,4팀 + GS리테일 1팀 + HDC랩스 1팀 + KT 알파1팀 + 경영지원팀 + 사업전략팀 + 자동화개발팀

  // 조직 이력에서 선택된 경우 처리
  useEffect(() => {
    if (selectedOrganization) {
      // 조직명을 기준으로 조직 찾기
      const findOrgByName = (name: string, node: any = orgData): any => {
        if (node.name === name) return node;
        if (node.children) {
          for (const child of node.children) {
            const found = findOrgByName(name, child);
            if (found) return found;
          }
        }
        return null;
      };

      const foundOrg = findOrgByName(selectedOrganization.organization);
      if (foundOrg) {
        setSelectedOrg(foundOrg);
        toast.success(`${selectedOrganization.organization}이(가) 선택되었습니다.`);
      } else {
        toast.info(`${selectedOrganization.organization}을(를) 찾을 수 없습니다. 새로 추가할 수 있습니다.`);
      }
      
      // 선택 완료 후 초기화
      if (onClearSelection) {
        onClearSelection();
      }
    }
  }, [selectedOrganization]);

  // 조직 펼침/접힘 토글 함수 (미사용)
  const toggleOrgExpanded = (orgCode: string) => {
    setExpandedOrgs(prev => ({
      ...prev,
      [orgCode]: !prev[orgCode]
    }));
  };

  // 조직 코드로 조직 찾기 함수
  const findOrgByCode = (code: string, node: any = orgData): any => {
    if (node.code === code) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findOrgByCode(code, child);
        if (found) return found;
      }
    }
    return null;
  };

  // 조직 추가 함수
  const handleAddOrganization = () => {
    if (!newOrgName || !parentOrgForAdd) {
      alert('조직명과 상위 조직을 입력해주세요.');
      return;
    }
    
    if (!newOrgCreatedDate) {
      alert('적용일을 선택해주세요.');
      return;
    }

    const newOrg = {
      name: newOrgName,
      code: newOrgCode || generateOrgCode(),
      level: parentOrgForAdd.level + 1,
      headCount: 0,
      leader: '',
      description: newOrgDescription,
      createdDate: newOrgCreatedDate,
      children: [],
    };

    // orgData에 새 조직 추가 (재귀적으로 찾아서 추가)
    const addOrgToTree = (node: any): any => {
      if (node.code === parentOrgForAdd.code) {
        return {
          ...node,
          children: [...(node.children || []), newOrg],
        };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map(addOrgToTree),
        };
      }
      return node;
    };

    const newOrgData = addOrgToTree(orgData);
    setOrgData(newOrgData);

    // parentOrgForAdd를 newOrgData에서 찾아서 selectedOrg로 설정 (항상 업데이트)
    const findUpdatedOrg = (node: any): any => {
      if (node.code === parentOrgForAdd.code) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const found = findUpdatedOrg(child);
          if (found) return found;
        }
      }
      return null;
    };

    const updatedParentOrg = findUpdatedOrg(newOrgData);
    if (updatedParentOrg) {
      setSelectedOrg(updatedParentOrg);
    }
    
    // 폼 초기화
    setNewOrgName('');
    setNewOrgCode('');
    setNewOrgDescription('');
    setNewOrgCreatedDate('');
    setParentOrgForAdd(null);
    setIsAddDialogOpen(false);
  };

  // 프로젝트 종료 여부 확인 함수
  const isProjectEnded = (projectPeriod: string): boolean => {
    if (!projectPeriod) return false;
    
    // 프로젝트 기간 형식: "2024.01 ~ 2025.12"
    const match = projectPeriod.match(/~\s*(\d{4})\.(\d{2})/);
    if (!match) return false;
    
    const endYear = parseInt(match[1]);
    const endMonth = parseInt(match[2]);
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 0-based to 1-based
    
    // 종료년���가 현재보다 작거나, 같은 년도에서 종료월이 현재보다 작으면 종료
    if (endYear < currentYear) return true;
    if (endYear === currentYear && endMonth < currentMonth) return true;
    
    return false;
  };

  // 프로젝트 추가 함수
  const handleAddProject = () => {
    if (!selectedOrg || !selectedProjectCode) return;

    // 선택한 프로젝트 정보 가져오기
    const selectedProject = allProjects.find(p => p.code === selectedProjectCode);
    if (!selectedProject) return;

    // selectedOrg에 프로젝트 정보 추가
    const updatedOrg = {
      ...selectedOrg,
      projectName: selectedProject.name,
      projectPeriod: selectedProject.period,
    };

    setSelectedOrg(updatedOrg);

    // 폼 초기화 및 다이얼로그 닫기
    setSelectedProjectCode('');
    setIsAddProjectDialogOpen(false);
  };

  // 조직 정보 업데이트 함수 (조직 상세 정보에서 저장)
  const handleUpdateOrganization = () => {
    if (!selectedOrg) return;

    // 재귀적으로 조직 데이터 업데이트 - selectedOrg의 변경사항을 orgData에 반영
    const updateOrgData = (node: any): any => {
      if (node.code === selectedOrg.code) {
        return {
          ...node,
          ...selectedOrg, // selectedOrg의 모든 변경사항(children 포함) 반영
        };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map(updateOrgData),
        };
      }
      return node;
    };

    const newOrgData = updateOrgData(orgData);
    setOrgData(newOrgData);

    // selectedOrg도 업데이트하여 조직계층구조에 반영
    // orgData에서 업데이트된 조직을 찾아서 selectedOrg에 설정
    const findUpdatedOrg = (node: any): any => {
      if (node.code === selectedOrg.code) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const found = findUpdatedOrg(child);
          if (found) return found;
        }
      }
      return null;
    };

    const updatedSelectedOrg = findUpdatedOrg(newOrgData);
    if (updatedSelectedOrg) {
      setSelectedOrg(updatedSelectedOrg);
    }

    // 토스트나 상태 메시지 대신 간단한 확인
    // 스크롤 위치 유지를 위해 alert 제거
  };

  // 조직 삭제 함수
  const handleDeleteOrganization = () => {
    if (!selectedOrg) return;

    // orgData에서 조직 삭제 (재귀적으로 찾아서 삭제)
    const deleteOrgFromTree = (node: any): any => {
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children
            .filter((child: any) => child.code !== selectedOrg.code)
            .map(deleteOrgFromTree),
        };
      }
      return node;
    };

    const newOrgData = deleteOrgFromTree(orgData);
    setOrgData(newOrgData);
    
    // 삭제 후 선택 해제
    setSelectedOrg(null);
    setIsDeleteDialogOpen(false);
    setDeleteMode('rename');
    setOrgNewName('');
  };

  // 조직 코드 자동 생성 함수
  const generateOrgCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORG-${timestamp}${random}`;
  };

  // 조직명 변경 함수 (기존 부서 삭제 후 신규 부서 생성)
  const handleRenameOrganization = () => {
    if (!selectedOrg || !orgNewName.trim()) {
      alert('새로운 조직명을 입력해주세요.');
      return;
    }

    if (!orgNewCreatedDate) {
      alert('부서 생성일을 입력해주세요.');
      return;
    }

    // 기존 조직의 구성원(children 중 개인만) 추출
    const members = selectedOrg.children?.filter((child: any) => child.headCount === 0 && child.leader) || [];

    // 새 조직 생성
    const newOrg = {
      name: orgNewName,
      code: orgNewCode,
      level: selectedOrg.level,
      headCount: selectedOrg.headCount,
      leader: '',
      description: orgNewDescription,
      createdDate: orgNewCreatedDate,
      projectName: orgNewProjectName,
      projectPeriod: orgNewProjectPeriod,
      children: members, // 구성원 유지
    };

    // orgData에서 기존 조직 삭제 후 새 조직 추가 (재귀적으로 처리)
    const replaceOrgInTree = (node: any): any => {
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map((child: any) => {
            if (child.code === selectedOrg.code) {
              return newOrg; // 기존 조직을 새 조직으로 교체
            }
            return replaceOrgInTree(child);
          }),
        };
      }
      return node;
    };

    const newOrgData = replaceOrgInTree(orgData);
    setOrgData(newOrgData);
    
    // selectedOrg도 업데이트
    const findUpdatedOrg = (node: any): any => {
      if (node.code === newOrg.code) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const found = findUpdatedOrg(child);
          if (found) return found;
        }
      }
      return null;
    };

    const updatedOrg = findUpdatedOrg(newOrgData);
    if (updatedOrg) {
      setSelectedOrg(updatedOrg);
    }
    
    setIsDeleteDialogOpen(false);
    setDeleteMode('rename');
    setOrgNewName('');
    setOrgNewCode('');
    setOrgNewCreatedDate('');
    setOrgNewDescription('');
    setOrgNewProjectName('');
    setOrgNewProjectPeriod('');
  };

  // 전체 구성원 목록 추출 (조직별로 그룹화, 팀 정보 포함)
  const getAllMembersGrouped = () => {
    const grouped: { [key: string]: any[] } = {};
    
    const traverse = (node: any, parentName: string = '', teamName: string = '') => {
      // 개인(직원)인 경우 해당 조직에 추가
      if (node.headCount === 0 && node.leader) {
        if (!grouped[parentName]) {
          grouped[parentName] = [];
        }
        grouped[parentName].push({
          ...node,
          department: parentName,
          team: teamName || parentName, // 팀 정보 추가
        });
      }
      
      // 자식 노드 탐색
      if (node.children) {
        node.children.forEach((child: any) => {
          // 조직인 경우 parentName 업데이트
          if (child.headCount > 0 || child.children?.length > 0) {
            // level 3 이상이면 팀으로 간주
            const isTeam = child.level >= 3;
            const newParentName = isTeam ? parentName : child.name;
            const newTeamName = isTeam ? child.name : teamName;
            traverse(child, newParentName || node.name, newTeamName);
          } else {
            traverse(child, parentName, teamName);
          }
        });
      }
    };
    
    traverse(orgData);
    return grouped;
  };

  // 현재 조직의 구성원 코드 목록
  const getCurrentOrgMemberCodes = () => {
    if (!selectedOrg || !selectedOrg.children) return [];
    return selectedOrg.children
      .filter((child: any) => child.headCount === 0 && child.leader)
      .map((member: any) => member.code);
  };

  // 체크박스 토글
  const toggleMemberSelection = (code: string) => {
    setSelectedMembers(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  // orgData에서 특정 조직을 찾아서 업데이트하는 헬퍼 함수
  const updateOrgInTree = (tree: any, targetCode: string, updater: (org: any) => any): any => {
    if (tree.code === targetCode) {
      return updater(tree);
    }
    
    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map((child: any) => updateOrgInTree(child, targetCode, updater))
      };
    }
    
    return tree;
  };

  // 구성원 추가 함수 (다중 선택)
  const handleAddMembers = () => {
    if (selectedMembers.length === 0 || !selectedOrg) {
      alert('구성원을 선택해주세요.');
      return;
    }

    // 선택된 구성원들을 찾아서 복사
    const allGrouped = getAllMembersGrouped();
    const membersToAdd: any[] = [];
    
    Object.values(allGrouped).forEach(members => {
      members.forEach(member => {
        if (selectedMembers.includes(member.code)) {
          membersToAdd.push({
            ...member,
            level: selectedOrg.level + 1,
          });
        }
      });
    });

    // selectedOrg의 children에 추가하고 headCount 증가
    const updatedSelectedOrg = {
      ...selectedOrg,
      children: [...(selectedOrg.children || []), ...membersToAdd],
      headCount: selectedOrg.headCount + membersToAdd.length,
    };
    setSelectedOrg(updatedSelectedOrg);

    // orgData 전체 트리에서 해당 조직 업데이트
    const updatedOrgData = updateOrgInTree(orgData, selectedOrg.code, (org: any) => ({
      ...org,
      children: [...(org.children || []), ...membersToAdd],
      headCount: org.headCount + membersToAdd.length,
    }));
    setOrgData(updatedOrgData);

    // 폼 초기화
    setSelectedMembers([]);
    setMemberSearchFilter('');
    setIsAddMemberDialogOpen(false);
  };

  // 구성원 삭제 함수
  const handleDeleteMember = () => {
    if (!selectedMember || !selectedOrg) return;

    const updatedChildren = selectedOrg.children.filter(
      (child: any) => child.code !== selectedMember.code
    );

    // selectedOrg의 children에서 제거하고 headCount 감소
    const updatedSelectedOrg = {
      ...selectedOrg,
      children: updatedChildren,
      headCount: selectedOrg.headCount - 1,
    };
    setSelectedOrg(updatedSelectedOrg);

    // orgData 전체 트리에서 해당 조직 업데이트
    const updatedOrgData = updateOrgInTree(orgData, selectedOrg.code, (org: any) => ({
      ...org,
      children: org.children.filter((child: any) => child.code !== selectedMember.code),
      headCount: org.headCount - 1,
    }));
    setOrgData(updatedOrgData);

    setIsDeleteMemberDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1>조직 구조 관리</h1>
          <p className="text-muted-foreground mt-1">조직 구조를 생성하고 관리하세요</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (open && !newOrgCode) {
            // 다이얼로그가 열릴 때 조직 코드 자동 생성
            setNewOrgCode(generateOrgCode());
            setNewOrgCreatedDate(new Date().toISOString().split('T')[0]);
          }
          if (!open) {
            // 다이얼로그가 닫힐 때 폼 초기화
            setNewOrgName('');
            setNewOrgCode('');
            setNewOrgDescription('');
            setNewOrgCreatedDate('');
            setParentOrgForAdd(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              조직 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 조직 추가</DialogTitle>
              <DialogDescription>
                {parentOrgForAdd ? `${parentOrgForAdd.name}의 하위 조직을 생성합니다` : '새로운 조직을 생성합니다'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">
                  조직명 <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="org-name" 
                  placeholder="예: LG전자 5팀" 
                  value={newOrgName} 
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className={newOrgName ? 'bg-white' : 'bg-yellow-50 border-yellow-300'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-code">조직 코드 (자동생성)</Label>
                <Input 
                  id="org-code" 
                  value={newOrgCode} 
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-created-date">
                  적용일 <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="org-created-date" 
                  type="date"
                  value={newOrgCreatedDate} 
                  onChange={(e) => setNewOrgCreatedDate(e.target.value)}
                  className={newOrgCreatedDate ? 'bg-white' : 'bg-yellow-50 border-yellow-300'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent-org">
                  상위 조직 <span className="text-destructive">*</span>
                </Label>
                {parentOrgForAdd ? (
                  <Input
                    id="parent-org"
                    value={parentOrgForAdd.name}
                    readOnly
                    className="bg-gray-100"
                    key={parentOrgForAdd.code}
                  />
                ) : (
                  <Select onValueChange={(value) => {
                    const org = findOrgByCode(value);
                    if (org) {
                      setParentOrgForAdd(org);
                    }
                  }}>
                    <SelectTrigger id="parent-org">
                      <SelectValue placeholder="상위 조직 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORG-110">STE1실</SelectItem>
                      <SelectItem value="ORG-120">STE2실</SelectItem>
                      <SelectItem value="ORG-200">경영전략실</SelectItem>
                      <SelectItem value="ORG-300">개발연구소</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Input id="description" placeholder="조직 설명" value={newOrgDescription} onChange={(e) => setNewOrgDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setNewOrgName('');
                setNewOrgCode('');
                setNewOrgDescription('');
                setNewOrgCreatedDate('');
                setParentOrgForAdd(null);
              }}>
                취소
              </Button>
              <Button 
                onClick={handleAddOrganization}
                disabled={!newOrgName.trim() || !newOrgCreatedDate}
              >
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
            {/* 조직 트리 */}
            <Card>
              <CardHeader>
                <CardTitle>조직 계층 구조</CardTitle>
                <CardDescription>조직을 클릭하여 상세 정보를 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-[600px] overflow-y-auto">
                  <TreeNode
                    key={JSON.stringify(orgData.children?.map((c: any) => c.code) || [])}
                    name={orgData.name}
                    code={orgData.code}
                    leader={orgData.leader}
                    headCount={orgData.headCount}
                    children={orgData.children}
                    level={0}
                    onEdit={(node) => {
                      setEditingOrg(node);
                      setIsEditDialogOpen(true);
                    }}
                    onDelete={() => setIsDeleteDialogOpen(true)}
                    onSelect={setSelectedOrg}
                    nodeData={orgData}
                    selectedOrg={selectedOrg}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 조직 상세 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>조직 상세 정보</CardTitle>
                <CardDescription>
                  {selectedOrg ? '선택한 조직의 상세 정보' : '조직을 선택하세요'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedOrg ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">조직 코드</label>
                        <Input value={selectedOrg.code} readOnly className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">조직명</label>
                        <Input 
                          value={selectedOrg.name} 
                          readOnly
                          className="mt-1 bg-muted/50" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-muted-foreground">인원</label>
                          <Input 
                            value={selectedOrg.headCount} 
                            onChange={(e) => setSelectedOrg({ ...selectedOrg, headCount: parseInt(e.target.value) || 0 })}
                            className="mt-1" 
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">부서생성일</label>
                          <Input 
                            type="date"
                            value={selectedOrg.createdDate || ''} 
                            readOnly
                            className="mt-1 bg-muted/50" 
                          />
                        </div>
                      </div>
                      {selectedOrg.leader && (
                        <div>
                          <label className="text-sm text-muted-foreground">리더</label>
                          <Input 
                            value={selectedOrg.leader} 
                            onChange={(e) => setSelectedOrg({ ...selectedOrg, leader: e.target.value })}
                            className="mt-1" 
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-sm text-muted-foreground">설명</label>
                        <Input 
                          value={selectedOrg.description} 
                          onChange={(e) => setSelectedOrg({ ...selectedOrg, description: e.target.value })}
                          className="mt-1" 
                        />
                      </div>

                      {/* 프로젝트 정보 표시 (STE그룹 내 프로젝트팀인 경우만) */}
                      {selectedOrg.code.startsWith('ORG-1') && selectedOrg.headCount > 0 && selectedOrg.name.includes('팀') && (
                        selectedOrg.projectName && selectedOrg.projectPeriod ? (
                          <div className="pt-4 border-t border-border space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              <h4 className="font-medium">프로젝트 정보</h4>
                              {isProjectEnded(selectedOrg.projectPeriod) ? (
                                <span className="ml-auto px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-md border border-red-200">
                                  프로젝트 종료
                                </span>
                              ) : (
                                <span className="ml-auto px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-md border border-green-200 flex items-center gap-1">
                                  <PlayCircle className="h-3 w-3" />
                                  프로젝트 진행중
                                </span>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">프로젝트명</label>
                              <Input 
                                value={selectedOrg.projectName} 
                                readOnly
                                className="mt-1 bg-muted/50" 
                              />
                            </div>
                            <div>
                              <label className="text-sm text-muted-foreground">프로젝트 기간</label>
                              <Input 
                                value={selectedOrg.projectPeriod} 
                                readOnly
                                className="mt-1 bg-muted/50" 
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="pt-4 border-t border-border">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <h4 className="font-medium">프로젝트 정보</h4>
                              </div>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4 text-center">
                              <p className="text-sm text-muted-foreground mb-3">진행중인 프로젝트가 없습니다</p>
                              <Button 
                                size="sm" 
                                onClick={() => setIsAddProjectDialogOpen(true)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                프로젝트 추가
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1" onClick={handleUpdateOrganization}>
                        <Save className="h-4 w-4 mr-2" />
                        저장
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </Button>
                    </div>

                    {/* 하위 조직 */}
                    {selectedOrg.children && selectedOrg.children.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm">하위 조직</h4>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setParentOrgForAdd(selectedOrg);
                              setIsAddDialogOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            추가
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {selectedOrg.children
                            .map((sub: any, index: number) => {
                              // 개인(직원)인지 확인: headCount가 0이고 leader가 있으면 개인
                              const isEmployee = sub.headCount === 0 && sub.leader;
                              
                              // 개인은 제외하고 조직만 표시
                              if (isEmployee) return null;
                              
                              return (
                                <div
                                  key={index}
                                  className="p-3 bg-accent/30 rounded-md flex items-center justify-between cursor-pointer hover:bg-accent/50"
                                  onClick={() => setSelectedOrg(sub)}
                                >
                                  <div>
                                    <div className="text-sm">{sub.name}</div>
                                    {sub.description && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {sub.description}
                                      </div>
                                    )}
                                  </div>
                                  <Badge variant="secondary">{sub.headCount}명</Badge>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* 구성원 */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm">구성원</h4>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setIsAddMemberDialogOpen(true)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          추가
                        </Button>
                      </div>
                      {/* 부서생성일이 오늘 이후인 경우 메시지 표시 */}
                      {selectedOrg.createdDate && new Date(selectedOrg.createdDate) > new Date(new Date().toISOString().split('T')[0]) && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-700">
                            {selectedOrg.createdDate.replace(/-/g, '.')} 인사이동 됩니다.
                          </p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {selectedOrg.children && selectedOrg.children
                          .filter((child: any) => child.headCount === 0 && child.leader)
                          .map((member: any, index: number) => (
                            <div
                              key={index}
                              className="p-3 bg-accent/30 rounded-md flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="text-sm">{member.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {member.leader}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setIsEditMemberDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-destructive"
                                  onClick={() => {
                                    // 부서생성일이 오늘 이후인 경우 바로 삭제
                                    if (selectedOrg.createdDate && new Date(selectedOrg.createdDate) > new Date(new Date().toISOString().split('T')[0])) {
                                      const updatedChildren = selectedOrg.children.filter(
                                        (child: any) => child.code !== member.code
                                      );
                                      const updatedSelectedOrg = {
                                        ...selectedOrg,
                                        children: updatedChildren,
                                        headCount: selectedOrg.headCount - 1,
                                      };
                                      setSelectedOrg(updatedSelectedOrg);
                                      const updateOrgData = (node: any): any => {
                                        if (node.code === selectedOrg.code) {
                                          return updatedSelectedOrg;
                                        }
                                        if (node.children) {
                                          return {
                                            ...node,
                                            children: node.children.map(updateOrgData)
                                          };
                                        }
                                        return node;
                                      };
                                      const updatedOrgData = updateOrgData(orgData);
                                      setOrgData(updatedOrgData);
                                      toast.success('구성원이 삭제되었습니다.');
                                    } else {
                                      setSelectedMember(member);
                                      setIsDeleteMemberDialogOpen(true);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        {(!selectedOrg.children || selectedOrg.children.filter((child: any) => child.headCount === 0 && child.leader).length === 0) && (
                          <div className="text-sm text-muted-foreground text-center py-4">
                            등록된 구성원이 없습니다
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    조직 트리에서 조직을 선택하면 상세 정보가 표시됩니다
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>조직 수정</DialogTitle>
            <DialogDescription>
              조직 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-org-name">조직명</Label>
              <Input 
                id="edit-org-name" 
                defaultValue={editingOrg?.name || ''} 
                key={editingOrg?.code}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-org-code">조직 코드</Label>
              <Input 
                id="edit-org-code" 
                defaultValue={editingOrg?.code || ''} 
                readOnly 
                key={`code-${editingOrg?.code}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">설명</Label>
              <Input 
                id="edit-description" 
                defaultValue={editingOrg?.description || ''} 
                key={`desc-${editingOrg?.code}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-parent-org">상위 조직</Label>
              <Input
                id="edit-parent-org"
                defaultValue={editingOrg?.parentName || ''}
                readOnly
                key={`parent-name-${editingOrg?.code}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setDeleteMode('rename');
          setOrgNewName('');
          setOrgNewCode('');
          setOrgNewCreatedDate('');
          setOrgNewDescription('');
          setOrgNewProjectName('');
          setOrgNewProjectPeriod('');
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>조직 관리</DialogTitle>
            <DialogDescription>
              부서명을 변경하거나 조직을 삭제할 수 있습니다.
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
                // 신규 부서 생성을 위한 초기값 설정
                setOrgNewName('');
                setOrgNewCode(generateOrgCode());
                setOrgNewCreatedDate(new Date().toISOString().split('T')[0]);
                setOrgNewDescription(selectedOrg?.description || '');
                setOrgNewProjectName(selectedOrg?.projectName || '');
                setOrgNewProjectPeriod(selectedOrg?.projectPeriod || '');
              }}
            >
              부서명 변경
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                deleteMode === 'delete'
                  ? 'border-b-2 border-destructive text-destructive'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setDeleteMode('delete')}
            >
              조직 삭제
            </button>
          </div>

          {/* 내용 영역 */}
          <div className="py-4">
            {deleteMode === 'rename' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm flex-1">
                      <p className="font-medium text-blue-900 mb-1">부서명 변경 (신규 부서 생성)</p>
                      <p className="text-blue-700 mb-2">
                        기존 부서: <span className="font-semibold">{selectedOrg?.name}</span> ({selectedOrg?.code})
                      </p>
                      <p className="text-xs text-blue-600">
                        ※ 기존 부서는 삭제되고 신규 부서로 생성됩니다. 조직원은 자동으로 이동됩니다.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      조직명 <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        orgNewName ? 'bg-white' : 'bg-yellow-50 border-yellow-300'
                      }`}
                      placeholder="새로운 부서명을 입력하세요"
                      value={orgNewName}
                      onChange={(e) => setOrgNewName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">조직 코드 (자동생성)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      value={orgNewCode}
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      부서 생성일 <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        orgNewCreatedDate ? 'bg-white' : 'bg-yellow-50 border-yellow-300'
                      }`}
                      value={orgNewCreatedDate}
                      onChange={(e) => setOrgNewCreatedDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">설명</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="조직 설명"
                      value={orgNewDescription}
                      onChange={(e) => setOrgNewDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">프로젝트명</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="프로젝트명"
                    value={orgNewProjectName}
                    onChange={(e) => setOrgNewProjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">프로젝트 기간</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 2025.01 ~ 2025.12"
                    value={orgNewProjectPeriod}
                    onChange={(e) => setOrgNewProjectPeriod(e.target.value)}
                  />
                </div>

                {/* 조직원 목록 표시 */}
                {selectedOrg?.children?.filter((child: any) => child.headCount === 0 && child.leader).length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">유지되는 조직원</label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
                      <div className="space-y-1">
                        {selectedOrg.children
                          .filter((child: any) => child.headCount === 0 && child.leader)
                          .map((member: any) => (
                            <div key={member.code} className="flex items-center gap-2 text-sm">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span>{member.name}</span>
                              <span className="text-muted-foreground">({member.leader})</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive mb-1">경고</p>
                      <p className="text-muted-foreground">
                        조직을 삭제하면 하위 조직과 인원 배치 정보가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    삭제할 조직: <span className="font-semibold text-foreground">{selectedOrg?.name}</span>
                  </p>
                  {selectedOrg?.children && selectedOrg.children.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      하위 조직: <span className="font-semibold text-foreground">{selectedOrg.children.length}개</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false);
              setDeleteMode('rename');
              setOrgNewName('');
              setOrgNewCode('');
              setOrgNewCreatedDate('');
              setOrgNewDescription('');
              setOrgNewProjectName('');
              setOrgNewProjectPeriod('');
            }}>
              취소
            </Button>
            {deleteMode === 'rename' ? (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleRenameOrganization}
                disabled={!orgNewName.trim() || !orgNewCreatedDate}
              >
                <Building2 className="h-4 w-4 mr-2" />
                신규 부서 생성
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={handleDeleteOrganization}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 구성원 추가 Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>구성원 추가</DialogTitle>
            <DialogDescription>
              {selectedOrg?.name}에 구성원을 추가합니다. 조직별로 구성원을 선택하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto flex-1 min-h-0">
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
                  {(() => {
                    const allGrouped = getAllMembersGrouped();
                    const selectedMemberDetails: any[] = [];
                    Object.values(allGrouped).forEach(members => {
                      members.forEach((member: any) => {
                        if (selectedMembers.includes(member.code)) {
                          selectedMemberDetails.push(member);
                        }
                      });
                    });
                    return selectedMemberDetails.map((member: any) => (
                      <Badge 
                        key={member.code} 
                        variant="secondary" 
                        className="gap-1 pr-1"
                      >
                        <span>{member.name}</span>
                        <span className="text-xs text-muted-foreground">({member.leader})</span>
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
                .filter(([dept]) => dept !== selectedOrg?.name) // 현재 조직 제외
                .map(([dept, members]) => {
                  const currentOrgMemberCodes = getCurrentOrgMemberCodes();
                  const filteredMembers = members.filter((member: any) => {
                    // 이미 현재 조직에 속한 구성원은 제외
                    if (currentOrgMemberCodes.includes(member.code)) return false;
                    
                    // 검색 필터 적용
                    if (memberSearchFilter) {
                      return (
                        member.name.toLowerCase().includes(memberSearchFilter.toLowerCase()) ||
                        member.leader.toLowerCase().includes(memberSearchFilter.toLowerCase()) ||
                        (member.team && member.team.toLowerCase().includes(memberSearchFilter.toLowerCase()))
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
                          const teamGrouped: { [key: string]: any[] } = {};
                          filteredMembers.forEach((member: any) => {
                            const teamName = member.team || dept;
                            if (!teamGrouped[teamName]) {
                              teamGrouped[teamName] = [];
                            }
                            teamGrouped[teamName].push(member);
                          });

                          return Object.entries(teamGrouped).map(([teamName, teamMembers]) => (
                            <div key={teamName} className="border-b border-border last:border-b-0">
                              {/* 팀 헤더 */}
                              <div className="px-6 py-2 bg-muted/50 flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm font-medium text-muted-foreground">{teamName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {teamMembers.length}명
                                </Badge>
                              </div>
                              
                              {/* 구성원 목록 */}
                              <div className="divide-y divide-border">
                                {teamMembers.map((member: any) => {
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
                                          {member.leader}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  );
                })}
              
              {Object.entries(getAllMembersGrouped()).filter(([dept]) => dept !== selectedOrg?.name).length === 0 && (
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
            }}>
              취소
            </Button>
            <Button onClick={handleAddMembers} disabled={selectedMembers.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              {selectedMembers.length}명 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 구성원 수정 Dialog */}
      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>구성원 수정</DialogTitle>
            <DialogDescription>
              구성원 정보를 수정합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-member-name">이름</Label>
              <Input 
                id="edit-member-name" 
                value={selectedMember?.name || ''}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-member-position">직급</Label>
              <Select defaultValue={selectedMember?.leader || ''} key={`position-${selectedMember?.code}`}>
                <SelectTrigger id="edit-member-position">
                  <SelectValue placeholder="직급 선택" />
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMemberDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsEditMemberDialogOpen(false)}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 구성원 삭제 Dialog */}
      <Dialog open={isDeleteMemberDialogOpen} onOpenChange={(open) => {
        setIsDeleteMemberDialogOpen(open);
        if (!open) {
          setRemoveType('transfer');
          setTargetDepartment('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>구성원 제거</DialogTitle>
            <DialogDescription>
              {selectedMember?.name} 구성원을 제거합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>제거 유형</Label>
              <div className="space-y-2">
                <div 
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    removeType === 'transfer' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setRemoveType('transfer')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    removeType === 'transfer' 
                      ? 'border-primary' 
                      : 'border-muted-foreground'
                  }`}>
                    {removeType === 'transfer' && (
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">부서 이동</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      다른 부서로 이동합니다
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    removeType === 'resignation' 
                      ? 'border-destructive bg-destructive/5' 
                      : 'border-border hover:border-destructive/50'
                  }`}
                  onClick={() => setRemoveType('resignation')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    removeType === 'resignation' 
                      ? 'border-destructive' 
                      : 'border-muted-foreground'
                  }`}>
                    {removeType === 'resignation' && (
                      <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">퇴사</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      조직에서 완전히 제거합니다
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {removeType === 'transfer' && (
              <div className="space-y-2">
                <Label htmlFor="target-department">이동할 부서</Label>
                <Select value={targetDepartment} onValueChange={setTargetDepartment}>
                  <SelectTrigger 
                    id="target-department"
                    className={!targetDepartment ? 'bg-yellow-50 border-yellow-300' : ''}
                  >
                    <SelectValue placeholder="부서 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ste1">STE1실</SelectItem>
                    <SelectItem value="ste2">STE2실</SelectItem>
                    <SelectItem value="management">경영전략실</SelectItem>
                    <SelectItem value="rd">개발연구소</SelectItem>
                    <SelectItem value="lg1">LG전자 1팀</SelectItem>
                    <SelectItem value="lg2">LG전자 2팀</SelectItem>
                    <SelectItem value="lg4">LG전자 4팀</SelectItem>
                    <SelectItem value="gs">GS리테일 1팀</SelectItem>
                    <SelectItem value="hdc">HDC랩스 1팀</SelectItem>
                    <SelectItem value="kt">KT 알파1팀</SelectItem>
                    <SelectItem value="etc">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {removeType === 'resignation' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive mb-1">경고</p>
                    <p className="text-muted-foreground">
                      퇴사 처리 시 모든 조직에서 제거됩니다. 이 작업은 되돌릴 수 없습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDeleteMemberDialogOpen(false);
              setRemoveType('transfer');
              setTargetDepartment('');
            }}>
              취소
            </Button>
            <Button 
              variant={removeType === 'resignation' ? 'destructive' : 'default'}
              onClick={handleDeleteMember}
              disabled={removeType === 'transfer' && !targetDepartment}
            >
              {removeType === 'transfer' ? (
                <>
                  <GitBranch className="h-4 w-4 mr-2" />
                  부서 이동
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  퇴사 처리
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로젝트 추가 Dialog */}
      <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>프로젝트 추가</DialogTitle>
            <DialogDescription>
              {selectedOrg?.name}에 연결할 프로젝트를 선택하세요 (실/팀 지정 안된 프로젝트만 표시)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {getUnassignedProjects().length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {getUnassignedProjects().map((project) => (
                  <div
                    key={project.code}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProjectCode === project.code
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedProjectCode(project.code)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{project.code}</Badge>
                          <Badge 
                            className={
                              project.status === '진행중' ? 'bg-blue-500' :
                              project.status === '대기중' ? 'bg-yellow-500' :
                              project.status === '계획중' ? 'bg-gray-500' :
                              'bg-green-500'
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">{project.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {project.client}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.period}
                          </div>
                        </div>
                      </div>
                      {selectedProjectCode === project.code && (
                        <div className="ml-2">
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <svg className="h-3 w-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>팀에 연결할 수 있는 프로젝트가 없습니다.</p>
                <p className="text-xs mt-1">모든 프로젝트가 이미 팀에 배정되었습니다.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedProjectCode('');
              setIsAddProjectDialogOpen(false);
            }}>
              취소
            </Button>
            <Button 
              onClick={handleAddProject}
              disabled={!selectedProjectCode}
            >
              <Plus className="h-4 w-4 mr-2" />
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}