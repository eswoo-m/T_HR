import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

// 조직도 기반 전체 인원 데이터
interface Employee {
  name: string;
  code: string;
  rank: string;
  position: string;
  department: string;
  team: string;
  gender: string;
  classification: string; // 구분 (투입_정산, 투입_지원, 대기, 관리)
  experience: number;
  joinYear: string;
  age: number;
  certifications: string[];
  skills: string[];
  skillLevel: string;
}

const allEmployees: Employee[] = [
  // 대표이사
  { name: '김종균', code: 'EMP-001', rank: '임원급', position: '대표이사', department: '대표이사', team: '대표이사', gender: '남', classification: '관리', experience: 25, joinYear: '2010', age: 55, certifications: ['정보처리기사', 'PMP'], skills: ['경영전략'], skillLevel: '고급' },
  
  // STE그룹 - 사장/실장
  { name: '박성호', code: 'EMP-101', rank: '임원급', position: '사장', department: 'STE그룹', team: 'STE그룹', gender: '남', classification: '관리', experience: 22, joinYear: '2010', age: 52, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'JIRA'], skillLevel: '고급' },
  { name: '김종협', code: 'EMP-102', rank: '임원급', position: '실장', department: 'STE그룹', team: 'STE그룹', gender: '남', classification: '관리', experience: 17, joinYear: '2015', age: 47, certifications: ['정보처리기사'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '고급' },
  
  // STE1실 - 이사
  { name: '강현규', code: 'EMP-111', rank: '임원급', position: '이사', department: 'STE1실', team: 'STE1실', gender: '남', classification: '관리', experience: 15, joinYear: '2018', age: 45, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'Spring Framework', 'JIRA', 'Mantis'], skillLevel: '고급' },
  
  // STE1실 - LG전자 1팀
  { name: '전광희', code: 'EMP-1111', rank: '책임', position: '팀장', department: 'STE1실', team: 'LG전자 1팀', gender: '남', classification: '투입_정산', experience: 12, joinYear: '2019', age: 42, certifications: ['정보처리기사'], skills: ['Java', 'Python', 'JIRA', 'Redmine'], skillLevel: '고급' },
  { name: '정홍근', code: 'EMP-1112', rank: '사원', position: '사원', department: 'STE1실', team: 'LG전자 1팀', gender: '남', classification: '투입_정산', experience: 2, joinYear: '2023', age: 28, certifications: ['정보처리산업기사'], skills: ['JavaScript/React', 'Node.js', 'JIRA'], skillLevel: '초급' },
  
  // STE1실 - LG전자 2팀
  { name: '이길원', code: 'EMP-1121', rank: '책임', position: '팀장', department: 'STE1실', team: 'LG전자 2팀', gender: '남', classification: '투입_정산', experience: 13, joinYear: '2018', age: 43, certifications: ['정보처리기사', 'ISTQB'], skills: ['Java', 'Spring Framework', 'JIRA', 'Mantis'], skillLevel: '고급' },
  { name: '이성미', code: 'EMP-1122', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 2팀', gender: '여', classification: '투입_정산', experience: 8, joinYear: '2020', age: 36, certifications: ['정보처리기사', '컴퓨터활용능력'], skills: ['Java', 'Python', 'JIRA'], skillLevel: '중급' },
  { name: '조혜진', code: 'EMP-1123', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 2팀', gender: '여', classification: '투입_정산', experience: 7, joinYear: '2021', age: 35, certifications: ['정보처리산업기사'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '이나리', code: 'EMP-1124', rank: '선임', position: '선임', department: 'STE1실', team: 'LG전자 2팀', gender: '여', classification: '투입_정산', experience: 5, joinYear: '2022', age: 32, certifications: ['컴퓨터활용능력'], skills: ['JavaScript/React', 'Node.js', 'JIRA'], skillLevel: '중급' },
  
  // STE1실 - LG전자 4팀
  { name: '박준수', code: 'EMP-1141', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 4팀', gender: '남', classification: '투입_정산', experience: 7, joinYear: '2021', age: 35, certifications: ['정보처리기사'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '용상수', code: 'EMP-1142', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 4팀', gender: '남', classification: '투입_정산', experience: 6, joinYear: '2022', age: 34, certifications: [], skills: ['Python', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '김규현', code: 'EMP-1143', rank: '사원', position: '사원', department: 'STE1실', team: 'LG전자 4팀', gender: '남', classification: '투입_정산', experience: 1, joinYear: '2024', age: 26, certifications: [], skills: ['Java', 'JIRA'], skillLevel: '초급' },
  
  // STE2실 - GS리테일 1팀
  { name: '조현균', code: 'EMP-1211', rank: '책임', position: '팀장', department: 'STE2실', team: 'GS리테일 1팀', gender: '남', classification: '투입_정산', experience: 14, joinYear: '2018', age: 44, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'Spring Framework', 'JIRA', 'Redmine'], skillLevel: '고급' },
  { name: '조현정', code: 'EMP-1212', rank: '책임', position: '책임', department: 'STE2실', team: 'GS리테일 1팀', gender: '여', classification: '투입_정산', experience: 7, joinYear: '2021', age: 36, certifications: ['정보처리기사'], skills: ['Java', 'Python', 'JIRA'], skillLevel: '중급' },
  { name: '최현준', code: 'EMP-1213', rank: '책임', position: '책임', department: 'STE2실', team: 'GS리테일 1팀', gender: '남', classification: '투입_정산', experience: 8, joinYear: '2020', age: 37, certifications: ['정보처리기사', 'ISTQB'], skills: ['Java', 'Spring Framework', 'JIRA', 'Mantis'], skillLevel: '중급' },
  { name: '강성희', code: 'EMP-1214', rank: '선임', position: '선임', department: 'STE2실', team: 'GS리테일 1팀', gender: '여', classification: '투입_정산', experience: 4, joinYear: '2023', age: 31, certifications: ['컴퓨터활용능력'], skills: ['JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '강문혁', code: 'EMP-1215', rank: '사원', position: '사원', department: 'STE2실', team: 'GS리테일 1팀', gender: '남', classification: '투입_정산', experience: 2, joinYear: '2023', age: 28, certifications: ['정보처리산업기사'], skills: ['Java', 'JIRA'], skillLevel: '초급' },
  
  // STE2실 - HDC랩스 1팀
  { name: '장대열', code: 'EMP-1221', rank: '선임', position: '선임', department: 'STE2실', team: 'HDC랩스 1팀', gender: '', classification: '투입_정산', experience: 5, joinYear: '2022', age: 32, certifications: ['정보처리기사'], skills: ['Python', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  
  // STE2실 - KT 알파1팀
  { name: '윤제진', code: 'EMP-1231', rank: '수석', position: '수석', department: 'STE2실', team: 'KT 알파1팀', gender: '남', classification: '투입_정산', experience: 12, joinYear: '2019', age: 40, certifications: ['정보처리기사', 'PMP', 'ISTQB'], skills: ['Java', 'Spring Framework', 'JIRA', 'Mantis'], skillLevel: '고급' },
  { name: '신진욱', code: 'EMP-1232', rank: '수석', position: '수석', department: 'STE2실', team: 'KT 알파1팀', gender: '', classification: '투입_정산', experience: 11, joinYear: '2019', age: 39, certifications: ['정보처리기사', 'ISTQB'], skills: ['Java', 'Python', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '이영택', code: 'EMP-1233', rank: '책임', position: '책임', department: 'STE2실', team: 'KT 알파1팀', gender: '남', classification: '투입_정산', experience: 6, joinYear: '2022', age: 34, certifications: ['정보처리산업기사'], skills: ['Java', 'JIRA', 'Redmine'], skillLevel: '중급' },
  
  // 경영지원실 - 경영지원팀
  { name: '김완수', code: 'EMP-2101', rank: '임원급', position: '부사장', department: '경영지원실', team: '경영지원팀', gender: '남', classification: '관리', experience: 18, joinYear: '2015', age: 48, certifications: ['정보처리기사'], skills: ['JIRA', 'Redmine'], skillLevel: '고급' },
  { name: '이현직', code: 'EMP-2102', rank: '임원급', position: '실장', department: '경영지원실', team: '경영지원팀', gender: '남', classification: '관리', experience: 16, joinYear: '2016', age: 46, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'JIRA'], skillLevel: '고급' },
  { name: '김예림', code: 'EMP-2103', rank: '선임', position: '파트장', department: '경영지원실', team: '경영지원팀', gender: '여', classification: '관리', experience: 10, joinYear: '2020', age: 38, certifications: ['컴퓨터활용능력', '기타'], skills: ['JIRA'], skillLevel: '중급' },
  { name: '가라현', code: 'EMP-2104', rank: '사원', position: '사원', department: '경영지원실', team: '경영지원팀', gender: '여', classification: '관리', experience: 2, joinYear: '2023', age: 27, certifications: ['컴퓨터활용능력'], skills: ['JIRA'], skillLevel: '초급' },
  { name: '신소영', code: 'EMP-2105', rank: '사원', position: '사원', department: '경영지원실', team: '경영지원팀', gender: '여', classification: '관리', experience: 1, joinYear: '2024', age: 25, certifications: [], skills: ['JIRA'], skillLevel: '초급' },
  
  // 경영지원실 - 사업전략팀
  { name: '이유라', code: 'EMP-2201', rank: '선임', position: '선임', department: '경영지원실', team: '사업전략팀', gender: '여', classification: '관리', experience: 5, joinYear: '2022', age: 32, certifications: ['정보처리산업기사', '컴퓨터활용능력'], skills: ['JIRA', 'Mantis'], skillLevel: '중급' },
  { name: '주호정', code: 'EMP-2202', rank: '사원', position: '사원', department: '경영지원실', team: '사업전략팀', gender: '남', classification: '관리', experience: 2, joinYear: '2023', age: 29, certifications: ['컴퓨터활용능력'], skills: ['JIRA'], skillLevel: '초급' },
  { name: '김연서', code: 'EMP-2203', rank: '사원', position: '사원', department: '경영지원실', team: '사업전략팀', gender: '여', classification: '관리', experience: 1, joinYear: '2024', age: 26, certifications: [], skills: ['JIRA'], skillLevel: '초급' },
  
  // 기술연구소 - 본부
  { name: '김태영', code: 'EMP-301', rank: '임원급', position: '부사장', department: '기술연구소', team: '기술연구소', gender: '남', classification: '관리', experience: 20, joinYear: '2015', age: 50, certifications: ['정보처리기사', 'PMP'], skills: ['Java', 'Python', 'Spring Framework', 'JIRA'], skillLevel: '고급' },
  { name: '이혜진', code: 'EMP-302', rank: '임원급', position: '이사', department: '기술연구소', team: '기술연구소', gender: '여', classification: '관리', experience: 16, joinYear: '2016', age: 46, certifications: ['정보처리기사', 'ISTQB', '기타'], skills: ['Java', 'Python', 'JIRA', 'Mantis'], skillLevel: '고급' },
  { name: '우은순', code: 'EMP-303', rank: '책임', position: '팀장', department: '기술연구소', team: '기술연구소', gender: '여', classification: '관리', experience: 12, joinYear: '2019', age: 42, certifications: ['정보처리기사'], skills: ['Java', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '김지연', code: 'EMP-304', rank: '사원', position: '사원', department: '기술연구소', team: '개발연구', gender: '여', classification: '관리', experience: 2, joinYear: '2023', age: 28, certifications: ['정보처리산업기사', 'ISTQB'], skills: ['JavaScript/React', 'Node.js', 'JIRA'], skillLevel: '초급' },
  { name: '추경운', code: 'EMP-305', rank: '사원', position: '사원', department: '기술연구소', team: '기술연구소', gender: '남', classification: '관리', experience: 2, joinYear: '2023', age: 29, certifications: ['컴퓨터활용능력'], skills: ['Python', 'JIRA'], skillLevel: '초급' },
  
  // 기술연구소 - 자동화개발팀
  { name: '김준하', code: 'EMP-3101', rank: '선임', position: '선임', department: '기술연구소', team: '자동화개발팀', gender: '남', classification: '관리', experience: 4, joinYear: '2023', age: 31, certifications: ['정보처리기사', 'ISTQB'], skills: ['Java', 'Spring Framework', 'JIRA'], skillLevel: '중급' },
  { name: '이유나', code: 'EMP-3102', rank: '선임', position: '선임', department: '기술연구소', team: '자동화개발팀', gender: '여', classification: '관리', experience: 5, joinYear: '2022', age: 32, certifications: ['정보처리산업기사'], skills: ['JavaScript/React', 'Node.js', 'JIRA'], skillLevel: '중급' },
  { name: '유정선', code: 'EMP-3103', rank: '선임', position: '선임', department: '기술연구소', team: '자동화개발팀', gender: '여', classification: '관리', experience: 4, joinYear: '2023', age: 30, certifications: ['컴퓨터활용능력', '기타'], skills: ['Python', 'JavaScript/React', 'JIRA'], skillLevel: '중급' },
  { name: '손진빈', code: 'EMP-3104', rank: '사원', position: '사원', department: '기술연구소', team: '자동화개발팀', gender: '남', classification: '관리', experience: 1, joinYear: '2024', age: 27, certifications: [], skills: ['Java', 'JIRA'], skillLevel: '초급' },
  { name: '유예진', code: 'EMP-3105', rank: '사원', position: '사원', department: '기술연구소', team: '자동화개발팀', gender: '여', classification: '관리', experience: 1, joinYear: '2024', age: 26, certifications: ['컴퓨터활용능력'], skills: ['JavaScript/React', 'JIRA'], skillLevel: '초급' },
];

interface HRBasicInfoProps {
  onEmployeeClick?: (code: string) => void;
}

export function HRBasicInfo({ onEmployeeClick }: HRBasicInfoProps) {
  const [deptFilter, setDeptFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [skillLevelFilter, setSkillLevelFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [certificationFilter, setCertificationFilter] = useState('all');
  const [classificationFilter, setClassificationFilter] = useState('all'); // 구분 필터 추가
  const [sortField, setSortField] = useState<keyof Employee>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 선택된 부서의 팀 목록 가져오기
  const availableTeams = useMemo(() => {
    if (deptFilter === 'all') {
      return Array.from(new Set(allEmployees.map(emp => emp.team))).sort();
    }
    return Array.from(new Set(allEmployees.filter(emp => emp.department === deptFilter).map(emp => emp.team))).sort();
  }, [deptFilter]);

  // 전체 자격증 목록
  const allCertifications = useMemo(() => {
    const certs = new Set<string>();
    allEmployees.forEach(emp => {
      emp.certifications.forEach(cert => certs.add(cert));
    });
    return Array.from(certs).sort();
  }, []);

  // 통합 필터링된 직원 목록
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(emp => {
      const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
      const matchesTeam = teamFilter === 'all' || emp.team === teamFilter;
      const matchesRank = rankFilter === 'all' || emp.rank === rankFilter;
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSkillLevel = skillLevelFilter === 'all' || emp.skillLevel === skillLevelFilter;
      
      // 경력년수 필터
      let matchesExperience = true;
      if (experienceFilter !== 'all') {
        if (experienceFilter === '0-3') matchesExperience = emp.experience <= 3;
        else if (experienceFilter === '4-7') matchesExperience = emp.experience >= 4 && emp.experience <= 7;
        else if (experienceFilter === '8-12') matchesExperience = emp.experience >= 8 && emp.experience <= 12;
        else if (experienceFilter === '13+') matchesExperience = emp.experience >= 13;
      }
      
      // 자격증 필터
      const matchesCertification = certificationFilter === 'all' || 
                                   emp.certifications.includes(certificationFilter);
      
      // 구분 필터
      const matchesClassification = classificationFilter === 'all' || 
                                    emp.classification === classificationFilter;
      
      return matchesDept && matchesTeam && matchesRank && matchesSearch && 
             matchesSkillLevel && matchesExperience && matchesCertification && matchesClassification;
    });
  }, [deptFilter, teamFilter, rankFilter, searchTerm, skillLevelFilter, experienceFilter, certificationFilter, classificationFilter]);

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

  const handleSort = (field: keyof Employee) => {
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
        <h1>정보조회</h1>
        <p className="text-muted-foreground mt-1">전 직원의 기본 정보 및 상세 현황을 조회하세요</p>
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
                variant={deptFilter === '기술연구소' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('기술연구소');
                  setTeamFilter('all');
                }}
              >
                개발연구소
              </Button>
              <Button
                variant={deptFilter === '경영지원실' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setDeptFilter('경영지원실');
                  setTeamFilter('all');
                }}
              >
                경영지원실
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

          {/* 직급 및 자격증 필터 */}
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

            {/* 자격증 */}
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">자격증</label>
              <Select value={certificationFilter} onValueChange={setCertificationFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="자격증 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 자격증</SelectItem>
                  {allCertifications.map(cert => (
                    <SelectItem key={cert} value={cert}>{cert}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 기술레벨 및 경력년수 필터 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* 기술레벨 */}
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">기술레벨</label>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant={skillLevelFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSkillLevelFilter('all')}
                >
                  전체
                </Button>
                <Button
                  variant={skillLevelFilter === '고급' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSkillLevelFilter('고급')}
                >
                  고급
                </Button>
                <Button
                  variant={skillLevelFilter === '중급' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSkillLevelFilter('중급')}
                >
                  중급
                </Button>
                <Button
                  variant={skillLevelFilter === '초급' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSkillLevelFilter('초급')}
                >
                  초급
                </Button>
              </div>
            </div>

            {/* 경력년수 */}
            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">경력년수</label>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant={experienceFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setExperienceFilter('all')}
                >
                  전체
                </Button>
                <Button
                  variant={experienceFilter === '0-3' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setExperienceFilter('0-3')}
                >
                  0-3년
                </Button>
                <Button
                  variant={experienceFilter === '4-7' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setExperienceFilter('4-7')}
                >
                  4-7년
                </Button>
                <Button
                  variant={experienceFilter === '8-12' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setExperienceFilter('8-12')}
                >
                  8-12년
                </Button>
                <Button
                  variant={experienceFilter === '13+' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setExperienceFilter('13+')}
                >
                  13년 이상
                </Button>
              </div>
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
                    onClick={() => handleSort('position')}
                  >
                    직책 {sortField === 'position' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('classification')}
                  >
                    구분 {sortField === 'classification' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('experience')}
                  >
                    경력 {sortField === 'experience' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('skillLevel')}
                  >
                    기술레벨 {sortField === 'skillLevel' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-center p-3">자격증</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.length > 0 ? (
                  sortedEmployees.map((emp) => (
                    <tr 
                      key={emp.code} 
                      className="border-b hover:bg-accent/50 cursor-pointer" 
                      onClick={() => onEmployeeClick?.(emp.code)}
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
                      <td className="text-center p-3">{emp.position}</td>
                      <td className="text-center p-3">
                        <Badge 
                          className={
                            emp.classification === '투입_정산' ? 'bg-purple-500' :
                            emp.classification === '투입_지원' ? 'bg-blue-500' :
                            emp.classification === '대기' ? 'bg-gray-500' :
                            'bg-green-500'
                          }
                        >
                          {emp.classification}
                        </Badge>
                      </td>
                      <td className="text-center p-3">{emp.experience}년</td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-6 text-muted-foreground">
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