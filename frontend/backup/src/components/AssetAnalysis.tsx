import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Package, Laptop, TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// 자산 데이터 타입 정의
interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  department: string;
  purchaseDate: string;
  purchasePrice: number;
  assignee?: string;
  serialNumber: string;
}

// 자산 연령 계산 (현재: 2025년 12월 26일 기준)
const calculateAssetAge = (purchaseDateStr: string): number => {
  const [year, month, day] = purchaseDateStr.split('.').map(Number);
  const purchaseDate = new Date(year, month - 1, day);
  const currentDate = new Date(2025, 11, 26);
  const ageInYears = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return ageInYears;
};

// 감가상각 계산 (정액법, 내용연수 5년)
const calculateDepreciation = (purchasePrice: number, ageInYears: number): number => {
  const usefulLife = 5;
  const annualDepreciation = purchasePrice / usefulLife;
  const totalDepreciation = Math.min(annualDepreciation * ageInYears, purchasePrice);
  return totalDepreciation;
};

// 자산 데이터 생성
const generateAssets = (): Asset[] => {
  const assetTypes = [
    { type: '노트북', count: 125, avgPrice: 1500000 },
    { type: '데스크탑', count: 45, avgPrice: 1200000 },
    { type: '모니터', count: 180, avgPrice: 300000 },
    { type: '키보드/마우스', count: 150, avgPrice: 100000 },
    { type: '휴대폰', count: 90, avgPrice: 800000 },
    { type: '기타', count: 5, avgPrice: 500000 }
  ];

  const departments = ['STE1실', 'STE2실', '경영전략실', '개발연구소', 'STE그룹'];
  const departmentRatios = { 
    'STE1실': 0.30, 
    'STE2실': 0.28, 
    '경영전략실': 0.20, 
    '개발연구소': 0.18,
    'STE그룹': 0.04
  };
  
  const statuses = [
    { status: '사용중', ratio: 0.848 },
    { status: '가용', ratio: 0.0286 },
    { status: '수리중', ratio: 0.084 },
    { status: '폐기예정', ratio: 0.0394 }
  ];

  const assets: Asset[] = [];
  let assetId = 1;
  let oldAssetCount = 0;
  const targetOldAssets = 97;

  assetTypes.forEach(({ type, count, avgPrice }) => {
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
      let cumDept = 0;
      for (const [dept, ratio] of Object.entries(departmentRatios)) {
        cumDept += ratio;
        if (deptRand <= cumDept) {
          department = dept;
          break;
        }
      }

      // 구매일자 결정
      let yearsAgo: number;
      let monthsAgo: number;
      
      if (oldAssetCount < targetOldAssets && Math.random() < 0.17) {
        yearsAgo = 3 + Math.floor(Math.random() * 2);
        monthsAgo = Math.floor(Math.random() * 12);
        oldAssetCount++;
      } else if (oldAssetCount >= targetOldAssets) {
        yearsAgo = Math.floor(Math.random() * 3);
        monthsAgo = Math.floor(Math.random() * 12);
      } else {
        yearsAgo = Math.floor(Math.random() * 5);
        monthsAgo = Math.floor(Math.random() * 12);
      }

      const purchaseDate = new Date(2025, 11, 26);
      purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsAgo);
      purchaseDate.setMonth(purchaseDate.getMonth() - monthsAgo);
      const purchaseDateStr = `${purchaseDate.getFullYear()}.${String(purchaseDate.getMonth() + 1).padStart(2, '0')}.${String(purchaseDate.getDate()).padStart(2, '0')}`;

      // 가격 변동 (±20%)
      const priceVariation = 0.8 + Math.random() * 0.4;
      const purchasePrice = Math.round(avgPrice * priceVariation);

      // 담당자
      const assignee = status === '사용중' ? `사용자${Math.floor(Math.random() * 120) + 1}` : undefined;

      assets.push({
        id: assetId++,
        name: `${type}-${String(i + 1).padStart(3, '0')}`,
        type,
        status,
        department,
        purchaseDate: purchaseDateStr,
        purchasePrice,
        assignee,
        serialNumber: `SN${String(assetId).padStart(6, '0')}`
      });
    }
  });

  // 노후 자산 수 조정
  const currentOldAssets = assets.filter(a => calculateAssetAge(a.purchaseDate) >= 3);
  const diff = targetOldAssets - currentOldAssets.length;
  
  if (diff > 0) {
    const newAssets = assets.filter(a => calculateAssetAge(a.purchaseDate) < 3);
    for (let i = 0; i < Math.min(diff, newAssets.length); i++) {
      const asset = newAssets[i];
      const yearsAgo = 3 + Math.floor(Math.random() * 2);
      const purchaseDate = new Date(2025, 11, 26);
      purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsAgo);
      asset.purchaseDate = `${purchaseDate.getFullYear()}.${String(purchaseDate.getMonth() + 1).padStart(2, '0')}.${String(purchaseDate.getDate()).padStart(2, '0')}`;
    }
  } else if (diff < 0) {
    for (let i = 0; i < Math.abs(diff); i++) {
      const asset = currentOldAssets[i];
      const yearsAgo = Math.floor(Math.random() * 3);
      const purchaseDate = new Date(2025, 11, 26);
      purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsAgo);
      asset.purchaseDate = `${purchaseDate.getFullYear()}.${String(purchaseDate.getMonth() + 1).padStart(2, '0')}.${String(purchaseDate.getDate()).padStart(2, '0')}`;
    }
  }

  return assets;
};

