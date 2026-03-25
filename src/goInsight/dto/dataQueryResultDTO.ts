export interface Column {
  colName?: string;
  displayName?: string;
  type?: string;
}

export interface Row {
  colName?: string;
  value?: string;
}

export interface DataQueryResultDTO {
  worksheetName?: string;
  columns?: Column[];
  rows?: Row[][];
  hasNext: boolean;
  offset: number;
  limit: number;
}
