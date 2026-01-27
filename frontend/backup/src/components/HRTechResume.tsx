import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Printer, Download, User, ChevronRight, ChevronDown } from 'lucide-react';

// 조직 구조 데이터 (조직도와 동일)
const organizationData = {
  name: '티벨',
  level: 0,
  children: [
    {
      name: '김종균',
      level: 1,
      position: '대표이사',
      department: '대표이사',
      team: '대표이사',
      code: 'EMP-001',
    },
    {
      name: 'STE그룹',
      level: 1,
      children: [
        {
          name: '박성호',
          level: 2,
          position: '사장',
          department: 'STE그룹',
          team: 'STE그룹',
          code: 'EMP-002',
        },
        {
          name: '김종협',
          level: 2,
          position: '실장',
          department: 'STE그룹',
          team: 'STE그룹',
          code: 'EMP-003',
        },
        {
          name: 'STE1실',
          level: 2,
          children: [
            {
              name: '강현규',
              level: 3,
              position: '이사',
              department: 'STE1실',
              team: 'STE1실',
              code: 'EMP-1101',
            },
            { 
              name: 'LG전자 1팀', 
              level: 3, 
              children: [
                { name: '전광희', level: 4, position: '팀장', department: 'STE1실', team: 'LG전자 1팀', code: 'EMP-1111' },
                { name: '정홍근', level: 4, position: '사원', department: 'STE1실', team: 'LG전자 1팀', code: 'EMP-1112' },
              ]
            },
            { 
              name: 'LG전자 2팀', 
              level: 3, 
              children: [
                { name: '이길원', level: 4, position: '팀장', department: 'STE1실', team: 'LG전자 2팀', code: 'EMP-1121' },
                { name: '이성미', level: 4, position: '책임', department: 'STE1실', team: 'LG전자 2팀', code: 'EMP-1122' },
                { name: '조혜진', level: 4, position: '책임', department: 'STE1실', team: 'LG전자 2팀', code: 'EMP-1123' },
                { name: '이나리', level: 4, position: '선임', department: 'STE1실', team: 'LG전자 2팀', code: 'EMP-1124' },
              ]
            },
            { 
              name: 'LG전자 4팀', 
              level: 3, 
              children: [
                { name: '박준수', level: 4, position: '책임', department: 'STE1실', team: 'LG전자 4팀', code: 'EMP-1141' },
                { name: '용상수', level: 4, position: '책임', department: 'STE1', team: 'LG전자 4팀', code: 'EMP-1142' },
                { name: '김규현', level: 4, position: '사원', department: 'STE1실', team: 'LG전자 4팀', code: 'EMP-1143' },
              ]
            },
          ],
        },
        {
          name: 'STE2실',
          level: 2,
          children: [
            { 
              name: 'GS리테일 1팀', 
              level: 3, 
              children: [
                { name: '조현균', level: 4, position: '팀장', department: 'STE2실', team: 'GS리테일 1팀', code: 'EMP-2101' },
                { name: '조현정', level: 4, position: '책임', department: 'STE2실', team: 'GS리테일 1팀', code: 'EMP-2102' },
                { name: '최현준', level: 4, position: '책임', department: 'STE2실', team: 'GS리테일 1팀', code: 'EMP-2103' },
                { name: '강성희', level: 4, position: '선임', department: 'STE2실', team: 'GS리테일 1팀', code: 'EMP-2104' },
                { name: '강문혁', level: 4, position: '사원', department: 'STE2실', team: 'GS리테일 1팀', code: 'EMP-2105' },
              ]
            },
            { 
              name: 'HDC랩스 1팀', 
              level: 3, 
              children: [
                { name: '장대열', level: 4, position: '선임', department: 'STE2실', team: 'HDC랩스 1팀', code: 'EMP-2201' },
              ]
            },
            { 
              name: 'KT 알파1팀', 
              level: 3, 
              children: [
                { name: '윤제진', level: 4, position: '수석', department: 'STE2실', team: 'KT 알파1팀', code: 'EMP-2301' },
                { name: '신진욱', level: 4, position: '수석', department: 'STE2실', team: 'KT 알파1팀', code: 'EMP-2302' },
                { name: '이영택', level: 4, position: '책임', department: 'STE2실', team: 'KT 알파1팀', code: 'EMP-2303' },
              ]
            },
          ],
        },
      ],
    },
    {
      name: '경영전략실',
      level: 1,
      children: [
        {
          name: '경영지원팀',
          level: 2,
          children: [
            { name: '김완수', level: 3, position: '부사장', department: '경영전략실', team: '경영지원팀', code: 'EMP-3101' },
            { name: '이현직', level: 3, position: '실장', department: '경영전략실', team: '경영지원팀', code: 'EMP-3102' },
            { name: '김예림', level: 3, position: '파트장', department: '경영전략실', team: '경영지원팀', code: 'EMP-3103' },
            { name: '가라현', level: 3, position: '사원', department: '경영전략실', team: '경영지원팀', code: 'EMP-3104' },
            { name: '신소영', level: 3, position: '사원', department: '경영전략실', team: '경���지원팀', code: 'EMP-3105' },
          ],
        },
        {
          name: '사업전략팀',
          level: 2,
          children: [
            { name: '이유라', level: 3, position: '선임', department: '경영전략실', team: '사업전략팀', code: 'EMP-3201' },
            { name: '주호정', level: 3, position: '사원', department: '경영전략실', team: '사업전략팀', code: 'EMP-3202' },
            { name: '김연서', level: 3, position: '사원', department: '경영전략실', team: '사업전략팀', code: 'EMP-3203' },
          ],
        },
      ],
    },
    {
      name: '개발연구소',
      level: 1,
      children: [
        {
          name: '김태영',
          level: 2,
          position: '부사장',
          department: '개발연구소',
          team: '개발연구소',
          code: 'EMP-4001',
        },
        {
          name: '이혜진',
          level: 2,
          position: '이사',
          department: '개발연구소',
          team: '개발연구소',
          code: 'EMP-4002',
        },
        {
          name: '우은순',
          level: 2,
          position: '팀장',
          department: '개발연구소',
          team: '개발연구소',
          code: 'EMP-4003',
        },
        {
          name: '김지연',
          level: 2,
          position: '사원',
          department: '개발연구소',
          team: '개발연구소',
          code: 'EMP-4004',
        },
        {
          name: '추경운',
          level: 2,
          position: '사원',
          department: '개발연구소',
          team: '개발연구소',
          code: 'EMP-4005',
        },
        {
          name: '자동화개발팀',
          level: 2,
          children: [
            { name: '김준하', level: 3, position: '선임', department: '개발연구소', team: '자동화개발팀', code: 'EMP-4101' },
            { name: '이유나', level: 3, position: '선임', department: '개발연구소', team: '자동화개발팀', code: 'EMP-4102' },
            { name: '유정선', level: 3, position: '선임', department: '개발연구소', team: '자동화개발팀', code: 'EMP-4103' },
            { name: '손진빈', level: 3, position: '사원', department: '개발연구소', team: '자동화개발팀', code: 'EMP-4104' },
            { name: '유예진', level: 3, position: '사원', department: '개발연구소', team: '자동화개발팀', code: 'EMP-4105' },
          ],
        },
      ],
    },
  ],
};

