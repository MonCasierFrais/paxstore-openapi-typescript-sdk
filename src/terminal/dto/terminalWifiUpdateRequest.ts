import { TerminalConfigUpdateRequest } from './terminalConfigUpdateRequest';

export interface WifiConfig {
  ssid?: string;
  password?: string;
  cipherType?: string;
  proxyType?: string;
  hostName?: string;
  port?: string;
  pacUrl?: string;
}

export interface TerminalWifiUpdateRequest extends TerminalConfigUpdateRequest {
  wifiList?: WifiConfig[];
}
