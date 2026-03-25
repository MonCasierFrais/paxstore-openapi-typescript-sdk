import { PolicyUpdatedContentDTO } from './policyUpdatedContentDTO';
import { LockedPolicyUpdateDTO } from './lockedPolicyUpdateDTO';

export interface MerchantEmmPolicyCreateRequest {
  resellerName?: string;
  merchantName?: string;
  contentInfo?: PolicyUpdatedContentDTO;
  lockedPolicyList?: LockedPolicyUpdateDTO[];
  inheritFlag?: boolean;
}
