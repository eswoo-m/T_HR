import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Shield, 
  UserCog, 
  Search, 
  Filter, 
  Calendar, 
  Edit, 
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  X,
  Users,
  Building2,
  Crown,
  User,
  Lock,
  UserPlus,
  Trash2
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

// 권한 레벨 정의
type PermissionLevel = 'MASTER' | 'MANAGER' | 'USER' | 'NONE';

interface Permission {
  level: PermissionLevel;
  levelName: string;
  description: string;
  canManageUsers: boolean;
  canManageOrg: boolean;
  canManageProjects: boolean;
  canManageAssets: boolean;
  canManageCodes: boolean;
  canViewAll: boolean;
  canEditAll: boolean;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  role: string;
}

interface UserPermission {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  role: string;
  defaultPermission: PermissionLevel;
  grantedPermission: PermissionLevel;
  isActive: boolean;
  grantedDate: string;
  grantedBy: string;
  lastLoginDate?: string;
  revokedDate?: string;
  revokedBy?: string;
  reason: string;
}

interface PermissionHistory {
  id: string;
  employeeCode: string;
  employeeName: string;
  action: 'GRANT' | 'REVOKE' | 'MODIFY';
  previousLevel?: PermissionLevel;
  newLevel: PermissionLevel;
  actionDate: string;
  actionBy: string;
  reason: string;
}

// 조직도에서 직원 목록 추출 함수
function extractEmployees(orgData: any): Employee[] {
  const employees: Employee[] = [];
  let idCounter = 1;

  function traverse(node: any, dept: string) {
    // 개인(임직원) 식별: headCount가 0이고 leader가 있는 경우
    if (node.headCount === 0 && node.leader) {
      const position = getPositionFromRole(node.leader);
      employees.push({
        id: `EMP-${String(idCounter++).padStart(3, '0')}`,
        name: node.name,
        department: dept,
        position: position,
        role: node.leader,
      });
    }

    // 자식 노드 순회
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {
        // 부서/팀인 경우 dept를 업데이트하고, 개인인 경우 현재 dept 유지
        const nextDept = (child.headCount > 0 || (!child.leader && child.children)) ? child.name : dept;
        traverse(child, nextDept);
      });
    }
  }

  // 최상위 티벨에서 시작
  if (orgData.children) {
    orgData.children.forEach((child: any) => {
      traverse(child, child.name === '티벨' ? '티벨' : child.name);
    });
  }

  return employees;
}

// 직책에서 직급 추출 (간단한 매핑)
function getPositionFromRole(role: string): string {
  if (role === '대표이사' || role === '부사장' || role === '사장') return '수석';
  if (role === '실장' || role === '이사') return '책임';
  if (role === '팀장' || role === '파트장') return '책임';
  if (role === '선임') return '선임';
  return '사원';
}

