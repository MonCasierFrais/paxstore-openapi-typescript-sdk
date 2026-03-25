export interface MerchantUpdateRequest {
  name?: string;
  email?: string;
  resellerName?: string;
  contact?: string;
  country?: string;
  phone?: string;
  province?: string;
  postcode?: string;
  city?: string;
  address?: string;
  description?: string;
  createUserFlag?: boolean;
  merchantCategoryNames?: string[];
  entityAttributeValues?: Record<string, string>;
}
