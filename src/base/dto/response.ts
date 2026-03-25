import { BaseDTO } from './baseDTO';

export interface Response<T> extends BaseDTO {
  data?: T;
}
