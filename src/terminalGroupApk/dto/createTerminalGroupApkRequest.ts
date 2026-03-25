import { FileParameter } from '../../terminalApk/dto/fileParameter';

export interface CreateTerminalGroupApkRequest {
  groupId?: number;
  pushTemplateName?: string;
  packageName?: string;
  version?: string;
  templateName?: string;
  parameters?: Record<string, string>;
  base64FileParameters?: FileParameter[];
  inheritPushHistory?: boolean;
  forceUpdate?: boolean;
  wifiOnly?: boolean;
  effectiveTime?: string;
  expiredTime?: string;
  validateUndefinedParameter?: boolean;
}
