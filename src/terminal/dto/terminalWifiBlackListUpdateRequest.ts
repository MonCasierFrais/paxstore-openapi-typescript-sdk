import { TerminalConfigUpdateRequest } from './terminalConfigUpdateRequest';

export interface BlackListConfig {
  wifiName?: string;
}

export interface TerminalWifiBlackListUpdateRequest extends TerminalConfigUpdateRequest {
  blackList?: BlackListConfig[];
}
