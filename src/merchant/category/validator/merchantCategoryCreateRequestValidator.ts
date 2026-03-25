import { Constants } from '../../../constant/constants';
import { MerchantCategoryCreateRequest } from '../dto/merchantCategoryCreateRequest';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';

export function validate(validateTarget: MerchantCategoryCreateRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'merchantCategoryCreateRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.name, 'name', Constants.MAX_128));
    validationErrs.push(...Validators.validateStrMax(validateTarget.remarks, 'remarks', Constants.MAX_255));
  }

  return validationErrs;
}
