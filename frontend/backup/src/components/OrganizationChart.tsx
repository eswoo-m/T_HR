import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, Users, ChevronRight, ChevronDown, User, FolderKanban, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

const organizationData = {
  name: '티벨',
  level: 0,
  headCount: 34,
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
      headCount: 16,
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
                { name: '전광희', level: 4, headCount: 0, leader: '팀장' },
                { name: '정홍근', level: 4, headCount: 0, leader: '사원' },
              ]
            },
            { 
              name: 'LG전자 2팀', 
              level: 3, 
              headCount: 4, 
              leader: '',
              children: [
                { name: '이길원', level: 4, headCount: 0, leader: '팀장' },
                { name: '이성미', level: 4, headCount: 0, leader: '책임' },
                { name: '조혜진', level: 4, headCount: 0, leader: '책임' },
                { name: '이나리', level: 4, headCount: 0, leader: '선임' },
              ]
            },
            { 
              name: 'LG전자 4팀', 
              level: 3, 
              headCount: 3, 
              leader: '',
              children: [
                { name: '박준수', level: 4, headCount: 0, leader: '책임' },
                { name: '용상수', level: 4, headCount: 0, leader: '책임' },
                { name: '김규현', level: 4, headCount: 0, leader: '사원' },
              ]
            },
          ],
        },
        {
          name: 'STE2실',
          level: 2,
          headCount: 9,
          leader: '',
          children: [
            { 
              name: 'GS리테일 1팀', 
              level: 3, 
              headCount: 5, 
              leader: '',
              children: [
                { name: '조현균', level: 4, headCount: 0, leader: '팀장' },
                { name: '조현정', level: 4, headCount: 0, leader: '책임' },
                { name: '최현준', level: 4, headCount: 0, leader: '책임' },
                { name: '강성희', level: 4, headCount: 0, leader: '선임' },
                { name: '강문혁', level: 4, headCount: 0, leader: '사원' },
              ]
            },
            { 
              name: 'HDC랩스 1팀', 
              level: 3, 
              headCount: 1, 
              leader: '',
              children: [
                { name: '장대열', level: 4, headCount: 0, leader: '선임' },
              ]
            },
            { 
              name: 'KT 알파1팀', 
              level: 3, 
              headCount: 3, 
              leader: '',
              children: [
                { name: '윤제진', level: 4, headCount: 0, leader: '수석' },
                { name: '신진욱', level: 4, headCount: 0, leader: '수석' },
                { name: '이영택', level: 4, headCount: 0, leader: '책임' },
              ]
            },
          ],
        },
      ],
    },
    {
      name: '경영전략실',
      level: 1,
      headCount: 8,
      leader: '',
      children: [
        {
          name: '경영지원팀',
          level: 2,
          headCount: 5,
          leader: '',
          children: [
            { name: '김완수', level: 3, headCount: 0, leader: '부사장' },
            { name: '이현직', level: 3, headCount: 0, leader: '실장' },
            { name: '김예림', level: 3, headCount: 0, leader: '파트장' },
            { name: '가라현', level: 3, headCount: 0, leader: '사원' },
            { name: '신소영', level: 3, headCount: 0, leader: '사원' },
          ],
        },
        {
          name: '사업전략팀',
          level: 2,
          headCount: 3,
          leader: '',
          children: [
            { name: '이유라', level: 3, headCount: 0, leader: '선임' },
            { name: '주호정', level: 3, headCount: 0, leader: '사원' },
            { name: '김연서', level: 3, headCount: 0, leader: '사원' },
          ],
        },
      ],
    },
    {
      name: '개발연구소',
      level: 1,
      headCount: 9,
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
          name: '자동화개발팀',
          level: 2,
          headCount: 5,
          leader: '',
          children: [
            { name: '김준하', level: 3, headCount: 0, leader: '선임' },
            { name: '이유나', level: 3, headCount: 0, leader: '선임' },
            { name: '유정선', level: 3, headCount: 0, leader: '선임' },
            { name: '손진빈', level: 3, headCount: 0, leader: '사원' },
            { name: '유예진', level: 3, headCount: 0, leader: '사원' },
          ],
        },
      ],
    },
  ],
};