export function UserManagement() {
  const [activeTab, setActiveTab] = useState<string>('user-list');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterPermission, setFilterPermission] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    permissionLevel: 'USER' as PermissionLevel,
    reason: '',
  });

  // 권한 레벨 정의
  const permissions: Record<PermissionLevel, Permission> = {
    MASTER: {
      level: 'MASTER',
      levelName: '마스터',
      description: '전사 모든 시스템 기능에 대한 전체 권한',
      canManageUsers: true,
      canManageOrg: true,
      canManageProjects: true,
      canManageAssets: true,
      canManageCodes: true,
      canViewAll: true,
      canEditAll: true,
    },
    MANAGER: {
      level: 'MANAGER',
      levelName: '매니저',
      description: '소속 부서 인력 및 프로젝트 관리 권한',
      canManageUsers: false,
      canManageOrg: false,
      canManageProjects: true,
      canManageAssets: true,
      canManageCodes: false,
      canViewAll: false,
      canEditAll: false,
    },
    USER: {
      level: 'USER',
      levelName: '사용자',
      description: '기본 조회 및 본인 정보 수정 권한',
      canManageUsers: false,
      canManageOrg: false,
      canManageProjects: false,
      canManageAssets: false,
      canManageCodes: false,
      canViewAll: false,
      canEditAll: false,
    },
    NONE: {
      level: 'NONE',
      levelName: '권한 없음',
      description: '시스템 접근 차단',
      canManageUsers: false,
      canManageOrg: false,
      canManageProjects: false,
      canManageAssets: false,
      canManageCodes: false,
      canViewAll: false,
      canEditAll: false,
    },
  };

  // 조직도 데이터 (OrganizationChart.tsx에서 가져온 것)
  const organizationData = {
    name: '티벨',
    level: 0,
    headCount: 54,
    leader: '',
    children: [
      {
        name: '김종균',
        level: 1,
        headCount: 0,
        leader: '대표이사',
        children: [],
      },
      {
        name: 'STE그룹',
        level: 1,
        headCount: 17,
        leader: '',
        children: [
          {
            name: '박성호',
            level: 2,
            headCount: 0,
            leader: '사장',
            children: [],
          },
          {
            name: '김종협',
            level: 2,
            headCount: 0,
            leader: '실장',
            children: [],
          },
          {
            name: 'STE1실',
            level: 2,
            headCount: 8,
            leader: '',
            children: [
              {
                name: '강현규',
                level: 3,
                headCount: 0,
                leader: '이사',
                children: [],
              },
              { 
                name: 'LG전자 1팀', 
                level: 3, 
                headCount: 2, 
                leader: '',
                children: [
                  { name: '전광희', level: 4, headCount: 0, leader: '팀장', children: [] },
                  { name: '정홍근', level: 4, headCount: 0, leader: '사원', children: [] },
                ]
              },
              { 
                name: 'LG전자 2팀', 
                level: 3, 
                headCount: 4, 
                leader: '',
                children: [
                  { name: '이길원', level: 4, headCount: 0, leader: '팀장', children: [] },
                  { name: '이성미', level: 4, headCount: 0, leader: '책임', children: [] },
                  { name: '조혜진', level: 4, headCount: 0, leader: '책임', children: [] },
                  { name: '이나리', level: 4, headCount: 0, leader: '선임', children: [] },
                ]
              },
              { 
                name: 'LG전자 4팀', 
                level: 3, 
                headCount: 3, 
                leader: '',
                children: [
                  { name: '박준수', level: 4, headCount: 0, leader: '책임', children: [] },
                  { name: '용상수', level: 4, headCount: 0, leader: '책임', children: [] },
                  { name: '김규현', level: 4, headCount: 0, leader: '사원', children: [] },
                ]
              },
            ],
          },
          {
            name: 'STE2실',
            level: 2,
            headCount: 8,
            leader: '',
            children: [
              { 
                name: 'GS리테일 1팀', 
                level: 3, 
                headCount: 5, 
                leader: '',
                children: [
                  { name: '조현균', level: 4, headCount: 0, leader: '팀장', children: [] },
                  { name: '조현정', level: 4, headCount: 0, leader: '책임', children: [] },
                  { name: '최현준', level: 4, headCount: 0, leader: '책임', children: [] },
                  { name: '강성희', level: 4, headCount: 0, leader: '선임', children: [] },
                  { name: '강문혁', level: 4, headCount: 0, leader: '사원', children: [] },
                ]
              },
              { 
                name: 'HDC랩스 1팀', 
                level: 3, 
                headCount: 1, 
                leader: '',
                children: [
                  { name: '장대열', level: 4, headCount: 0, leader: '선임', children: [] },
                ]
              },
              { 
                name: 'KT 알파1팀', 
                level: 3, 
                headCount: 3, 
                leader: '',
                children: [
                  { name: '윤제진', level: 4, headCount: 0, leader: '수석', children: [] },
                  { name: '신진욱', level: 4, headCount: 0, leader: '수석', children: [] },
                  { name: '이영택', level: 4, headCount: 0, leader: '책임', children: [] },
                ]
              },
            ],
          },
        ],
      },
      {
        name: '경영전략실',
        level: 1,
        headCount: 9,
        leader: '',
        children: [
          {
            name: '경영지원팀',
            level: 2,
            headCount: 5,
            leader: '',
            children: [
              { name: '김완수', level: 3, headCount: 0, leader: '부사장', children: [] },
              { name: '이현직', level: 3, headCount: 0, leader: '실장', children: [] },
              { name: '김예림', level: 3, headCount: 0, leader: '파트장', children: [] },
              { name: '가라현', level: 3, headCount: 0, leader: '사원', children: [] },
              { name: '신소영', level: 3, headCount: 0, leader: '사원', children: [] },
            ],
          },
          {
            name: '사업전략팀',
            level: 2,
            headCount: 3,
            leader: '',
            children: [
              { name: '이유라', level: 3, headCount: 0, leader: '선임', children: [] },
              { name: '주호정', level: 3, headCount: 0, leader: '사원', children: [] },
              { name: '김연서', level: 3, headCount: 0, leader: '사원', children: [] },
            ],
          },
        ],
      },
      {
        name: '개발연구소',
        level: 1,
        headCount: 10,
        leader: '',
        children: [
          {
            name: '김태영',
            level: 2,
            headCount: 0,
            leader: '부사장',
            children: [],
          },
          {
            name: '이혜진',
            level: 2,
            headCount: 0,
            leader: '이사',
            children: [],
          },
          {
            name: '우은순',
            level: 2,
            headCount: 0,
            leader: '팀장',
            children: [],
          },
          {
            name: '김지연',
            level: 2,
            headCount: 0,
            leader: '사원',
            children: [],
          },
          {
            name: '추경운',
            level: 2,
            headCount: 0,
            leader: '사원',
            children: [],
          },
          {
            name: '자동화개발팀',
            level: 2,
            headCount: 5,
            leader: '',
            children: [
              { name: '김준하', level: 3, headCount: 0, leader: '선임', children: [] },
              { name: '이유나', level: 3, headCount: 0, leader: '선임', children: [] },
              { name: '유정선', level: 3, headCount: 0, leader: '선임', children: [] },
              { name: '손진빈', level: 3, headCount: 0, leader: '사원', children: [] },
              { name: '유예진', level: 3, headCount: 0, leader: '사원', children: [] },
            ],
          },
        ],
      },
    ],
  };

  // 조직도에서 전체 직원 추출
  const allEmployees = extractEmployees(organizationData);

  // 직책별 기본 권한 계산
  const getDefaultPermission = (role: string): PermissionLevel => {
    if (role === '대표이사' || role === '사장') return 'MASTER';
    if (role === '실장' || role === '이사') return 'MANAGER';
    return 'USER';
  };

  // 특별 권한이 부여된 사용자 (기본 권한과 다른 경우)
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([
    {
      id: 'UP-001',
      employeeCode: 'EMP-012',
      employeeName: '전광희',
      department: 'STE1실',
      position: '책임',
      role: '팀장',
      defaultPermission: 'USER',
      grantedPermission: 'MANAGER',
      isActive: true,
      grantedDate: '2024.01.10',
      grantedBy: '박성호',
      lastLoginDate: '2024.12.28',
      reason: 'LG전자 1팀 프로젝트 관리 권한 부여',
    },
    {
      id: 'UP-002',
      employeeCode: 'EMP-025',
      employeeName: '김예림',
      department: '경영전략실',
      position: '책임',
      role: '파트장',
      defaultPermission: 'USER',
      grantedPermission: 'MANAGER',
      isActive: true,
      grantedDate: '2024.03.15',
      grantedBy: '이현직',
      lastLoginDate: '2024.12.29',
      reason: '경영지원팀 인사 관리 권한 부여',
    },
    {
      id: 'UP-003',
      employeeCode: 'EMP-030',
      employeeName: '김연서',
      department: '경영전략실',
      position: '사원',
      role: '사원',
      defaultPermission: 'USER',
      grantedPermission: 'NONE',
      isActive: false,
      grantedDate: '2023.05.01',
      grantedBy: '이현직',
      revokedDate: '2024.10.20',
      revokedBy: '이현직',
      reason: '휴직으로 인한 시스템 접근 차단',
    },
  ]);

  // 권한 이력
  const [permissionHistory, setPermissionHistory] = useState<PermissionHistory[]>([
    {
      id: 'PH-001',
      employeeCode: 'EMP-012',
      employeeName: '전광희',
      action: 'GRANT',
      previousLevel: 'USER',
      newLevel: 'MANAGER',
      actionDate: '2024.01.10',
      actionBy: '박성호',
      reason: 'LG전자 1팀 프로젝트 관리 권한 부여',
    },
    {
      id: 'PH-002',
      employeeCode: 'EMP-025',
      employeeName: '김예림',
      action: 'GRANT',
      previousLevel: 'USER',
      newLevel: 'MANAGER',
      actionDate: '2024.03.15',
      actionBy: '이현직',
      reason: '경영지원팀 인사 관리 권한 부여',
    },
    {
      id: 'PH-003',
      employeeCode: 'EMP-030',
      employeeName: '김연서',
      action: 'REVOKE',
      previousLevel: 'USER',
      newLevel: 'NONE',
      actionDate: '2024.10.20',
      actionBy: '이현직',
      reason: '휴직으로 인한 시스템 접근 차단',
    },
  ]);

  // 전체 사용자 목록 생성 (전체 직원 + 특별 권한 매핑)
  const getAllUsers = () => {
    return allEmployees.map(emp => {
      const defaultPerm = getDefaultPermission(emp.role);
      const specialPerm = userPermissions.find(u => u.employeeName === emp.name);
      
      if (specialPerm) {
        return {
          ...specialPerm,
          department: emp.department,
          position: emp.position,
          role: emp.role,
        };
      }
      
      // 특별 권한이 없는 경우 기본 권한 사용
      return {
        id: emp.id,
        employeeCode: emp.id,
        employeeName: emp.name,
        department: emp.department,
        position: emp.position,
        role: emp.role,
        defaultPermission: defaultPerm,
        grantedPermission: defaultPerm,
        isActive: true,
        grantedDate: '-',
        grantedBy: '-',
        reason: '기본 권한',
      } as UserPermission;
    });
  };

  // 필터링된 사용자 목록
  const getFilteredUsers = () => {
    const allUsers = getAllUsers();
    
    return allUsers.filter(user => {
      const matchSearch = 
        user.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchDept = filterDept === 'all' || user.department.includes(filterDept);
      const matchPosition = filterPosition === 'all' || user.position === filterPosition;
      
      // 권한 필터
      const matchPermission = 
        filterPermission === 'all' 
          ? true 
          : filterPermission === 'special' 
            ? user.grantedPermission !== user.defaultPermission
            : filterPermission === 'default'
              ? user.grantedPermission === user.defaultPermission
              : user.grantedPermission === filterPermission;

      return matchSearch && matchDept && matchPosition && matchPermission;
    });
  };

  // 권한 수정 다이얼로그 열기
  const handleOpenEditDialog = (user: UserPermission) => {
    const employee: Employee = {
      id: user.employeeCode,
      name: user.employeeName,
      department: user.department,
      position: user.position,
      role: user.role,
    };
    setSelectedUser(employee);
    setFormData({
      permissionLevel: user.grantedPermission,
      reason: '',
    });
    setIsDialogOpen(true);
  };

  // 권한 수정
  const handleUpdatePermission = () => {
    if (!selectedUser) return;

    if (!formData.reason.trim()) {
      toast.error('권한 변경 사유를 입력해주세요');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    const currentUser = getAllUsers().find(u => u.employeeName === selectedUser.name);
    
    if (!currentUser) return;

    const previousLevel = currentUser.grantedPermission;
    const newLevel = formData.permissionLevel;
    const defaultPerm = getDefaultPermission(selectedUser.role);

    // 기본 권한으로 되돌리는 경우 특별 권한 목록에서 제거
    if (newLevel === defaultPerm) {
      setUserPermissions(userPermissions.filter(u => u.employeeName !== selectedUser.name));
      toast.success(`${selectedUser.name}님이 기본 권한으로 변경되었습니다`);
    } else {
      // 특별 권한 부여/수정
      const existingPerm = userPermissions.find(u => u.employeeName === selectedUser.name);
      
      if (existingPerm) {
        // 기존 특별 권한 수정
        const updatedUsers = userPermissions.map(user => 
          user.employeeName === selectedUser.name
            ? {
                ...user,
                grantedPermission: newLevel,
                isActive: newLevel !== 'NONE',
                revokedDate: newLevel === 'NONE' ? currentDate : undefined,
                revokedBy: newLevel === 'NONE' ? '홍길동' : undefined,
                reason: formData.reason.trim(),
              }
            : user
        );
        setUserPermissions(updatedUsers);
      } else {
        // 새로운 특별 권한 추가
        const newUser: UserPermission = {
          id: `UP-${String(userPermissions.length + 1).padStart(3, '0')}`,
          employeeCode: selectedUser.id,
          employeeName: selectedUser.name,
          department: selectedUser.department,
          position: selectedUser.position,
          role: selectedUser.role,
          defaultPermission: defaultPerm,
          grantedPermission: newLevel,
          isActive: newLevel !== 'NONE',
          grantedDate: currentDate,
          grantedBy: '홍길동',
          reason: formData.reason.trim(),
        };
        setUserPermissions([...userPermissions, newUser]);
      }

      const actionText = newLevel === 'NONE' ? '회수' : '변경';
      toast.success(`${selectedUser.name}님의 권한이 ${actionText}되었습니다`);
    }

    // 이력 추가
    const action: 'GRANT' | 'REVOKE' | 'MODIFY' = 
      newLevel === 'NONE' ? 'REVOKE' : newLevel === defaultPerm ? 'REVOKE' : 'MODIFY';

    const newHistory: PermissionHistory = {
      id: `PH-${String(permissionHistory.length + 1).padStart(3, '0')}`,
      employeeCode: selectedUser.id,
      employeeName: selectedUser.name,
      action,
      previousLevel: previousLevel !== newLevel ? previousLevel : undefined,
      newLevel,
      actionDate: currentDate,
      actionBy: '홍길동',
      reason: formData.reason.trim(),
    };
    setPermissionHistory([newHistory, ...permissionHistory]);

    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  // 권한 레벨 뱃지 색상
  const getPermissionBadgeColor = (level: PermissionLevel) => {
    switch (level) {
      case 'MASTER':
        return 'bg-red-500';
      case 'MANAGER':
        return 'bg-orange-500';
      case 'USER':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 권한 레벨 아이콘
  const getPermissionIcon = (level: PermissionLevel) => {
    switch (level) {
      case 'MASTER':
        return <Crown className="h-3 w-3" />;
      case 'MANAGER':
        return <Building2 className="h-3 w-3" />;
      case 'USER':
        return <User className="h-3 w-3" />;
      default:
        return <Lock className="h-3 w-3" />;
    }
  };

  // 액션 뱃지 색상
  const getActionBadgeColor = (action: 'GRANT' | 'REVOKE' | 'MODIFY') => {
    switch (action) {
      case 'GRANT':
        return 'bg-green-500';
      case 'REVOKE':
        return 'bg-red-500';
      case 'MODIFY':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 액션 텍스트
  const getActionText = (action: 'GRANT' | 'REVOKE' | 'MODIFY') => {
    switch (action) {
      case 'GRANT':
        return '권한 부여';
      case 'REVOKE':
        return '권한 회수';
      case 'MODIFY':
        return '권한 변경';
      default:
        return '알 수 없음';
    }
  };

  // 입력 필드 CSS
  const getInputClassName = (value: string, isRequired: boolean = true) => {
    if (!isRequired) return 'bg-white';
    if (!value || value.trim() === '') return 'bg-yellow-50 border-yellow-300';
    return 'bg-white';
  };

  const filteredUsers = getFilteredUsers();
  const specialPermissionCount = userPermissions.filter(u => u.grantedPermission !== u.defaultPermission).length;
  const revokedUsers = userPermissions.filter(u => !u.isActive).length;

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // 부서 목록 추출
  const departments = Array.from(new Set(allEmployees.map(e => e.department)));

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1>계정관리</h1>
        <p className="text-muted-foreground mt-1">전체 사용자의 권한을 조회하고 관리합니다</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>전체 사용자</CardDescription>
            <CardTitle className="text-3xl">{allEmployees.length}명</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>특별 권한 부여</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{specialPermissionCount}명</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>권한 없음</CardDescription>
            <CardTitle className="text-3xl text-red-600">{revokedUsers}명</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user-list">사용자 권한 목록</TabsTrigger>
          <TabsTrigger value="history">권한 이력</TabsTrigger>
        </TabsList>

        {/* 사용자 권한 목록 탭 */}
        <TabsContent value="user-list" className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>기본 권한은 직책을 따릅니다.</strong> 전체 사용자 목록을 조회하고, 필요시 특별 권한을 부여할 수 있습니다.
              <br />• 대표이사/사장 → 마스터 | 실장/이사 → 매니저 | 그 외 → 사용자
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>전체 사용자 권한</CardTitle>
                    <CardDescription>전체 {allEmployees.length}명 (특별 권한 {specialPermissionCount}명)</CardDescription>
                  </div>
                </div>

                {/* 검색 및 필터 */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 검색 */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="이름, 사번, 부서 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* 부서 필터 */}
                  <Select value={filterDept} onValueChange={setFilterDept}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="부서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 부서</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* 직급 필터 */}
                  <Select value={filterPosition} onValueChange={setFilterPosition}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="직급 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 직급</SelectItem>
                      <SelectItem value="수석">수석</SelectItem>
                      <SelectItem value="책임">책임</SelectItem>
                      <SelectItem value="선임">선임</SelectItem>
                      <SelectItem value="사원">사원</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* 권한 필터 */}
                  <Select value={filterPermission} onValueChange={setFilterPermission}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="권한 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 권한</SelectItem>
                      <SelectItem value="special">특별 권한</SelectItem>
                      <SelectItem value="default">기본 권한</SelectItem>
                      <SelectItem value="MASTER">마스터</SelectItem>
                      <SelectItem value="MANAGER">매니저</SelectItem>
                      <SelectItem value="USER">사용자</SelectItem>
                      <SelectItem value="NONE">권한 없음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">이름</th>
                      <th className="text-left p-3">부서</th>
                      <th className="text-left p-3">직급/직책</th>
                      <th className="text-left p-3">기본 권한</th>
                      <th className="text-left p-3">부여된 권한</th>
                      <th className="text-left p-3">부여일</th>
                      <th className="text-left p-3">상태</th>
                      <th className="text-left p-3">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium whitespace-nowrap">{user.employeeName}</td>
                          <td className="p-3 text-muted-foreground whitespace-nowrap">{user.department}</td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1">
                              <Badge variant="secondary">{user.position}</Badge>
                              {user.role && user.role !== '-' && (
                                <Badge variant="outline" className="text-xs">{user.role}</Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <Badge variant="outline" className="text-xs">
                              <span className="mr-1">{getPermissionIcon(user.defaultPermission)}</span>
                              {permissions[user.defaultPermission].levelName}
                            </Badge>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <Badge className={getPermissionBadgeColor(user.grantedPermission)}>
                              <span className="mr-1">{getPermissionIcon(user.grantedPermission)}</span>
                              {permissions[user.grantedPermission].levelName}
                            </Badge>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {user.grantedDate}
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {user.isActive ? (
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                활성
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="h-3 w-3 mr-1" />
                                비활성
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditDialog(user)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              수정
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          검색 결과가 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 권한 이력 탭 */}
        <TabsContent value="history" className="space-y-6">
          <Alert>
            <History className="h-4 w-4" />
            <AlertDescription>
              특별 권한 부여, 변경, 회수 이력을 조회할 수 있습니다. 모든 이력은 감사 목적으로 보관됩니다.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>권한 변경 이력</CardTitle>
              <CardDescription>총 {permissionHistory.length}건의 이력</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">일시</th>
                      <th className="text-left p-3">사번</th>
                      <th className="text-left p-3">이름</th>
                      <th className="text-left p-3">작업</th>
                      <th className="text-left p-3">이전 권한</th>
                      <th className="text-left p-3">새 권한</th>
                      <th className="text-left p-3">작업자</th>
                      <th className="text-left p-3">사유</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionHistory.length > 0 ? (
                      permissionHistory.map((history) => (
                        <tr key={history.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {history.actionDate}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{history.employeeCode}</Badge>
                          </td>
                          <td className="p-3 font-medium">{history.employeeName}</td>
                          <td className="p-3">
                            <Badge className={getActionBadgeColor(history.action)}>
                              {getActionText(history.action)}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {history.previousLevel ? (
                              <Badge variant="outline" className="text-xs">
                                {permissions[history.previousLevel].levelName}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <Badge className={getPermissionBadgeColor(history.newLevel)}>
                              <span className="mr-1">{getPermissionIcon(history.newLevel)}</span>
                              {permissions[history.newLevel].levelName}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{history.actionBy}</td>
                          <td className="p-3 text-sm text-muted-foreground max-w-xs truncate" title={history.reason}>
                            {history.reason}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          권한 변경 이력이 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 특별 권한 수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>특별 권한 수정</DialogTitle>
            <DialogDescription>
              {selectedUser?.name}님의 특별 권한을 수정합니다
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* 사용자 정보 */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">사번:</span>
                    <span className="ml-2 font-medium">{selectedUser.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">이름:</span>
                    <span className="ml-2 font-medium">{selectedUser.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">부서:</span>
                    <span className="ml-2 font-medium">{selectedUser.department}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">직급/직책:</span>
                    <span className="ml-2 font-medium">
                      {selectedUser.position} {selectedUser.role && selectedUser.role !== '-' && `/ ${selectedUser.role}`}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground text-sm">기본 권한:</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      <span className="mr-1">{getPermissionIcon(getDefaultPermission(selectedUser.role))}</span>
                      {permissions[getDefaultPermission(selectedUser.role)].levelName}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">현재 권한:</span>
                    <Badge className={`ml-2 ${getPermissionBadgeColor(formData.permissionLevel)}`}>
                      <span className="mr-1">{getPermissionIcon(formData.permissionLevel)}</span>
                      {permissions[formData.permissionLevel].levelName}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 권한 레벨 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  새로운 권한 레벨
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select 
                  value={formData.permissionLevel} 
                  onValueChange={(value) => setFormData({ ...formData, permissionLevel: value as PermissionLevel })}
                >
                  <SelectTrigger className={getInputClassName(formData.permissionLevel)}>
                    <SelectValue placeholder="권한 레벨 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASTER">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-red-500" />
                        <span>마스터 (전체)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="MANAGER">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-orange-500" />
                        <span>매니저 (부서)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="USER">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-500" />
                        <span>사용자 (본인)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="NONE">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span>권한 없음 (접근 차단)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {permissions[formData.permissionLevel].description}
                </p>
              </div>

              {/* 변경 사유 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  변경 사유
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Textarea
                  placeholder="권한 변경 사유를 입력하세요"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className={getInputClassName(formData.reason)}
                  rows={4}
                />
              </div>

              {/* 권한 변경 시 경고 메시지 */}
              {formData.permissionLevel === 'NONE' && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    권한을 회수하면 해당 사용자는 시스템에 접근할 수 없습니다.
                  </AlertDescription>
                </Alert>
              )}

              {formData.permissionLevel === 'MASTER' && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-600">
                    최고관리자 권한은 모든 시스템 기능에 대한 전체 권한을 부여합니다. 신중하게 설정하세요.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedUser(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleUpdatePermission}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}