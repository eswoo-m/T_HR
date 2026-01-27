import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// 직원 역량정보 인터페이스
interface EmployeeCompetency {
  name: string;
  code: string;
  rank: string;
  position: string;
  department: string;
  team: string;
  // 자격증
  certifications: string[];
  // 기술 스택
  skills: string[];
  skillLevel: string; // 초급/중급/고급
}

const allEmployeeCompetencies: EmployeeCompetency[] = [
  // 대표이사
  { name: '김종균', code: 'EMP-001', rank: '임원급', position: '대표이사', department: '대표이사', team: '대표이사', certifications: ['정보처리기사', 'PMP'], skills: ['JIRA', 'Teams', 'Slack', 'Email'], skillLevel: '고급' },
  
  // STE그룹 - 사장/실장
  { name: '박성호', code: 'EMP-101', rank: '임원급', position: '사장', department: 'STE그룹', team: 'STE그룹', certifications: ['정보처리기사', 'PMP'], skills: ['JIRA', 'Mantis', 'Teams', 'Slack'], skillLevel: '고급' },
  { name: '김종협', code: 'EMP-102', rank: '임원급', position: '실장', department: 'STE그룹', team: 'STE그룹', certifications: ['정보처리기사'], skills: ['JIRA', 'Redmine', 'Teams', 'Email'], skillLevel: '고급' },
  
  // STE1실 - 이사
  { name: '강현규', code: 'EMP-111', rank: '임원급', position: '이사', department: 'STE1실', team: 'STE1실', certifications: ['정보처리기사', 'PMP'], skills: ['JIRA', 'Mantis', 'Teams', 'Slack'], skillLevel: '고급' },
  
  // STE1실 - LG전자 1팀
  { name: '전광희', code: 'EMP-1111', rank: '책임', position: '팀장', department: 'STE1실', team: 'LG전자 1팀', certifications: ['정보처리기사'], skills: ['JIRA', 'Redmine', 'Teams', 'Slack'], skillLevel: '중급' },
  { name: '정홍근', code: 'EMP-1112', rank: '사원', position: '사원', department: 'STE1실', team: 'LG전자 1팀', certifications: ['정보처리산업기사'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  
  // STE1실 - LG전자 2팀
  { name: '이길원', code: 'EMP-1121', rank: '책임', position: '팀장', department: 'STE1실', team: 'LG전자 2팀', certifications: ['정보처리기사', 'ISTQB'], skills: ['JIRA', 'Mantis', 'Teams', 'Slack'], skillLevel: '고급' },
  { name: '이성미', code: 'EMP-1122', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 2팀', certifications: ['정보처리기사', '컴퓨터활용능력'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '조혜진', code: 'EMP-1123', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 2팀', certifications: ['정보처리산업기사'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '이나리', code: 'EMP-1124', rank: '선임', position: '선임', department: 'STE1실', team: 'LG전자 2팀', certifications: ['컴퓨터활용능력'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  
  // STE1실 - LG전자 4팀
  { name: '박준수', code: 'EMP-1141', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 4팀', certifications: ['정보처리기사'], skills: ['JIRA', 'Teams', 'Slack'], skillLevel: '중급' },
  { name: '용상수', code: 'EMP-1142', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 4팀', certifications: [], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '김규현', code: 'EMP-1143', rank: '사원', position: '사원', department: 'STE1실', team: 'LG전자 4팀', certifications: [], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  
  // STE2실 - GS리테일 1팀
  { name: '조현균', code: 'EMP-1211', rank: '책임', position: '팀장', department: 'STE2실', team: 'GS리테일 1팀', certifications: ['정보처리기사', 'PMP'], skills: ['JIRA', 'Redmine', 'Teams', 'Slack'], skillLevel: '고급' },
  { name: '조현정', code: 'EMP-1212', rank: '책임', position: '책임', department: 'STE2실', team: 'GS리테일 1팀', certifications: ['정보처리기사'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '최현준', code: 'EMP-1213', rank: '책임', position: '책임', department: 'STE2실', team: 'GS리테일 1팀', certifications: ['정보처리기사', 'ISTQB'], skills: ['JIRA', 'Mantis', 'Teams', 'Slack'], skillLevel: '중급' },
  { name: '강성희', code: 'EMP-1214', rank: '선임', position: '선임', department: 'STE2실', team: 'GS리테일 1팀', certifications: ['컴퓨터활용능력'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '강문혁', code: 'EMP-1215', rank: '사원', position: '사원', department: 'STE2실', team: 'GS리테일 1팀', certifications: ['정보처리산업기사'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  
  // STE2실 - HDC랩스 1팀
  { name: '장대열', code: 'EMP-1221', rank: '선임', position: '선임', department: 'STE2실', team: 'HDC랩스 1팀', certifications: ['정보처리기사'], skills: ['JIRA', 'Teams', 'Slack'], skillLevel: '중급' },
  
  // STE2실 - KT 알파1팀
  { name: '윤제진', code: 'EMP-1231', rank: '수석', position: '수석', department: 'STE2실', team: 'KT 알파1팀', certifications: ['정보처리기사', 'PMP', 'ISTQB'], skills: ['JIRA', 'Mantis', 'Teams', 'Slack'], skillLevel: '고급' },
  { name: '신진욱', code: 'EMP-1232', rank: '수석', position: '수석', department: 'STE2실', team: 'KT 알파1팀', certifications: ['정보처리기사', 'ISTQB'], skills: ['JIRA', 'Teams', 'Slack'], skillLevel: '고급' },
  { name: '이영택', code: 'EMP-1233', rank: '책임', position: '책임', department: 'STE2실', team: 'KT 알파1팀', certifications: ['정보처리산업기사'], skills: ['JIRA', 'Redmine', 'Teams', 'Email'], skillLevel: '중급' },
  
  // 경영전략실 - 경영지원팀
  { name: '김완수', code: 'EMP-2101', rank: '임원급', position: '부사장', department: '경영전략실', team: '경영지원팀', certifications: ['정보처리기사'], skills: ['JIRA', 'Redmine', 'Teams', 'Slack', 'Email'], skillLevel: '고급' },
  { name: '이현직', code: 'EMP-2102', rank: '임원급', position: '실장', department: '경영전략실', team: '경영지원팀', certifications: ['정보처리기사', 'PMP'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '고급' },
  { name: '김예림', code: 'EMP-2103', rank: '선임', position: '파트장', department: '경영전략실', team: '경영지원팀', certifications: ['컴퓨터활용능력', '기타'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '가라현', code: 'EMP-2104', rank: '사원', position: '사원', department: '경영전략실', team: '경영지원팀', certifications: ['컴퓨터활용능력'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '신소영', code: 'EMP-2105', rank: '사원', position: '사원', department: '경영전략실', team: '경영지원팀', certifications: [], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  
  // 경영전략실 - 사업전략팀
  { name: '이유라', code: 'EMP-2201', rank: '선임', position: '선임', department: '경영전략실', team: '사업전략팀', certifications: ['정보처리산업기사', '컴퓨터활용능력'], skills: ['JIRA', 'Mantis', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '주호정', code: 'EMP-2202', rank: '사원', position: '사원', department: '경영전략실', team: '사업전략팀', certifications: ['컴퓨터활용능력'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '김연서', code: 'EMP-2203', rank: '사원', position: '사원', department: '경영전략실', team: '사업전략팀', certifications: [], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  
  // 개발연구소 - 본부
  { name: '김태영', code: 'EMP-301', rank: '임원급', position: '부사장', department: '개발연구소', team: '개발연구소', certifications: ['정보처리기사', 'PMP'], skills: ['JIRA', 'Teams', 'Slack', 'Email'], skillLevel: '고급' },
  { name: '이혜진', code: 'EMP-302', rank: '임원급', position: '이사', department: '개발연구소', team: '개발연구소', certifications: ['정보처리기사', 'ISTQB', '기타'], skills: ['JIRA', 'Mantis', 'Teams', 'Slack'], skillLevel: '고급' },
  { name: '우은순', code: 'EMP-303', rank: '책임', position: '팀장', department: '개발연구소', team: '개발연구소', certifications: ['정보처리기사'], skills: ['JIRA', 'Teams', 'Slack'], skillLevel: '중급' },
  { name: '김지연', code: 'EMP-304', rank: '사원', position: '사원', department: '개발연구소', team: '개발연구소', certifications: ['정보처리산업기사', 'ISTQB'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '추경운', code: 'EMP-305', rank: '사원', position: '사원', department: '개발연구소', team: '개발연구소', certifications: ['컴퓨터활용능력'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  
  // 개발연구소 - 자동화개발팀
  { name: '김준하', code: 'EMP-3101', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀', certifications: ['정보처리기사', 'ISTQB'], skills: ['JIRA', 'Teams', 'Slack'], skillLevel: '중급' },
  { name: '이유나', code: 'EMP-3102', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀', certifications: ['정보처리산업기사'], skills: ['JIRA', 'Teams', 'Slack'], skillLevel: '중급' },
  { name: '유정선', code: 'EMP-3103', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀', certifications: ['컴퓨터활용능력', '기타'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '손진빈', code: 'EMP-3104', rank: '사원', position: '사원', department: '개발연구소', team: '자동화개발팀', certifications: [], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
  { name: '유예진', code: 'EMP-3105', rank: '사원', position: '사원', department: '개발연구소', team: '자동화개발팀', certifications: ['컴퓨터활용능력'], skills: ['JIRA', 'Teams', 'Email'], skillLevel: '중급' },
];

interface HRCompetencyInfoProps {
  onEmployeeClick?: (code: string, tab?: string) => void;
}

export function HRCompetencyInfo({ onEmployeeClick }: HRCompetencyInfoProps) {
  const [deptFilter, setDeptFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');
  const [skillLevelFilter, setSkillLevelFilter] = useState('all');
  const [certFilter, setCertFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EmployeeCompetency>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 선택된 부서의 팀 목록 가져오기
  const availableTeams = useMemo(() => {
    if (deptFilter === 'all') {
      return Array.from(new Set(allEmployeeCompetencies.map(emp => emp.team))).sort();
    }
    return Array.from(new Set(allEmployeeCompetencies.filter(emp => emp.department === deptFilter).map(emp => emp.team))).sort();
  }, [deptFilter]);

  // 통합 필터링된 직원 목록
  const filteredEmployees = useMemo(() => {
    return allEmployeeCompetencies.filter(emp => {
      const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
      const matchesTeam = teamFilter === 'all' || emp.team === teamFilter;
      const matchesRank = rankFilter === 'all' || emp.rank === rankFilter;
      const matchesSkillLevel = skillLevelFilter === 'all' || emp.skillLevel === skillLevelFilter;
      const matchesCert = certFilter === 'all' || emp.certifications.includes(certFilter);
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDept && matchesTeam && matchesRank && matchesSkillLevel && matchesCert && matchesSearch;
    });
  }, [deptFilter, teamFilter, rankFilter, skillLevelFilter, certFilter, searchTerm]);

  // 정렬
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  const handleSort = (field: keyof EmployeeCompetency) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div>
        <h1>역량정보</h1>
        <p className="text-muted-foreground mt-1">전 직원의 역량정보(기술능력 및 사용가능도구)를 조회하세요</p>
      </div>

      {/* 통합 검색 필터 */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          {/* 실(부서) 선택 버튼 */}
          <div>
            <label className="text-xs mb-1.5 block text-muted-foreground">실(부서)</label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={deptFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('all');
                  setTeamFilter('all');
                }}
              >
                전체
              </Button>
              <Button
                variant={deptFilter === '대표이사' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('대표이사');
                  setTeamFilter('all');
                }}
              >
                대표이사
              </Button>
              <Button
                variant={deptFilter === 'STE그룹' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('STE그룹');
                  setTeamFilter('all');
                }}
              >
                STE그룹
              </Button>
              <Button
                variant={deptFilter === 'STE1실' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('STE1실');
                  setTeamFilter('all');
                }}
              >
                STE1실
              </Button>
              <Button
                variant={deptFilter === 'STE2실' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('STE2실');
                  setTeamFilter('all');
                }}
              >
                STE2실
              </Button>
              <Button
                variant={deptFilter === '경영전략실' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('경영전략실');
                  setTeamFilter('all');
                }}
              >
                경영전략실
              </Button>
              <Button
                variant={deptFilter === '개발연구소' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('개발연구소');
                  setTeamFilter('all');
                }}
              >
                개발연구소
              </Button>
            </div>
          </div>

          {/* 직급 선택 버튼 */}
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
                variant={rankFilter === '임원급' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setRankFilter('임원급')}
              >
                임원급
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

          {/* 팀 선택 및 이름/사번 검색 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">이름/사번 검색</label>
              <Input
                placeholder="이름 또는 사번으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* 기술수준 및 자격증 검색 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">기술레벨</label>
              <Select value={skillLevelFilter} onValueChange={setSkillLevelFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="기술레벨 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="고급">고급</SelectItem>
                  <SelectItem value="중급">중급</SelectItem>
                  <SelectItem value="초급">초급</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">자격증</label>
              <Select value={certFilter} onValueChange={setCertFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="자격증 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="정보처리기사">정보처리기사</SelectItem>
                  <SelectItem value="정보처리산업기사">정보처리산업기사</SelectItem>
                  <SelectItem value="컴퓨터활용능력">컴퓨터활용능력</SelectItem>
                  <SelectItem value="PMP">PMP</SelectItem>
                  <SelectItem value="ISTQB">ISTQB</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 검색 결과 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>검색 결과</span>
            <Badge>{sortedEmployees.length}명</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th 
                    className="text-left p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('name')}
                  >
                    이름 {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('department')}
                  >
                    부서 {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('team')}
                  >
                    팀 {sortField === 'team' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('rank')}
                  >
                    직급 {sortField === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-center p-3">기술레벨</th>
                  <th className="text-center p-3">자격증</th>
                  <th className="text-center p-3">기술 스택</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.length > 0 ? (
                  sortedEmployees.map((emp) => (
                    <tr 
                      key={emp.code} 
                      className="border-b hover:bg-accent/50 cursor-pointer" 
                      onClick={() => onEmployeeClick?.(emp.code, 'competency')}
                    >
                      <td className="p-3">{emp.name}</td>
                      <td className="text-center p-3">
                        <Badge variant="outline">{emp.department}</Badge>
                      </td>
                      <td className="text-center p-3">
                        {emp.team !== emp.department ? (
                          <Badge variant="secondary">{emp.team}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="text-center p-3">
                        <Badge variant="secondary">{emp.rank}</Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge 
                          className={
                            emp.skillLevel === '고급' ? 'bg-purple-500' :
                            emp.skillLevel === '중급' ? 'bg-blue-500' :
                            'bg-green-500'
                          }
                        >
                          {emp.skillLevel}
                        </Badge>
                      </td>
                      <td className="text-center p-3 text-xs">
                        {emp.certifications.length > 0 
                          ? <Badge variant="outline">{emp.certifications.length}개</Badge>
                          : <span className="text-muted-foreground">없음</span>
                        }
                      </td>
                      <td className="text-center p-3 text-xs">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[150px] truncate mx-auto">
                                {emp.skills.join(', ')}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{emp.skills.join(', ')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-6 text-muted-foreground">
                      검색 결과가 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}