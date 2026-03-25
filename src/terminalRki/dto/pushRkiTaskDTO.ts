export interface PushRkiTaskDTO {
  id?: number;
  terminalSN?: string;
  rkiKey?: string;
  activatedDate?: number;
  effectiveTime?: number;
  expiredTime?: number;
  status?: string;
  actionStatus?: number;
  errorCode?: number;
  remarks?: string;
}
