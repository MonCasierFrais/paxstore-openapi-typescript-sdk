import { ParameterVariable } from '../../variable/dto/parameterVariable';

export interface TerminalParameterVariableRequest {
  tid?: string;
  serialNo?: string;
  variableList?: ParameterVariable[];
}
