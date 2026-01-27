import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Laptop, Package, TrendingUp, TrendingDown, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useState } from 'react';

// 자산 데이터 타입 정의
interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  department: string;
  purchaseDate: string;
  assignee?: string;
  serialNumber: string;
}

// 자산 연령대별 분포 (현재: 2025년 12월 18일 기준)
const calculateAssetAge = (purchaseDateStr: string): number => {
  const [year, month, day] = purchaseDateStr.split('.').map(Number);
  const purchaseDate = new Date(year, month - 1, day);
  const currentDate = new Date(2025, 11, 18);
  const ageInYears = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return ageInYears;
};

// 자산 데이터 생성 함수
const generateAssets = (): Asset[] => {
  const assetTypes = [
    { type: '노트북', count: 125 },
    { type: '키보드', count: 150 },
    { type: '모니터', count: 180 },
    { type: '휴대폰', count: 90 },
    { type: '기타', count: 50 }
  ];

  const departments = ['STE1실', 'STE2실', '기타'];
  const departmentRatios = { 'STE1실': 0.5, 'STE2실': 0.375, '기타': 0.125 };
  const statuses = [
    { status: '사용중', ratio: 0.848 },
    { status: '가용', ratio: 0.0286 },
    { status: '수리중', ratio: 0.084 },
    { status: '폐기예정', ratio: 0.0394 }
  ];

  const assets: Asset[] = [];
  let assetId = 1;
  let oldAssetCount = 0;
  const targetOldAssets = 97; // 노후 자산 목표 개수

  assetTypes.forEach(({ type, count }) => {
    for (let i = 0; i < count; i++) {
      // 상태 결정
      const statusRand = Math.random();
      let cumulativeRatio = 0;
      let status = '사용중';
      for (const s of statuses) {
        cumulativeRatio += s.ratio;
        if (statusRand <= cumulativeRatio) {
          status = s.status;
          break;
        }
      }

      // 부서 결정
      const deptRand = Math.random();
      let department = 'STE1실';
      if (deptRand < departmentRatios['STE1실']) {
        department = 'STE1실';
      } else if (deptRand < departmentRatios['STE1실'] + departmentRatios['STE2실']) {
        department = 'STE2실';
      } else {
        department = '기타';
      }

      // 구매일자 결정 (노후 자산 97개 맞추기)
      let yearsAgo: number;
      let monthsAgo: number;
      
      // 전체 자산 중 97개를 노후 자산으로 설정
      if (oldAssetCount < targetOldAssets && Math.random() < 0.17) {
        // 3년 이상 (노후 자산)
        yearsAgo = 3 + Math.floor(Math.random() * 2); // 3~4년
        monthsAgo = Math.floor(Math.random() * 12);
        oldAssetCount++;
      } else if (oldAssetCount >= targetOldAssets) {
        // 3년 미만 (신규 자산)
        yearsAgo = Math.floor(Math.random() * 3); // 0~2년
        monthsAgo = Math.floor(Math.random() * 12);
      } else {
        // 랜덤
        yearsAgo = Math.floor(Math.random() * 5);
        monthsAgo = Math.floor(Math.random() * 12);
      }

      const purchaseDate = new Date(2025, 11, 18);
      purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsAgo);
      purchaseDate.setMonth(purchaseDate.getMonth() - monthsAgo);
      const purchaseDateStr = `${purchaseDate.getFullYear()}.${String(purchaseDate.getMonth() + 1).padStart(2, '0')}.${String(purchaseDate.getDate()).padStart(2, '0')}`;

      // 담당자 (사용중인 경우만)
      const assignee = status === '사용중' ? `사용자${Math.floor(Math.random() * 120) + 1}` : undefined;

      assets.push({
        id: assetId++,
        name: `${type}-${String(i + 1).padStart(3, '0')}`,
        type,
        status,
        department,
        purchaseDate: purchaseDateStr,
        assignee,
        serialNumber: `SN${String(assetId).padStart(6, '0')}`
      });
    }
  });

  // 정확히 97개가 되도록 조정
  const currentOldAssets = assets.filter(a => calculateAssetAge(a.purchaseDate) >= 3);
  const diff = targetOldAssets - currentOldAssets.length;
  
  if (diff > 0) {
    // 더 필요하면 신규 자산을 노후 자산으로 변경
    const newAssets = assets.filter(a => calculateAssetAge(a.purchaseDate) < 3);
    for (let i = 0; i < Math.min(diff, newAssets.length); i++) {
      const asset = newAssets[i];
      const yearsAgo = 3 + Math.floor(Math.random() * 2);
      const purchaseDate = new Date(2025, 11, 18);
      purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsAgo);
      asset.purchaseDate = `${purchaseDate.getFullYear()}.${String(purchaseDate.getMonth() + 1).padStart(2, '0')}.${String(purchaseDate.getDate()).padStart(2, '0')}`;
    }
  } else if (diff < 0) {
    // 너무 많으면 노후 자산을 신규 자산으로 변경
    for (let i = 0; i < Math.abs(diff); i++) {
      const asset = currentOldAssets[i];
      const yearsAgo = Math.floor(Math.random() * 3);
      const purchaseDate = new Date(2025, 11, 18);
      purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsAgo);
      asset.purchaseDate = `${purchaseDate.getFullYear()}.${String(purchaseDate.getMonth() + 1).padStart(2, '0')}.${String(purchaseDate.getDate()).padStart(2, '0')}`;
    }
  }

  return assets;
};

