import { EntityInputType } from '../entityAttributeApi';

export interface EntityAttributeUpdateRequest {
  inputType?: EntityInputType;
  minLength?: number;
  maxLength?: number;
  required: boolean;
  /** @deprecated */
  regex?: string;
  selector?: string;
  defaultLabel?: string;
}
