import { FileParameter } from './fileParameter';

export interface CreateTerminalApkRequest {
  tid?: string;
  serialNo?: string;
  packageName?: string;
  version?: string;
  templateName?: string;
  parameters?: Record<string, string>;
  base64FileParameters?: FileParameter[];
  pushTemplateName?: string;
  inheritPushHistory?: boolean;
  forceUpdate: boolean;
  wifiOnly: boolean;
  effectiveTime?: string;
  expiredTime?: string;
  validateUndefinedParameter?: boolean;
}