const assets = generateAssets();

// 통계 계산
const totalAssets = assets.length;
const inUseAssets = assets.filter(a => a.status === '사용중').length;
const availableAssets = assets.filter(a => a.status === '가용').length;
const underRepairAssets = assets.filter(a => a.status === '수리중').length;
const toBeDisposedAssets = assets.filter(a => a.status === '폐기예정').length;
const utilizationRate = Math.round((inUseAssets / totalAssets) * 100);

// 자산 유형별 분포
const assetTypeDistribution = [
  { name: '노트북', 수량: assets.filter(a => a.type === '노트북').length },
  { name: '키보드', 수량: assets.filter(a => a.type === '키보드').length },
  { name: '모니터', 수량: assets.filter(a => a.type === '모니터').length },
  { name: '휴대폰', 수량: assets.filter(a => a.type === '휴대폰').length },
  { name: '기타', 수량: assets.filter(a => a.type === '기타').length }
];

// 자산 유형별 상태 분포
const assetTypeByStatus = [
  { 
    name: '노트북', 
    사용중: assets.filter(a => a.type === '노트북' && a.status === '사용중').length,
    가용: assets.filter(a => a.type === '노트북' && a.status === '가용').length,
    수리중: assets.filter(a => a.type === '노트북' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.type === '노트북' && a.status === '폐기예정').length
  },
  { 
    name: '키보드', 
    사용중: assets.filter(a => a.type === '키보드' && a.status === '사용중').length,
    가용: assets.filter(a => a.type === '키보드' && a.status === '가용').length,
    수리중: assets.filter(a => a.type === '키보드' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.type === '키보드' && a.status === '폐기예정').length
  },
  { 
    name: '모니터', 
    사용중: assets.filter(a => a.type === '모니터' && a.status === '사용중').length,
    가용: assets.filter(a => a.type === '모니터' && a.status === '가용').length,
    수리중: assets.filter(a => a.type === '모니터' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.type === '모니터' && a.status === '폐기예정').length
  },
  { 
    name: '휴대폰', 
    사용중: assets.filter(a => a.type === '휴대폰' && a.status === '사용중').length,
    가용: assets.filter(a => a.type === '휴대폰' && a.status === '가용').length,
    수리중: assets.filter(a => a.type === '휴대폰' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.type === '휴대폰' && a.status === '폐기예정').length
  },
  { 
    name: '기타', 
    사용중: assets.filter(a => a.type === '기타' && a.status === '사용중').length,
    가용: assets.filter(a => a.type === '기타' && a.status === '가용').length,
    수리중: assets.filter(a => a.type === '기타' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.type === '기타' && a.status === '폐기예정').length
  }
];

