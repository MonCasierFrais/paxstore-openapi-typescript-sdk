import { FileParameter } from '../../terminalApk/dto/fileParameter';

export interface UpdateApkParameterRequest {
  paramTemplateName?: string;
  parameters?: Record<string, string>;
  base64FileParameters?: FileParameter[];
  validateUndefinedParameter?: boolean;
}
