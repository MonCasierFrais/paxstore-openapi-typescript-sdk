import { TerminalConfigUpdateRequest } from './terminalConfigUpdateRequest';

export interface ApnConfig {
  name?: string;
  apn?: string;
  type?: string;
  proxy?: string;
  port?: string;
  user?: string;
  password?: string;
  server?: string;
  mmsc?: string;
  mmsproxy?: string;
  mmsport?: string;
  mcc?: string;
  mnc?: string;
  authtype?: string;
  protocol?: string;
  roaming_protocol?: string;
  mvno_type?: string;
  mvno_match_data?: string;
}

export interface TerminalApnUpdateRequest extends TerminalConfigUpdateRequest {
  apnList?: ApnConfig[];
}
