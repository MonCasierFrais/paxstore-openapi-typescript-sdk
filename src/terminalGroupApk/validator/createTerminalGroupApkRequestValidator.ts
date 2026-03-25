import { CreateTerminalGroupApkRequest } from '../dto/createTerminalGroupApkRequest';
import { getMessage } from '../../util/messageBundleUtils';
import * as Validators from '../../validate/validators';
import { getBase64FileSizeKB } from '../../util/fileUtils';

const MAX_FILE_TYPE_PARAMETER_COUNTER = 10;
const MAX_FILE_TYPE_PARAMETER_SIZE = 500;

export function validate(
  validateTarget: CreateTerminalGroupApkRequest | null | undefined
): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'terminalGroupApkCreateRequest'));
  } else {
    validationErrs.push(...Validators.validateId(validateTarget.groupId, 'parameter.id.invalid', 'groupId'));
    validationErrs.push(...Validators.validateObject(validateTarget.packageName, 'packageName'));

    if (validateTarget.base64FileParameters && validateTarget.base64FileParameters.length > 0) {
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
