import { PolicyContentDTO } from './policyContentDTO';
import { LockedPolicyDTO } from './lockedPolicyDTO';

export interface EmmPolicyDTO {
  customPolicyCount?: number;
  name?: string;
  contentInfo?: PolicyContentDTO;
  lockedPolicyList?: LockedPolicyDTO[];
  inheritFlag?: boolean;
}
