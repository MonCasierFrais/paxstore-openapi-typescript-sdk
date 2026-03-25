import { Constants } from '../../constant/constants';
import { TerminalCopyRequest } from '../dto/terminalCopyRequest';
import { TerminalSnCopyRequest } from '../dto/terminalSnCopyRequest';
import * as stringUtils from '../../util/stringUtils';
import * as Validators from '../../validate/validators';
import { getMessage } from '../../util/messageBundleUtils';

export function validate(validateTarget: TerminalCopyRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'terminalCopyRequest'));
  } else {
    validationErrs.push(...Validators.validateLongNull(validateTarget.terminalId, 'terminalId'));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.name, 'name', Constants.MAX_64));
    validationErrs.push(...Validators.validateRange(validateTarget.tid, 'tid', Constants.MIN_8, Constants.MAX_16));
    validationErrs.push(...Validators.validateStrMax(validateTarget.serialNo, 'serialNo', Constants.MAX_32));
    if (stringUtils.isBlank(validateTarget.status)) {
      validationErrs.push(getMessage('parameter.not.null', 'status'));
    }
  }

  return validationErrs;
}

export function validateSerialNo(validateTarget: TerminalSnCopyRequest | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'terminalCopyRequest'));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.name, 'name', Constants.MAX_64));
    validationErrs.push(...Validators.validateRange(validateTarget.tid, 'tid', Constants.MIN_8, Constants.MAX_16));
    validationErrs.push(...Validators.validateStrMax(validateTarget.serialNo, 'serialNo', Constants.MAX_32));
    if (stringUtils.isBlank(validateTarget.status)) {
      validationErrs.push(getMessage('parameter.not.null', 'status'));
    }
  }

  return validationErrs;
}
