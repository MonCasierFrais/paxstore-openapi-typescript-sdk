import { Constants } from '../../constant/constants';
import { MerchantUpdateRequest } from '../dto/merchantUpdateRequest';
import * as stringUtils from '../../util/stringUtils';
import * as Validators from '../../validate/validators';
import { getMessage } from '../../util/messageBundleUtils';

export function validate(merchantId: number | null | undefined, validateTarget: MerchantUpdateRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (merchantId === null || merchantId === undefined || merchantId < 0) {
    validationErrs.push(getMessage('parameter.id.invalid', 'merchantId'));
  }
  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'merchantUpdateRequest'));
  } else {
    validationErrs.push(...Validators.validateStrMax(validateTarget.name, 'name', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrMax(validateTarget.email, 'email', Constants.MAX_255));
    if (stringUtils.isNotBlank(validateTarget.email) && !stringUtils.isValidEmailAddress(validateTarget.email)) {
      validationErrs.push(getMessage('parameter.email.invalid'));
    }
    validationErrs.push(...Validators.validateStrMax(validateTarget.resellerName, 'resellerName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrMax(validateTarget.contact, 'contact', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrMax(validateTarget.country, 'country', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrMax(validateTarget.phone, 'phone', Constants.MAX_32));
    validationErrs.push(...Validators.validateStrMax(validateTarget.province, 'province', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrMax(validateTarget.city, 'city', Constants.MAX_255));
    validationErrs.push(...Validators.validateStrMax(validateTarget.postcode, 'postcode', Constants.MAX_16));
    validationErrs.push(...Validators.validateStrMax(validateTarget.address, 'address', Constants.MAX_255));
    validationErrs.push(...Validators.validateStrMax(validateTarget.description, 'description', Constants.MAX_3000));
  }

  return validationErrs;
}
