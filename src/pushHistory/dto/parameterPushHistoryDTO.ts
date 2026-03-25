export interface ParameterPushHistoryDTO {
  terminalId?: number;
  serialNo?: string;
  appName?: string;
  versionName?: string;
  pushStartTime?: number;
  appPushTime?: number;
  appPushStatus?: string;
  appPushError?: string;
  parameterTemplateName?: string;
  parameterPushTime?: number;
  parameterPushStatus?: string;
  parameterPushError?: string;
  parameterValues?: string;
  parameterVariables?: string;
  pushType?: string;
}
