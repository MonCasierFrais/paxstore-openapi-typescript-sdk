export interface PageInfo<T> {
  pageNo: number;
  limit: number;
  orderBy?: string;
  totalCount?: number;
  hasNext: boolean;
  dataSet?: T[];
}
