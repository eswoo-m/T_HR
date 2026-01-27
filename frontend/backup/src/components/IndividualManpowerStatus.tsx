import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Search, Users, TrendingUp, Calendar, Briefcase, DollarSign, FileText } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Label } from './ui/label';

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
  { name: '이영택', code: 'EMP-1233', department: 'STE2실', team: 'KT 알파1팀', rank: '���임', role: '책임', 투입_정산: 0, 투입_지원: 1.0, 대기: 0, 관리: 0 },
  
  // 경영전략실 - 경영지원팀 (5명)
  { name: '김완수', code: 'EMP-2101', department: '경영전략실', team: '경영지원팀', rank: '임원급', role: '부사장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '이현직', code: 'EMP-2102', department: '경영전략실', team: '경영지원팀', rank: '임원급', role: '실장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '김예림', code: 'EMP-2103', department: '경영전략실', team: '경영지원팀', rank: '선임', role: '파트장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '가라현', code: 'EMP-2104', department: '경영전략실', team: '경영지원팀', rank: '사원', role: '사원', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '신소영', code: 'EMP-2105', department: '경영전략실', team: '경영지원팀', rank: '사원', role: '사원', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  
  // 경영전략실 - 사업전략팀 (3명)
  { name: '이유라', code: 'EMP-2201', department: '경영전략실', team: '사업전략팀', rank: '선임', role: '선임', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '주호정', code: 'EMP-2202', department: '경영전략실', team: '사업전략팀', rank: '사원', role: '사원', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '김연서', code: 'EMP-2203', department: '경영전략실', team: '사업전략팀', rank: '사원', role: '사원', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  
  // 개발연구소 - 본부 (5명)
  { name: '김태영', code: 'EMP-301', department: '개발연구소', team: '개발연구소', rank: '임원급', role: '부사장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '이혜진', code: 'EMP-302', department: '개발연구소', team: '개발연구소', rank: '임원급', role: '이사', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '우은순', code: 'EMP-303', department: '개발연구소', team: '개발연구소', rank: '책임', role: '팀장', 투입_정산: 0, 투입_지원: 0, 대기: 0, 관리: 1.0 },
  { name: '김지연', code: 'EMP-304', department: '개발연구소', team: '개발연구소', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '추경운', code: 'EMP-305', department: '개발연구소', team: '개발연구소', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  
  // 개발연구소 - 자동화개발팀 (5명)
  { name: '김준하', code: 'EMP-3101', department: '개발연구소', team: '자동화개발팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '이유나', code: 'EMP-3102', department: '개발연구소', team: '자동화개발팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '유정선', code: 'EMP-3103', department: '개발연구소', team: '자동화개발팀', rank: '선임', role: '선임', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '손진빈', code: 'EMP-3104', department: '개발연구소', team: '자동화개발팀', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
  { name: '유예진', code: 'EMP-3105', department: '개발연구소', team: '자동화개발팀', rank: '사원', role: '사원', 투입_정산: 1.0, 투입_지원: 0, 대기: 0, 관리: 0 },
];

export function IndividualManpowerStatus() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [deptFilter, setDeptFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

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

  // 필터링된 직원 목록
  const filteredData = useMemo(() => {
    return individualManpowerData.filter(emp => {
      const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
      const matchesTeam = teamFilter === 'all' || emp.team === teamFilter;
      const matchesRank = rankFilter === 'all' || emp.rank === rankFilter;
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 구분 필터
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

  // 통계 계산
  const stats = useMemo(() => {
    const totalManpower = filteredData.reduce((sum, emp) => 
      sum + emp.투입_정산 + emp.투입_지원 + emp.대기 + emp.관리, 0);
    const activeManpower = filteredData.reduce((sum, emp) => 
      sum + emp.투입_정산 + emp.투입_지원, 0);
    const rate = totalManpower > 0 ? ((activeManpower / totalManpower) * 100) : 0;

    return {
      total: filteredData.length,
      투입_정산: filteredData.reduce((sum, emp) => sum + emp.투입_정산, 0),
      투입_지원: filteredData.reduce((sum, emp) => sum + emp.투입_지원, 0),
      대기: filteredData.reduce((sum, emp) => sum + emp.대기, 0),
      관리: filteredData.reduce((sum, emp) => sum + emp.관리, 0),
      totalManpower,
      rate: rate.toFixed(1),
    };
  }, [filteredData]);

  // 선택된 직원의 상세 정보 계산
  const selectedEmployeeDetails = useMemo(() => {
    if (!selectedEmployee) return null;

    const total = selectedEmployee.투입_정산 + selectedEmployee.투입_지원 + 
                  selectedEmployee.대기 + selectedEmployee.관리;
    const rate = total > 0 ? ((selectedEmployee.투입_정산 + selectedEmployee.투입_지원) / total) * 100 : 0;

    return {
      ...selectedEmployee,
      total,
      rate: rate.toFixed(1),
    };
  }, [selectedEmployee]);

  return (
    <div className="space-y-4">
      <div>
        <h1>개인별 공수 현���</h1>
        <p className="text-muted-foreground mt-1">{selectedYear}년 {selectedMonth}월 기준 개인별 공수 상세 데이터</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              총 인원
            </CardDescription>
            <CardTitle className="text-2xl">{stats.total}명</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              투입_정산
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.투입_정산.toFixed(1)}M</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-green-600" />
              투입_지원
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.투입_지원.toFixed(1)}M</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              대기
            </CardDescription>
            <CardTitle className="text-2xl text-orange-600">{stats.대기.toFixed(1)}M</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              투입률
            </CardDescription>
            <CardTitle className="text-2xl text-primary">{stats.rate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* 좌측 검색/필터 및 직원 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 검색 및 필터 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                검색 및 필터
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* 년월 선택 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block text-muted-foreground">년도</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block text-muted-foreground">월</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(m => (
                        <SelectItem key={m} value={m}>{m}월</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 실/팀 선택 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1.5 block text-muted-foreground">실</Label>
                  <Select value={deptFilter} onValueChange={(value) => {
                    setDeptFilter(value);
                    setTeamFilter('all');
                  }}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
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
                  <Label className="text-xs mb-1.5 block text-muted-foreground">팀</Label>
                  <Select value={teamFilter} onValueChange={setTeamFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {availableTeams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 이름/사번 검색 */}
              <div>
                <Label className="text-xs mb-1.5 block text-muted-foreground">이름/사번 검색</Label>
                <Input
                  placeholder="이름 또는 사번..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>

              {/* 직급 */}
              <div>
                <Label className="text-xs mb-1.5 block text-muted-foreground">직급</Label>
                <Select value={rankFilter} onValueChange={setRankFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="수석">수석</SelectItem>
                    <SelectItem value="책임">책임</SelectItem>
                    <SelectItem value="선임">선임</SelectItem>
                    <SelectItem value="사원">사원</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 구분 */}
              <div>
                <Label className="text-xs mb-1.5 block text-muted-foreground">구분</Label>
                <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="투입_정산">투입_정산</SelectItem>
                    <SelectItem value="투입_지원">투입_지원</SelectItem>
                    <SelectItem value="대기">대기</SelectItem>
                    <SelectItem value="관리">관리</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 직원 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  직원 목록
                </span>
                <Badge variant="secondary">{filteredData.length}명</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredData.map((employee) => {
                  const total = employee.투입_정산 + employee.투입_지원 + employee.대기 + employee.관리;
                  const rate = total > 0 ? ((employee.투입_정산 + employee.투입_지원) / total) * 100 : 0;
                  const isSelected = selectedEmployee?.code === employee.code;

                  return (
                    <div
                      key={employee.code}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected ? 'bg-accent border-primary' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{employee.name}</span>
                              <Badge variant="outline" className="text-xs">{employee.rank}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {employee.code} | {employee.role !== '-' ? employee.role : ''}
                            </div>
                          </div>
                        </div>
                        <Badge variant={rate >= 80 ? 'default' : rate >= 60 ? 'secondary' : 'destructive'}>
                          {rate.toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {employee.team !== '-' ? `${employee.department} / ${employee.team}` : employee.department}
                      </div>
                    </div>
                  );
                })}
                {filteredData.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 우측 상세 정보 */}
        <div className="lg:col-span-3">
          {selectedEmployeeDetails ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {selectedEmployeeDetails.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {selectedEmployeeDetails.code} | {selectedEmployeeDetails.rank} | {selectedEmployeeDetails.role !== '-' ? selectedEmployeeDetails.role : '직책 없음'}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={parseFloat(selectedEmployeeDetails.rate) >= 80 ? 'default' : 
                            parseFloat(selectedEmployeeDetails.rate) >= 60 ? 'secondary' : 'destructive'}
                    className="text-lg px-3 py-1"
                  >
                    투입률 {selectedEmployeeDetails.rate}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 정보 */}
                <div>
                  <h3 className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4" />
                    기본 정보
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-accent/30 p-4 rounded-lg">
                    <div>
                      <Label className="text-xs text-muted-foreground">소속 실</Label>
                      <p className="mt-1">{selectedEmployeeDetails.department}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">소속 팀</Label>
                      <p className="mt-1">{selectedEmployeeDetails.team !== '-' ? selectedEmployeeDetails.team : '-'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">직급</Label>
                      <p className="mt-1">{selectedEmployeeDetails.rank}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">직책</Label>
                      <p className="mt-1">{selectedEmployeeDetails.role !== '-' ? selectedEmployeeDetails.role : '-'}</p>
                    </div>
                  </div>
                </div>

                {/* 공수 현황 */}
                <div>
                  <h3 className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4" />
                    공수(M/M) 현황
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="text-sm">투입_정산</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-semibold text-blue-700">
                          {selectedEmployeeDetails.투입_정산.toFixed(1)}M
                        </span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                          {selectedEmployeeDetails.total > 0 
                            ? ((selectedEmployeeDetails.투입_정산 / selectedEmployeeDetails.total) * 100).toFixed(0) 
                            : 0}%
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                        <span className="text-sm">투입_지원</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-semibold text-green-700">
                          {selectedEmployeeDetails.투입_지원.toFixed(1)}M
                        </span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          {selectedEmployeeDetails.total > 0 
                            ? ((selectedEmployeeDetails.투입_지원 / selectedEmployeeDetails.total) * 100).toFixed(0) 
                            : 0}%
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full" />
                        <span className="text-sm">대기</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-semibold text-orange-700">
                          {selectedEmployeeDetails.대기.toFixed(1)}M
                        </span>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                          {selectedEmployeeDetails.total > 0 
                            ? ((selectedEmployeeDetails.대기 / selectedEmployeeDetails.total) * 100).toFixed(0) 
                            : 0}%
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full" />
                        <span className="text-sm">관리</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-semibold text-red-700">
                          {selectedEmployeeDetails.관리.toFixed(1)}M
                        </span>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                          {selectedEmployeeDetails.total > 0 
                            ? ((selectedEmployeeDetails.관리 / selectedEmployeeDetails.total) * 100).toFixed(0) 
                            : 0}%
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent border-2 border-border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">합계</span>
                      </div>
                      <span className="text-3xl font-bold">
                        {selectedEmployeeDetails.total.toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>

                {/* 공수 산출 기준 */}
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    공수(M/M) 산출 기준
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• 1M = 1명 × 1개월 (Man-Month)</p>
                    <p>• 투입률 = (투입_정산 + 투입_지원) ÷ 합계 × 100%</p>
                    <p>• 기준일: {selectedYear}년 {selectedMonth}월</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-16">
                <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-lg mb-2">직원을 선택해주세요</h3>
                <p className="text-sm text-muted-foreground">
                  좌측 목록에서 직원을 선택하면 상세 공수 정보를 확인할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}