// 직원 역량정보 (역량정보 조회와 동일한 데이터)
const employeeCompetencyData: Record<string, any> = {
  'EMP-1111': {
    certifications: [
      {
        date: '2015.06.15',
        name: '정보처리기사',
        type: '취득',
        issuer: '한국산업인력공단'
      }
    ],
    skillLevel: '중급',
    // 기술능력 (역량정보 편집의 기술능력 항목)
    technicalSkills: {
      communicationSkill: '프로젝트 팀원들과 원활한 소통 가능. 기술 문서 작성 및 발표 경험 풍부.',
      officeSkill: 'MS Office, Google Workspace 활용 가능. 문서 작성, 프레젠테이션, 스프레드시트 고급 활용.',
      testDesignSkill: '테스트 케이스 설계 및 작성. 경계값 분석, 동등 분할, 상태 전이 테스트 경험.',
      testExecutionSkill: '수동/자동화 테스트 수행. Selenium, Cypress 등 자동화 도구 활용 가능.'
    },
    // 사용 가능 도구 (역량정보 편집의 사용 가능 도구 항목)
    tools: {
      defectManagementTool: 'JIRA, Redmine, Mantis',
      communicationTool: 'Slack, Microsoft Teams, Email',
      apiTool: 'Postman, Swagger, Insomnia',
      otherTool: 'Git, GitHub, GitLab, Confluence, Notion'
    }
  },
  'EMP-1121': {
    certifications: [
      {
        date: '2014.03.20',
        name: '정보처리기사',
        type: '취득',
        issuer: '한국산업인력공단'
      },
      {
        date: '2018.09.15',
        name: 'ISTQB Foundation Level',
        type: '취득',
        issuer: 'ISTQB'
      },
      {
        date: '2022.06.10',
        name: 'AWS Solutions Architect Associate',
        type: '수료',
        issuer: 'Amazon Web Services'
      }
    ],
    skillLevel: '고급',
    technicalSkills: {
      communicationSkill: '고객사 및 팀원과의 효과적인 커뮤니케이션. 요구사항 분석 및 기술 컨설팅 경험.',
      officeSkill: 'MS Office 고급 활용. 매크로, 피벗 테이블, 데이터 분석 가능.',
      testDesignSkill: '테스트 전략 수립 및 테스트 계획 작성. ISO/IEC 25000 기반 품질 관리.',
      testExecutionSkill: '테스트 자동화 프레임워크 구축. CI/CD 파이프라인 통합 경험.'
    },
    tools: {
      defectManagementTool: 'JIRA, Mantis, Bugzilla',
      communicationTool: 'Slack, Microsoft Teams, Zoom',
      apiTool: 'Postman, SoapUI, JMeter',
      otherTool: 'Jenkins, Docker, Kubernetes, Selenium, TestNG'
    }
  }
};

