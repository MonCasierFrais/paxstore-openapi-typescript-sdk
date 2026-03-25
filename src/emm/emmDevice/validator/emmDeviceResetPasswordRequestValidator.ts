import { EmmDeviceResetPasswordRequest } from '../dto/emmDeviceResetPasswordRequest';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';

export function validate(validateTarget: EmmDeviceResetPasswordRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'emmDeviceResetPasswordRequest'));
  } else {
    validationErrs.push(...Validators.validateStr(validateTarget.password, 'parameter.not.null', 'password'));
    validationErrs.push(...Validators.validateObject(validateTarget.lockNow, 'lockNow'));
  }

  return validationErrs;
}
