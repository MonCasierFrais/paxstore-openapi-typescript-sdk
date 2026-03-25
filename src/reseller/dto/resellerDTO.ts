import { ResellerPageDTO } from './resellerPageDTO';
import { SimpleResellerDTO } from '../../merchant/dto/simpleResellerDTO';

export interface ResellerDTO extends ResellerPageDTO {
  entityAttributeValues?: Record<string, string>;
  parent?: SimpleResellerDTO;
}