const assets = generateAssets();

// 주요 지표 계산
const totalAssets = assets.length;
const inUseAssets = assets.filter(a => a.status === '사용중').length;
const availableAssets = assets.filter(a => a.status === '가용').length;
const underRepairAssets = assets.filter(a => a.status === '수리중').length;
const toBeDisposedAssets = assets.filter(a => a.status === '폐기예정').length;
const oldAssets = assets.filter(a => calculateAssetAge(a.purchaseDate) >= 3).length;
const utilizationRate = Math.round((inUseAssets / totalAssets) * 100);

// 총 자산 가치 계산
const totalPurchaseValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
const totalDepreciation = assets.reduce((sum, a) => {
  const age = calculateAssetAge(a.purchaseDate);
  return sum + calculateDepreciation(a.purchasePrice, age);
}, 0);
const totalBookValue = totalPurchaseValue - totalDepreciation;

// 자산 유형별 분포
const assetTypeDistribution = [
  { name: '노트북', 수량: assets.filter(a => a.type === '노트북').length, value: assets.filter(a => a.type === '노트북').length },
  { name: '데스크탑', 수량: assets.filter(a => a.type === '데스크탑').length, value: assets.filter(a => a.type === '데스크탑').length },
  { name: '모니터', 수량: assets.filter(a => a.type === '모니터').length, value: assets.filter(a => a.type === '모니터').length },
  { name: '키보드/마우스', 수량: assets.filter(a => a.type === '키보드/마우스').length, value: assets.filter(a => a.type === '키보드/마우스').length },
  { name: '휴대폰', 수량: assets.filter(a => a.type === '휴대폰').length, value: assets.filter(a => a.type === '휴대폰').length },
  { name: '기타', 수량: assets.filter(a => a.type === '기타').length, value: assets.filter(a => a.type === '기타').length }
];

// 자산 상태별 분포
const assetStatusDistribution = [
  { name: '사용중', 수량: inUseAssets, value: inUseAssets },
  { name: '가용', 수량: availableAssets, value: availableAssets },
  { name: '수리중', 수량: underRepairAssets, value: underRepairAssets },
  { name: '폐기예정', 수량: toBeDisposedAssets, value: toBeDisposedAssets }
];

