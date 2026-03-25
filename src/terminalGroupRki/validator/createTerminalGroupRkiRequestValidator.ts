import { CreateTerminalGroupRkiRequest } from '../dto/createTerminalGroupRkiRequest';
import { getMessage } from '../../util/messageBundleUtils';
import * as Validators from '../../validate/validators';

export function validate(
  validateTarget: CreateTerminalGroupRkiRequest | null | undefined
): string[] {
  const validationErrs: string[] = [];

  if (!validateTarget) {
    validationErrs.push(getMessage('parameter.not.null', 'groupPushRkiRequest'));
  } else {
    validationErrs.push(...Validators.validateId(validateTarget.groupId, 'parameter.id.invalid', 'terminalGroupId'));
    validationErrs.push(...Validators.validateObject(validateTarget.rkiKey, 'rkiKey'));
  }

  return validationErrs;
}
