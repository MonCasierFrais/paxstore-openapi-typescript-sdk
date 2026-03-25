import { EmmModelDTO } from './emmModelDTO';
import { EmmResellerDTO } from './emmResellerDTO';
import { EmmMerchantDTO } from './emmMerchantDTO';

export interface EmmDeviceDTO {
  id?: number;
  name?: string;
  serialNo?: string;
  model?: EmmModelDTO;
  reseller?: EmmResellerDTO;
  merchant?: EmmMerchantDTO;
  registerTime?: number;
  status?: string;
}
