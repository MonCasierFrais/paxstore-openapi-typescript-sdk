import { Constants } from '../../constant/constants';
import * as Validators from '../../validate/validators';

export function validate(terminalId: number | null | undefined, resellerName: string | null | undefined, merchantName: string | null | undefined): string[] {
  const validationErrs: string[] = [
    ...Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId'),
    ...Validators.validateStrNullAndMax(resellerName, 'resellerName', Constants.MAX_64),
    ...Validators.validateStrNullAndMax(merchantName, 'merchantName', Constants.MAX_64),
  ];

  return validationErrs;
}