// 부서별 자산 현황
const departmentDistribution = [
  { 
    dept: 'STE1실', 
    총자산: assets.filter(a => a.department === 'STE1실').length,
    사용중: assets.filter(a => a.department === 'STE1실' && a.status === '사용중').length,
    가용: assets.filter(a => a.department === 'STE1실' && a.status === '가용').length,
    수리중: assets.filter(a => a.department === 'STE1실' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.department === 'STE1실' && a.status === '폐기예정').length
  },
  { 
    dept: 'STE2실', 
    총자산: assets.filter(a => a.department === 'STE2실').length,
    사용중: assets.filter(a => a.department === 'STE2실' && a.status === '사용중').length,
    가용: assets.filter(a => a.department === 'STE2실' && a.status === '가용').length,
    수리중: assets.filter(a => a.department === 'STE2실' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.department === 'STE2실' && a.status === '폐기예정').length
  },
  { 
    dept: '경영전략실', 
    총자산: assets.filter(a => a.department === '경영전략실').length,
    사용중: assets.filter(a => a.department === '경영전략실' && a.status === '사용중').length,
    가용: assets.filter(a => a.department === '경영전략실' && a.status === '가용').length,
    수리중: assets.filter(a => a.department === '경영전략실' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.department === '경영전략실' && a.status === '폐기예정').length
  },
  { 
    dept: '개발연구소', 
    총자산: assets.filter(a => a.department === '개발연구소').length,
    사용중: assets.filter(a => a.department === '개발연구소' && a.status === '사용중').length,
    가용: assets.filter(a => a.department === '개발연구소' && a.status === '가용').length,
    수리중: assets.filter(a => a.department === '개발연구소' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.department === '개발연구소' && a.status === '폐기예정').length
  },
  { 
    dept: 'STE그룹', 
    총자산: assets.filter(a => a.department === 'STE그룹').length,
    사용중: assets.filter(a => a.department === 'STE그룹' && a.status === '사용중').length,
    가용: assets.filter(a => a.department === 'STE그룹' && a.status === '가용').length,
    수리중: assets.filter(a => a.department === 'STE그룹' && a.status === '수리중').length,
    폐기예정: assets.filter(a => a.department === 'STE그룹' && a.status === '폐기예정').length
  }
];

// 자산 연령 분포
const assetAgeDistribution = [
  { age: '1년 미만', 수량: assets.filter(a => calculateAssetAge(a.purchaseDate) < 1).length },
  { age: '1-2년', 수량: assets.filter(a => {
    const age = calculateAssetAge(a.purchaseDate);
    return age >= 1 && age < 2;
  }).length },
  { age: '2-3년', 수량: assets.filter(a => {
    const age = calculateAssetAge(a.purchaseDate);
    return age >= 2 && age < 3;
  }).length },
  { age: '3년 이상', 수량: assets.filter(a => calculateAssetAge(a.purchaseDate) >= 3).length }
];

// 월별 자산 취득 추이 (최근 12개월)
const monthlyAcquisition = (() => {
  const data = [];
  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(2025, 11, 26);
    targetDate.setMonth(targetDate.getMonth() - i);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    
    const count = assets.filter(a => {
      const [y, m] = a.purchaseDate.split('.').map(Number);
      return y === year && m === month;
    }).length;
    
    data.push({
      month: `${year}.${String(month).padStart(2, '0')}`,
      수량: count
    });
  }
  return data;
})();