// 샘플 직원 데이터 (기본정보만 표시용)
const employeeDetails: Record<string, any> = {
  'EMP-1111': {
    name: '전광희',
    code: 'EMP-1111',
    photo: null, // 실제로는 이미지 URL
    position: '팀장',
    rank: '책임',
    department: 'STE1실',
    team: 'LG전자 1팀',
    organization: 'STE그룹 > STE1실 > LG전자 1팀',
    
    // 기본정보
    finalDegree: '석사',
    graduationDate: '2010.02',
    major: '컴퓨터공학',
    relatedProjectYears: 10,
    totalYears: 12,
    residence: '서울시 강남구 역삼동',
    
    phone: '010-2345-6789',
    email: 'jeon@tibell.co.kr',
    birthDate: '1985-07-20',
    joinDate: '2012-03-01',
    
    // 프로젝트 경력 (프로젝트 탭 데이터) - 최신순
    projectCareers: [
      {
        id: '1',
        client: 'LG전자',
        projectName: 'Smart TV 플랫폼 고도화',
        description: 'webOS 기반 차세대 스마트TV 플랫폼 개발',
        period: '2023.07 ~ 현재',
        role: '팀장 / PL',
        teamSize: 8,
        field: '스마트TV 플랫폼',
        location: '서울시 금천구',
        tools: 'JavaScript, React, Node.js, webOS, Docker, Jenkins',
        overview: 'webOS 기반 차세대 스마트TV 플랫폼 개발 프로젝트로, UI/UX 개선, 성능 최적화, CI/CD 파이프라인 구축을 통해 개발 효율성 향상',
        detailWork: '프로젝트 전체 일정 관리 및 팀원 업무 배분, React 기반 UI/UX 개선 및 성능 최적화, Node.js 백엔드 API 설계 및 구현, CI/CD 파이프라인 구축 및 배포 자동화',
        contribution: '팀 리더로서 프로젝트 일정을 효율적으로 관리하여 목표 대비 95% 달성, React 컴포넌트 최적화를 통해 초기 로딩 속도 40% 개선'
      },
      {
        id: '2',
        client: 'LG전자',
        projectName: 'ThinQ 앱 개발',
        description: 'LG 가전제품 통합 제어 모바일 앱 개발',
        period: '2022.01 ~ 2023.06',
        role: 'PL',
        teamSize: 6,
        field: '모바일 앱',
        location: '서울시 금천구',
        tools: 'React Native, TypeScript, Redux, REST API, Firebase',
        overview: 'LG 가전제품을 통합 제어하는 크로스플랫폼 모바일 앱 개발 프로젝트',
        detailWork: 'React Native 기반 크로스플랫폼 앱 개발, IoT 디바이스 연동 API 개발, UI/UX 설계 및 프로토타입 제작, 앱 성능 모니터링 및 최적화',
        contribution: 'React Native 기반 단일 코드베이스로 iOS/Android 동시 개발하여 개발 기간 30% 단축, Firebase를 활용한 실시간 디바이스 상태 모니터링 구현'
      },
      {
        id: '3',
        client: 'LG전자',
        projectName: 'webOS TV OS 기능 개발',
        description: 'webOS 플랫폼 핵심 기능 개발 및 유지보수',
        period: '2019.03 ~ 2021.12',
        role: '선임개발자',
        teamSize: 10,
        field: 'TV OS 플랫폼',
        location: '서울시 금천구',
        tools: 'JavaScript, webOS, Enact, React, Node.js',
        overview: 'webOS 플랫폼의 핵심 기능 개발 및 써드파티 앱 개발 지원',
        detailWork: 'JavaScript 기반 UI 컴포넌트 개발, 플랫폼 API 설계 및 문서화, 성능 최적화 및 메모리 누수 개선, 써드파티 앱 개발 지원',
        contribution: '재사용 가능한 UI 컴포넌트 라이브러리 구축으로 개발 생산성 50% 향상, 메모리 누수 개선으로 앱 안정성 대폭 개선'
      },
      {
        id: '4',
        client: '삼성전자',
        projectName: '스마트홈 플랫폼 개발',
        description: 'IoT 기반 스마트홈 통합 플랫폼 개발',
        period: '2015.01 ~ 2019.02',
        role: '개발자',
        teamSize: 12,
        field: 'IoT 플랫폼',
        location: '서울시 서초구',
        tools: 'React, Java, Spring, MySQL, MQTT',
        overview: 'IoT 디바이스를 통합 관리하는 스마트홈 플랫폼 개발',
        detailWork: '웹 프론트엔드 개발 (React), RESTful API 설계 및 구현, 디바이스 연동 프로토콜 구현, 데이터베이스 설계 및 최적화',
        contribution: 'React 기반 반응형 웹 UI 개발로 모바일/태블릿/PC 모든 환경 지원, MQTT 프로토콜 최적화로 디바이스 제어 응답 속도 60% 개선'
      },
      {
        id: '5',
        client: '현대자동차',
        projectName: '차량용 인포테인먼트 시스템',
        description: '차량 내 멀티미디어 시스템 웹 인터페이스 개발',
        period: '2012.03 ~ 2014.12',
        role: '주니어 개발자',
        teamSize: 5,
        field: '차량용 시스템',
        location: '서울시 서초구',
        tools: 'HTML5, CSS3, JavaScript, jQuery, SVG',
        overview: '차량 내 멀티미디어 시스템의 터치스크린 인터페이스 개발',
        detailWork: 'HTML/CSS/JavaScript 기반 UI 개발, 터치스크린 인터페이스 최적화, 음성인식 기능 연동, 크로스 브라우저 호환성 테스트',
        contribution: 'SVG 기반 벡터 그래픽 활용으로 다양한 해상도 지원, 터치스크린 최적화로 사용자 만족도 향상'
      }
    ]
  },
  'EMP-1121': {
    name: '이길원',
    code: 'EMP-1121',
    photo: null,
    position: '팀장',
    rank: '책임',
    department: 'STE1실',
    team: 'LG전자 2팀',
    organization: 'STE그룹 > STE1실 > LG전자 2팀',
    
    // 기본정보
    finalDegree: '석사',
    graduationDate: '2008.02',
    major: '소프트웨어공학',
    relatedProjectYears: 11,
    totalYears: 13,
    residence: '서울시 서초구 방배동',
    
    phone: '010-3456-7890',
    email: 'lee@tibell.co.kr',
    birthDate: '1983-11-05',
    joinDate: '2011-06-01',
    
    // 프로젝트 경력 (프로젝트 탭 데이터) - 최신순
    projectCareers: [
      {
        id: '1',
        client: 'LG전자',
        projectName: '스마트팩토리 구축',
        description: '제조 공정 자동화 및 품질관리 시스템 구축',
        period: '2023.01 ~ 현재',
        role: '팀장 / QA 총괄',
        teamSize: 6,
        field: '스마트팩토리',
        location: '경기도 평택시',
        tools: 'Python, Selenium, Jenkins, Docker, Grafana',
        overview: '제조 공정 전체의 자동화 및 실시간 품질 모니터링 시스템 구축',
        detailWork: '전체 QA 프로세스 설계 및 관리, Python 기반 테스트 자동화 프레임워크 구축, CI/CD 파이프라인 설계 및 구현, 품질 지표 모니터링 대시보드 개발',
        contribution: 'QA 자동화율 85% 달성으로 테스트 시간 70% 단축, Grafana 대시보드 구축으로 실시간 품질 모니터링 체계 확립'
      },
      {
        id: '2',
        client: 'LG전자',
        projectName: '제조 시스템 고도화',
        description: '생산라인 공정 자동화 및 품질 개선',
        period: '2021.01 ~ 2022.12',
        role: 'PL',
        teamSize: 8,
        field: '제조 시스템',
        location: '경기도 평택시',
        tools: 'Python, Selenium, JMeter, MySQL',
        overview: '생산라인의 자동화 테스트 및 성능 최적화 프로젝트',
        detailWork: '자동화 테스트 스크립트 개발, 성능 테스트 설계 및 실행, 결함 분석 및 개선 방안 도출, 테스트 데이터 관리 체계 구축',
        contribution: 'Python 기반 자동화 스크립트로 반복 테스트 자동화, JMeter를 활용한 성능 테스트로 병목 구간 식별 및 개선'
      },
      {
        id: '3',
        client: 'LG전자',
        projectName: '품질관리 시스템 구축',
        description: '통합 품질관리 시스템 구축 및 테스트 자동화',
        period: '2018.01 ~ 2020.12',
        role: 'QA 팀장',
        teamSize: 5,
        field: '품질관리',
        location: '경기도 평택시',
        tools: 'Java, Selenium, Jenkins, TestNG',
        overview: '전사 통합 품질관리 시스템 구축 및 E2E 테스트 자동화',
        detailWork: 'Selenium 기반 E2E 테스트 자동화, 테스트 케이스 설계 및 관리, CI/CD 도구 연동 및 자동화, 품질 보고서 자동 생성 시스템 개발',
        contribution: 'Selenium + TestNG 프레임워크 구축으로 회귀 테스트 자동화, Jenkins 연동으로 빌드마다 자동 테스트 실행'
      },
      {
        id: '4',
        client: 'SK하이닉스',
        projectName: '반도체 검사 시스템 QA',
        description: '반도체 제조 검사 시스템 품질 보증',
        period: '2014.06 ~ 2017.12',
        role: 'QA 엔지니어',
        teamSize: 10,
        field: '반도체',
        location: '경기도 이천시',
        tools: 'Python, Java, Selenium, SQL',
        overview: '반도체 제조 공정의 검사 시스템 품질 검증',
        detailWork: '기능 테스트 및 회귀 테스트, 테스트 자동화 스크립트 개발, 결함 추적 및 보고, 테스트 환경 구축 및 관리',
        contribution: '반도체 검사 시스템의 안정성 검증으로 불량률 15% 감소, 자동화 테스트로 검증 시간 50% 단축'
      },
      {
        id: '5',
        client: '삼성전자',
        projectName: '모바일 앱 QA',
        description: '모바일 애플리케이션 품질 검증',
        period: '2011.06 ~ 2014.05',
        role: 'QA 엔지니어',
        teamSize: 7,
        field: '모바일',
        location: '서울시 서초구',
        tools: 'Java, Appium, Android, iOS',
        overview: '모바일 앱의 기능 검증 및 디바이스 호환성 테스트',
        detailWork: '수동 테스트 수행, 테스트 케이스 작성 및 실행, 버그 리포팅 및 추적, 디바이스별 호환성 테스트',
        contribution: '다양한 디바이스에서의 호환성 테스트로 사용자 불만 감소, 체계적인 버그 리포팅으로 개발팀과의 협업 효율 향상'
      }
    ]
  },
};

