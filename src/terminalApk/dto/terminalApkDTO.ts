import { TerminalApkParamDTO } from './terminalApkParamDTO';

export interface TerminalApkDTO {
  id?: number;
  terminalSN?: string;
  apkPackageName?: string;
  apkVersionCode?: number;
  apkVersionName?: string;
  activatedDate?: number;
  forceUpdate?: boolean;
  wifiOnly?: boolean;
  effectiveTime?: number;
  expiredTime?: number;
  status?: string;
  actionStatus: number;
  actionTime?: number;
  errorCode: number;
  terminalApkParam?: TerminalApkParamDTO;
}
