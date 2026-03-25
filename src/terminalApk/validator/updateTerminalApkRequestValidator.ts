import { UpdateTerminalApkRequest } from '../dto/updateTerminalApkRequest';
import * as stringUtils from '../../util/stringUtils';
import { getMessage } from '../../util/messageBundleUtils';

export function validate(
  validateTarget: UpdateTerminalApkRequest | null | undefined,
  paramName: string
): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', paramName));
  } else {
    if (stringUtils.isBlank(validateTarget.packageName)) {
      validationErrs.push(getMessage('parameter.not.null', 'packageName'));
    }
    if (stringUtils.isEmpty(validateTarget.serialNo) && stringUtils.isEmpty(validateTarget.tid)) {
      validationErrs.push(getMessage('parameter.sn.tid.empty'));
    }
  }

  return validationErrs;
}
