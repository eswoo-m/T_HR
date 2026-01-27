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

// 직원 프로젝트경력 인터페이스
interface ProjectCareer {
  id: string;
  client: string;
  projectName: string;
  description: string;
  period: string;
  role: string;
}

interface EmployeeProjectCareer {
  name: string;
  code: string;
  rank: string;
  position: string;
  department: string;
  team: string;
  skillLevel: string;
  totalYears: number; // 총 경력 년수
  projectCount: number; // 프로젝트 개수
  projectCareers: ProjectCareer[];
}

const allEmployeeProjectCareers: EmployeeProjectCareer[] = [
  // 대표이사
  { 
    name: '김종균', code: 'EMP-001', rank: '임원급', position: '대표이사', department: '대표이사', team: '대표이사',
    skillLevel: '고급', totalYears: 25, projectCount: 5,
    projectCareers: [
      { id: '1', client: '티벨 내부', projectName: '전사 디지털 전환 프로젝트', description: '전사 시스템 통합', period: '2023.01 ~ 진행중', role: 'PM' },
      { id: '2', client: '티벨 내부', projectName: '신규 사업 개발', description: '신사업 기획 및 추진', period: '2024.03 ~ 진행중', role: '총괄' },
    ]
  },
  
  // STE그룹 - 사장/실장
  { 
    name: '박성호', code: 'EMP-101', rank: '임원급', position: '사장', department: 'STE그룹', team: 'STE그룹',
    skillLevel: '고급', totalYears: 22, projectCount: 8,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: 'webOS 고도화', description: 'TV 플랫폼 개선', period: '2023.01 ~ 2024.12', role: 'PM' },
      { id: '2', client: 'GS리테일', projectName: '옴니채널 구축', description: '통합 유통 시스템', period: '2024.01 ~ 진행중', role: 'PM' },
    ]
  },
  { 
    name: '김종협', code: 'EMP-102', rank: '임원급', position: '실장', department: 'STE그룹', team: 'STE그룹',
    skillLevel: '고급', totalYears: 17, projectCount: 6,
    projectCareers: [
      { id: '1', client: 'KT', projectName: '5G 서비스 플랫폼', description: '통신 시스템 구축', period: '2023.06 ~ 2024.12', role: 'PM' },
      { id: '2', client: 'HDC랩스', projectName: '부동산 플랫폼', description: 'PropTech 시스템', period: '2024.03 ~ 진행중', role: 'PL' },
    ]
  },
  
  // STE1실 - 이사
  { 
    name: '강현규', code: 'EMP-111', rank: '임원급', position: '이사', department: 'STE1실', team: 'STE1실',
    skillLevel: '고급', totalYears: 15, projectCount: 7,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: 'ThinQ 앱 고도화', description: 'IoT 통합 앱', period: '2023.01 ~ 2024.06', role: 'PL' },
      { id: '2', client: 'LG전자', projectName: '스마트홈 시스템', description: 'Home IoT 플랫폼', period: '2024.07 ~ 진행중', role: 'PM' },
    ]
  },
  
  // STE1실 - LG전자 1팀
  { 
    name: '전광희', code: 'EMP-1111', rank: '책임', position: '팀장', department: 'STE1실', team: 'LG전자 1팀',
    skillLevel: '고급', totalYears: 12, projectCount: 5,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: 'webOS 6.0 개발', description: 'TV OS 기능 개발', period: '2023.03 ~ 2024.02', role: 'PL' },
      { id: '2', client: 'LG전자', projectName: 'AI ThinQ 연동', description: 'AI 음성인식 통합', period: '2024.03 ~ 진행중', role: 'PL' },
    ]
  },
  { 
    name: '정홍근', code: 'EMP-1112', rank: '사원', position: '사원', department: 'STE1실', team: 'LG전자 1팀',
    skillLevel: '초급', totalYears: 2, projectCount: 2,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: 'LG ThinQ 앱', description: 'React Native 개발', period: '2023.06 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'LG전자', projectName: '모바일 UI 개선', description: 'UX 리뉴얼', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  
  // STE1실 - LG전자 2팀
  { 
    name: '이길원', code: 'EMP-1121', rank: '책임', position: '팀장', department: 'STE1실', team: 'LG전자 2팀',
    skillLevel: '고급', totalYears: 13, projectCount: 6,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: '품질관리 자동화', description: 'QA 시스템 구축', period: '2023.01 ~ 2024.06', role: 'PL' },
      { id: '2', client: 'LG전자', projectName: '제조실행 시스템', description: 'MES 고도화', period: '2024.07 ~ 진행중', role: 'PL' },
    ]
  },
  { 
    name: '이성미', code: 'EMP-1122', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 2팀',
    skillLevel: '중급', totalYears: 8, projectCount: 4,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: 'BI 대시보드', description: '데이터 분석 플랫폼', period: '2023.03 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'LG전자', projectName: 'AI 예측 모델', description: 'ML 모델 개발', period: '2024.06 ~ 진행중', role: '선임개발자' },
    ]
  },
  { 
    name: '조혜진', code: 'EMP-1123', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 2팀',
    skillLevel: '중급', totalYears: 7, projectCount: 3,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: 'B2B 포털 구축', description: 'Enterprise 포털', period: '2023.01 ~ 2024.08', role: '개발자' },
      { id: '2', client: 'LG전자', projectName: '파트너 시스템', description: '협력사 관리', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '이나리', code: 'EMP-1124', rank: '선임', position: '선임', department: 'STE1실', team: 'LG전자 2팀',
    skillLevel: '중급', totalYears: 5, projectCount: 3,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: '고객센터 앱', description: 'CS 모바일 앱', period: '2023.06 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'LG전자', projectName: 'AR 매뉴얼', description: 'AR 기반 가이드', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  
  // STE1실 - LG전자 4팀
  { 
    name: '박준수', code: 'EMP-1141', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 4팀',
    skillLevel: '중급', totalYears: 7, projectCount: 3,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: 'ERP 통합', description: 'Backend API 개발', period: '2023.03 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'LG전자', projectName: '재고관리 시스템', description: 'Inventory System', period: '2024.06 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '용상수', code: 'EMP-1142', rank: '책임', position: '책임', department: 'STE1실', team: 'LG전자 4팀',
    skillLevel: '중급', totalYears: 6, projectCount: 3,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: '데이터 레이크', description: 'Big Data 플랫폼', period: '2023.06 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'LG전자', projectName: 'ETL 파이프라인', description: '데이터 통합', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '김규현', code: 'EMP-1143', rank: '사원', position: '사원', department: 'STE1실', team: 'LG전자 4팀',
    skillLevel: '초급', totalYears: 1, projectCount: 1,
    projectCareers: [
      { id: '1', client: 'LG전자', projectName: '사내 시스템 운영', description: 'Java 개발 및 유지보수', period: '2024.03 ~ 진행중', role: '개발자' },
    ]
  },
  
  // STE2실 - GS리테일 1팀
  { 
    name: '조현균', code: 'EMP-1211', rank: '책임', position: '팀장', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '고급', totalYears: 14, projectCount: 7,
    projectCareers: [
      { id: '1', client: 'GS리테일', projectName: '옴니채널 플랫폼', description: '통합 유통 시스템', period: '2023.01 ~ 2024.06', role: 'PM' },
      { id: '2', client: 'GS리테일', projectName: 'AI 추천 시스템', description: '개인화 추천 엔진', period: '2024.07 ~ 진행중', role: 'PM' },
    ]
  },
  { 
    name: '조현정', code: 'EMP-1212', rank: '책임', position: '책임', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '중급', totalYears: 7, projectCount: 3,
    projectCareers: [
      { id: '1', client: 'GS리테일', projectName: '재고관리 고도화', description: 'Inventory Optimization', period: '2023.03 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'GS리테일', projectName: 'WMS 구축', description: '창고관리 시스템', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '최현준', code: 'EMP-1213', rank: '책임', position: '책임', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '중급', totalYears: 8, projectCount: 4,
    projectCareers: [
      { id: '1', client: 'GS리테일', projectName: '쿠폰 플랫폼', description: '프로모션 시스템', period: '2023.01 ~ 2024.08', role: '개발자' },
      { id: '2', client: 'GS리테일', projectName: '멤버십 통합', description: '고객 로열티 시스템', period: '2024.09 ~ 진행중', role: 'PL' },
    ]
  },
  { 
    name: '강성희', code: 'EMP-1214', rank: '선임', position: '선임', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '중급', totalYears: 4, projectCount: 2,
    projectCareers: [
      { id: '1', client: 'GS리테일', projectName: 'GS25 앱 리뉴얼', description: 'Mobile App 개발', period: '2023.06 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'GS리테일', projectName: 'O2O 서비스', description: 'Online to Offline', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '강문혁', code: 'EMP-1215', rank: '사원', position: '사원', department: 'STE2실', team: 'GS리테일 1팀',
    skillLevel: '초급', totalYears: 2, projectCount: 2,
    projectCareers: [
      { id: '1', client: 'GS리테일', projectName: '관리자 대시보드', description: 'Admin Dashboard', period: '2023.09 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'GS리테일', projectName: '통계 분석 시스템', description: '매출 분석', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  
  // STE2실 - HDC랩스 1팀
  { 
    name: '장대열', code: 'EMP-1221', rank: '선임', position: '선임', department: 'STE2실', team: 'HDC랩스 1팀',
    skillLevel: '중급', totalYears: 5, projectCount: 3,
    projectCareers: [
      { id: '1', client: 'HDC랩스', projectName: '부동산 플랫폼 구축', description: 'PropTech 서비스', period: '2023.03 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'HDC랩스', projectName: 'VR 매물 투어', description: 'Virtual Tour System', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  
  // STE2실 - KT 알파1팀
  { 
    name: '윤제진', code: 'EMP-1231', rank: '수석', position: '수석', department: 'STE2실', team: 'KT 알파1팀',
    skillLevel: '고급', totalYears: 12, projectCount: 6,
    projectCareers: [
      { id: '1', client: 'KT', projectName: '5G 코어망 구축', description: 'Network Infrastructure', period: '2023.01 ~ 2024.06', role: 'PL' },
      { id: '2', client: 'KT', projectName: 'IoT 플랫폼', description: 'Device Management', period: '2024.07 ~ 진행중', role: 'PM' },
    ]
  },
  { 
    name: '신진욱', code: 'EMP-1232', rank: '수석', position: '수석', department: 'STE2실', team: 'KT 알파1팀',
    skillLevel: '고급', totalYears: 11, projectCount: 5,
    projectCareers: [
      { id: '1', client: 'KT', projectName: '클라우드 전환', description: 'Cloud Migration', period: '2023.03 ~ 2024.08', role: 'PL' },
      { id: '2', client: 'KT', projectName: 'AI 챗봇 서비스', description: 'Conversational AI', period: '2024.09 ~ 진행중', role: 'PL' },
    ]
  },
  { 
    name: '이영택', code: 'EMP-1233', rank: '책임', position: '책임', department: 'STE2실', team: 'KT 알파1팀',
    skillLevel: '중급', totalYears: 6, projectCount: 3,
    projectCareers: [
      { id: '1', client: 'KT', projectName: '빅데이터 분석', description: 'Data Analytics Platform', period: '2023.06 ~ 2024.12', role: '개발자' },
      { id: '2', client: 'KT', projectName: 'Real-time Dashboard', description: '실시간 모니터링', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  
  // 경영전략실 - 경영지원팀
  { 
    name: '김완수', code: 'EMP-2101', rank: '임원급', position: '부사장', department: '경영전략실', team: '경영지원팀',
    skillLevel: '고급', totalYears: 18, projectCount: 4,
    projectCareers: [
      { id: '1', client: '내부', projectName: '전사 ERP 고도화', description: 'ERP Upgrade', period: '2023.01 ~ 2024.06', role: 'PM' },
      { id: '2', client: '내부', projectName: '경영정보 시스템', description: 'MIS 구축', period: '2024.07 ~ 진행중', role: 'PM' },
    ]
  },
  { 
    name: '이현직', code: 'EMP-2102', rank: '임원급', position: '실장', department: '경영전략실', team: '경영지원팀',
    skillLevel: '고급', totalYears: 16, projectCount: 3,
    projectCareers: [
      { id: '1', client: '내부', projectName: '인사 시스템 구축', description: 'HR Management System', period: '2023.03 ~ 2024.12', role: 'PL' },
      { id: '2', client: '내부', projectName: '근태관리 자동화', description: 'Attendance System', period: '2024.09 ~ 진행중', role: 'PL' },
    ]
  },
  { 
    name: '김예림', code: 'EMP-2103', rank: '선임', position: '파트장', department: '경영전략실', team: '경영지원팀',
    skillLevel: '중급', totalYears: 10, projectCount: 3,
    projectCareers: [
      { id: '1', client: '내부', projectName: '회계 시스템 고도화', description: 'Accounting System', period: '2023.06 ~ 2024.12', role: '담당자' },
      { id: '2', client: '내부', projectName: '예산관리 시스템', description: 'Budget Planning', period: '2024.09 ~ 진행중', role: '담당자' },
    ]
  },
  { 
    name: '가라현', code: 'EMP-2104', rank: '사원', position: '사원', department: '경영전략실', team: '경영지원팀',
    skillLevel: '초급', totalYears: 2, projectCount: 1,
    projectCareers: [
      { id: '1', client: '내부', projectName: 'RPA 도입', description: 'Process Automation', period: '2023.09 ~ 진행중', role: '담당자' },
    ]
  },
  { 
    name: '신소영', code: 'EMP-2105', rank: '사원', position: '사원', department: '경영전략실', team: '경영지원팀',
    skillLevel: '초급', totalYears: 1, projectCount: 1,
    projectCareers: [
      { id: '1', client: '내부', projectName: '전자결재 시스템', description: 'Approval System', period: '2024.03 ~ 진행중', role: '담당자' },
    ]
  },
  
  // 경영전략실 - 사업전략팀
  { 
    name: '이유라', code: 'EMP-2201', rank: '선임', position: '선임', department: '경영전략실', team: '사업전략팀',
    skillLevel: '중급', totalYears: 5, projectCount: 2,
    projectCareers: [
      { id: '1', client: '내부', projectName: '2024 사업계획', description: '중장기 전략 수립', period: '2023.10 ~ 2024.03', role: '기획자' },
      { id: '2', client: '내부', projectName: '신규 사업 발굴', description: 'New Business', period: '2024.04 ~ 진행중', role: '기획자' },
    ]
  },
  { 
    name: '주호정', code: 'EMP-2202', rank: '사원', position: '사원', department: '경영전략실', team: '사업전략팀',
    skillLevel: '초급', totalYears: 2, projectCount: 1,
    projectCareers: [
      { id: '1', client: '내부', projectName: '시장 조사', description: 'Market Research', period: '2023.06 ~ 진행중', role: '담당자' },
    ]
  },
  { 
    name: '김연서', code: 'EMP-2203', rank: '사원', position: '사원', department: '경영전략실', team: '사업전략팀',
    skillLevel: '초급', totalYears: 1, projectCount: 1,
    projectCareers: [
      { id: '1', client: '내부', projectName: 'BM 개발', description: 'Business Model', period: '2024.03 ~ 진행중', role: '담당자' },
    ]
  },
  
  // 개발연구소 - 본부
  { 
    name: '김태영', code: 'EMP-301', rank: '임원급', position: '부사장', department: '개발연구소', team: '개발연구소',
    skillLevel: '고급', totalYears: 20, projectCount: 10,
    projectCareers: [
      { id: '1', client: '내부', projectName: 'AI 플랫폼 개발', description: 'AI/ML Platform', period: '2023.01 ~ 2024.06', role: 'PM' },
      { id: '2', client: '내부', projectName: '자동화 프레임워크', description: 'Automation Framework', period: '2024.07 ~ 진행중', role: 'PM' },
    ]
  },
  { 
    name: '이혜진', code: 'EMP-302', rank: '임원급', position: '이사', department: '개발연구소', team: '개발연구소',
    skillLevel: '고급', totalYears: 16, projectCount: 8,
    projectCareers: [
      { id: '1', client: '내부', projectName: 'IoT 플랫폼 R&D', description: 'IoT Research', period: '2023.03 ~ 2024.12', role: 'PM' },
      { id: '2', client: '내부', projectName: 'Edge Computing', description: 'Edge Platform', period: '2024.09 ~ 진행중', role: 'PM' },
    ]
  },
  { 
    name: '우은순', code: 'EMP-303', rank: '책임', position: '팀장', department: '개발연구소', team: '개발연구소',
    skillLevel: '중급', totalYears: 12, projectCount: 6,
    projectCareers: [
      { id: '1', client: '내부', projectName: '마이크로서비스 아키텍처', description: 'MSA 전환', period: '2023.06 ~ 2024.12', role: 'PL' },
      { id: '2', client: '내부', projectName: 'Container Platform', description: 'Kubernetes 구축', period: '2024.09 ~ 진행중', role: 'PL' },
    ]
  },
  { 
    name: '김지연', code: 'EMP-304', rank: '사원', position: '사원', department: '개발연구소', team: '개발연구소',
    skillLevel: '초급', totalYears: 2, projectCount: 2,
    projectCareers: [
      { id: '1', client: '내부', projectName: 'SaaS 플랫폼 POC', description: 'Proof of Concept', period: '2023.09 ~ 2024.06', role: '개발자' },
      { id: '2', client: '내부', projectName: 'Frontend Framework', description: 'React Library', period: '2024.07 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '추경운', code: 'EMP-305', rank: '사원', position: '사원', department: '개발연구소', team: '개발연구소',
    skillLevel: '초급', totalYears: 2, projectCount: 2,
    projectCareers: [
      { id: '1', client: '내부', projectName: '데이터 분석 도구', description: 'Analytics Tool', period: '2023.09 ~ 2024.06', role: '개발자' },
      { id: '2', client: '내부', projectName: 'ML Pipeline', description: 'Machine Learning', period: '2024.07 ~ 진행중', role: '개발자' },
    ]
  },
  
  // 개발연구소 - 자동화개발팀
  { 
    name: '김준하', code: 'EMP-3101', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '중급', totalYears: 4, projectCount: 3,
    projectCareers: [
      { id: '1', client: '내부', projectName: 'Test Automation', description: 'Selenium Framework', period: '2023.06 ~ 2024.12', role: '개발자' },
      { id: '2', client: '내부', projectName: 'API Testing', description: '자동화 테스트', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '이유나', code: 'EMP-3102', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '중급', totalYears: 5, projectCount: 3,
    projectCareers: [
      { id: '1', client: '내부', projectName: 'CI/CD 구축', description: 'Jenkins Pipeline', period: '2023.03 ~ 2024.08', role: '개발자' },
      { id: '2', client: '내부', projectName: 'DevOps 자동화', description: 'Infrastructure as Code', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '유정선', code: 'EMP-3103', rank: '선임', position: '선임', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '중급', totalYears: 4, projectCount: 2,
    projectCareers: [
      { id: '1', client: '내부', projectName: 'RPA 프로젝트', description: 'UiPath 개발', period: '2023.06 ~ 2024.12', role: '개발자' },
      { id: '2', client: '내부', projectName: '업무 자동화', description: 'Process Automation', period: '2024.09 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '손진빈', code: 'EMP-3104', rank: '사원', position: '사원', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '초급', totalYears: 1, projectCount: 1,
    projectCareers: [
      { id: '1', client: '내부', projectName: '모니터링 시스템', description: 'Grafana Dashboard', period: '2024.03 ~ 진행중', role: '개발자' },
    ]
  },
  { 
    name: '유예진', code: 'EMP-3105', rank: '사원', position: '사원', department: '개발연구소', team: '자동화개발팀',
    skillLevel: '초급', totalYears: 1, projectCount: 1,
    projectCareers: [
      { id: '1', client: '내부', projectName: '배포 자동화', description: 'Deployment Automation', period: '2024.03 ~ 진행중', role: '개발자' },
    ]
  },
];

interface HRProjectCareerInfoProps {
  onEmployeeClick?: (code: string, tab?: string) => void;
}

export function HRProjectCareerInfo({ onEmployeeClick }: HRProjectCareerInfoProps) {
  const [deptFilter, setDeptFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [rankFilter, setRankFilter] = useState('all');
  const [skillLevelFilter, setSkillLevelFilter] = useState('all');
  const [careerYearsFilter, setCareerYearsFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof EmployeeProjectCareer>('totalYears');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // 선택된 부서의 팀 목록 가져오기
  const availableTeams = useMemo(() => {
    if (deptFilter === 'all') {
      return Array.from(new Set(allEmployeeProjectCareers.map(emp => emp.team))).sort();
    }
    return Array.from(new Set(allEmployeeProjectCareers.filter(emp => emp.department === deptFilter).map(emp => emp.team))).sort();
  }, [deptFilter]);

  // 통합 필터링된 직원 목록
  const filteredEmployees = useMemo(() => {
    return allEmployeeProjectCareers.filter(emp => {
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

  const handleSort = (field: keyof EmployeeProjectCareer) => {
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
        <h1>프로젝트 경력</h1>
        <p className="text-muted-foreground mt-1">전 직원의 프로젝트 경력 정보를 조회하세요</p>
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

          {/* 기술레벨 및 경력년수 선택 버튼 */}
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
              <label className="text-xs mb-1.5 block text-muted-foreground">경력년수</label>
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
                    onClick={() => handleSort('projectCount')}
                  >
                    프로젝트 수 {sortField === 'projectCount' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                      onClick={() => onEmployeeClick?.(emp.code, 'project-career')}
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
                            emp.skillLevel === '��급' ? 'bg-blue-500' :
                            'bg-green-500'
                          }
                        >
                          {emp.skillLevel}
                        </Badge>
                      </td>
                      <td className="text-center p-3">
                        <Badge variant="outline">{emp.projectCount}개</Badge>
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