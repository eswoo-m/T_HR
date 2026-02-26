export class OrgMemberDto {
  id: string;
  name: string;
  jobRole: string;
  department?: string;
}

export class OrgChartDto {
  id: number;
  name: string;
  level: number;
  description: string;
  regDate: string;
  parentId?: number | null;
  children?: OrgChartDto[];
  members?: OrgMemberDto[];
  activeProject?: {
    name: string;
    period: string;
  } | null;
}