// 파이 차트 색상
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface TreeNodeProps {
  name: string;
  leader: string;
  headCount: number;
  children?: Array<{
    name: string;
    leader: string;
    headCount: number;
    children?: Array<{ name: string; leader: string; headCount: number }>;
  }>;
  level: number;
}

function TreeNode({ name, leader, headCount, children = [], level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = children.length > 0;
  const isEmployee = headCount === 0 && leader; // 개인(임직원)인지 확인
  const isTeam = name.includes('팀'); // 팀인지 확인 (팀은 드롭다운 비활성화)
  const isClickable = hasChildren && !isTeam; // 팀이 아닐 때만 클릭 가능

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 hover:bg-accent rounded-md transition-colors ${
          level === 0 ? 'bg-accent/50' : ''
        } ${isClickable ? 'cursor-pointer' : ''}`}
        onClick={() => isClickable && setIsExpanded(!isExpanded)}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
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
      </div>

      {hasChildren && isExpanded && (
        <div>
          {children.map((child, index) => (
            <TreeNode
              key={index}
              name={child.name}
              leader={child.leader}
              headCount={child.headCount}
              children={child.children}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrganizationChart() {
  return (
    <div className="space-y-6">
      <div>
        <h1>조직도 조회</h1>
        <p className="text-muted-foreground mt-1">회사의 조직 구조를 확인하세요</p>
      </div>

      {/* Stats Cards - 4개 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">전체 부서 수</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {organizationData.children.filter(d => d.headCount > 0).length}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              주요 부서
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">전체 프로젝트 팀 수</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {(() => {
                const steGroup = organizationData.children.find(d => d.name === 'STE그룹');
                if (!steGroup) return 0;
                
                const projectTeams = steGroup.children
                  .filter(child => child.name === 'STE1실' || child.name === 'STE2실')
                  .flatMap(dept => dept.children.filter(team => team.name.includes('팀')));
                
                return projectTeams.length;
              })()}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              진행중인 프로젝트
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">평균 팀 규모</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {(() => {
                const steGroup = organizationData.children.find(d => d.name === 'STE그룹');
                if (!steGroup) return 0;
                
                const projectTeams = steGroup.children
                  .filter(child => child.name === 'STE1실' || child.name === 'STE2실')
                  .flatMap(dept => dept.children.filter(team => team.headCount > 0));
                
                const totalMembers = projectTeams.reduce((sum, team) => sum + team.headCount, 0);
                const teamCount = projectTeams.length;
                
                return teamCount > 0 ? (totalMembers / teamCount).toFixed(1) : 0;
              })()}명
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              팀당 평균 인원
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">직책 보유 인원 수</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {(() => {
                // 모든 직책 보유자 카운트 (파트장/팀장/실장/이사/부사장/사장/대표이사)
                const positions = ['파트장', '팀장', '실장', '이사', '부사장', '사장', '대표이사'];
                let count = 0;
                
                const countPositions = (node: any) => {
                  if (node.leader && positions.includes(node.leader)) {
                    count++;
                  }
                  if (node.children) {
                    node.children.forEach((child: any) => countPositions(child));
                  }
                };
                
                countPositions(organizationData);
                return count;
              })()}명
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              관리직 및 임원
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row - 2개 차트 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>조직 계층 구조</CardTitle>
            <CardDescription>클릭하여 조직을 펼치거나 접으세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {/* 최상위 티벨 */}
              <TreeNode
                name={organizationData.name}
                leader={organizationData.leader}
                headCount={organizationData.headCount}
                children={organizationData.children}
                level={0}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>조직 통계</CardTitle>
            <CardDescription>부서별 인원 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizationData.children.filter(dept => dept.headCount > 0).map((dept, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm">{dept.name}</span>
                    </div>
                    <span className="text-sm font-medium">{dept.headCount}명</span>
                  </div>
                  <div className="w-full bg-accent rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(dept.headCount / organizationData.headCount) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {dept.children.length > 0 ? `${dept.children.length}개 팀` : '팀 없음'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {((dept.headCount / organizationData.headCount) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Detail Table */}
      {/* Removed - 조직별 상세 정보 section deleted */}
    </div>
  );
}