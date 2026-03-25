import { PushFirmwareTaskBasicRequest } from '../dto/pushFirmwareTaskBasicRequest';
import { getMessage } from '../../util/messageBundleUtils';
import * as stringUtils from '../../util/stringUtils';

export function validate(
  validateTarget: PushFirmwareTaskBasicRequest | null | undefined,
  paramName: string
): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', paramName));
  } else {
    if (stringUtils.isBlank(validateTarget.fmName)) {
      validationErrs.push(getMessage('parameter.not.null', 'fmName'));
    }
    if (stringUtils.isEmpty(validateTarget.serialNo) && stringUtils.isEmpty(validateTarget.tid)) {
      validationErrs.push(getMessage('parameter.sn.tid.empty'));
    }
  }

  return validationErrs;
}
