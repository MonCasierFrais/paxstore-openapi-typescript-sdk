import { MerchantCategoryCreateRequest } from '../dto/merchantCategoryCreateRequest';
import * as stringUtils from '../../../util/stringUtils';
import { getMessage } from '../../../util/messageBundleUtils';

const MAX_LENGTH_CATEGORY_NAME = 128;
const MAX_LENGTH_CATEGORY_REMARKS = 255;

export function validate(batchCreateRequest: MerchantCategoryCreateRequest[] | null | undefined): string[] {
  const validationErrs: string[] = [];

  if (!batchCreateRequest || batchCreateRequest.length === 0) {
    validationErrs.push(getMessage('parameter.not.null', 'merchantCategoryBatchCreateRequest'));
  } else {
    for (const category of batchCreateRequest) {
      if (stringUtils.isEmpty(category.name)) {
        validationErrs.push(getMessage('merchantCategory.name.null'));
      }
      if (category.name != null && category.name.length > MAX_LENGTH_CATEGORY_NAME) {
        validationErrs.push(getMessage('parameter.too.long', 'merchant category name', MAX_LENGTH_CATEGORY_NAME));
      }
      if (category.remarks != null && category.remarks.length > MAX_LENGTH_CATEGORY_REMARKS) {
        validationErrs.push(getMessage('parameter.too.long', 'merchant category remarks', MAX_LENGTH_CATEGORY_REMARKS));
      }
    }
  }

  return validationErrs;
}
