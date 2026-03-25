import { GoInsightCustomFilter } from './goInsightCustomFilter';

export interface DataQueryRequest {
  timeRangeType?: string;
  customFilterList?: GoInsightCustomFilter[];
  pageNo?: number;
  pageSize?: number;
}
