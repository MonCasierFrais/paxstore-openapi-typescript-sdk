export interface CreateTerminalGroupRequest {
  name?: string;
  modelName?: string;
  resellerName?: string;
  description?: string;
  status?: string;
  dynamic?: boolean;
  containSubResellerTerminal?: boolean;
  merchantNameList?: string[];
}