// 자산 유형별 평균 연령
const assetTypeAvgAge = [
  { 
    type: '노트북', 
    평균연령: Math.round(
      assets.filter(a => a.type === '노트북')
        .reduce((sum, a) => sum + calculateAssetAge(a.purchaseDate), 0) / 
      assets.filter(a => a.type === '노트북').length * 10
    ) / 10
  },
  { 
    type: '데스크탑', 
    평균연령: Math.round(
      assets.filter(a => a.type === '데스크탑')
        .reduce((sum, a) => sum + calculateAssetAge(a.purchaseDate), 0) / 
      assets.filter(a => a.type === '데스크탑').length * 10
    ) / 10
  },
  { 
    type: '모니터', 
    평균연령: Math.round(
      assets.filter(a => a.type === '모니터')
        .reduce((sum, a) => sum + calculateAssetAge(a.purchaseDate), 0) / 
      assets.filter(a => a.type === '모니터').length * 10
    ) / 10
  },
  { 
    type: '키보드/마우스', 
    평균연령: Math.round(
      assets.filter(a => a.type === '키보드/마우스')
        .reduce((sum, a) => sum + calculateAssetAge(a.purchaseDate), 0) / 
      assets.filter(a => a.type === '키보드/마우스').length * 10
    ) / 10
  },
  { 
    type: '휴대폰', 
    평균연령: Math.round(
      assets.filter(a => a.type === '휴대폰')
        .reduce((sum, a) => sum + calculateAssetAge(a.purchaseDate), 0) / 
      assets.filter(a => a.type === '휴대폰').length * 10
    ) / 10
  }
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f97316'];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 0
  }).format(value);
};

