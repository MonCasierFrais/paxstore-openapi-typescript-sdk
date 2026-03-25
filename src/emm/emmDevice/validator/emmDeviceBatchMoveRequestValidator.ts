import { EmmDeviceBatchMoveRequest } from '../dto/emmDeviceBatchMoveRequest';
import { Constants } from '../../../constant/constants';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';

export function validate(validateTarget: EmmDeviceBatchMoveRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'emmDeviceBatchMoveRequest'));
  } else {
    validationErrs.push(...Validators.validateObject(validateTarget.deviceIds, 'deviceIds'));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.resellerName, 'resellerName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.merchantName, 'merchantName', Constants.MAX_64));
  }

  return validationErrs;
}
