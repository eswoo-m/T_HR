export class MonthlyMmListResponseDto {
  employeeId: string;
  nameKr: string;
  deptName: string;
  teamName: string;
  jobTitle: string;
  jobRole: string;
  jobPosition: string;

  assignments: {
    projectName: string;
    contribution: number;
  }[];

  totalMm: number;
  effortRate: string;
  assignStatus: string;
}
