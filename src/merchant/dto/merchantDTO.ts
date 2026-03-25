import { MerchantPageDTO } from './merchantPageDTO';
import { MerchantCategoryDTO } from './merchantCategoryDTO';

export interface MerchantDTO extends MerchantPageDTO {
  entityAttributeValues?: Record<string, string>;
  merchantCategory?: MerchantCategoryDTO[];
}
