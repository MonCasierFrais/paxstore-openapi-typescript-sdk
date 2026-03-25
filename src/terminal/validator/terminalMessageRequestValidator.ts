import { Constants } from '../../constant/constants';
import { TerminalMessageRequest } from '../dto/terminalMessageRequest';
import * as Validators from '../../validate/validators';
import { getMessage } from '../../util/messageBundleUtils';

export function validate(validateTarget: TerminalMessageRequest | null | undefined, paramName: string): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', paramName));
  } else {
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.title, 'title', Constants.MAX_64));
    validationErrs.push(...Validators.validateStrNullAndMax(validateTarget.content, 'content', Constants.MAX_256));
  }

  return validationErrs;
}
