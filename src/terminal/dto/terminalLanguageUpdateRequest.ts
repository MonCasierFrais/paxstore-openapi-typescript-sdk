import { TerminalConfigUpdateRequest } from './terminalConfigUpdateRequest';

export interface TerminalLanguageUpdateRequest extends TerminalConfigUpdateRequest {
  language?: string;
}
