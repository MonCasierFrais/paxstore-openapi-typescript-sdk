import { CustomColName } from './customColName';

export interface GoInsightCustomFilter {
  cloName?: string;
  filterValue?: string;
}

export function createGoInsightCustomFilter(
  cloName: string | CustomColName,
  filterValue?: string,
): GoInsightCustomFilter {
  return {
    cloName: typeof cloName === 'string' ? cloName : cloName,
    filterValue,
  };
}