// 자산 유형별 노후/신규 분포
const assetTypeWithAge = [
  { 
    name: '노트북', 
    신규자산: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) < 3).length,
    노후자산: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) >= 3).length
  },
  { 
    name: '키보드', 
    신규자산: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) < 3).length,
    노후자산: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) >= 3).length
  },
  { 
    name: '모니터', 
    신규자산: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) < 3).length,
    노후자산: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) >= 3).length
  },
  { 
    name: '휴대폰', 
    신규자산: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) < 3).length,
    노후자산: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) >= 3).length
  },
  { 
    name: '기타', 
    신규자산: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) < 3).length,
    노후자산: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) >= 3).length
  }
];

// 자산 상태별 분포
const assetStatusDistribution = [
  { name: '사용중', 수량: inUseAssets, 비율: Math.round((inUseAssets / totalAssets) * 100) },
  { name: '가용', 수량: availableAssets, 비율: Math.round((availableAssets / totalAssets) * 100) },
  { name: '수리중', 수량: underRepairAssets, 비율: Math.round((underRepairAssets / totalAssets) * 100) },
  { name: '폐기예정', 수량: toBeDisposedAssets, 비율: Math.round((toBeDisposedAssets / totalAssets) * 100) }
];

// 부서별 자산 배정
const departmentAssetDistribution = [
  { name: 'STE1실', 자산수: assets.filter(a => a.department === 'STE1실').length },
  { name: 'STE2실', 자산수: assets.filter(a => a.department === 'STE2실').length },
  { name: '기타', 자산수: assets.filter(a => a.department === '기타').length }
];

// 연도별 자산 도입 추이 (최근 5년) - 유형별
const assetAcquisitionTrend = [
  { year: '2021', 노트북: 25, 키보드: 30, 모니터: 35, 휴대폰: 18, 기타: 10 },
  { year: '2022', 노트북: 28, 키보드: 35, 모니터: 38, 휴대폰: 20, 기타: 12 },
  { year: '2023', 노트북: 30, 키보드: 32, 모니터: 42, 휴대폰: 22, 기타: 15 },
  { year: '2024', 노트북: 22, 키보드: 28, 모니터: 36, 휴대폰: 16, 기타: 8 },
  { year: '2025', 노트북: 20, 키보드: 25, 모니터: 29, 휴대폰: 14, 기타: 5 }
];

// 자산 상태별 월별 추이 (최근 12개월)
const assetStatusTrend = [
  { month: '2025.01', 사용중: 480, 가용: 12, 수리중: 45, 폐기예정: 18 },
  { month: '2025.02', 사용중: 485, 가용: 15, 수리중: 42, 폐기예정: 20 },
  { month: '2025.03', 사용중: 490, 가용: 13, 수리중: 48, 폐기예정: 22 },
  { month: '2025.04', 사용중: 495, 가용: 18, 수리중: 40, 폐기예정: 19 },
  { month: '2025.05', 사용중: 492, 가용: 14, 수리중: 50, 폐기예정: 21 },
  { month: '2025.06', 사용중: 498, 가용: 16, 수리중: 44, 폐기예정: 23 },
  { month: '2025.07', 사용중: 500, 가용: 19, 수리중: 46, 폐기예정: 20 },
  { month: '2025.08', 사용중: 505, 가용: 15, 수리중: 48, 폐기예정: 22 },
  { month: '2025.09', 사용중: 502, 가용: 17, 수리중: 50, 폐기예정: 21 },
  { month: '2025.10', 사용중: 508, 가용: 14, 수리중: 47, 폐기예정: 23 },
  { month: '2025.11', 사용중: 510, 가용: 16, 수리중: 49, 폐기예정: 22 },
  { month: '2025.12', 사용중: inUseAssets, 가용: availableAssets, 수리중: underRepairAssets, 폐기예정: toBeDisposedAssets }
];

