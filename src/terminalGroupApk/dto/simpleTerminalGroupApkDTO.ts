import { TerminalGroupApkParamDTO } from './terminalGroupApkParamDTO';

export interface SimpleTerminalGroupApkDTO {
  id?: number;
  apkPackageName?: string;
  apkVersionCode?: number;
  apkVersionName?: string;
  forceUpdate?: boolean;
  wifiOnly?: boolean;
  effectiveTime?: number;
  expiredTime?: number;
  updatedDate?: number;
  actionStatus?: number;
  status?: string;
  pendingCount?: number;
  successCount?: number;
  failedCount?: number;
  filteredCount?: number;
  groupApkParam?: TerminalGroupApkParamDTO;
}
