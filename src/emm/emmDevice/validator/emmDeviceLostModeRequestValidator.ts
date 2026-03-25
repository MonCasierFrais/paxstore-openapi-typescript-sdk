import { EmmDeviceLostModeRequest } from '../dto/emmDeviceLostModeRequest';
import { Constants } from '../../../constant/constants';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';

export function validate(validateTarget: EmmDeviceLostModeRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'emmDeviceLostModeRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.lostMessage, 'lostMessage', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.lostPhoneNumber, 'lostPhoneNumber', Constants.MAX_32));
  }

  return validationErrs;
}
