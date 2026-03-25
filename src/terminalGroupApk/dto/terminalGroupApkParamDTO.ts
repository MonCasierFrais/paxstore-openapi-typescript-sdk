export interface TerminalGroupApkParamDTO {
  paramTemplateName?: string;
  configuredParameters?: Record<string, string>;
  pendingCount?: number;
  successCount?: number;
  failedCount?: number;
  filteredCount?: number;
}
