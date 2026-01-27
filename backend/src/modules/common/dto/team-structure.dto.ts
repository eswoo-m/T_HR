export class TeamStructureDto {
  id: number;
  name: string;

  // 하위 팀 정보
  subTeams: {
    id: number;
    name: string;
    employeeCount: number;
  }[];

  // 해당 팀 소속 구성원
  members: {
    id: number;
    name: string;
    jobRole: string;
    email: string;
    phone: string;
  }[];
}
