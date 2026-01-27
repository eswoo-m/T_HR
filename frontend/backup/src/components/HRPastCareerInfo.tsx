import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

// 기간 계산 함수 (년/월 형식으로 반환)
const calculateDuration = (period: string): { years: number; months: number } => {
  try {
    // "2020.01 ~ 2021.12" 형식 파싱
    const parts = period.split('~').map(p => p.trim());
    if (parts.length !== 2) return { years: 0, months: 0 };
    
    const start = parts[0].replace(/\s/g, '');
    const end = parts[1].replace(/\s/g, '');
    
    // "진행중" 또는 "현재"인 경우 현재 날짜 사용
    const isOngoing = end.includes('진행중') || end.includes('현재');
    
    const startMatch = start.match(/(\d{4})\.(\d{2})/);
    if (!startMatch) return { years: 0, months: 0 };
    
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
      if (!endMatch) return { years: 0, months: 0 };
      endYear = parseInt(endMatch[1]);
      endMonth = parseInt(endMatch[2]);
    }
    
    let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    return { years, months };
  } catch (error) {
    return { years: 0, months: 0 };
  }
};

// 여러 경력의 총 기간 계산
const calculateTotalDuration = (careers: { period: string }[]): string => {
  let totalMonths = 0;
  careers.forEach(career => {
    const duration = calculateDuration(career.period);
    totalMonths += duration.years * 12 + duration.months;
  });
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0 && months === 0) return '0개월';
  if (years === 0) return `${months}개월`;
  if (months === 0) return `${years}년`;
  return `${years}년 ${months}개월`;
};

// 총경력을 년/월 형식으로 변환 (totalYears는 소수점 가능: 5.5년 = 5년 6개월)
const formatTotalYears = (years: number): string => {
  const totalMonths = Math.round(years * 12);
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  
  if (y === 0 && m === 0) return '0개월';
  if (y === 0) return `${m}개월`;
  if (m === 0) return `${y}년`;
  return `${y}년 ${m}개월`;
};

// 직원 과거경력 인터페이스
interface PastCareer {
  id: string;
  client: string;
  projectName: string;
  description: string;
  period: string;
  role: string;
}

interface EmployeePastCareer {
  name: string;
  code: string;
  rank: string;
  position: string;
  department: string;
  team: string;
  skillLevel: string;
  totalYears: number; // 총 경력 년수
  careerCount: number; // 프로젝트 개수
  pastCareers: PastCareer[];
}

