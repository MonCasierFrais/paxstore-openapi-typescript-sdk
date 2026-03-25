import { ApkDTO } from './apkDTO';

export interface AppPageDTO {
  id?: number;
  name?: string;
  packageName?: string;
  status?: string;
  osType?: string;
  specificReseller?: boolean;
  chargeType?: number;
  price?: number;
  text?: string;
  downloads?: number;
  apkList?: ApkDTO[];
  entityAttributeValues?: Record<string, string>;
}
