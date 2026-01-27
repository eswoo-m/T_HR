import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, TrendingUp, TrendingDown, Activity, Briefcase, Calendar, DollarSign, Search, RotateCcw, X } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

// 개인별 공수 데이터 (34명 전체 인력)
const individualManpowerData = [
  // STE1실 - 이사 + 3개 팀
  { name: '강현규', code: 'EMP-111', department: 'STE1실', team: 'STE1실', rank: '임원급', role: '이사', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  
  // STE1실 - LG전자 1팀 (2명)
  { name: '전광희', code: 'EMP-1111', department: 'STE1실', team: 'LG전자 1팀', rank: '책임', role: '팀장', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '정홍근', code: 'EMP-1112', department: 'STE1실', team: 'LG전자 1팀', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  
  // STE1실 - LG전자 2팀 (4명)
  { name: '이길원', code: 'EMP-1121', department: 'STE1실', team: 'LG전자 2팀', rank: '책임', role: '팀장', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '이성미', code: 'EMP-1122', department: 'STE1실', team: 'LG전자 2팀', rank: '책임', role: '책임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '조혜진', code: 'EMP-1123', department: 'STE1실', team: 'LG전자 2팀', rank: '책임', role: '책임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '이나리', code: 'EMP-1124', department: 'STE1실', team: 'LG전자 2팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  
  // STE1실 - LG전자 4팀 (3명)
  { name: '박준수', code: 'EMP-1141', department: 'STE1실', team: 'LG전자 4팀', rank: '책임', role: '책임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '용상수', code: 'EMP-1142', department: 'STE1실', team: 'LG전자 4팀', rank: '책임', role: '책임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '김규현', code: 'EMP-1143', department: 'STE1실', team: 'LG전자 4팀', rank: '사원', role: '사원', 투입_정산: 0, 투입_지원: 0, 대기: 1.0, 관리: 0 },
  
  // STE2실 - GS리테일 1팀 (5명)
  { name: '조현균', code: 'EMP-1211', department: 'STE2실', team: 'GS리테일 1팀', rank: '책임', role: '팀장', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '조현정', code: 'EMP-1212', department: 'STE2실', team: 'GS리테일 1팀', rank: '책임', role: '책임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '최현준', code: 'EMP-1213', department: 'STE2실', team: 'GS리테일 1팀', rank: '책임', role: '책임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '강성희', code: 'EMP-1214', department: 'STE2실', team: 'GS리테일 1팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '강문혁', code: 'EMP-1215', department: 'STE2실', team: 'GS리테일 1팀', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  
  // STE2실 - HDC랩스 1팀 (1명)
  { name: '장대열', code: 'EMP-1221', department: 'STE2실', team: 'HDC랩스 1팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  
  // STE2실 - KT 알파1팀 (3명)
  { name: '윤제진', code: 'EMP-1231', department: 'STE2실', team: 'KT 알파1팀', rank: '수석', role: '수석', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '신진욱', code: 'EMP-1232', department: 'STE2실', team: 'KT 알파1팀', rank: '수석', role: '수석', 투입_정산: 0, 투입_지원: 1.0, 대기: 0, 관리: 0 },
  
  // 경영전략실 - 경영지원팀 (5명)
  { name: '김완수', code: 'EMP-2101', department: '경영전략실', team: '경영지원팀', rank: '임원급', role: '부사장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '이현직', code: 'EMP-2102', department: '경영전략실', team: '경영지원팀', rank: '임원급', role: '실장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '김예림', code: 'EMP-2103', department: '경영전략실', team: '경영지원팀', rank: '선임', role: '파트장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '가라현', code: 'EMP-2104', department: '경영전략실', team: '경영지원팀', rank: '사원', role: '사원', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '신소영', code: 'EMP-2105', department: '경영전략실', team: '경영지원팀', rank: '사원', role: '사원', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  
  // 경영전략실 - 사업전략팀 (3명)
  { name: '이유라', code: 'EMP-2201', department: '경영전략실', team: '사업전략팀', rank: '선임', role: '선임', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '주호정', code: 'EMP-2202', department: '경영전략실', team: '사업전략팀', rank: '사원', role: '사원', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  
  // 개발연구소 - 본부 (5명)
  { name: '김태영', code: 'EMP-301', department: '개발연구소', team: '개발연구소', rank: '임원급', role: '부사장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '이혜진', code: 'EMP-302', department: '개발연구소', team: '개발연구소', rank: '임원급', role: '이사', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '우은순', code: 'EMP-303', department: '개발연구소', team: '개발연구소', rank: '책임', role: '팀장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '김지연', code: 'EMP-304', department: '개발연구소', team: '개발연구소', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '추경운', code: 'EMP-305', department: '개발연구소', team: '개발연구소', rank: '사원', role: '원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  
  // 개발연구소 - 자동화개발팀 (5명)
  { name: '김준하', code: 'EMP-3101', department: '개발연구소', team: '자동화개발팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '이유나', code: 'EMP-3102', department: '개발연구소', team: '자동화개발팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '유정선', code: 'EMP-3103', department: '개발연구소', team: '자동화개발팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '손진빈', code: 'EMP-3104', department: '개발연구소', team: '자동화개발팀', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '유예진', code: 'EMP-3105', department: '개발연구소', team: '자동화개발팀', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
];

export function ManpowerManagement() {
  const [deptFilter, setDeptFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('all'); // 구분 필터
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedEmployee, setSelectedEmployee] = useState<typeof individualManpowerData[0] | null>(null);

  // 월별 공수 데이터 (예시)
  const getMonthlyData = (employeeCode: string) => {
    const employee = individualManpowerData.find(emp => emp.code === employeeCode);
    if (!employee) return [];
    
    // 현재 1월이므로 1월만 데이터가 있고, 나머지는 0
    return [
      { 
        month: '1월', 
        투입_정산: employee.투입_정산, 
        투입_지원: employee.투입_지원, 
        대기: employee.대기, 
        관리: employee.관리 
      },
      { month: '2월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '3월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '4월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '5월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '6월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '7월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '8월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '9월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '10월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '11월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
      { month: '12월', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 0 },
    ];
  };

  // 해당월의 기간별 공수 데이터 (예시)
  const getCurrentMonthPeriods = (employee: typeof individualManpowerData[0]) => {
    // 예시 데이터: 1월 기준
    if (employee.투입_정산 > 0) {
      return [
        { period: '2026-01-01 ~ 2026-01-31', classification: '투입_정산', manpower: 1.0, project: 'LG전자 전사 차세대 시스템 구축' },
      ];
    } else if (employee.투입_지원 > 0) {
      return [
        { period: '2026-01-01 ~ 2026-01-31', classification: '투입_지원', manpower: 1.0, project: 'KT 알파 플랫폼 유지보수' },
      ];
    } else if (employee.대기 > 0) {
      return [
        { period: '2026-01-01 ~ 2026-01-31', classification: '대기', manpower: 1.0, project: '-' },
      ];
    } else if (employee.관리 > 0) {
      return [
        { period: '2026-01-01 ~ 2026-01-31', classification: '관리', manpower: 1.0, project: '-' },
      ];
    }
    return [];
  };

  // 정렬 핸들러
  const handleSort = (field: string) => {
    if (sortField === field) {
      // 같은 필드를 클릭하면 정렬 방향 변경
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 필드를 클릭하면 해당 필드로 오름차순 정렬
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 선택된 부서의 팀 목록 가져오기
  const availableTeams = useMemo(() => {
    if (deptFilter === 'all') {
      return Array.from(new Set(individualManpowerData.map(emp => emp.team))).sort();
    }
    return Array.from(new Set(
      individualManpowerData
        .filter(emp => emp.department === deptFilter && emp.team !== emp.department) // 팀이 실과 같은 경우 제외
        .map(emp => emp.team)
    )).sort();
  }, [deptFilter]);

  // 통합 필터링된 직원 목록
  const filteredData = useMemo(() => {
    return individualManpowerData.filter(emp => {
      const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
      const matchesTeam = teamFilter === 'all' || emp.team === teamFilter;
      const matchesRank = rankFilter === 'all' || emp.rank === rankFilter;
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 구분 필터 (투입_정산, 투입_지원, 대기, 관리)
      let matchesClassification = true;
      if (classificationFilter !== 'all') {
        if (classificationFilter === '투입_정산') matchesClassification = emp.투입_정산 > 0;
        else if (classificationFilter === '투입_지원') matchesClassification = emp.투입_지원 > 0;
        else if (classificationFilter === '대기') matchesClassification = emp.대기 > 0;
        else if (classificationFilter === '관리') matchesClassification = emp.관리 > 0;
      }
      
      return matchesDept && matchesTeam && matchesRank && matchesSearch && matchesClassification;
    });
  }, [deptFilter, teamFilter, rankFilter, searchTerm, classificationFilter]);

  // 정렬된 데이터
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'department':
          aValue = a.department;
          bValue = b.department;
          break;
        case 'team':
          aValue = a.team;
          bValue = b.team;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case '투입_정산':
          aValue = a.투입_정산;
          bValue = b.투입_정산;
          break;
        case '투입_지원':
          aValue = a.투입_지원;
          bValue = b.투입_지원;
          break;
        case '대기':
          aValue = a.대기;
          bValue = b.대기;
          break;
        case '관리':
          aValue = a.관리;
          bValue = b.관리;
          break;
        case 'total':
          aValue = a.투입_정산 + a.투입_지원 + a.대기 + a.관리;
          bValue = b.투입_정산 + b.투입_지원 + b.대기 + b.관리;
          break;
        case 'rate':
          const totalA = a.투입_정산 + a.투입_지원 + a.대기 + a.관리;
          const totalB = b.투입_정산 + b.투입_지원 + b.대기 + b.관리;
          aValue = totalA > 0 ? ((a.투입_정산 + a.투입_지원) / totalA) * 100 : 0;
          bValue = totalB > 0 ? ((b.투입_정산 + b.투입_지원) / totalB) * 100 : 0;
          break;
        default:
          return 0;
      }

      // 문자열 비교
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // 숫자 비교
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // 초기화 함수
  const handleReset = () => {
    setDeptFilter('all');
    setTeamFilter('all');
    setRankFilter('all');
    setSearchTerm('');
    setClassificationFilter('all');
    setSelectedYear('2026');
    setSelectedMonth('1');
    setSortField(null);
    setSortDirection('asc');
    setSelectedEmployee(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-primary mb-2">공수현황</h1>
        <p className="text-muted-foreground">
          조직별 공수 현황을 조회하고 관리합니다.
        </p>
      </div>

      {/* 검색 및 필터 영역 */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          {/* 년월 선택 */}
          <div className="flex gap-3 items-start">
            <div className="w-32">
              <label className="text-xs mb-1.5 block text-muted-foreground">년도</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="년도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1.5 block text-muted-foreground">월</label>
              <div className="flex flex-wrap gap-1.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((month) => (
                  <Button
                    key={month}
                    variant={selectedMonth === month ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setSelectedMonth(month)}
                  >
                    {month}월
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* 실 및 팀 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">실</label>
              <Select value={deptFilter} onValueChange={(value) => {
                setDeptFilter(value);
                setTeamFilter('all');
              }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="실 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="STE1실">STE1실</SelectItem>
                  <SelectItem value="STE2실">STE2실</SelectItem>
                  <SelectItem value="경영전략실">경영전략실</SelectItem>
                  <SelectItem value="개발연구소">개발연구소</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">팀</label>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="팀 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 팀</SelectItem>
                  {availableTeams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 이름/사 검색 */}
          <div>
            <label className="text-xs mb-1.5 block text-muted-foreground">이름/사번 검색</label>
            <Input
              placeholder="이름 또는 사번으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>

          {/* 직급 및 구분 필터 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 직급 */}
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">직급</label>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant={rankFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setRankFilter('all')}
                >
                  전체
                </Button>
                <Button
                  variant={rankFilter === '수석' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setRankFilter('수석')}
                >
                  수석
                </Button>
                <Button
                  variant={rankFilter === '책임' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setRankFilter('책임')}
                >
                  책임
                </Button>
                <Button
                  variant={rankFilter === '선임' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setRankFilter('선임')}
                >
                  선임
                </Button>
                <Button
                  variant={rankFilter === '사원' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setRankFilter('사원')}
                >
                  사원
                </Button>
              </div>
            </div>

            {/* 구분 필터 */}
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">구분</label>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant={classificationFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setClassificationFilter('all')}
                >
                  전체
                </Button>
                <Button
                  variant={classificationFilter === '투입_정산' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setClassificationFilter('투입_정산')}
                >
                  투입_정산
                </Button>
                <Button
                  variant={classificationFilter === '투입_지원' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setClassificationFilter('투입_지원')}
                >
                  투입_지원
                </Button>
                <Button
                  variant={classificationFilter === '대기' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setClassificationFilter('대기')}
                >
                  대기
                </Button>
                <Button
                  variant={classificationFilter === '관리' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setClassificationFilter('관리')}
                >
                  관리
                </Button>
              </div>
            </div>
          </div>

          {/* 초기화 버튼 */}
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 개인별 공수 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>개인별 공수 현황</CardTitle>
          <CardDescription>
            총 {filteredData.length}명 (전체 {individualManpowerData.length}명)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('name')}
                  >
                    이름 {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('department')}
                  >
                    부서 {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('team')}
                  >
                    팀 {sortField === 'team' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('role')}
                  >
                    직책 {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('투입_정산')}
                  >
                    투입_정산 {sortField === '투입_정산' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('투입_지원')}
                  >
                    투입_지원 {sortField === '투입_지원' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('대기')}
                  >
                    대기 {sortField === '대기' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('관리')}
                  >
                    관리 {sortField === '관리' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('total')}
                  >
                    합계 {sortField === 'total' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-3 bg-accent/50 cursor-pointer hover:bg-accent transition-colors whitespace-nowrap"
                    onClick={() => handleSort('rate')}
                  >
                    투입률 {sortField === 'rate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((employee, index) => {
                  const total = employee.투입_정산 + employee.투입_지원 + employee.대기 + employee.관리;
                  const rate = total > 0 ? ((employee.투입_정산 + employee.투입_지원) / total) * 100 : 0;
                  
                  return (
                    <tr 
                      key={index} 
                      className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <td className="p-3 whitespace-nowrap">{employee.name}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{employee.department}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{employee.team}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap">{employee.role}</td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {employee.투입_정산.toFixed(1)}M
                        </Badge>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {employee.투입_지원.toFixed(1)}M
                        </Badge>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {employee.대기.toFixed(1)}M
                        </Badge>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {employee.관리.toFixed(1)}M
                        </Badge>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Badge variant="secondary">
                          {total.toFixed(1)}M
                        </Badge>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Badge 
                          variant={rate >= 80 ? 'default' : rate >= 60 ? 'secondary' : 'destructive'}
                        >
                          {rate.toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-accent/50">
                  <td className="p-3 whitespace-nowrap" colSpan={4}>
                    합계 ({filteredData.length}명)
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-base">
                      {filteredData.reduce((sum, emp) => sum + emp.투입_정산, 0).toFixed(1)}M
                    </Badge>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-base">
                      {filteredData.reduce((sum, emp) => sum + emp.투입_지원, 0).toFixed(1)}M
                    </Badge>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-base">
                      {filteredData.reduce((sum, emp) => sum + emp.대기, 0).toFixed(1)}M
                    </Badge>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-base">
                      {filteredData.reduce((sum, emp) => sum + emp.관리, 0).toFixed(1)}M
                    </Badge>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Badge variant="secondary" className="text-base">
                      {filteredData.reduce((sum, emp) => sum + emp.투입_정산 + emp.투입_지원 + emp.대기 + emp.관리, 0).toFixed(1)}M
                    </Badge>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Badge variant="default" className="text-base">
                      {(() => {
                        const totalManpower = filteredData.reduce((sum, emp) => sum + emp.투입_정산 + emp.투입_지원 + emp.대기 + emp.관리, 0);
                        const activeManpower = filteredData.reduce((sum, emp) => sum + emp.투입_정산 + emp.투입_지원, 0);
                        return totalManpower > 0 ? ((activeManpower / totalManpower) * 100).toFixed(1) : '0.0';
                      })()}%
                    </Badge>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 공수 산출 기준 안내 */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            공수(M/M) 산출 기준
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">1M</Badge>
            <p className="text-sm text-muted-foreground">
              = 1명 × 1개월 (Man-Month)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">예시</Badge>
            <p className="text-sm text-muted-foreground">
              투입_���산 28명 = 28M, 투입_지원 3명 = 3M
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">투입률</Badge>
            <p className="text-sm text-muted-foreground">
              = (투입_정산 + 투입_지원) ÷ 합계 × 100%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 개인별 공수 상세 팝업 */}
      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedEmployee?.name} 공수 상세</DialogTitle>
            <DialogDescription>
              {selectedYear}년 {selectedMonth}월 기준 개인별 공수 현황 및 월별 추이를 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1">
            {selectedEmployee && (
              <div className="space-y-4 mt-4 pr-2">
                {/* 기본 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      기본 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">이름</p>
                        <p>{selectedEmployee.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">사번</p>
                        <p className="text-muted-foreground">{selectedEmployee.code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">부서</p>
                        <p>{selectedEmployee.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">팀</p>
                        <p>{selectedEmployee.team}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">직급</p>
                        <Badge variant="outline">{selectedEmployee.rank}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">직책</p>
                        <Badge variant="secondary">{selectedEmployee.role}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 해당월의 기간별 공수 상세 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {selectedYear}년 {selectedMonth}월 기간별 공수 상세
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left p-2 bg-accent/50">기간</th>
                            <th className="text-left p-2 bg-accent/50">구분</th>
                            <th className="text-right p-2 bg-accent/50">공수(M)</th>
                            <th className="text-left p-2 bg-accent/50">프로젝트</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCurrentMonthPeriods(selectedEmployee).map((periodData, index) => (
                            <tr key={index} className="border-b hover:bg-accent/30">
                              <td className="p-2">{periodData.period}</td>
                              <td className="p-2">
                                <Badge 
                                  variant="outline"
                                  className={
                                    periodData.classification === '투입_정산' 
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                      : periodData.classification === '투입_지원' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : periodData.classification === '대기'
                                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                      : periodData.classification === '관리'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                      : ''
                                  }
                                >
                                  {periodData.classification}
                                </Badge>
                              </td>
                              <td className="p-2 text-right">
                                <Badge variant="secondary">{periodData.manpower.toFixed(1)}M</Badge>
                              </td>
                              <td className="p-2">{periodData.project}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}