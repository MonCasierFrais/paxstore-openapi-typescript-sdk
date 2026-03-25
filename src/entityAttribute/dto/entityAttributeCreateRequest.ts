import { EntityAttributeType, EntityInputType } from '../entityAttributeApi';

export interface EntityAttributeCreateRequest {
  entityType?: EntityAttributeType;
  inputType?: EntityInputType;
  minLength?: number;
  maxLength?: number;
  required: boolean;
  /** @deprecated */
  regex?: string;
  selector?: string;
  key?: string;
  defaultLabel?: string;
}
