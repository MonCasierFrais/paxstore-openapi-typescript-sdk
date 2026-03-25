import { PageResponse } from '../../base/dto/pageResponse';
import { ParameterPushHistoryDTO } from './parameterPushHistoryDTO';
import { OptimizedParameterPushHistoryDTO } from './optimizedParameterPushHistoryDTO';

export type ParameterPushHistoryPageResponse = PageResponse<ParameterPushHistoryDTO>;
export type OptimizedParameterPushHistoryPageResponse = PageResponse<OptimizedParameterPushHistoryDTO>;
