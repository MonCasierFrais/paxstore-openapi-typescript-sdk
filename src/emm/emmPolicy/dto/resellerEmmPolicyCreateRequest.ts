import { PolicyUpdatedContentDTO } from './policyUpdatedContentDTO';
import { LockedPolicyUpdateDTO } from './lockedPolicyUpdateDTO';

export interface ResellerEmmPolicyCreateRequest {
  resellerName?: string;
  contentInfo?: PolicyUpdatedContentDTO;
  lockedPolicyList?: LockedPolicyUpdateDTO[];
  inheritFlag?: boolean;
}
