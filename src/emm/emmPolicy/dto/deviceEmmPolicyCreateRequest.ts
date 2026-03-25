import { PolicyUpdatedContentDTO } from './policyUpdatedContentDTO';
import { LockedPolicyUpdateDTO } from './lockedPolicyUpdateDTO';

export interface DeviceEmmPolicyCreateRequest {
  serialNo?: string;
  contentInfo?: PolicyUpdatedContentDTO;
  lockedPolicyList?: LockedPolicyUpdateDTO[];
  inheritFlag?: boolean;
}
