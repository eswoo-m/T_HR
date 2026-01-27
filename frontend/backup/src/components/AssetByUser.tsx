import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { User, Package, DollarSign, Calendar } from 'lucide-react';
import { allAssets, calculateAssetAge, type Asset } from '../data/assetData';

interface AssetByUserProps {
  onAssetClick?: (code: string) => void;
}

export function AssetByUser({ onAssetClick }: AssetByUserProps) {
  const [selectedDept, setSelectedDept] = useState('STE1실');
  const [selectedTeam, setSelectedTeam] = useState('LG전자 1팀');
  const [selectedUser, setSelectedUser] = useState('전광희');

  // 부서별 팀 목록
  const teamsByDepartment: { [key: string]: string[] } = {
    'STE1실': ['LG전자 1팀', 'LG전자 2팀', 'LG전자 4팀'],
    'STE2실': ['GS리테일 1팀', 'HDC랩스 1팀', 'KT 알파1팀'],
    '경영전략실': ['경영지원팀', '사업전략팀'],
    '개발연구소': ['자동화개발팀'],
    'STE그룹': []
  };

  // 부서별 직속 인원 (팀이 없을 때 선택 가능한 인원)
  const directMembersByDepartment: { [key: string]: string[] } = {
    'STE1실': ['강현규'], // 이사
    'STE2실': [], // 직속 인원 없음
    '경영전략실': [], // 팀으로만 구성
    '개발연구소': ['김태영', '이혜진', '우은순', '김지연', '추경운'], // 부사장, 이사, 팀장, 사원들
    'STE그룹': ['박성호', '김종협'] // 사장, 실장
  };

  // 팀별 구성원 목록
  const membersByTeam: { [key: string]: string[] } = {
    'LG전자 1팀': ['전광희', '정홍근'],
    'LG전자 2팀': ['이길원', '이성미', '조혜진', '이나리'],
    'LG전자 4팀': ['박준수', '용상수', '김규현'],
    'GS리테일 1팀': ['조현균', '조현정', '최현준', '강성희', '강문혁'],
    'HDC랩스 1팀': ['장대열'],
    'KT 알파1팀': ['윤제진', '신진욱', '이영택'],
    '경영지원팀': ['김완수', '이현직', '김예림', '가라현', '신소영'],
    '사업전략팀': ['이유라', '주호정', '김연서'],
    '자동화개발팀': ['김준하', '이유나', '유정선', '손진빈', '유예진']
  };

  // 선택된 부서의 팀 목록
  const availableTeams = teamsByDepartment[selectedDept] || [];

  // 선택된 팀의 구성원 목록 (팀이 "없음"이면 부서 직속 인원)
  const availableMembers = useMemo(() => {
    if (selectedTeam === '-' || selectedTeam === '') {
      return directMembersByDepartment[selectedDept] || [];
    }
    return membersByTeam[selectedTeam] || [];
  }, [selectedTeam, selectedDept]);

  // 부서 변경 시 팀과 사용자 초기화
  const handleDeptChange = (value: string) => {
    setSelectedDept(value);
    const teams = teamsByDepartment[value] || [];
    const firstTeam = teams.length > 0 ? teams[0] : '-';
    setSelectedTeam(firstTeam);
    
    // 첫 번째 사용자 자동 선택
    const members = firstTeam !== '-' 
      ? membersByTeam[firstTeam] || [] 
      : directMembersByDepartment[value] || [];
    setSelectedUser(members.length > 0 ? members[0] : '');
  };

  // 팀 변경 시 사용자 초기화
  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    
    // 첫 번째 사용자 자동 선택
    const members = value !== '-' 
      ? membersByTeam[value] || [] 
      : directMembersByDepartment[selectedDept] || [];
    setSelectedUser(members.length > 0 ? members[0] : '');
  };

  // 선택된 사용자의 자산 목록
  const userAssets = useMemo(() => {
    return allAssets.filter(asset => asset.assignee === selectedUser);
  }, [selectedUser]);

  // 통계 계산
  const statistics = useMemo(() => {
    const totalAssets = userAssets.length;
    const totalValue = userAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    const assetsByType = userAssets.reduce((acc, asset) => {
      acc[asset.assetType] = (acc[asset.assetType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    const assetsByStatus = userAssets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    // 평균 사용 기간
    const avgAge = userAssets.length > 0
      ? userAssets.reduce((sum, asset) => sum + calculateAssetAge(asset.purchaseDate), 0) / userAssets.length
      : 0;

    return {
      totalAssets,
      totalValue,
      assetsByType,
      assetsByStatus,
      avgAge
    };
  }, [userAssets]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '사용중':
        return <Badge className="bg-green-500">{status}</Badge>;
      case '가용':
        return <Badge className="bg-blue-500">{status}</Badge>;
      case '수리중':
        return <Badge className="bg-orange-500">{status}</Badge>;
      case '폐기예정':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAgeBadge = (purchaseDate: string) => {
    const age = calculateAssetAge(purchaseDate);
    if (age >= 3) {
      return <Badge variant="destructive">노후</Badge>;
    } else if (age >= 2) {
      return <Badge variant="secondary">2년+</Badge>;
    }
    return null;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1>사용자별 자산 조회</h1>
        <p className="text-muted-foreground mt-1">사용자를 선택하여 보유 자산 현황을 조회합니다</p>
      </div>

      {/* 사용자 선택 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자 선택</CardTitle>
          <CardDescription>부서와 팀을 선택한 후 사용자를 선택하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 부서 선택 */}
            <div className="space-y-2">
              <label className="text-sm">부서</label>
              <Select value={selectedDept} onValueChange={handleDeptChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STE1실">STE1실</SelectItem>
                  <SelectItem value="STE2실">STE2실</SelectItem>
                  <SelectItem value="경영전략실">경영전략실</SelectItem>
                  <SelectItem value="개발연구소">개발연구소</SelectItem>
                  <SelectItem value="STE그룹">STE그룹</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 팀 선택 */}
            <div className="space-y-2">
              <label className="text-sm">팀</label>
              <Select value={selectedTeam} onValueChange={handleTeamChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.length === 0 ? (
                    <SelectItem value="-">부서 직속</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="-">부서 직속</SelectItem>
                      {availableTeams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 사용자 선택 */}
            <div className="space-y-2">
              <label className="text-sm">사용자</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.length === 0 ? (
                    <SelectItem value="-" disabled>구성원 없음</SelectItem>
                  ) : (
                    availableMembers.map(member => (
                      <SelectItem key={member} value={member}>{member}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 정보 및 통계 */}
      {selectedUser && selectedUser !== '-' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 총 자산 수 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">총 자산 수</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalAssets}개</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedUser} 보유
                </p>
              </CardContent>
            </Card>

            {/* 총 취득가액 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">총 취득가액</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(statistics.totalValue)}원</div>
                <p className="text-xs text-muted-foreground mt-1">
                  평균 {statistics.totalAssets > 0 ? formatCurrency(statistics.totalValue / statistics.totalAssets) : 0}원
                </p>
              </CardContent>
            </Card>

            {/* 평균 사용 기간 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">평균 사용 기간</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.avgAge.toFixed(1)}년</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {statistics.avgAge >= 3 ? '교체 검토 필요' : '정상 범위'}
                </p>
              </CardContent>
            </Card>

            {/* 소속 정보 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">소속 정보</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedUser}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedDept} {selectedTeam !== '-' ? `· ${selectedTeam}` : ''}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 자산 유형별 분포 */}
          <Card>
            <CardHeader>
              <CardTitle>자산 유형별 분포</CardTitle>
              <CardDescription>보유 중인 자산을 유형별로 분류합니다</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(statistics.assetsByType).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">보유 중인 자산이 없습니다</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(statistics.assetsByType).map(([type, count]) => (
                    <div key={type} className="p-4 border rounded-lg text-center">
                      <div className="text-sm text-muted-foreground mb-1">{type}</div>
                      <div className="text-2xl font-bold">{count}개</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 자산 상태별 분포 */}
          <Card>
            <CardHeader>
              <CardTitle>자산 상태별 분포</CardTitle>
              <CardDescription>보유 중인 자산을 상태별로 분류합니다</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(statistics.assetsByStatus).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">보유 중인 자산이 없습니다</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(statistics.assetsByStatus).map(([status, count]) => (
                    <div key={status} className="p-4 border rounded-lg text-center">
                      <div className="mb-2">{getStatusBadge(status)}</div>
                      <div className="text-2xl font-bold">{count}개</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 자산 목록 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>보유 자산 목록</CardTitle>
              <CardDescription>총 {userAssets.length}개의 자산</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">자산코드</th>
                      <th className="text-left p-3">자산명</th>
                      <th className="text-left p-3">유형</th>
                      <th className="text-left p-3">제조사</th>
                      <th className="text-left p-3">모델명</th>
                      <th className="text-left p-3">상태</th>
                      <th className="text-left p-3">구매일</th>
                      <th className="text-right p-3">취득가액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userAssets.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center p-8 text-muted-foreground">
                          보유 중인 자산이 없습니다
                        </td>
                      </tr>
                    ) : (
                      userAssets.map((asset) => (
                        <tr 
                          key={asset.assetCode} 
                          className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => onAssetClick?.(asset.assetCode)}
                        >
                          <td className="p-3">{asset.assetCode}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {asset.assetName}
                              {getAgeBadge(asset.purchaseDate)}
                            </div>
                          </td>
                          <td className="p-3">{asset.assetType}</td>
                          <td className="p-3">{asset.manufacturer}</td>
                          <td className="p-3">{asset.model}</td>
                          <td className="p-3">{getStatusBadge(asset.status)}</td>
                          <td className="p-3">{asset.purchaseDate}</td>
                          <td className="p-3 text-right">{formatCurrency(asset.purchasePrice)}원</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
