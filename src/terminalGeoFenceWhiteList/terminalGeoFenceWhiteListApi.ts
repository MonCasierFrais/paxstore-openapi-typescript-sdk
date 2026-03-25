import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { EmptyResponse } from '../base/dto/emptyResponse';
import * as Validators from '../validate/validators';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { TerminalGeoFenceWhiteListDTO } from './dto/terminalGeoFenceWhiteListDTO';
import { TerminalGeoFenceWhiteListRequest } from './dto/terminalGeoFenceWhiteListRequest';
import { TerminalGeoFenceWhiteListPageResponse } from './dto/terminalGeoFenceWhiteListPageResponse';

export enum SearchOrderBy {
  CreatedDate_desc = 't.created_date DESC',
  CreatedDate_asc = 't.created_date ASC',
}

export class TerminalGeoFenceWhiteListApi extends BaseThirdPartySysApi {
  private static readonly SEARCH_TERMINAL_GEOFENCE_WHITELIST_URL = '/v1/3rdsys/terminal/geofence/whitelist';
  private static readonly CREATE_TERMINAL_GEOFENCE_WHITELIST_URL = '/v1/3rdsys/terminal/geofence/whitelist';
  private static readonly DELETE_TERMINAL_GEOFENCE_WHITELIST_URL = '/v1/3rdsys/terminal/geofence/whitelist';

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchGeoFenceWhiteList(
    pageNo: number,
    pageSize: number,
    orderBy: SearchOrderBy | null,
    serialNo: string | null
  ): Promise<Result<TerminalGeoFenceWhiteListDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize);
    if (orderBy != null) {
      page.orderBy = orderBy;
    }
    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<TerminalGeoFenceWhiteListDTO>(validationErrs);
    }
    const request = this.getPageRequest(TerminalGeoFenceWhiteListApi.SEARCH_TERMINAL_GEOFENCE_WHITELIST_URL, page);
    request.setRequestMethod(RequestMethod.GET);
    if (serialNo != null) {
      request.addRequestParam('serialNo', serialNo);
    }

    const responseJson = await client.execute(request);
    const response = JSON.parse(responseJson) as TerminalGeoFenceWhiteListPageResponse;
    return new Result<TerminalGeoFenceWhiteListDTO>(response);
  }

  async createGeoFenceWhiteList(createRequest: TerminalGeoFenceWhiteListRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateObject(createRequest, 'createRequest');
    validationErrs.push(...Validators.validateStr(createRequest.serialNo, 'parameter.not.null', 'serialNo'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(TerminalGeoFenceWhiteListApi.CREATE_TERMINAL_GEOFENCE_WHITELIST_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createRequest));
    return this.emptyResult(client, request);
  }

  async deleteGeoFenceWhiteList(deleteRequest: TerminalGeoFenceWhiteListRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateObject(deleteRequest, 'request');
    validationErrs.push(...Validators.validateStr(deleteRequest.serialNo, 'parameter.not.null', 'serialNo'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(TerminalGeoFenceWhiteListApi.DELETE_TERMINAL_GEOFENCE_WHITELIST_URL);
    request.setRequestMethod(RequestMethod.DELETE);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(deleteRequest));
    return this.emptyResult(client, request);
  }

  private async emptyResult(client: ThirdPartySysApiClient, request: SdkRequest): Promise<Result<string>> {
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
