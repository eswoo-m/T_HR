import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Settings, Plus, Save, RotateCcw, Calendar, Edit, X, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
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

interface CodeItem {
  id: string;
  code: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  createdDate: string;
  updatedDate?: string;
}

interface CodeCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate?: string;
}

export function CodeManagement() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState<string>('code-management');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CodeItem | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CodeCategory | null>(null);
  
  // 코드 유형 목록
  const [categories, setCategories] = useState<CodeCategory[]>([
    { id: 'CAT-001', categoryCode: 'POSITION', categoryName: '직급', description: '직급 코드 (사원, 선임, 책임, 수석)', isActive: true, createdDate: '2020.01.15' },
    { id: 'CAT-002', categoryCode: 'ROLE', categoryName: '직책', description: '직책 코드 (파트장, 팀장, 실장, 이사)', isActive: true, createdDate: '2020.01.15' },
    { id: 'CAT-003', categoryCode: 'DEPT', categoryName: '부서', description: '부서 코드', isActive: true, createdDate: '2020.01.15' },
    { id: 'CAT-004', categoryCode: 'PHASE', categoryName: '프로젝트 단계', description: '프로젝트 진행 단계', isActive: true, createdDate: '2020.01.15' },
    { id: 'CAT-005', categoryCode: 'ASSET_STATUS', categoryName: '자산 상태', description: '자산 상태 코드', isActive: true, createdDate: '2020.01.15' },
    { id: 'CAT-006', categoryCode: 'CERTIFICATE', categoryName: '자격증', description: '자격증 분류 코드', isActive: true, createdDate: '2020.01.15' },
    { id: 'CAT-007', categoryCode: 'TOOL_TYPE', categoryName: '사용도구 유형', description: '프로젝트 사용도구 분류', isActive: true, createdDate: '2024.12.29' },
  ]);

  // 선택된 코드 유형
  const [selectedCategory, setSelectedCategory] = useState<string>('CAT-001');

  // 전체 코드 데이터 (카테고리별로 분류)
  const [allCodes, setAllCodes] = useState<{ [key: string]: CodeItem[] }>({
    'CAT-001': [
      { id: 'POS-001', code: 'EMP', name: '사원', description: '일반 사원급', order: 1, isActive: true, createdDate: '2020.01.15' },
      { id: 'POS-002', code: 'SEN', name: '선임', description: '선임급', order: 2, isActive: true, createdDate: '2020.01.15' },
      { id: 'POS-003', code: 'MGR', name: '책임', description: '책임급', order: 3, isActive: true, createdDate: '2020.01.15' },
      { id: 'POS-004', code: 'EXP', name: '수석', description: '수석급', order: 4, isActive: true, createdDate: '2020.01.15' },
    ],
    'CAT-002': [
      { id: 'ROL-001', code: 'PART', name: '파트장', description: '파트 관리 책임자', order: 1, isActive: true, createdDate: '2020.01.15' },
      { id: 'ROL-002', code: 'TEAM', name: '팀장', description: '팀 관리 책임자', order: 2, isActive: true, createdDate: '2020.01.15' },
      { id: 'ROL-003', code: 'EXEC', name: '실장', description: '실 관리 책임자', order: 3, isActive: true, createdDate: '2020.01.15' },
      { id: 'ROL-004', code: 'DIR', name: '이사', description: '이사급', order: 4, isActive: true, createdDate: '2020.01.15' },
    ],
    'CAT-003': [
      { id: 'DEPT-001', code: 'STE1', name: 'STE1실', description: 'STE1 실무조직', order: 1, isActive: true, createdDate: '2020.01.15' },
      { id: 'DEPT-002', code: 'STE2', name: 'STE2실', description: 'STE2 실무조직', order: 2, isActive: true, createdDate: '2020.01.15' },
      { id: 'DEPT-003', code: 'MGMT', name: '경영전략실', description: '경영전략 실무조직', order: 3, isActive: true, createdDate: '2020.01.15' },
      { id: 'DEPT-004', code: 'RND', name: '개발연구소', description: '개발 및 연구조직', order: 4, isActive: true, createdDate: '2020.01.15' },
      { id: 'DEPT-005', code: 'STEGRP', name: 'STE그룹', description: 'STE 그룹조직', order: 5, isActive: true, createdDate: '2020.01.15' },
    ],
    'CAT-004': [
      { id: 'PHS-001', code: 'INIT', name: '착수', description: '프로젝트 착수 단계', order: 1, isActive: true, createdDate: '2020.01.15' },
      { id: 'PHS-002', code: 'ANAL', name: '테스트 분석', description: '테스트 분석 단계', order: 2, isActive: true, createdDate: '2020.01.15' },
      { id: 'PHS-003', code: 'DESN', name: '테스트 설계', description: '테스트 설계 단계', order: 3, isActive: true, createdDate: '2020.01.15' },
      { id: 'PHS-004', code: 'IMPL', name: '테스트 구현', description: '테스트 구현 단계', order: 4, isActive: true, createdDate: '2020.01.15' },
      { id: 'PHS-005', code: 'EXEC', name: '테스트 수행', description: '테스트 수행 단계', order: 5, isActive: true, createdDate: '2020.01.15' },
      { id: 'PHS-006', code: 'RSLT', name: '결과 분석', description: '결과 분석 단계', order: 6, isActive: true, createdDate: '2020.01.15' },
      { id: 'PHS-007', code: 'CLOSE', name: '종료', description: '프로젝트 종료 단계', order: 7, isActive: true, createdDate: '2020.01.15' },
    ],
    'CAT-005': [
      { id: 'AST-001', code: 'AVAIL', name: '가용', description: '사용 가능한 상태', order: 1, isActive: true, createdDate: '2020.01.15' },
      { id: 'AST-002', code: 'INUSE', name: '사용중', description: '현재 사용중인 상태', order: 2, isActive: true, createdDate: '2020.01.15' },
      { id: 'AST-003', code: 'REPAIR', name: '수리중', description: '수리중인 상태', order: 3, isActive: true, createdDate: '2020.01.15' },
      { id: 'AST-004', code: 'RETIRE', name: '폐기예정', description: '폐기 예정 상태', order: 4, isActive: true, createdDate: '2020.01.15' },
    ],
    'CAT-006': [
      { id: 'CER-001', code: 'ITE', name: '정보처리기사', description: '한국산업인력공단', order: 1, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-002', code: 'ITE_ADV', name: '정보처리기술사', description: '한국산업인력공단', order: 2, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-003', code: 'PMP', name: 'PMP', description: 'Project Management Professional (PMI)', order: 3, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-004', code: 'ISTQB_FL', name: 'ISTQB Foundation Level', description: 'ISTQB 소프트웨어 테스팅 기초', order: 4, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-005', code: 'ISTQB_ADV', name: 'ISTQB Advanced Level', description: 'ISTQB 소프트웨어 테스팅 고급', order: 5, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-006', code: 'AWS_SAA', name: 'AWS Solutions Architect Associate', description: 'AWS 자격증', order: 6, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-007', code: 'AWS_DEV', name: 'AWS Developer Associate', description: 'AWS 자격증', order: 7, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-008', code: 'AWS_SAP', name: 'AWS Solutions Architect Professional', description: 'AWS 자격증', order: 8, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-009', code: 'SQLD', name: 'SQL 개발자', description: '한국데이터산업진흥원', order: 9, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-010', code: 'SQLP', name: 'SQL 전문가', description: '한국데이터산업진흥원', order: 10, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-011', code: 'TOEIC', name: 'TOEIC', description: '영어 능력 평가', order: 11, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-012', code: 'TOEFL', name: 'TOEFL', description: '영어 능력 평가', order: 12, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-013', code: 'OPIC', name: 'OPIc', description: '영어 회화 능력 평가', order: 13, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-014', code: 'CISSP', name: 'CISSP', description: '정보보안 전문가 (ISC)²', order: 14, isActive: true, createdDate: '2020.01.15' },
      { id: 'CER-015', code: 'CISA', name: 'CISA', description: '정보시스템 감사사 (ISACA)', order: 15, isActive: true, createdDate: '2020.01.15' },
    ],
    'CAT-007': [
      { id: 'TOL-001', code: 'JIRA', name: 'JIRA', description: '프로젝트 관리 도구', order: 1, isActive: true, createdDate: '2024.12.29' },
      { id: 'TOL-002', code: 'GIT', name: 'Git', description: '버전 관리 시스템', order: 2, isActive: true, createdDate: '2024.12.29' },
      { id: 'TOL-003', code: 'DOCKER', name: 'Docker', description: '컨테이너화 도구', order: 3, isActive: true, createdDate: '2024.12.29' },
      { id: 'TOL-004', code: 'KUBERNETES', name: 'Kubernetes', description: '컨테이너 오케스트레이션 시스템', order: 4, isActive: true, createdDate: '2024.12.29' },
      { id: 'TOL-005', code: 'AWS', name: 'AWS', description: '클라우드 서비스 제공자', order: 5, isActive: true, createdDate: '2024.12.29' },
      { id: 'TOL-006', code: 'GCP', name: 'GCP', description: '클라우드 서비스 제공자', order: 6, isActive: true, createdDate: '2024.12.29' },
      { id: 'TOL-007', code: 'AZURE', name: 'Azure', description: '클라우드 서비스 제공자', order: 7, isActive: true, createdDate: '2024.12.29' },
    ],
  });

  // 코드 폼 상태
  const [codeFormData, setCodeFormData] = useState({
    code: '',
    name: '',
    description: '',
    order: 1,
  });

  // 유형 폼 상태
  const [categoryFormData, setCategoryFormData] = useState({
    categoryCode: '',
    categoryName: '',
    description: '',
  });

  // 현재 선택된 카테고리의 코드들
  const getCurrentCodes = () => {
    return allCodes[selectedCategory] || [];
  };

  // 검색 필터링
  const getFilteredData = (data: CodeItem[]) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 코드 추가 다이얼로그 열기
  const handleOpenAddDialog = () => {
    setEditingItem(null);
    const currentCodes = getCurrentCodes();
    setCodeFormData({
      code: '',
      name: '',
      description: '',
      order: currentCodes.length + 1,
    });
    setIsDialogOpen(true);
  };

  // 코드 수정 다이얼로그 열기
  const handleOpenEditDialog = (item: CodeItem) => {
    setEditingItem(item);
    setCodeFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  // 코드 저장
  const handleSaveCode = () => {
    const currentCodes = getCurrentCodes();
    const selectedCat = categories.find(c => c.id === selectedCategory);

    // 필수 항목 검증
    if (!codeFormData.code.trim()) {
      toast.error('코드를 입력해주세요');
      return;
    }
    if (!codeFormData.name.trim()) {
      toast.error('코드명을 입력해주세요');
      return;
    }

    if (editingItem) {
      // 수정
      const updated = currentCodes.map(item =>
        item.id === editingItem.id
          ? { 
              ...item, 
              code: codeFormData.code.trim(),
              name: codeFormData.name.trim(), 
              description: codeFormData.description.trim(),
              order: codeFormData.order,
              updatedDate: new Date().toISOString().split('T')[0].split('-').join('.')
            }
          : item
      );
      setAllCodes({ ...allCodes, [selectedCategory]: updated });
      toast.success(`${selectedCat?.categoryName} 코드가 수정되었습니다`);
    } else {
      // 추가
      // 중복 확인
      const isDuplicateCode = currentCodes.some(item => item.code === codeFormData.code.trim());
      const isDuplicateName = currentCodes.some(item => item.name === codeFormData.name.trim());
      
      if (isDuplicateCode) {
        toast.error('이미 존재하는 코드입니다');
        return;
      }
      if (isDuplicateName) {
        toast.error('이미 존재하는 코드명입니다');
        return;
      }

      const prefix = selectedCat?.categoryCode.substring(0, 3).toUpperCase() || 'COD';
      
      const newItem: CodeItem = {
        id: `${prefix}-${String(currentCodes.length + 1).padStart(3, '0')}`,
        code: codeFormData.code.trim(),
        name: codeFormData.name.trim(),
        description: codeFormData.description.trim(),
        order: codeFormData.order,
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0].split('-').join('.'),
      };

      setAllCodes({ ...allCodes, [selectedCategory]: [...currentCodes, newItem] });
      toast.success(`${selectedCat?.categoryName} 코드가 추가되었습니다`);
    }

    setIsDialogOpen(false);
    resetCodeForm();
  };

  // 코드 상태 토글
  const handleToggleCodeStatus = (id: string) => {
    const currentCodes = getCurrentCodes();
    const selectedCat = categories.find(c => c.id === selectedCategory);
    
    const updated = currentCodes.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    setAllCodes({ ...allCodes, [selectedCategory]: updated });

    const toggledItem = currentCodes.find(item => item.id === id);
    if (toggledItem) {
      const newStatus = !toggledItem.isActive ? '활성화' : '비활성화';
      toast.success(`${toggledItem.name} 코드가 ${newStatus}되었습니다`);
    }
  };

  // 유형 추가 다이얼로그 열기
  const handleOpenAddCategoryDialog = () => {
    setEditingCategory(null);
    setCategoryFormData({
      categoryCode: '',
      categoryName: '',
      description: '',
    });
    setIsCategoryDialogOpen(true);
  };

  // 유형 수정 다이얼로그 열기
  const handleOpenEditCategoryDialog = (category: CodeCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      categoryCode: category.categoryCode,
      categoryName: category.categoryName,
      description: category.description,
    });
    setIsCategoryDialogOpen(true);
  };

  // 유형 저장
  const handleSaveCategory = () => {
    // 필수 항목 검증
    if (!categoryFormData.categoryCode.trim()) {
      toast.error('유형 코드를 입력해주세요');
      return;
    }
    if (!categoryFormData.categoryName.trim()) {
      toast.error('유형명을 입력해주세요');
      return;
    }

    if (editingCategory) {
      // 수정
      const updated = categories.map(cat =>
        cat.id === editingCategory.id
          ? {
              ...cat,
              categoryCode: categoryFormData.categoryCode.trim(),
              categoryName: categoryFormData.categoryName.trim(),
              description: categoryFormData.description.trim(),
              updatedDate: new Date().toISOString().split('T')[0].split('-').join('.')
            }
          : cat
      );
      setCategories(updated);
      toast.success('코드 유형이 수정되었습니다');
    } else {
      // 추가
      // 중복 확인
      const isDuplicateCode = categories.some(cat => cat.categoryCode === categoryFormData.categoryCode.trim());
      const isDuplicateName = categories.some(cat => cat.categoryName === categoryFormData.categoryName.trim());
      
      if (isDuplicateCode) {
        toast.error('이미 존재하는 유형 코드입니다');
        return;
      }
      if (isDuplicateName) {
        toast.error('이미 존재하는 유형명입니다');
        return;
      }

      const newCategory: CodeCategory = {
        id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
        categoryCode: categoryFormData.categoryCode.trim(),
        categoryName: categoryFormData.categoryName.trim(),
        description: categoryFormData.description.trim(),
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0].split('-').join('.'),
      };

      setCategories([...categories, newCategory]);
      // 새 카테고리의 빈 코드 배열 초기화
      setAllCodes({ ...allCodes, [newCategory.id]: [] });
      toast.success('코드 유형이 추가되었습니다');
    }

    setIsCategoryDialogOpen(false);
    resetCategoryForm();
  };

  // 유형 상태 토글
  const handleToggleCategoryStatus = (id: string) => {
    const updated = categories.map(cat =>
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    );
    setCategories(updated);

    const toggledCategory = categories.find(cat => cat.id === id);
    if (toggledCategory) {
      const newStatus = !toggledCategory.isActive ? '활성화' : '비활성화';
      toast.success(`${toggledCategory.categoryName} 유형이 ${newStatus}되었습니다`);
    }
  };

  // 코드 폼 초기화
  const resetCodeForm = () => {
    setCodeFormData({
      code: '',
      name: '',
      description: '',
      order: 1,
    });
    setEditingItem(null);
  };

  // 유형 폼 초기화
  const resetCategoryForm = () => {
    setCategoryFormData({
      categoryCode: '',
      categoryName: '',
      description: '',
    });
    setEditingCategory(null);
  };

  // 입력 필드 CSS 클래스
  const getInputClassName = (value: string, isRequired: boolean = true) => {
    if (!isRequired) return 'bg-yellow-50 border-yellow-300';
    return 'bg-yellow-50 border-yellow-300';
  };

  const selectedCat = categories.find(c => c.id === selectedCategory);
  const currentCodes = getCurrentCodes();
  const filteredCodes = getFilteredData(currentCodes);

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1>코드 관리</h1>
        <p className="text-muted-foreground mt-1">시스템에서 사용하는 공통 코드를 관리합니다</p>
      </div>

      {/* 탭 */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code-management">코드 관리</TabsTrigger>
          <TabsTrigger value="category-management">코드 유형 관리</TabsTrigger>
        </TabsList>

        {/* 코드 관리 탭 */}
        <TabsContent value="code-management" className="space-y-6">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              코드 유형을 선택하고 해당 유형의 코드를 추가, 수정, 비활성화할 수 있습니다.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div>
                  <CardTitle>코드 관리</CardTitle>
                  <CardDescription>
                    {selectedCat ? `${selectedCat.categoryName} 코드 목록 (총 ${currentCodes.length}개)` : '유형을 선택하세요'}
                  </CardDescription>
                </div>
                
                {/* 코드 유형 선택, 검색, 추가 버튼을 한 줄로 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium whitespace-nowrap">
                    코드 유형
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="코드 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat.isActive).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.categoryName} ({cat.categoryCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex-1" />
                  
                  {/* 검색 */}
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="코드, 코드명, 설명 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={handleOpenAddDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    코드 추가
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">순서</th>
                      <th className="text-left p-3">코드</th>
                      <th className="text-left p-3">코드명</th>
                      <th className="text-left p-3">설명</th>
                      <th className="text-left p-3">등록일</th>
                      <th className="text-left p-3">수정일</th>
                      <th className="text-left p-3">상태</th>
                      <th className="text-left p-3">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCodes.length > 0 ? (
                      filteredCodes
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="p-3">
                              <Badge variant="outline">{item.order}</Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant="secondary">{item.code}</Badge>
                            </td>
                            <td className="p-3 font-medium">{item.name}</td>
                            <td className="p-3 text-muted-foreground">
                              {item.description || '-'}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {item.createdDate}
                              </div>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {item.updatedDate || '-'}
                            </td>
                            <td className="p-3">
                              {item.isActive ? (
                                <Badge className="bg-green-500">사용중</Badge>
                              ) : (
                                <Badge variant="secondary">비활성</Badge>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEditDialog(item)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  수정
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleCodeStatus(item.id)}
                                >
                                  {item.isActive ? '비활성화' : '활성화'}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          {searchTerm ? '검색 결과가 없습니다' : '등록된 코드가 없습니다'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 코드 유형 관리 탭 */}
        <TabsContent value="category-management" className="space-y-6">
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              새로운 코드 유형을 추가하거나 기존 유형을 관리할 수 있습니다. 비활성화된 유형은 코드 관리에서 선택할 수 없습니다.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>코드 유형 관리</CardTitle>
                  <CardDescription>총 {categories.length}개의 코드 유형</CardDescription>
                </div>
                <Button onClick={handleOpenAddCategoryDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  유형 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">유형 코드</th>
                      <th className="text-left p-3">유형명</th>
                      <th className="text-left p-3">코드 수</th>
                      <th className="text-left p-3">등록일</th>
                      <th className="text-left p-3">수정일</th>
                      <th className="text-left p-3">상태</th>
                      <th className="text-left p-3">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => {
                      const codeCount = allCodes[category.id]?.length || 0;
                      return (
                        <tr key={category.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3">
                            <Badge variant="secondary">{category.categoryCode}</Badge>
                          </td>
                          <td className="p-3 font-medium">{category.categoryName}</td>
                          <td className="p-3">
                            <Badge variant="outline">{codeCount}개</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {category.createdDate}
                            </div>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {category.updatedDate || '-'}
                          </td>
                          <td className="p-3">
                            {category.isActive ? (
                              <Badge className="bg-green-500">사용중</Badge>
                            ) : (
                              <Badge variant="secondary">비활성</Badge>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditCategoryDialog(category)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                수정
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleCategoryStatus(category.id)}
                              >
                                {category.isActive ? '비활성화' : '활성화'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 코드 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `${selectedCat?.categoryName} 코드 수정` : `${selectedCat?.categoryName} 코드 추가`}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? '코드 정보를 수정합니다' : '새로운 코드를 추가합니다'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 코드 */}
            <div className="space-y-2">
              <label className="text-sm">
                코드
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="예: EMP, TEAM, STE1"
                value={codeFormData.code}
                onChange={(e) => setCodeFormData({ ...codeFormData, code: e.target.value.toUpperCase() })}
                className={getInputClassName(codeFormData.code)}
                disabled={!!editingItem}
              />
              <p className="text-xs text-muted-foreground">
                영문 대문자로 입력하세요 {editingItem && '(수정 불가)'}
              </p>
            </div>

            {/* 코드명 */}
            <div className="space-y-2">
              <label className="text-sm">
                코드명
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="예: 사원, 팀장, STE1실"
                value={codeFormData.name}
                onChange={(e) => setCodeFormData({ ...codeFormData, name: e.target.value })}
                className={getInputClassName(codeFormData.name)}
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <label className="text-sm">
                설명
                <Badge variant="secondary" className="text-xs ml-2">선택</Badge>
              </label>
              <Textarea
                placeholder="코드에 대한 설명을 입력하세요"
                value={codeFormData.description}
                onChange={(e) => setCodeFormData({ ...codeFormData, description: e.target.value })}
                rows={3}
                className="bg-white"
              />
            </div>

            {/* 순서 */}
            <div className="space-y-2">
              <label className="text-sm">
                표시 순서
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="number"
                min="1"
                value={codeFormData.order}
                onChange={(e) => setCodeFormData({ ...codeFormData, order: parseInt(e.target.value) || 1 })}
                className="bg-white"
              />
              <p className="text-xs text-muted-foreground">
                코드 목록에서 표시되는 순서입니다
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleSaveCode}>
              <Save className="h-4 w-4 mr-2" />
              {editingItem ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 코드 유형 추가/수정 다이얼로그 */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? '코드 유형 수정' : '코드 유형 추가'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? '유형 정보를 수정합니다' : '새로운 코드 유형을 추가합니다'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 유형 코드 */}
            <div className="space-y-2">
              <label className="text-sm">
                유형 코드
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="예: EDUCATION, SKILL, CERTIFICATE"
                value={categoryFormData.categoryCode}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, categoryCode: e.target.value.toUpperCase() })}
                className={getInputClassName(categoryFormData.categoryCode)}
                disabled={!!editingCategory}
              />
              <p className="text-xs text-muted-foreground">
                영문 대문자로 입력하세요 {editingCategory && '(수정 불가)'}
              </p>
            </div>

            {/* 유형명 */}
            <div className="space-y-2">
              <label className="text-sm">
                유형명
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="예: 학력, 기술, 자격증"
                value={categoryFormData.categoryName}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, categoryName: e.target.value })}
                className={getInputClassName(categoryFormData.categoryName)}
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <label className="text-sm">
                설명
                <Badge variant="secondary" className="text-xs ml-2">선택</Badge>
              </label>
              <Textarea
                placeholder="코드 유형에 대한 설명을 입력하세요"
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                rows={3}
                className="bg-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleSaveCategory}>
              <Save className="h-4 w-4 mr-2" />
              {editingCategory ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}