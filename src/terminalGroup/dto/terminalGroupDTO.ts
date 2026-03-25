export interface TerminalGroupDTO {
  id?: number;
  resellerName?: string;
  modelName?: string;
  name?: string;
  status?: string;
  description?: string;
  createdByResellerId?: number;
  createdDate?: number;
  updatedDate?: number;
  terminalCount?: number;
  dynamic?: boolean;
  containSubResellerTerminal?: boolean;
  merchantNames?: string[];
}
