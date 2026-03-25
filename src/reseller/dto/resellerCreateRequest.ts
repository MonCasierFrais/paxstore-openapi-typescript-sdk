export interface ResellerCreateRequest {
  parentResellerName?: string;
  email?: string;
  name?: string;
  country?: string;
  contact?: string;
  phone?: string;
  postcode?: string;
  address?: string;
  company?: string;
  activateWhenCreate?: boolean;
  status?: string;
  entityAttributeValues?: Record<string, string>;
}

/**
 * Factory helper that mirrors the Java setter behavior:
 * if activateWhenCreate is true, status is set to 'A' (Active).
 */
export function createResellerCreateRequest(
  request: Omit<ResellerCreateRequest, 'status'>
): ResellerCreateRequest {
  const result: ResellerCreateRequest = { ...request };
  if (result.activateWhenCreate) {
    result.status = 'A'; // ResellerStatus.Active
  }
  return result;
}
