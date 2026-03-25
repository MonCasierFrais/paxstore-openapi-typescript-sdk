export interface TerminalGroupRkiDTO {
  id?: number;
  rkiKey?: string;
  activatedDate?: number;
  effectiveTime?: number;
  expiredTime?: number;
  status?: string;
  actionStatus?: number;
  errorCode?: number;
  remarks?: string;
  pendingCount?: number;
  successCount?: number;
  failedCount?: number;
  completed?: boolean;
  pushLimit?: number;
}
