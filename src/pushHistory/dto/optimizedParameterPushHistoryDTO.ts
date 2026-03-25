export interface OptimizedParameterPushHistoryDTO {
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
  parameters?: Record<string, string>;
  pushType?: string;
}
