import { TerminalSnCopyRequest } from './terminalSnCopyRequest';

export interface TerminalCopyRequest extends TerminalSnCopyRequest {
  terminalId?: number;
}
