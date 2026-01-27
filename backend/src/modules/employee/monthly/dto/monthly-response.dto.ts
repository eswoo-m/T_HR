export class MonthlyMmListResponseDto {
  employeeId: string;
  nameKr: string;
  deptName: string;
  teamName: string;
  jobTitle: string;
  jobLevel: string;

  assignments: {
    projectName: string;
    contribution: number;
  }[];

  totalMm: number;
  effortRate: string;
  assignStatus: string;
}
