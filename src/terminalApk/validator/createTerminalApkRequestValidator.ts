import { CreateTerminalApkRequest } from '../dto/createTerminalApkRequest';
import { FileParameter } from '../dto/fileParameter';
import { getBase64FileSizeKB } from '../../util/fileUtils';
import * as stringUtils from '../../util/stringUtils';
import { getMessage } from '../../util/messageBundleUtils';

const MAX_FILE_TYPE_PARAMETER_COUNTER = 10;
const MAX_FILE_TYPE_PARAMETER_SIZE = 500;
const TEMPLATE_NAME_DELIMITER = '|';
const MAX_TEMPLATE_SIZE = 10;

export function validate(validateTarget: CreateTerminalApkRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'createTerminalApkRequest'));
  } else {
    if (stringUtils.isBlank(validateTarget.packageName)) {
      validationErrs.push(getMessage('parameter.not.null', 'packageName'));
    }
    if (stringUtils.isEmpty(validateTarget.serialNo) && stringUtils.isEmpty(validateTarget.tid)) {
      validationErrs.push(getMessage('parameter.sn.tid.empty'));
    }
    if (stringUtils.isNotEmpty(validateTarget.templateName)) {
      if (validateTarget.templateName!.split(TEMPLATE_NAME_DELIMITER).length > MAX_TEMPLATE_SIZE) {
        validationErrs.push(getMessage('parameter.createTerminalApkRequest.template.name.toolong'));
      }
    }
    if (
      validateTarget.base64FileParameters &&
      validateTarget.base64FileParameters.length > 0
    ) {
      if (validateTarget.base64FileParameters.length > MAX_FILE_TYPE_PARAMETER_COUNTER) {
        validationErrs.push(getMessage('parametersBase64FileParameters.over.maxCounter'));
      }
      for (const fileParameter of validateTarget.base64FileParameters) {
        if (getBase64FileSizeKB(fileParameter.fileData) > MAX_FILE_TYPE_PARAMETER_SIZE) {
          validationErrs.push(getMessage('parametersBase64FileParameters.over.maxSize'));
          break;
        }
      }
    }
  }

  return validationErrs;
}
