import { TerminalConfigUpdateRequest } from './terminalConfigUpdateRequest';

export interface TerminalTimeZoneUpdateRequest extends TerminalConfigUpdateRequest {
  automaticTimeZoneEnable?: boolean;
  timeZone?: string;
}