export function AssetAnalysis() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1>현황분석</h1>
        <p className="text-muted-foreground mt-1">자산 현황, 가치 분석, 노후 자산 현황을 확인하고 통계를 분석하세요</p>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 자산</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}개</div>
            <p className="text-xs text-muted-foreground mt-1">
              전체 보유 자산
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">사용중 자산</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inUseAssets}개</div>
            <p className="text-xs text-muted-foreground mt-1">
              활용률 {utilizationRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">가용 자산</CardTitle>
            <Laptop className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableAssets}개</div>
            <p className="text-xs text-muted-foreground mt-1">
              즉시 배정 가능
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">노후 자산</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{oldAssets}개</div>
            <p className="text-xs text-muted-foreground mt-1">
              3년 이상 경과
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 탭 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="type">유형별 분석</TabsTrigger>
          <TabsTrigger value="department">부서별 분석</TabsTrigger>
          <TabsTrigger value="aging">노후도 분석</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 자산 유형별 분포 */}
            <Card>
              <CardHeader>
                <CardTitle>자산 유형별 분포</CardTitle>
                <CardDescription>각 자산 유형별 보유 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assetTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {assetTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {assetTypeDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm">{item.name}: {item.수량}개</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 자산 상태별 분포 */}
            <Card>
              <CardHeader>
                <CardTitle>자산 상태별 분포</CardTitle>
                <CardDescription>자산의 현재 사용 상태</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assetStatusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">사용중: {inUseAssets}개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">가용: {availableAssets}개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm">수리중: {underRepairAssets}개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">폐기예정: {toBeDisposedAssets}개</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 월별 자산 취득 추이 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>월별 자산 취득 추이</CardTitle>
                <CardDescription>최근 12개월 자산 구매 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyAcquisition}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="수량" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 유형별 분석 탭 */}
        <TabsContent value="type" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 자산 유형별 수량 */}
            <Card>
              <CardHeader>
                <CardTitle>자산 유형별 보유 현황</CardTitle>
                <CardDescription>각 유형별 자산 수량</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={assetTypeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="수량" fill="#3b82f6" name="보유 수량" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 자산 유형별 평균 연령 */}
            <Card>
              <CardHeader>
                <CardTitle>자산 유형별 평균 연령</CardTitle>
                <CardDescription>각 유형별 평균 사용 연수</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={assetTypeAvgAge}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="평균연령" fill="#8b5cf6" name="평균 연령 (년)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* 상세 통계 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>자산 유형별 상세 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">자산 유형</th>
                      <th className="text-center p-3">총 수량</th>
                      <th className="text-center p-3">사용중</th>
                      <th className="text-center p-3">가용</th>
                      <th className="text-center p-3">수리중</th>
                      <th className="text-center p-3">폐기예정</th>
                      <th className="text-center p-3">활용률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['노트북', '데스크탑', '모니터', '키보드/마우스', '휴대폰', '기타'].map(type => {
                      const total = assets.filter(a => a.type === type).length;
                      const inUse = assets.filter(a => a.type === type && a.status === '사용중').length;
                      const available = assets.filter(a => a.type === type && a.status === '가용').length;
                      const repair = assets.filter(a => a.type === type && a.status === '수리중').length;
                      const dispose = assets.filter(a => a.type === type && a.status === '폐기예정').length;
                      const utilRate = total > 0 ? Math.round((inUse / total) * 100) : 0;
                      
                      return (
                        <tr key={type} className="border-b">
                          <td className="p-3">{type}</td>
                          <td className="text-center p-3">{total}</td>
                          <td className="text-center p-3">{inUse}</td>
                          <td className="text-center p-3">{available}</td>
                          <td className="text-center p-3">{repair}</td>
                          <td className="text-center p-3">{dispose}</td>
                          <td className="text-center p-3">
                            <Badge variant={utilRate >= 80 ? 'default' : 'secondary'}>
                              {utilRate}%
                            </Badge>
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

        {/* 부서별 분석 탭 */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>부서별 자산 현황</CardTitle>
              <CardDescription>각 부서의 자산 보유 및 활용 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="사용중" stackId="a" fill="#10b981" />
                  <Bar dataKey="가용" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="수리중" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="폐기예정" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 부서별 상세 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>부서별 상세 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">부서</th>
                      <th className="text-center p-3">총 자산</th>
                      <th className="text-center p-3">사용중</th>
                      <th className="text-center p-3">가용</th>
                      <th className="text-center p-3">수리중</th>
                      <th className="text-center p-3">폐기예정</th>
                      <th className="text-center p-3">활용률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentDistribution.map(dept => {
                      const utilRate = dept.총자산 > 0 ? Math.round((dept.사용중 / dept.총자산) * 100) : 0;
                      return (
                        <tr key={dept.dept} className="border-b">
                          <td className="p-3">{dept.dept}</td>
                          <td className="text-center p-3">{dept.총자산}</td>
                          <td className="text-center p-3">{dept.사용중}</td>
                          <td className="text-center p-3">{dept.가용}</td>
                          <td className="text-center p-3">{dept.수리중}</td>
                          <td className="text-center p-3">{dept.폐기예정}</td>
                          <td className="text-center p-3">
                            <Badge variant={utilRate >= 80 ? 'default' : 'secondary'}>
                              {utilRate}%
                            </Badge>
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

        {/* 노후도 분석 탭 */}
        <TabsContent value="aging" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 자산 연령 분포 */}
            <Card>
              <CardHeader>
                <CardTitle>자산 연령 분포</CardTitle>
                <CardDescription>보유 자산의 연령대별 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={assetAgeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="수량" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 노후 자산 현황 */}
            <Card>
              <CardHeader>
                <CardTitle>노후 자산 경고</CardTitle>
                <CardDescription>3년 이상 경과 자산 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="font-semibold">노후 자산 총 {oldAssets}개</p>
                        <p className="text-sm text-muted-foreground">전체 자산의 {Math.round((oldAssets / totalAssets) * 100)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">유형별 노후 자산</p>
                    {['노트북', '데스크탑', '모니터', '키보드/마우스', '휴대폰'].map(type => {
                      const oldCount = assets.filter(a => a.type === type && calculateAssetAge(a.purchaseDate) >= 3).length;
                      const total = assets.filter(a => a.type === type).length;
                      const percentage = total > 0 ? Math.round((oldCount / total) * 100) : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{oldCount}개</span>
                            <Badge variant={percentage >= 20 ? 'destructive' : 'secondary'}>
                              {percentage}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm font-medium mb-2">💡 권장 사항</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 3년 이상 노트북/데스크탑은 성능 저하 가능성</li>
                      <li>• 교체 계획 수립 검토 필요</li>
                      <li>• 보증 기간 만료 확인 권장</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}