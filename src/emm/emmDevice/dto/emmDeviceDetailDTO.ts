import { EmmModelDTO } from './emmModelDTO';
import { EmmResellerDTO } from './emmResellerDTO';

export interface EmmDeviceDetailDTO {
  id?: number;
  name?: string;
  serialNo?: string;
  type?: string;
  status?: string;
  imei?: string;
  securityStatus?: string;
  registerTime?: number;
  model?: EmmModelDTO;
  reseller?: EmmResellerDTO;
}
