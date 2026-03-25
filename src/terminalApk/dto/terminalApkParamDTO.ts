export interface TerminalApkParamDTO {
  paramTemplateName?: string;
  actionStatus: number;
  errorCode: number;
  configuredParameters?: Record<string, string>;
}
