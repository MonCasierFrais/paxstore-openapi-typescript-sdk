import { ModelDTO } from './modelDTO';

export interface FactoryDTO {
  id?: number;
  name?: string;
  modelList?: ModelDTO[];
}