interface TreeNodeProps {
  name: string;
  position?: string;
  code?: string;
  department?: string;
  team?: string;
  children?: any[];
  level: number;
  searchTerm: string;
  selectedCode: string | null;
  onSelect: (code: string) => void;
}

function TreeNode({ name, position, code, department, team, children = [], level, searchTerm, selectedCode, onSelect }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 3);
  const hasChildren = children && children.length > 0;
  const isEmployee = code && position; // 개인(임직원)인지 확인
  const isTeam = name.includes('팀'); // 팀인지 확인
  const isClickable = hasChildren && !isTeam; // 팀이 아닐 때만 드롭다운 활성화

  // 조직 경로 생성
  const organizationPath = isEmployee && department && team 
    ? `${department} > ${team}` 
    : '';

  // 검색어와 일치하는지 확인
  const matchesSearch = searchTerm === '' || 
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (code && code.toLowerCase().includes(searchTerm.toLowerCase()));

  // 자식 중에 검색어와 일치하는 항목이 있는지 확인
  const hasMatchingChildren = (node: any, term: string): boolean => {
    if (!term) return true;
    if (node.name?.toLowerCase().includes(term.toLowerCase())) return true;
    if (node.code?.toLowerCase().includes(term.toLowerCase())) return true;
    if (node.children) {
      return node.children.some((child: any) => hasMatchingChildren(child, term));
    }
    return false;
  };

  const shouldShow = matchesSearch || (hasChildren && children.some(child => hasMatchingChildren(child, searchTerm)));

  if (!shouldShow) return null;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
          isEmployee
            ? selectedCode === code
              ? 'bg-primary text-primary-foreground cursor-pointer'
              : 'hover:bg-accent cursor-pointer'
            : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={() => {
          if (isEmployee && code) {
            onSelect(code);
          } else if (isClickable) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {/* 드롭다운 아이콘 */}
        {hasChildren && (
          isClickable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )
        )}
        
        {/* 이름과 직책 */}
        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`${isEmployee ? 'font-normal' : 'font-medium'} truncate`}>
                {name}
              </span>
              {isEmployee && position && (
                <Badge 
                  variant={selectedCode === code ? 'secondary' : 'outline'}
                  className="text-xs flex-shrink-0"
                >
                  {position}
                </Badge>
              )}
            </div>
            {isEmployee && organizationPath && (
              <span className="text-xs text-muted-foreground truncate">
                {organizationPath}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 자식 노드 */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child: any, idx: number) => (
            <TreeNode
              key={idx}
              name={child.name}
              position={child.position}
              code={child.code}
              department={child.department}
              team={child.team}
              children={child.children}
              level={level + 1}
              searchTerm={searchTerm}
              selectedCode={selectedCode}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface HRTechResumeProps {
  onEmployeeClick?: (code: string, tab?: string) => void;
  selectedEmployeeCode?: string | null;
}

export function HRTechResume({ selectedEmployeeCode }: HRTechResumeProps) {
  const [selectedCode, setSelectedCode] = useState<string | null>(selectedEmployeeCode || null);
  const [searchTerm, setSearchTerm] = useState('');
  const resumeRef = useRef<HTMLDivElement>(null);

  // 모든 직원 목록을 평면 리스트로 추출
  const getAllEmployees = (node: any, employees: any[] = []): any[] => {
    if (node.code && node.position) {
      employees.push({
        name: node.name,
        code: node.code,
        position: node.position,
        department: node.department,
        team: node.team,
        organization: node.department && node.team ? `${node.department} > ${node.team}` : node.department || node.team
      });
    }
    if (node.children) {
      node.children.forEach((child: any) => getAllEmployees(child, employees));
    }
    return employees;
  };

  // selectedEmployeeCode가 변경되면 selectedCode 업데이트
  useEffect(() => {
    if (selectedEmployeeCode) {
      setSelectedCode(selectedEmployeeCode);
      // 직원 상세 데이터가 없는 경우 검색어에 코드 설정하여 사용자가 검색할 수 있도록
      if (!employeeDetails[selectedEmployeeCode]) {
        // 조직 데이터에서 직원 정보 찾기
        const allEmployees = organizationData.children?.reduce((acc: any[], child: any) => {
          return [...acc, ...getAllEmployees(child)];
        }, []) || [];
        const employee = allEmployees.find(emp => emp.code === selectedEmployeeCode);
        if (employee) {
          setSearchTerm(employee.name);
        }
      }
    }
  }, [selectedEmployeeCode]);

  const selectedEmployee = selectedCode ? employeeDetails[selectedCode] : null;

  // 검색된 직원 목록
  const searchedEmployees = useMemo(() => {
    if (!searchTerm) return [];
    
    const allEmployees = organizationData.children?.reduce((acc: any[], child: any) => {
      return [...acc, ...getAllEmployees(child)];
    }, []) || [];
    
    return allEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // 인쇄 함수
  const handlePrint = () => {
    if (!selectedEmployee) return;
    window.print();
  };

  // PDF 다운로드 함수
  const handleDownload = () => {
    if (!selectedEmployee) {
      alert('직원을 선택해주세요.');
      return;
    }
    alert('PDF 다운로드 기능은 실제 환경에서 구현됩니다.\n(html2pdf 또는 jsPDF 라이브러리 사용)');
  };

  // 기간 계산 함수
  const calculateDuration = (period: string): string => {
    try {
      const parts = period.split('~').map(p => p.trim());
      if (parts.length !== 2) return '';
      
      const start = parts[0].replace(/\s/g, '');
      const end = parts[1].replace(/\s/g, '');
      
      const isOngoing = end.includes('진행중') || end.includes('현재');
      
      const startMatch = start.match(/(\d{4})\.(\d{2})/);
      if (!startMatch) return '';
      
      const startYear = parseInt(startMatch[1]);
      const startMonth = parseInt(startMatch[2]);
      
      let endYear: number;
      let endMonth: number;
      
      if (isOngoing) {
        const now = new Date();
        endYear = now.getFullYear();
        endMonth = now.getMonth() + 1;
      } else {
        const endMatch = end.match(/(\d{4})\.(\d{2})/);
        if (!endMatch) return '';
        endYear = parseInt(endMatch[1]);
        endMonth = parseInt(endMatch[2]);
      }
      
      let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;
      
      if (years === 0 && months === 0) return '1개월';
      if (years === 0) return `${months}개월`;
      if (months === 0) return `${years}년`;
      return `${years}년 ${months}개월`;
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1>경력기술서</h1>
          <p className="text-muted-foreground mt-1">직원의 기술경력서를 조회하고 출력하세요</p>
        </div>
        {selectedEmployee && (
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="size-4" />
              인쇄
            </Button>
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Download className="size-4" />
              PDF 다운로드
            </Button>
          </div>
        )}
      </div>

      {/* 검색 영역 */}
      <Card className="print:hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="직원 이름 또는 사번 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            {selectedEmployee && (
              <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
                <User className="size-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{selectedEmployee.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedEmployee.organization}</div>
                </div>
                <Badge>{selectedEmployee.rank}</Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedCode(null)}
                  className="ml-2"
                >
                  변경
                </Button>
              </div>
            )}
          </div>
          
          {/* 검색 결과 드롭다운 */}
          {searchTerm && !selectedEmployee && (
            <div className="mt-3 border rounded-lg max-h-[400px] overflow-y-auto">
              {searchedEmployees.length > 0 ? (
                <div className="divide-y">
                  {searchedEmployees.map((emp: any) => (
                    <div
                      key={emp.code}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setSelectedCode(emp.code)}
                    >
                      <User className="size-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{emp.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {emp.position}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {emp.organization}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex-shrink-0">
                        {emp.code}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 기술경력서 미리보기 - 전체 너비 */}
      <div ref={resumeRef}>
        {selectedEmployee ? (
          <Card className="print:shadow-none print:border-0">
            <CardContent className="p-10 lg:p-12 space-y-8 max-w-[1200px] mx-auto">
              {/* 제목 */}
              <div className="text-center border-b pb-6">
                <h2 className="text-3xl mb-2">기술경력서</h2>
                <p className="text-muted-foreground">Technical Resume</p>
              </div>

              {/* 1. 기본정보 */}
              <section>
                <h3 className="text-xl mb-6 pb-3 border-b-2">기본정보</h3>
                <div className="flex gap-8">
                  {/* 왼쪽: 사진 */}
                  <div className="flex-shrink-0">
                    <div className="w-40 h-48 bg-muted rounded-lg flex items-center justify-center border-2">
                      {selectedEmployee.photo ? (
                        <img src={selectedEmployee.photo} alt={selectedEmployee.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <User className="size-20 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* 오른쪽: 정보 */}
                  <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex">
                      <span className="w-40 text-muted-foreground">이름</span>
                      <span className="font-semibold text-lg">{selectedEmployee.name}</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-muted-foreground">직급</span>
                      <span className="text-lg">{selectedEmployee.rank}</span>
                    </div>
                    <div className="flex col-span-2">
                      <span className="w-40 text-muted-foreground">소속</span>
                      <span>{selectedEmployee.organization}</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-muted-foreground">총 경력</span>
                      <span className="font-semibold text-primary">{selectedEmployee.totalYears}년</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-muted-foreground">유관프로젝트 경력</span>
                      <span className="font-semibold text-primary">{selectedEmployee.relatedProjectYears}년</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-muted-foreground">최종학위</span>
                      <span>{selectedEmployee.finalDegree}</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-muted-foreground">졸업년월</span>
                      <span>{selectedEmployee.graduationDate}</span>
                    </div>
                    <div className="flex col-span-2">
                      <span className="w-40 text-muted-foreground">전공</span>
                      <span>{selectedEmployee.major}</span>
                    </div>
                    <div className="flex col-span-2">
                      <span className="w-40 text-muted-foreground">거주지</span>
                      <span>{selectedEmployee.residence}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. 자격증 */}
              <section>
                <h3 className="text-xl mb-4 pb-3 border-b-2">자격증</h3>
                {employeeCompetencyData[selectedEmployee.code]?.certifications && employeeCompetencyData[selectedEmployee.code]?.certifications.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50 border-b">
                          <th className="px-4 py-3 text-left text-sm font-semibold">취득일</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">자격증명</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">취득/수료</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">발행기관</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeeCompetencyData[selectedEmployee.code].certifications.map((cert: any, idx: number) => (
                          <tr key={idx} className="border-b last:border-b-0 hover:bg-muted/20">
                            <td className="px-4 py-3 text-sm">{cert.date}</td>
                            <td className="px-4 py-3 text-sm font-medium">{cert.name}</td>
                            <td className="px-4 py-3 text-sm text-center">
                              <Badge variant={cert.type === '취득' ? 'default' : 'secondary'} className="text-xs">
                                {cert.type}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{cert.issuer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-muted-foreground">등록된 자격증이 없습니다.</div>
                )}
              </section>

              {/* 3. 기술능력 */}
              <section>
                <h3 className="text-xl mb-4 pb-3 border-b-2">기술능력</h3>
                {employeeCompetencyData[selectedEmployee.code]?.technicalSkills ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <div className="font-semibold mb-3 text-primary">소통능력</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {employeeCompetencyData[selectedEmployee.code].technicalSkills.communicationSkill}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-semibold mb-3 text-primary">오피스 활용능력</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {employeeCompetencyData[selectedEmployee.code].technicalSkills.officeSkill}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-semibold mb-3 text-primary">테스트 설계능력</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {employeeCompetencyData[selectedEmployee.code].technicalSkills.testDesignSkill}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-semibold mb-3 text-primary">테스트 수행능력</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {employeeCompetencyData[selectedEmployee.code].technicalSkills.testExecutionSkill}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">등록된 기술능력 정보가 없습니다.</div>
                )}
              </section>

              {/* 4. 사용가능 툴 */}
              <section>
                <h3 className="text-xl mb-4 pb-3 border-b-2">사용가능 도구</h3>
                {employeeCompetencyData[selectedEmployee.code]?.tools ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <div className="font-semibold mb-3 text-primary">결함 관리 도구</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {employeeCompetencyData[selectedEmployee.code].tools.defectManagementTool}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-semibold mb-3 text-primary">커뮤니케이션 도구</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {employeeCompetencyData[selectedEmployee.code].tools.communicationTool}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-semibold mb-3 text-primary">API 도구</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {employeeCompetencyData[selectedEmployee.code].tools.apiTool}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="font-semibold mb-3 text-primary">기타 도구</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {employeeCompetencyData[selectedEmployee.code].tools.otherTool}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">등록된 도구가 없습니다.</div>
                )}
              </section>

              {/* 5. 프로젝트 경력 요약 */}
              <section>
                <h3 className="text-xl mb-4 pb-3 border-b-2">프로젝트 경력 요약</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold">고객사명</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">프로젝트명</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">수행업무내역</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">수행기간</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">역할</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">인력수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployee.projectCareers.map((project: any, idx: number) => (
                        <tr key={idx} className="border-b last:border-b-0 hover:bg-muted/20">
                          <td className="px-4 py-3 text-sm">{project.client}</td>
                          <td className="px-4 py-3 text-sm font-medium">{project.projectName}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{project.description}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">{project.period}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="secondary" className="text-xs">{project.role}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">{project.teamSize}명</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 6. 프로젝트 경력 상세 */}
              <section className="page-break-before">
                <h3 className="text-xl mb-5 pb-3 border-b-2">프로젝트 경력 상세</h3>
                <div className="space-y-6">
                  {selectedEmployee.projectCareers.map((project: any, idx: number) => (
                    <div key={idx} className="border-2 rounded-xl overflow-hidden">
                      {/* 프로젝트 헤더 */}
                      <div className="bg-muted/30 px-6 py-4 border-b-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{project.projectName}</h4>
                              <Badge variant="secondary" className="text-sm">{project.role}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{project.client} · {project.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{project.period}</div>
                            <div className="text-sm text-primary font-medium">({calculateDuration(project.period)})</div>
                          </div>
                        </div>
                      </div>

                      {/* 프로젝트 상세 정보 */}
                      <div className="p-6 space-y-5">
                        {/* 기본 정보 */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1.5">과제분야</div>
                            <div className="font-medium">{project.field}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1.5">인력수</div>
                            <div className="font-medium">{project.teamSize}명</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1.5">위치</div>
                            <div className="font-medium">{project.location}</div>
                          </div>
                        </div>

                        {/* 사용도구 */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-2">사용도구</div>
                          <div className="flex flex-wrap gap-2">
                            {project.tools.split(',').map((tool: string, toolIdx: number) => (
                              <Badge key={toolIdx} variant="outline" className="text-sm">
                                {tool.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* 과제개요 */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-2">과제개요</div>
                          <p className="text-sm leading-relaxed bg-muted/20 p-4 rounded-lg">
                            {project.overview}
                          </p>
                        </div>

                        {/* 진행업무상세내용 */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-2">진행업무상세내용</div>
                          <p className="text-sm leading-relaxed bg-muted/20 p-4 rounded-lg">
                            {project.detailWork}
                          </p>
                        </div>

                        {/* 프로젝트 기여사항 */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-2">프로젝트 기여사항</div>
                          <div className="text-sm leading-relaxed bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                            {project.contribution}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 작성일 */}
              <div className="text-right text-muted-foreground mt-12 pt-6 border-t-2">
                작성일: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-32">
              <User className="size-24 text-muted-foreground mb-6" />
              <p className="text-xl text-muted-foreground mb-2">직원을 검색하여 선택해주세요</p>
              <p className="text-muted-foreground">상단 검색창에서 이름 또는 사번을 입력하세요</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 인쇄용 스타일 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
}