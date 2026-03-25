import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { Result } from '../base/dto/result';
import { SdkRequest } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import * as Validators from '../validate/validators';
import * as stringUtils from '../util/stringUtils';
import { ParameterPushHistoryDTO } from './dto/parameterPushHistoryDTO';
import { OptimizedParameterPushHistoryDTO } from './dto/optimizedParameterPushHistoryDTO';
import { PageResponse } from '../base/dto/pageResponse';

export enum PushStatus {
  Success = 2,
  Failed = 3,
}

export class PushHistoryApi extends BaseThirdPartySysApi {
  private static readonly SEARCH_APP_PUSH_HISTORY_URL = '/v1/3rdsys/parameter/push/history';

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchParameterPushHistory(
    pageNo: number,
    pageSize: number,
    packageName: string,
    serialNo?: string,
    pushStatus?: PushStatus,
    pushTime?: Date,
  ): Promise<Result<ParameterPushHistoryDTO>> {
    return this.doSearchParameterPushHistory<ParameterPushHistoryDTO>(
      pageNo, pageSize, packageName, serialNo, pushStatus, pushTime, 'false', 'false',
    );
  }

  async searchOptimizedParameterPushHistory(
    pageNo: number,
    pageSize: number,
    packageName: string,
    serialNo?: string,
    pushStatus?: PushStatus,
    pushTime?: Date,
  ): Promise<Result<OptimizedParameterPushHistoryDTO>> {
    return this.doSearchParameterPushHistory<OptimizedParameterPushHistoryDTO>(
      pageNo, pageSize, packageName, serialNo, pushStatus, pushTime, 'false', 'true',
    );
  }

  async searchLatestParameterPushHistory(
    pageNo: number,
    pageSize: number,
    packageName: string,
    serialNo?: string,
    pushStatus?: PushStatus,
    pushTime?: Date,
  ): Promise<Result<ParameterPushHistoryDTO>> {
    return this.doSearchParameterPushHistory<ParameterPushHistoryDTO>(
      pageNo, pageSize, packageName, serialNo, pushStatus, pushTime, 'true', 'false',
    );
  }

  async searchLatestOptimizedParameterPushHistory(
    pageNo: number,
    pageSize: number,
    packageName: string,
    serialNo?: string,
    pushStatus?: PushStatus,
    pushTime?: Date,
  ): Promise<Result<OptimizedParameterPushHistoryDTO>> {
    return this.doSearchParameterPushHistory<OptimizedParameterPushHistoryDTO>(
      pageNo, pageSize, packageName, serialNo, pushStatus, pushTime, 'true', 'true',
    );
  }

  private async doSearchParameterPushHistory<T>(
    pageNo: number,
    pageSize: number,
    packageName: string,
    serialNo: string | undefined,
    pushStatus: PushStatus | undefined,
    pushTime: Date | undefined,
    onlyLastPushHistory: string,
    optimizeParameters: string,
  ): Promise<Result<T>> {
    const validationErrsP = Validators.validateStr(packageName, 'parameter.not.null', 'packageName');
    if (validationErrsP.length > 0) {
      return new Result<T>(validationErrsP);
    }

    const page = createPageRequest(pageNo, pageSize);
    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<T>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.getPageRequest(PushHistoryApi.SEARCH_APP_PUSH_HISTORY_URL, page);

    if (pushStatus != null) {
      request.addRequestParam('pushStatus', String(pushStatus));
    }
    if (pushTime != null) {
      request.addRequestParam('pushTime', pushTime.toISOString());
    }
    request.addRequestParam('packageName', packageName);
    if (serialNo != null) {
      request.addRequestParam('serialNo', serialNo);
    }
    request.addRequestParam('onlyLastPushHistory', onlyLastPushHistory);
    request.addRequestParam('optimizeParameters', optimizeParameters);

    const responseJson = await client.execute(request);
    const pageResponse = JSON.parse(responseJson) as PageResponse<T>;
    return new Result<T>(pageResponse);
  }
}