const allEmployeePastCareers: EmployeePastCareer[] = [
  // 대표이사
  { 
    name: '김종균', code: 'EMP-001', rank: '임원급', position: '대표이사', department: '대표이사', team: '대표이사',
    skillLevel: '고급', totalYears: 25, careerCount: 8,
    pastCareers: [
      { id: '1', client: 'ABC기업', projectName: 'ERP 시스템 구축', description: '프로젝트 총괄', period: '2005.01 ~ 2007.12', role: 'PM' },
      { id: '2', client: 'XYZ그룹', projectName: '통합 솔루션 개발', description: '시스템 설계 및 구현', period: '2008.01 ~ 2009.12', role: 'PL' },
    ]
  },
  
  // STE그룹 - 사장/실장
  { 
    name: '박성호', code: 'EMP-101', rank: '임원급', position: '사장', department: 'STE그룹', team: 'STE그룹',
    skillLevel: '고급', totalYears: 22, careerCount: 12,
    pastCareers: [
      { id: '1', client: '삼성전자', projectName: 'IoT 플랫폼 개발', description: 'Backend 시스템 설계', period: '2010.03 ~ 2012.12', role: 'PL' },
      { id: '2', client: 'LG유플러스', projectName: '5G 서비스 개발', description: '통신 시스템 구축', period: '2013.01 ~ 2015.06', role: 'PM' },
    ]
  },
  { 
    name: '김종협', code: 'EMP-102', rank: '임원급', position: '실장', department: 'STE그룹', team: 'STE그룹',
    skillLevel: '고급', totalYears: 17, careerCount: 9,
    pastCareers: [
      { id: '1', client: '현대자동차', projectName: '커넥티드카 시스템', description: '차량 통신 시스템 개발', period: '2015.01 ~ 2017.12', role: 'PL' },
      { id: '2', client: 'SK텔레콤', projectName: '통합 플랫폼 구축', description: 'API 서버 개발', period: '2018.01 ~ 2019.12', role: '개발팀장' },
    ]
  },
  
  // STE1실 - 이사
  { 
    name: '강현규', code: 'EMP-111', rank: '임원급', position: '이사', department: 'STE1실', team: 'STE1실',
    skillLevel: '고급', totalYears: 15, careerCount: 10,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: '스마트홈 시스템', description: '홈 IoT 플랫폼 개발', period: '2018.01 ~ 2020.12', role: 'PL' },
      { id: '2', client: '네이버', projectName: '클라우드 서비스 구축', description: '인프라 설계 및 개발', period: '2021.01 ~ 2022.06', role: 'PM' },
    ]
  },
  
  // STE1실 - LG전자 1팀
  { 
    name: '전광희', code: 'EMP-1111', rank: '책임', position: '팀장', department: 'STE1실', team: 'LG전자 1팀',
    skillLevel: '고급', totalYears: 12, careerCount: 7,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: 'TV OS 개발', description: 'webOS 기능 개발', period: '2019.03 ~ 2021.12', role: '선임개발자' },
      { id: '2', client: 'LG전자', projectName: '가전제품 연동 앱', description: 'ThinQ 앱 개발', period: '2022.01 ~ 2023.06', role: 'PL' },
    ]
  },
  { 
    name: '정홍근', code: 'EMP-1112', rank: '사원', position: '사원', department: 'STE1실', team: 'LG전자 1팀',
    skillLevel: '초급', totalYears: 2, careerCount: 1,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: '모바일 앱 개발', description: 'React Native 앱 개발', period: '2023.01 ~ 2024.06', role: '개발자' },
    ]
  },
  
  // STE1실 - LG전자 2팀
  { 
    name: '이길원', code: 'EMP-1121', rank: '책임', position: '팀장', department: 'STE1실', team: 'LG전자 2팀',
    skillLevel: '고급', totalYears: 13, careerCount: 8,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: '품질관리 시스템', description: '테스트 자동화 구축', period: '2018.01 ~ 2020.12', role: 'QA 팀장' },
      { id: '2', client: 'LG전자', projectName: '제조 시스템 고도화', description: '공정 자동화', period: '2021.01 ~ 2022.12', role: 'PL' },
    ]
  },
  { 
    name: '이성미', code: 'EMP-1122', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 2팀',
    skillLevel: '중급', totalYears: 8, careerCount: 5,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: '데이터 분석 플랫폼', description: 'BI 시스템 개발', period: '2020.01 ~ 2022.06', role: '개발자' },
      { id: '2', client: 'LG전자', projectName: 'AI 모델 서빙', description: 'ML 파이프라인 구축', period: '2022.07 ~ 2024.03', role: '선임개발자' },
    ]
  },
  { 
    name: '조혜진', code: 'EMP-1123', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 2팀',
    skillLevel: '중급', totalYears: 7, careerCount: 4,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: 'B2B 포털 개발', description: 'Frontend 개발', period: '2021.01 ~ 2023.12', role: '개발자' },
    ]
  },
  { 
    name: '이나리', code: 'EMP-1124', rank: '선임', position: '선임', department: 'STE1실', team: 'LG전자 2팀',
    skillLevel: '중급', totalYears: 5, careerCount: 3,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: '모바일 앱 리뉴얼', description: 'UI/UX 개선', period: '2022.01 ~ 2024.06', role: '개발자' },
    ]
  },
  
  // STE1실 - LG전자 4팀
  { 
    name: '박준수', code: 'EMP-1141', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 4팀',
    skillLevel: '중급', totalYears: 7, careerCount: 4,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: 'ERP 고도화', description: 'Backend API 개발', period: '2021.01 ~ 2023.12', role: '개발자' },
    ]
  },
  { 
    name: '용상수', code: 'EMP-1142', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 4팀',
    skillLevel: '중급', totalYears: 6, careerCount: 3,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: '데이터 웨어하우스', description: '데이터 ETL 개발', period: '2022.01 ~ 2024.06', role: '개발자' },
    ]
  },
  { 
    name: '김규현', code: 'EMP-1143', rank: '사원', position: '사원', department: 'STE1실', team: 'LG전자 4팀',
    skillLevel: '초급', totalYears: 1, careerCount: 1,
    pastCareers: [
      { id: '1', client: 'LG전자', projectName: '사내 시스템 개발', description: 'Java 개발', period: '2024.01 ~ 현재', role: '개발자' },
    ]
  },
  
  // STE2실 - GS리테일 1팀
  { 
    name: '조현균', code: 'EMP-1211', rank: '책임', position: '팀장', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '고급', totalYears: 14, careerCount: 9,
    pastCareers: [
      { id: '1', client: 'GS리테일', projectName: 'POS 시스템 구축', description: '매장 시스템 개발', period: '2018.01 ~ 2020.12', role: 'PL' },
      { id: '2', client: 'GS리테일', projectName: '옴니채널 플랫폼', description: '통합 주문 시스템', period: '2021.01 ~ 2023.06', role: 'PM' },
    ]
  },
  { 
    name: '조현정', code: 'EMP-1212', rank: '책임', position: '책임', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '중급', totalYears: 7, careerCount: 4,
    pastCareers: [
      { id: '1', client: 'GS리테일', projectName: '재고관리 시스템', description: 'Backend 개발', period: '2021.01 ~ 2023.12', role: '개발자' },
    ]
  },
  { 
    name: '최현준', code: 'EMP-1213', rank: '책임', position: '책임', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '중급', totalYears: 8, careerCount: 5,
    pastCareers: [
      { id: '1', client: 'GS리테일', projectName: '모바일 쿠폰 시스템', description: '쿠폰 발행 시스템', period: '2020.01 ~ 2022.12', role: '개발자' },
    ]
  },
  { 
    name: '강성희', code: 'EMP-1214', rank: '선임', position: '선임', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '중급', totalYears: 4, careerCount: 2,
    pastCareers: [
      { id: '1', client: 'GS리테일', projectName: '고객 앱 개발', description: 'React 앱 개발', period: '2023.01 ~ 2024.12', role: '개발자' },
    ]
  },
  { 
    name: '강문혁', code: 'EMP-1215', rank: '사원', position: '사원', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '초급', totalYears: 2, careerCount: 1,
    pastCareers: [
      { id: '1', client: 'GS리테일', projectName: '관리자 시스템', description: 'Backend 개발', period: '2023.01 ~ 현재', role: '개발자' },
    ]
  },
  
  // STE2실 - HDC랩스 1팀
  { 
    name: '장대열', code: 'EMP-1221', rank: '선임', position: '선임', department: 'STE2실', team: 'HDC랩스 1팀',
    skillLevel: '중급', totalYears: 5, careerCount: 3,
    pastCareers: [
      { id: '1', client: 'HDC랩스', projectName: '부동산 플랫폼', description: 'Frontend 개발', period: '2022.01 ~ 2024.06', role: '개발자' },
    ]
  },
  
  // STE2실 - KT 알파1팀
  { 
    name: '윤제진', code: 'EMP-1231', rank: '수석', position: '수석', department: 'STE2실', team: 'KT 알파1팀',
    skillLevel: '고급', totalYears: 12, careerCount: 8,
    pastCareers: [
      { id: '1', client: 'KT', projectName: '5G 코어 시스템', description: '통신 인프라 구축', period: '2019.01 ~ 2021.12', role: 'PL' },
      { id: '2', client: 'KT', projectName: 'IoT 플랫폼 개발', description: 'Device 연동 시스템', period: '2022.01 ~ 2023.12', role: 'PM' },
    ]
  },
  { 
    name: '신진욱', code: 'EMP-1232', rank: '수석', position: '수석', department: 'STE2실', team: 'KT 알파1팀',
    skillLevel: '고급', totalYears: 11, careerCount: 7,
    pastCareers: [
      { id: '1', client: 'KT', projectName: '클라우드 마이그레이션', description: 'AWS 전환 프로젝트', period: '2019.01 ~ 2021.06', role: '개발자' },
      { id: '2', client: 'KT', projectName: 'AI 서비스 개발', description: 'ML 모델 개발', period: '2021.07 ~ 2023.12', role: 'PL' },
    ]
  },
  { 
    name: '이영택', code: 'EMP-1233', rank: '책임', position: '책임', department: 'STE2실', team: 'KT 알파1팀',
    skillLevel: '중급', totalYears: 6, careerCount: 3,
    pastCareers: [
      { id: '1', client: 'KT', projectName: '빅데이터 분석', description: '데이터 파이프라인 구축', period: '2022.01 ~ 2024.06', role: '개발자' },
    ]
  },
  
  // 경영전략실 - 경영지원팀
  { 
    name: '김완수', code: 'EMP-2101', rank: '임원급', position: '부사장', department: '경영전략실', team: '경영지원팀',
    skillLevel: '고급', totalYears: 18, careerCount: 6,
    pastCareers: [
      { id: '1', client: '내부', projectName: '경영시스템 구축', description: 'ERP 도입 및 운영', period: '2015.01 ~ 2018.12', role: 'PM' },
    ]
  },
  { 
    name: '이현직', code: 'EMP-2102', rank: '임원급', position: '실장', department: '경영전략실', team: '경영지원팀',
    skillLevel: '고급', totalYears: 16, careerCount: 5,
    pastCareers: [
      { id: '1', client: '내부', projectName: '인사시스템 고도화', description: 'HR 시스템 개발', period: '2016.01 ~ 2019.12', role: 'PL' },
    ]
  },
  { 
    name: '김예림', code: 'EMP-2103', rank: '선임', position: '파트장', department: '경영전략실', team: '경영지원팀',
    skillLevel: '중급', totalYears: 10, careerCount: 4,
    pastCareers: [
      { id: '1', client: '내부', projectName: '경영관리 시스템', description: '재무 시스템 관리', period: '2020.01 ~ 2023.12', role: '관리자' },
    ]
  },
  { 
    name: '가라현', code: 'EMP-2104', rank: '사원', position: '사원', department: '경영전략실', team: '경영지원팀',
    skillLevel: '초급', totalYears: 2, careerCount: 1,
    pastCareers: [
      { id: '1', client: '내부', projectName: '업무 자동화', description: 'RPA 도입', period: '2023.01 ~ 현재', role: '담당자' },
    ]
  },
  { 
    name: '신소영', code: 'EMP-2105', rank: '사원', position: '사원', department: '경영전략실', team: '경영지원팀',
    skillLevel: '초급', totalYears: 1, careerCount: 1,
    pastCareers: [
      { id: '1', client: '내부', projectName: '문서관리 시스템', description: '전자결재 시스템', period: '2024.01 ~ 현재', role: '담당자' },
    ]
  },
  
  // 경영전략실 - 사업전략팀
  { 
    name: '이유라', code: 'EMP-2201', rank: '선임', position: '선임', department: '경영전략실', team: '사업전략팀',
    skillLevel: '중급', totalYears: 5, careerCount: 3,
    pastCareers: [
      { id: '1', client: '내부', projectName: '사업계획 수립', description: '전략 기획', period: '2022.01 ~ 2024.12', role: '기획자' },
    ]
  },
  { 
    name: '주호정', code: 'EMP-2202', rank: '사원', position: '사원', department: '경영전략실', team: '사업전략팀',
    skillLevel: '초급', totalYears: 2, careerCount: 1,
    pastCareers: [
      { id: '1', client: '내부', projectName: '시장 분석', description: '경쟁사 분석', period: '2023.01 ~ 현재', role: '담당자' },
    ]
  },
  { 
    name: '김연서', code: 'EMP-2203', rank: '사원', position: '사원', department: '경영전략실', team: '사업전략팀',
    skillLevel: '초급', totalYears: 1, careerCount: 1,
    pastCareers: [
      { id: '1', client: '내부', projectName: '신규 사업 발굴', description: 'BM 개발', period: '2024.01 ~ 현재', role: '담당자' },
    ]
  },
  
  // 개발연구소 - 본부
  { 
    name: '김태영', code: 'EMP-301', rank: '임원급', position: '부사장', department: '개발연구소', team: '개발연구소',
    skillLevel: '고급', totalYears: 20, careerCount: 15,
    pastCareers: [
      { id: '1', client: '삼성SDS', projectName: 'ERP 솔루션 개발', description: '핵심 모듈 개발', period: '2005.01 ~ 2010.12', role: 'PL' },
      { id: '2', client: 'SK C&C', projectName: '클라우드 플랫폼', description: '아키텍처 설계', period: '2011.01 ~ 2014.12', role: 'PM' },
    ]
  },
  { 
    name: '이혜진', code: 'EMP-302', rank: '임원급', position: '이사', department: '개발연구소', team: '개발연구소',
    skillLevel: '고급', totalYears: 16, careerCount: 12,
    pastCareers: [
      { id: '1', client: 'LG CNS', projectName: '스마트팩토리 시스템', description: 'IoT 플랫폼 개발', period: '2008.01 ~ 2012.12', role: 'PL' },
      { id: '2', client: '네이버', projectName: '검색 엔진 고도화', description: 'Backend 시스템', period: '2013.01 ~ 2015.12', role: 'PM' },
    ]
  },
  { 
    name: '우은순', code: 'EMP-303', rank: '책임', position: '팀장', department: '개발연구소', team: '개발연구소',
    skillLevel: '중급', totalYears: 12, careerCount: 8,
    pastCareers: [
      { id: '1', client: '카카오', projectName: '메시징 플랫폼', description: '실시간 메시징 시스템', period: '2013.01 ~ 2016.12', role: '개발자' },
      { id: '2', client: '쿠팡', projectName: '물류 시스템', description: '재고 관리 시스템', period: '2017.01 ~ 2018.12', role: 'PL' },
    ]
  },
  { 
    name: '김지연', code: 'EMP-304', rank: '사원', position: '사원', department: '개발연구소', team: '개발연구소',
    skillLevel: '초급', totalYears: 2, careerCount: 1,
    pastCareers: [
      { id: '1', client: '스타트업', projectName: 'SaaS 플랫폼 개발', description: 'Frontend 개발', period: '2023.01 ~ 2024.12', role: '개발자' },
    ]
  },
  { 
    name: '추경운', code: 'EMP-305', rank: '사원', position: '사원', department: '개발연구소', team: '개발연구소',
    skillLevel: '초급', totalYears: 2, careerCount: 1,
    pastCareers: [
      { id: '1', client: '스타트업', projectName: '데이터 분석 플랫폼', description: 'Python 개발', period: '2023.01 ~ 2024.12', role: '개발자' },
    ]
  },
  
  // 개발연구소 - 자동화개발팀
  { 
    name: '김준하', code: 'EMP-3101', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '중급', totalYears: 4, careerCount: 2,
    pastCareers: [
      { id: '1', client: '내부', projectName: '테스트 자동화', description: 'Selenium 프레임워크', period: '2023.01 ~ 2024.12', role: '개발자' },
    ]
  },
  { 
    name: '이유나', code: 'EMP-3102', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '중급', totalYears: 5, careerCount: 3,
    pastCareers: [
      { id: '1', client: '내부', projectName: 'CI/CD 파이프라인', description: 'Jenkins 구축', period: '2022.01 ~ 2024.12', role: '개발자' },
    ]
  },
  { 
    name: '유정선', code: 'EMP-3103', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '중급', totalYears: 4, careerCount: 2,
    pastCareers: [
      { id: '1', client: '내부', projectName: 'RPA 개발', description: 'UiPath 프로젝트', period: '2023.01 ~ 2024.12', role: '개발자' },
    ]
  },
  { 
    name: '손진빈', code: 'EMP-3104', rank: '사원', position: '사원', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '초급', totalYears: 1, careerCount: 1,
    pastCareers: [
      { id: '1', client: '내부', projectName: '모니터링 시스템', description: 'Grafana 구축', period: '2024.01 ~ 현재', role: '개발자' },
    ]
  },
  { 
    name: '유예진', code: 'EMP-3105', rank: '사원', position: '사원', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '초급', totalYears: 1, careerCount: 1,
    pastCareers: [
      { id: '1', client: '내부', projectName: '자동화 도구 개발', description: 'Script 개발', period: '2024.01 ~ 현재', role: '개발자' },
    ]
  },
];

