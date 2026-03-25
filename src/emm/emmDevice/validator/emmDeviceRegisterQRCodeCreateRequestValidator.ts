import { EmmDeviceRegisterQRCodeCreateRequest } from '../dto/emmDeviceRegisterQRCodeCreateRequest';
import { Constants } from '../../../constant/constants';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';

export function validate(validateTarget: EmmDeviceRegisterQRCodeCreateRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'emmDeviceRegisterQRCodeCreateRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.resellerName, 'resellerName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.merchantName, 'merchantName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStr(validateTarget.type, 'parameter.not.null', 'type'));
    validationErrs.push(...Validators.validateObject(validateTarget.expireDate, 'expireDate'));
  }

  return validationErrs;
}
