export interface CustomerWithCounts {
  id: number;
  name: string;
  ceoName: string | null;
  industry: string | null;
  tel: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  remarks: string | null;
  projects: { id: number }[];
  _count: { projects: number };
  businessNo?: string | null;
  regTime?: Date;
}

export interface CustomerResult {
  id: number;
  name: string;
  businessNo: string | null;
  ceoName: string | null;
  tel: string | null;
  address: string | null;
  homepage: string | null;
  status: string;
  remarks: string | null;
  regTime: Date;
  contacts: any[];
  projects: {
    id: number;
    name: string;
    startDate: Date | string;
    endDate: Date | string | null;
    status: string;
  }[];
}
