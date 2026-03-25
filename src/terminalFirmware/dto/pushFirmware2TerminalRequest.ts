import { PushFirmwareTaskBasicRequest } from './pushFirmwareTaskBasicRequest';

export interface PushFirmware2TerminalRequest extends PushFirmwareTaskBasicRequest {
  wifiOnly?: boolean;
  effectiveTime?: string;
  expiredTime?: string;
}
