import { ParameterVariable } from '../../variable/dto/parameterVariable';

export interface MerchantVariableCreateRequest {
  merchantId?: number;
  variableList?: ParameterVariable[];
}
