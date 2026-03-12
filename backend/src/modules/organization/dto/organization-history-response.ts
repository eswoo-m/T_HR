export interface OrgHistoryResponse {
  id: string;
  date: Date;
  displayDate: string;
  type: string;
  category: string;
  organization: string;
  department: string;
  description: string;
  headCountBefore: number;
  headCountAfter: number;
  registeredDate: string;

  projectId?: number;
  projectName?: string;
  projectPeriod?: string;
  members?: {
    name: string;
    jobPosition?: string;
    jobTitle?: string;
    jobRole?: string;
  }[];
}
