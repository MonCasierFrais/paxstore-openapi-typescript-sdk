import { Constants } from '../../constant/constants';
import { TerminalUpdateRequest } from '../dto/terminalUpdateRequest';
import * as Validators from '../../validate/validators';
import { getMessage } from '../../util/messageBundleUtils';

export function validate(validateTarget: TerminalUpdateRequest | null | undefined, paramName: string): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', paramName));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.name, 'name', Constants.MAX_64));
    validationErrs.push(...Validators.validateRange(validateTarget.tid, 'tid', Constants.MIN_8, Constants.MAX_16));
    validationErrs.push(...Validators.validateStrMax(validateTarget.serialNo, 'serialNo', Constants.MAX_32));
    validationErrs.push(...Validators.validateStrMax(validateTarget.merchantName, 'merchantName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.resellerName, 'resellerName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrMax(validateTarget.modelName, 'modelName', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrMax(validateTarget.location, 'location', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrMax(validateTarget.remark, 'remark', Constants.MAX_500));
  }

  return validationErrs;
}