// 자산 연령 분포 (전체 자산)
const assetAgeDistribution = [
  { 
    range: '0-1년', 
    수량: assets.filter(a => {
      const age = calculateAssetAge(a.purchaseDate);
      return age >= 0 && age < 1;
    }).length 
  },
  { 
    range: '1-2년', 
    수량: assets.filter(a => {
      const age = calculateAssetAge(a.purchaseDate);
      return age >= 1 && age < 2;
    }).length 
  },
  { 
    range: '2-3년', 
    수량: assets.filter(a => {
      const age = calculateAssetAge(a.purchaseDate);
      return age >= 2 && age < 3;
    }).length 
  },
  { 
    range: '3-4년', 
    수량: assets.filter(a => {
      const age = calculateAssetAge(a.purchaseDate);
      return age >= 3 && age < 4;
    }).length 
  },
  { 
    range: '4년 이상', 
    수량: assets.filter(a => {
      const age = calculateAssetAge(a.purchaseDate);
      return age >= 4;
    }).length 
  }
];

// 자산 연령 분포 (유형별)
const assetAgeDistributionByType = [
  { 
    range: '0-1년',
    노트북: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) >= 0 && calculateAssetAge(a.purchaseDate) < 1).length,
    키보드: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) >= 0 && calculateAssetAge(a.purchaseDate) < 1).length,
    모니터: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) >= 0 && calculateAssetAge(a.purchaseDate) < 1).length,
    휴대폰: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) >= 0 && calculateAssetAge(a.purchaseDate) < 1).length,
    기타: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) >= 0 && calculateAssetAge(a.purchaseDate) < 1).length
  },
  { 
    range: '1-2년',
    노트북: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) >= 1 && calculateAssetAge(a.purchaseDate) < 2).length,
    키보드: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) >= 1 && calculateAssetAge(a.purchaseDate) < 2).length,
    모니터: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) >= 1 && calculateAssetAge(a.purchaseDate) < 2).length,
    휴대폰: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) >= 1 && calculateAssetAge(a.purchaseDate) < 2).length,
    기타: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) >= 1 && calculateAssetAge(a.purchaseDate) < 2).length
  },
  { 
    range: '2-3년',
    노트북: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) >= 2 && calculateAssetAge(a.purchaseDate) < 3).length,
    키보드: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) >= 2 && calculateAssetAge(a.purchaseDate) < 3).length,
    모니터: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) >= 2 && calculateAssetAge(a.purchaseDate) < 3).length,
    휴대폰: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) >= 2 && calculateAssetAge(a.purchaseDate) < 3).length,
    기타: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) >= 2 && calculateAssetAge(a.purchaseDate) < 3).length
  },
  { 
    range: '3-4년',
    노트북: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) >= 3 && calculateAssetAge(a.purchaseDate) < 4).length,
    키보드: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) >= 3 && calculateAssetAge(a.purchaseDate) < 4).length,
    모니터: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) >= 3 && calculateAssetAge(a.purchaseDate) < 4).length,
    휴대폰: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) >= 3 && calculateAssetAge(a.purchaseDate) < 4).length,
    기타: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) >= 3 && calculateAssetAge(a.purchaseDate) < 4).length
  },
  { 
    range: '4년 이상',
    노트북: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) >= 4).length,
    키보드: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) >= 4).length,
    모니터: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) >= 4).length,
    휴대폰: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) >= 4).length,
    기타: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) >= 4).length
  }
];

// 노후 자산 계산 (3년 이상)
const oldAssets = assets.filter(a => calculateAssetAge(a.purchaseDate) >= 3).length;
const oldAssetsRatio = Math.round((oldAssets / totalAssets) * 100);

