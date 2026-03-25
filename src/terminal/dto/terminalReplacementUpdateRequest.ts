import { TerminalConfigUpdateRequest } from './terminalConfigUpdateRequest';

export interface TerminalReplacementUpdateRequest extends TerminalConfigUpdateRequest {
  allowReplacement?: boolean;
}
