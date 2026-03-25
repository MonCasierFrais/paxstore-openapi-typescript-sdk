import { Constants } from '../../constant/constants';
import { ResellerCreateRequest } from '../dto/resellerCreateRequest';
import { getMessage } from '../../util/messageBundleUtils';
import * as stringUtils from '../../util/stringUtils';
import * as Validators from '../../validate/validators';

export function validate(validateTarget: ResellerCreateRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (validateTarget == null) {
    validationErrs.push(...Validators.validateObject(validateTarget, 'resellerCreateRequest'));
  } else {
    validationErrs.push(
      ...Validators.validateRange(validateTarget.parentResellerName, 'parentResellerName', Constants.MIN_0, Constants.MAX_64)
    );

    validationErrs.push(
      ...Validators.validateStrNullAndMax(validateTarget.name, 'email', Constants.MAX_255)
    );

    if (!stringUtils.isValidEmailAddress(validateTarget.email)) {
      validationErrs.push(getMessage('parameter.email.invalid'));
    }

    validationErrs.push(
      ...Validators.validateStrNullAndMax(validateTarget.name, 'name', Constants.MAX_64)
    );
    validationErrs.push(
      ...Validators.validateStrNullAndMax(validateTarget.country, 'country', Constants.MAX_64)
    );
    validationErrs.push(
      ...Validators.validateStrNullAndMax(validateTarget.contact, 'concat', Constants.MAX_64)
    );
    validationErrs.push(
      ...Validators.validateStrNullAndMax(validateTarget.phone, 'phone', Constants.MAX_32)
    );
    validationErrs.push(
      ...Validators.validateStrMax(validateTarget.postcode, 'postcode', Constants.MAX_16)
    );
    validationErrs.push(
      ...Validators.validateStrMax(validateTarget.address, 'address', Constants.MAX_255)
    );
    validationErrs.push(
      ...Validators.validateStrMax(validateTarget.company, 'company', Constants.MAX_255)
    );
  }

  return validationErrs;
}
