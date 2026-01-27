// 자산 데이터 타입
export interface Asset {
  assetCode: string;
  assetName: string;
  assetType: string;
  status: string;
  department: string;
  team: string;
  assignee: string;
  purchaseDate: string;
  purchasePrice: number;
  serialNumber: string;
  manufacturer: string;
  model: string;
  specifications: string;
  location: string;
  warrantyPeriod: string;
  assetNumber: string;
  note: string;
}

// 자산 연령 계산
export const calculateAssetAge = (purchaseDateStr: string): number => {
  const [year, month, day] = purchaseDateStr.split('.').map(Number);
  const purchaseDate = new Date(year, month - 1, day);
  const currentDate = new Date(2025, 11, 26);
  const ageInYears = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return ageInYears;
};

// 보증 기간 계산 (구매일로부터 3년)
const calculateWarrantyPeriod = (purchaseDateStr: string): string => {
  const [year, month, day] = purchaseDateStr.split('.').map(Number);
  const warrantyDate = new Date(year + 3, month - 1, day - 1);
  return `${warrantyDate.getFullYear()}.${String(warrantyDate.getMonth() + 1).padStart(2, '0')}.${String(warrantyDate.getDate()).padStart(2, '0')}`;
};

// 샘플 자산 데이터 생성
export const generateSampleAssets = (): Asset[] => {
  const assetTypes = [
    { 
      type: '노트북', 
      manufacturers: ['삼성전자', 'LG전자', '애플', 'HP', 'Dell'],
      models: ['갤럭시북', '그램', '맥북프로', 'EliteBook', 'XPS'],
      specs: ['i7/16GB/512GB SSD', 'i5/8GB/256GB SSD', 'M2/16GB/512GB SSD', 'i7/32GB/1TB SSD']
    },
    { 
      type: '데스크탑', 
      manufacturers: ['삼성전자', 'LG전자', 'HP', 'Dell', '레노버'],
      models: ['데스크탑PC', 'All-in-One', 'OptiPlex', 'ThinkCentre'],
      specs: ['i7/16GB/512GB SSD', 'i5/8GB/256GB SSD', 'i9/32GB/1TB SSD']
    },
    { 
      type: '모니터', 
      manufacturers: ['삼성전자', 'LG전자', 'Dell', 'HP', 'BenQ'],
      models: ['27인치', '32인치', '24인치', 'UltraWide'],
      specs: ['FHD', 'QHD', '4K UHD', 'WQHD']
    },
    { 
      type: '키보드/마우스', 
      manufacturers: ['로지텍', '삼성전자', 'HP', 'Dell'],
      models: ['무선키보드/마우스세트', '기계식키보드', '무선마우스'],
      specs: ['무선', '유선', 'Bluetooth']
    },
    { 
      type: '휴대폰', 
      manufacturers: ['삼성전자', '애플', 'LG전자'],
      models: ['갤럭시S', '갤럭시노트', '아이폰'],
      specs: ['128GB', '256GB', '512GB']
    }
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

  const assigneeNames = [
    '강현규', '전광희', '정홍근', '이길원', '이성미', '조혜진', '이나리', '박준수', '용상수', '김규현',
    '조현균', '조현정', '최현준', '강성희', '강문혁', '장대열', '윤제진', '신진욱', '이영택',
    '김완수', '이현직', '김예림', '가라현', '신소영', '이유라', '주호정', '김연서',
    '김태영', '이혜진', '우은순', '김지연', '추경운', '김준하', '이유나', '유정선', '손진빈', '유예진',
    '박성호', '김종협'
  ];

  const locations = [
    '본사 3층 개발실', '본사 4층 사무실', '본사 5층 회의실', '본사 6층 임원실', '본사 2층 로비'
  ];

  const assets: Asset[] = [];
  let assetId = 1;

  assetTypes.forEach(({ type, manufacturers, models, specs }) => {
    let count = 0;
    if (type === '노트북') count = 125;
    else if (type === '데스크탑') count = 45;
    else if (type === '모니터') count = 180;
    else if (type === '키보드/마우스') count = 150;
    else if (type === '휴대폰') count = 90;

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

      // 팀 결정
      const teamsByDept: { [key: string]: string[] } = {
        'STE1실': ['LG전자 1팀', 'LG전자 2팀', 'LG전자 4팀'],
        'STE2실': ['GS리테일 1팀', 'HDC랩스 1팀', 'KT 알파1팀'],
        '경영전략실': ['경영지원팀', '사업전략팀'],
        '개발연구소': ['개발연구소', '자동화개발팀'],
        'STE그룹': ['STE그룹']
      };
      const teamsInDept = teamsByDept[department] || [department];
      const team = teamsInDept[Math.floor(Math.random() * teamsInDept.length)];

      // 구매일자 결정
      const yearsAgo = Math.floor(Math.random() * 5);
      const monthsAgo = Math.floor(Math.random() * 12);
      const purchaseDate = new Date(2025, 11, 26);
      purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsAgo);
      purchaseDate.setMonth(purchaseDate.getMonth() - monthsAgo);
      const purchaseDateStr = `${purchaseDate.getFullYear()}.${String(purchaseDate.getMonth() + 1).padStart(2, '0')}.${String(purchaseDate.getDate()).padStart(2, '0')}`;

      // 제조사, 모델, 사양
      const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
      const model = models[Math.floor(Math.random() * models.length)];
      const specification = specs[Math.floor(Math.random() * specs.length)];

      // 가격
      let avgPrice = 1000000;
      if (type === '노트북') avgPrice = 1500000;
      else if (type === '데스크탑') avgPrice = 1200000;
      else if (type === '모니터') avgPrice = 300000;
      else if (type === '키보드/마우스') avgPrice = 100000;
      else if (type === '휴대폰') avgPrice = 800000;
      
      const priceVariation = 0.8 + Math.random() * 0.4;
      const purchasePrice = Math.round(avgPrice * priceVariation);

      // 담당자
      const assignee = status === '사용중' ? assigneeNames[Math.floor(Math.random() * assigneeNames.length)] : '-';

      // 위치
      const location = locations[Math.floor(Math.random() * locations.length)];

      // 보증 기간
      const warrantyPeriod = calculateWarrantyPeriod(purchaseDateStr);

      // 자산 번호
      const year = purchaseDate.getFullYear();
      const assetNumber = `ASSET-${year}-${String(assetId).padStart(3, '0')}`;

      // 비고
      const notes = ['일반 업무용', '개발용', '테스트용', '임원용', '회의실용'];
      const note = notes[Math.floor(Math.random() * notes.length)];

      assets.push({
        assetCode: `AST-${String(assetId).padStart(4, '0')}`,
        assetName: `${type}-${String(i + 1).padStart(3, '0')}`,
        assetType: type,
        status,
        department,
        team,
        assignee,
        purchaseDate: purchaseDateStr,
        purchasePrice,
        serialNumber: `SN${String(assetId).padStart(6, '0')}`,
        manufacturer,
        model,
        specifications: specification,
        location,
        warrantyPeriod,
        assetNumber,
        note
      });
      assetId++;
    }
  });

  return assets;
};

// 전역 자산 데이터
export const allAssets = generateSampleAssets();

// 자산 코드로 자산 찾기
export const getAssetByCode = (code: string): Asset | undefined => {
  return allAssets.find(asset => asset.assetCode === code);
};
