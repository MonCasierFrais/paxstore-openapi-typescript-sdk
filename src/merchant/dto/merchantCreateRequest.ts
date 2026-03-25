export interface MerchantCreateRequest {
  name?: string;
  email?: string;
  resellerName?: string;
  contact?: string;
  country?: string;
  phone?: string;
  province?: string;
  city?: string;
  postcode?: string;
  address?: string;
  description?: string;
  createUserFlag?: boolean;
  merchantCategoryNames?: string[];
  entityAttributeValues?: Record<string, string>;
  activateWhenCreate?: boolean;
  status?: string;
}
