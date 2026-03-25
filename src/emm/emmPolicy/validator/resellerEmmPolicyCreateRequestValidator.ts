import { ResellerEmmPolicyCreateRequest } from '../dto/resellerEmmPolicyCreateRequest';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';
import { Constants } from '../../../constant/constants';

export function validate(validateTarget: ResellerEmmPolicyCreateRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'resellerEmmPolicyCreateRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.resellerName, 'resellerName', Constants.MAX_64));
    if (validateTarget.inheritFlag === false) {
      validationErrs.push(...Validators.validateObject(validateTarget.contentInfo, 'contentInfo'));
    }
    validationErrs.push(...Validators.validateObject(validateTarget.inheritFlag, 'inheritFlag'));
  }

  return validationErrs;
}
