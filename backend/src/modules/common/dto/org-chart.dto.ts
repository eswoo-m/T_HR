export class OrgChartDto {
  id: number;
  name: string;
  level: number; // 본부: 1, 실: 2, 팀: 3 등
  children?: OrgChartDto[]; // 하위 조직

  // 구성원까지 포함할 때만 데이터가 채워짐
  members?: {
    id: number;
    nameKr: string;
    jobRole: string;
  }[];
}
