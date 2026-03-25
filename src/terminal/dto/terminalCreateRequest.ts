import { TerminalUpdateRequest } from './terminalUpdateRequest';

export interface TerminalCreateRequest extends TerminalUpdateRequest {
  status?: string;
}
