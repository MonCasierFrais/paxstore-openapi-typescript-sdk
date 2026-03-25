import { BaseDTO } from './baseDTO';

export interface PageResponse<T> extends BaseDTO {
  pageNo: number;
  limit: number;
  orderBy?: string;
  totalCount?: number;
  dataset?: T[];
  hasNext: boolean;
}