interface HRPastCareerInfoProps {
  onEmployeeClick?: (code: string, tab?: string) => void;
}

export function HRPastCareerInfo({ onEmployeeClick }: HRPastCareerInfoProps) {
  const [deptFilter, setDeptFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');
  const [skillLevelFilter, setSkillLevelFilter] = useState('all');
  const [careerYearsFilter, setCareerYearsFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EmployeePastCareer>('totalYears');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // 선택된 부서의 팀 목록 가져오기
  const availableTeams = useMemo(() => {
    if (deptFilter === 'all') {
      return Array.from(new Set(allEmployeePastCareers.map(emp => emp.team))).sort();
    }
    return Array.from(new Set(allEmployeePastCareers.filter(emp => emp.department === deptFilter).map(emp => emp.team))).sort();
  }, [deptFilter]);

  // 통합 필터링된 직원 목록
  const filteredEmployees = useMemo(() => {
    return allEmployeePastCareers.filter(emp => {
      const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
      const matchesTeam = teamFilter === 'all' || emp.team === teamFilter;
      const matchesRank = rankFilter === 'all' || emp.rank === rankFilter;
      const matchesSkillLevel = skillLevelFilter === 'all' || emp.skillLevel === skillLevelFilter;
      const matchesCareerYears = careerYearsFilter === 'all' || (emp.totalYears >= parseInt(careerYearsFilter));
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDept && matchesTeam && matchesRank && matchesSkillLevel && matchesCareerYears && matchesSearch;
    });
  }, [deptFilter, teamFilter, rankFilter, skillLevelFilter, careerYearsFilter, searchTerm]);

  // 정렬
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue, 'ko')
          : bValue.localeCompare(aValue, 'ko');
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  const handleSort = (field: keyof EmployeePastCareer) => {
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
        <h1>경력정보</h1>
        <p className="text-muted-foreground mt-1">전 직원의 과거 경력 정보를 조회하세요</p>
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

          {/* 기술레벨 및 경력년차 선택 버튼 */}
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-3">
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

            <div>
              <label className="text-xs mb-1.5 block text-muted-foreground">경력년차</label>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant={careerYearsFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCareerYearsFilter('all')}
                >
                  전체
                </Button>
                <Button
                  variant={careerYearsFilter === '1' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCareerYearsFilter('1')}
                >
                  1년 이상
                </Button>
                <Button
                  variant={careerYearsFilter === '3' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCareerYearsFilter('3')}
                >
                  3년 이상
                </Button>
                <Button
                  variant={careerYearsFilter === '5' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCareerYearsFilter('5')}
                >
                  5년 이상
                </Button>
                <Button
                  variant={careerYearsFilter === '7' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCareerYearsFilter('7')}
                >
                  7년 이상
                </Button>
                <Button
                  variant={careerYearsFilter === '10' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCareerYearsFilter('10')}
                >
                  10년 이상
                </Button>
                <Button
                  variant={careerYearsFilter === '15' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCareerYearsFilter('15')}
                >
                  15년 이상
                </Button>
              </div>
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
                  <th 
                    className="text-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('careerCount')}
                  >
                    과거경력 {sortField === 'careerCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-center p-3 cursor-pointer hover:bg-accent"
                    onClick={() => handleSort('totalYears')}
                  >
                    총경력 {sortField === 'totalYears' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.length > 0 ? (
                  sortedEmployees.map((emp) => (
                    <tr 
                      key={emp.code} 
                      className="border-b hover:bg-accent/50 cursor-pointer" 
                      onClick={() => onEmployeeClick?.(emp.code, 'past-career')}
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
                      <td className="text-center p-3">
                        <Badge variant="outline">{calculateTotalDuration(emp.pastCareers)}</Badge>
                      </td>
                      <td className="text-center p-3">{formatTotalYears(emp.totalYears)}</td>
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