import { DeviceEmmPolicyCreateRequest } from '../dto/deviceEmmPolicyCreateRequest';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';
import { Constants } from '../../../constant/constants';

export function validate(validateTarget: DeviceEmmPolicyCreateRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'deviceEmmPolicyCreateRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.serialNo, 'serialNo', Constants.MAX_16));
    if (validateTarget.inheritFlag === false) {
      validationErrs.push(...Validators.validateObject(validateTarget.contentInfo, 'contentInfo'));
    }
    validationErrs.push(...Validators.validateObject(validateTarget.inheritFlag, 'inheritFlag'));
  }

  return validationErrs;
}
