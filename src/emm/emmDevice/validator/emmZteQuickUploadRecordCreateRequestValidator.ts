import { EmmZteQuickUploadRecordCreateRequest } from '../dto/emmZteQuickUploadRecordCreateRequest';
import { Constants } from '../../../constant/constants';
import * as Validators from '../../../validate/validators';
import { getMessage } from '../../../util/messageBundleUtils';

export function validate(validateTarget: EmmZteQuickUploadRecordCreateRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'emmZteQuickUploadRecordCreateRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.resellerName, 'resellerName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.merchantName, 'merchantName', Constants.MAX_64));
    validationErrs.push(...Validators.validateObject(validateTarget.identifierType, 'identifierType'));
    validationErrs.push(...Validators.validateStr(validateTarget.numbers, 'parameter.not.null', 'numbers'));
  }

  return validationErrs;
}
