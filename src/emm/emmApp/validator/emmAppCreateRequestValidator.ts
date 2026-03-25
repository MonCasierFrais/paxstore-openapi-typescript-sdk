import { EmmAppCreateRequest } from '../dto/emmAppCreateRequest';
import { Constants } from '../../../constant/constants';
import { getMessage } from '../../../util/messageBundleUtils';
import { validateStrNullAndMax } from '../../../validate/validators';

export function validate(validateTarget: EmmAppCreateRequest | null | undefined): string[] {
  const errors: string[] = [];
  if (!validateTarget) {
    errors.push(getMessage('parameter.not.null', 'emmAppCreateRequest'));
  } else {
    errors.push(...validateStrNullAndMax(validateTarget.resellerName, 'resellerName', Constants.MAX_64));
    errors.push(...validateStrNullAndMax(validateTarget.packageName, 'packageName', Constants.MAX_128));
  }
  return errors;
}
