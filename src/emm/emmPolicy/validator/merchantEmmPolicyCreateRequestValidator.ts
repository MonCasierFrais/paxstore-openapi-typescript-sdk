import { MerchantEmmPolicyCreateRequest } from '../dto/merchantEmmPolicyCreateRequest';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';
import { Constants } from '../../../constant/constants';

export function validate(validateTarget: MerchantEmmPolicyCreateRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'merchantEmmPolicyCreateRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.resellerName, 'resellerName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.merchantName, 'merchantName', Constants.MAX_64));
    if (validateTarget.inheritFlag === false) {
      validationErrs.push(...Validators.validateObject(validateTarget.contentInfo, 'contentInfo'));
    }
    validationErrs.push(...Validators.validateObject(validateTarget.inheritFlag, 'inheritFlag'));
  }

  return validationErrs;
}
