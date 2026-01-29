export class OrgMemberDto {
  id: string;
  nameKr: string;
  jobRole: string;
}

export class OrgChartDto {
  id: number;
  name: string;
  level: number;
  parentId?: number | null;
  children?: OrgChartDto[];
  members?: OrgMemberDto[];
}