// 노후 자산 유형별 분포 (3년 이상)
const oldAssetsByType = [
  { 
    유형: '노트북', 
    노후자산: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) >= 3).length,
    신규자산: assets.filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) < 3).length,
    전체: assets.filter(a => a.type === '노트북').length
  },
  { 
    유형: '키보드', 
    노후자산: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) >= 3).length,
    신규자산: assets.filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) < 3).length,
    전체: assets.filter(a => a.type === '키보드').length
  },
  { 
    유형: '모니터', 
    노후자산: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) >= 3).length,
    신규자산: assets.filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) < 3).length,
    전체: assets.filter(a => a.type === '모니터').length
  },
  { 
    유형: '휴대폰', 
    노후자산: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) >= 3).length,
    신규자산: assets.filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) < 3).length,
    전체: assets.filter(a => a.type === '휴대폰').length
  },
  { 
    유형: '기타', 
    노후자산: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) >= 3).length,
    신규자산: assets.filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) < 3).length,
    전체: assets.filter(a => a.type === '기타').length
  }
];

// 노후 자산 목록 (3년 이상) - 유형별로 분류
const oldAssetsByTypeGrouped = {
  '노트북': assets
    .filter(a => a.type === '노트북' && calculateAssetAge(a.purchaseDate) >= 3)
    .sort((a, b) => calculateAssetAge(b.purchaseDate) - calculateAssetAge(a.purchaseDate))
    .map(asset => ({
      ...asset,
      age: Math.floor(calculateAssetAge(asset.purchaseDate))
    })),
  '키보드': assets
    .filter(a => a.type === '키보드' && calculateAssetAge(a.purchaseDate) >= 3)
    .sort((a, b) => calculateAssetAge(b.purchaseDate) - calculateAssetAge(a.purchaseDate))
    .map(asset => ({
      ...asset,
      age: Math.floor(calculateAssetAge(asset.purchaseDate))
    })),
  '모니터': assets
    .filter(a => a.type === '모니터' && calculateAssetAge(a.purchaseDate) >= 3)
    .sort((a, b) => calculateAssetAge(b.purchaseDate) - calculateAssetAge(a.purchaseDate))
    .map(asset => ({
      ...asset,
      age: Math.floor(calculateAssetAge(asset.purchaseDate))
    })),
  '휴대폰': assets
    .filter(a => a.type === '휴대폰' && calculateAssetAge(a.purchaseDate) >= 3)
    .sort((a, b) => calculateAssetAge(b.purchaseDate) - calculateAssetAge(a.purchaseDate))
    .map(asset => ({
      ...asset,
      age: Math.floor(calculateAssetAge(asset.purchaseDate))
    })),
  '기타': assets
    .filter(a => a.type === '기타' && calculateAssetAge(a.purchaseDate) >= 3)
    .sort((a, b) => calculateAssetAge(b.purchaseDate) - calculateAssetAge(a.purchaseDate))
    .map(asset => ({
      ...asset,
      age: Math.floor(calculateAssetAge(asset.purchaseDate))
    }))
};

// 가용 자산 목록 - 유형별로 분류
const availableAssetsByTypeGrouped = {
  '노트북': assets.filter(a => a.type === '노트북' && a.status === '가용'),
  '키보드': assets.filter(a => a.type === '키보드' && a.status === '가용'),
  '모니터': assets.filter(a => a.type === '모니터' && a.status === '가용'),
  '휴대폰': assets.filter(a => a.type === '휴대폰' && a.status === '가용'),
  '기타': assets.filter(a => a.type === '기타' && a.status === '가용')
};

