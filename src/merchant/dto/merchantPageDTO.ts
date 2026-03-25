import { SimpleResellerDTO } from './simpleResellerDTO';

export interface MerchantPageDTO {
  id?: number;
  name?: string;
  reseller?: SimpleResellerDTO;
  country?: string;
  province?: string;
  city?: string;
  postcode?: string;
  address?: string;
  contact?: string;
  email?: string;
  phone?: string;
  status?: string;
  description?: string;
}
