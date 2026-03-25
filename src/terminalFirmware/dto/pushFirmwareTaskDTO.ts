export interface PushFirmwareTaskDTO {
  id?: number;
  terminalSN?: string;
  fmName?: string;
  activatedDate?: number;
  wifiOnly?: boolean;
  effectiveTime?: number;
  expiredTime?: number;
  status?: string;
  actionStatus?: number;
  errorCode?: number;
}