// 차트 색상
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// 자산 계 (상단 KPI)
const assetStats = [
  {
    title: '전체 자산',
    value: `${totalAssets}개`,
    change: '+8%',
    trend: 'up',
    icon: Package,
    description: '등록된 자산 총계'
  },
  {
    title: '자산 활용률',
    value: `${utilizationRate}%`,
    change: '+5%',
    trend: 'up',
    icon: TrendingUp,
    description: `사용중 ${inUseAssets}개`
  },
  {
    title: '가용 자산',
    value: `${availableAssets}개`,
    change: '-2개',
    trend: 'down',
    icon: CheckCircle,
    description: '배정 가능 자산'
  },
  {
    title: '노후 자산',
    value: `${oldAssets}개`,
    change: '+12%',
    trend: 'up',
    icon: AlertCircle,
    description: `전체의 ${oldAssetsRatio}%`
  }
];

export function AssetDashboard() {
  const [openOldAssets, setOpenOldAssets] = useState<Record<string, boolean>>({});
  const [openAvailableAssets, setOpenAvailableAssets] = useState<Record<string, boolean>>({});

  const toggleOldAsset = (type: string) => {
    setOpenOldAssets(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleAvailableAsset = (type: string) => {
    setOpenAvailableAssets(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>자산</h1>
        <p className="text-muted-foreground mt-1">IT 자산 현황 및 관리 정보</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {assetStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span>전년 대비</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>자산 유형별 보유 현황</CardTitle>
            <CardDescription>유형별 상태 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assetTypeByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  label={{ value: '자산 수량 (개)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                />
                <Legend />
                <Bar dataKey="사용중" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="가용" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="수리중" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="폐기예정" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>자산 연령 분포</CardTitle>
            <CardDescription>보유 자산의 연령대별 유형 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assetAgeDistributionByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="range" 
                  stroke="hsl(var(--muted-foreground))" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  label={{ value: '자산 수량 (개)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px'
                  }}
                />
                <Legend />
                <Bar dataKey="노트북" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="키보드" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="모니터" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="휴대폰" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="기타" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>


      {/* Tabs Section */}
      <Tabs defaultValue="old" className="space-y-6">
        <TabsList>
          <TabsTrigger value="old">노후 자산</TabsTrigger>
          <TabsTrigger value="available">가용 자산</TabsTrigger>
        </TabsList>

        <TabsContent value="old" className="space-y-4">
          {Object.entries(oldAssetsByTypeGrouped).map(([type, assetList]) => (
            assetList.length > 0 && (
              <Collapsible key={type} open={openOldAssets[type] || false} onOpenChange={() => toggleOldAsset(type)}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-left">{type}</CardTitle>
                          <Badge variant="outline">{assetList.length}개</Badge>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openOldAssets[type] ? 'rotate-180' : ''}`} />
                      </div>
                      <CardDescription className="text-left">3년 이상 경과한 {type} 목록</CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {assetList.map((asset) => (
                          <div
                            key={asset.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h4>{asset.name}</h4>
                                <Badge className="bg-amber-500 hover:bg-amber-600">{asset.age}년 경과</Badge>
                                <Badge variant="outline">{asset.status}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>부서: {asset.department}</span>
                                <span>소유자: {asset.assignee || '미배정'}</span>
                                <span>구매일: {asset.purchaseDate}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                S/N: {asset.serialNumber}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          ))}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {Object.entries(availableAssetsByTypeGrouped).map(([type, assetList]) => (
            assetList.length > 0 && (
              <Collapsible key={type} open={openAvailableAssets[type] || false} onOpenChange={() => toggleAvailableAsset(type)}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-left">{type}</CardTitle>
                          <Badge variant="outline">{assetList.length}개</Badge>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openAvailableAssets[type] ? 'rotate-180' : ''}`} />
                      </div>
                      <CardDescription className="text-left">즉시 배정 가능한 {type} 목록</CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {assetList.map((asset) => (
                          <div
                            key={asset.id}
                            className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4>{asset.name}</h4>
                                <Badge className="bg-green-500 hover:bg-green-600">가용</Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span>{asset.department}</span>
                                <span>구매일: {asset.purchaseDate}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                S/N: {asset.serialNumber}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}