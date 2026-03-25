import { EntityAttributeLabelInfo } from './entityAttributeLabelInfo';

export interface EntityAttributeDTO {
  id?: number;
  entityType?: string;
  inputType?: string;
  minLength?: number;
  maxLength?: number;
  required: boolean;
  /** @deprecated */
  regex?: string;
  selector?: string;
  key?: string;
  index: number;
  defaultLabel?: string;
  entityAttributeLabelList?: EntityAttributeLabelInfo[];
}
