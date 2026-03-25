import { EmmDeviceBatchDeleteRequest } from '../dto/emmDeviceBatchDeleteRequest';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';

export function validate(validateTarget: EmmDeviceBatchDeleteRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'emmDeviceBatchDeleteRequest'));
  } else {
    validationErrs.push(...Validators.validateObject(validateTarget.deviceIds, 'deviceIds'));
  }

  return validationErrs;
}
