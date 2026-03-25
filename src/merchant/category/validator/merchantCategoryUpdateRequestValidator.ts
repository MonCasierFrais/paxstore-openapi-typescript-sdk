import { Constants } from '../../../constant/constants';
import { MerchantCategoryUpdateRequest } from '../dto/merchantCategoryUpdateRequest';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';

export function validate(merchantCategoryId: number | null | undefined, validateTarget: MerchantCategoryUpdateRequest | null | undefined): string[] {
  const validationErrs = Validators.validateId(merchantCategoryId, 'parameter.id.invalid', 'merchantCategoryId');

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'merchantCategoryUpdateRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.name, 'name', Constants.MAX_128));
    validationErrs.push(...Validators.validateStrMax(validateTarget.remarks, 'remarks', Constants.MAX_255));
  }

  return validationErrs;
}
