import { FileParameter } from '../../terminalApk/dto/fileParameter';

export interface CreateApkParameterRequest {
  packageName?: string;
  version?: string;
  name?: string;
  paramTemplateName?: string;
  parameters?: Record<string, string>;
  base64FileParameters?: FileParameter[];
  validateUndefinedParameter?: boolean;
}
