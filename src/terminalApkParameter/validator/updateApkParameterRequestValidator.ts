import { UpdateApkParameterRequest } from '../dto/updateApkParameterRequest';
import { getBase64FileSizeKB } from '../../util/fileUtils';
import * as Validators from '../../validate/validators';
import { getMessage } from '../../util/messageBundleUtils';

const MAX_FILE_TYPE_PARAMETER_COUNTER = 10;
const MAX_FILE_TYPE_PARAMETER_SIZE = 500;

export function validate(
  apkParameterId: number | null | undefined,
  validateTarget: UpdateApkParameterRequest | null | undefined
): string[] {
  const validationErrs = Validators.validateId(apkParameterId, 'parameter.id.invalid', 'apkParameterId');

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'apkParameterCreateRequest'));
  } else {
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
