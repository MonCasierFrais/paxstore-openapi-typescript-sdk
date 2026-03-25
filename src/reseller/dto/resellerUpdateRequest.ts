export interface ResellerUpdateRequest {
  name?: string;
  email?: string;
  country?: string;
  contact?: string;
  phone?: string;
  postcode?: string;
  address?: string;
  company?: string;
  parentResellerName?: string;
  entityAttributeValues?: Record<string, string>;
}
