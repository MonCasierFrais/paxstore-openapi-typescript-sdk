import { BaseThirdPartySysApi } from '../../base/baseThirdPartySysApi';
import { Result } from '../../base/dto/result';
import { RequestMethod } from '../../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../../client/thirdPartySysApiClient';
import { Constants } from '../../constant/constants';
import { validateId, validateObject, validatePageRequest, validateStrNullAndMax } from '../../validate/validators';
import { EmmAppDTO } from './dto/emmAppDTO';
import { EmmAppPageResponse } from './dto/emmAppPageResponse';
import { EmmAppCreateRequest } from './dto/emmAppCreateRequest';
import { EmmAppResponse } from './dto/emmAppResponse';
import { EmmAppDetailDTO } from './dto/emmAppDetailDTO';
import { EmmAppDetailResponse } from './dto/emmAppDetailResponse';
import { SubscribeEmmAppDTO } from './dto/subscribeEmmAppDTO';
import { SubscribeEmmAppPageResponse } from './dto/subscribeEmmAppPageResponse';
import { EmmAppPermissionDTO } from './dto/emmAppPermissionDTO';
import { EmmAppPermissionResponse } from './dto/emmAppPermissionResponse';
import { EmmAppAvailableTestVersionDTO } from './dto/emmAppAvailableTestVersionDTO';
import { EmmAppAvailableTestVersionResponse } from './dto/emmAppAvailableTestVersionResponse';
import { EmptyResponse } from '../../base/dto/emptyResponse';
import { validate as validateEmmAppCreateRequest } from './validator/emmAppCreateRequestValidator';

export enum EmmAppSearchOrderBy {
  EmmAppName_desc = 'a.name DESC',
  EmmAppName_asc = 'a.name ASC',
  EmmUpdatedDate_desc = 'a.updated_date DESC',
  EmmUpdatedDate_asc = 'a.updated_date ASC',
}

export enum EmmAppType {
  GOOGLE = 'G',
  PRIVATE = 'P',
}

export class EmmAppApi extends BaseThirdPartySysApi {
  private static readonly EMM_APP_URL = '/v1/3rdsys/emm/apps';
  private static readonly GET_EMM_APP_DETAIL_URL = '/v1/3rdsys/emm/apps/{appId}';
  private static readonly DELETE_EMM_APP_URL = '/v1/3rdsys/emm/apps/{appId}';
  private static readonly SEARCH_RESELLER_SUBSCRIBE_EMM_APP_URL = '/v1/3rdsys/emm/apps/subscription';
  private static readonly RESELLER_SUBSCRIBE_EMM_APP_URL = '/v1/3rdsys/emm/apps/{appId}/subscribe';
  private static readonly RESELLER_UNSUBSCRIBE_EMM_APP_URL = '/v1/3rdsys/emm/apps/{appId}/unsubscribe';
  private static readonly GET_PERMISSION_LIST_FOR_EMM_APP_URL = '/v1/3rdsys/emm/apps/{appId}/permissions';
  private static readonly GET_AVAILABLE_TEST_TRACK_VERSION_LIST_APP_URL = '/v1/3rdsys/emm/apps/{appId}/available/test/versions';

  constructor(baseUrl: string, apiKey: string, apiSecret: string) {
    super(baseUrl, apiKey, apiSecret);
  }

  async searchEmmApp(
    pageNo: number,
    pageSize: number,
    orderBy: EmmAppSearchOrderBy | null,
    resellerName: string,
    keyWords?: string | null,
    type?: EmmAppType | null
  ): Promise<Result<EmmAppDTO>> {
    const validationErrsR = validateStrNullAndMax(resellerName, 'resellerName', Constants.MAX_64);
    if (validationErrsR.length > 0) return new Result<EmmAppDTO>(validationErrsR);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = { pageNo, pageSize, orderBy: orderBy ?? undefined };
    const validationErrs = validatePageRequest(page);
    if (validationErrs.length > 0) return new Result<EmmAppDTO>(validationErrs);

    const request = this.getPageRequest(EmmAppApi.EMM_APP_URL, page);
    request.addRequestParam('resellerName', resellerName);
    if (keyWords) request.addRequestParam('keyWords', keyWords);
    if (type) request.addRequestParam('appType', type);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as EmmAppPageResponse;
    return new Result<EmmAppDTO>(resp);
  }

  async createEmmApp(emmAppCreateRequest: EmmAppCreateRequest): Promise<Result<EmmAppDTO>> {
    const validationErrs = validateEmmAppCreateRequest(emmAppCreateRequest);
    if (validationErrs.length > 0) return new Result<EmmAppDTO>(validationErrs);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(EmmAppApi.EMM_APP_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(emmAppCreateRequest));

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as EmmAppResponse;
    return new Result<EmmAppDTO>(resp);
  }

  async getEmmAppDetail(appId: number): Promise<Result<EmmAppDetailDTO>> {
    const validationErrs = validateId(appId, 'parameter.id.invalid', 'appId');
    if (validationErrs.length > 0) return new Result<EmmAppDetailDTO>(validationErrs);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(EmmAppApi.GET_EMM_APP_DETAIL_URL.replace('{appId}', String(appId)));
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as EmmAppDetailResponse;
    return new Result<EmmAppDetailDTO>(resp);
  }

  async removeEmmApp(appId: number, resellerName: string): Promise<Result<string>> {
    const validationErrsI = validateId(appId, 'parameter.id.invalid', 'appId');
    if (validationErrsI.length > 0) return new Result<string>(validationErrsI);

    const validationErrR = validateStrNullAndMax(resellerName, 'resellerName', Constants.MAX_64);
    if (validationErrR.length > 0) return new Result<string>(validationErrR);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(EmmAppApi.DELETE_EMM_APP_URL.replace('{appId}', String(appId)));
    request.setRequestMethod(RequestMethod.DELETE);
    request.addRequestParam('resellerName', resellerName);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(resp);
  }

  async searchSubscribeEmmApp(
    pageNo: number,
    pageSize: number,
    name: string | null,
    isSubscribed: boolean
  ): Promise<Result<SubscribeEmmAppDTO>> {
    const validationErrI = validateObject(isSubscribed, 'isSubscribed');
    if (validationErrI.length > 0) return new Result<SubscribeEmmAppDTO>(validationErrI);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = { pageNo, pageSize };
    const validationErrs = validatePageRequest(page);
    if (validationErrs.length > 0) return new Result<SubscribeEmmAppDTO>(validationErrs);

    const request = this.getPageRequest(EmmAppApi.SEARCH_RESELLER_SUBSCRIBE_EMM_APP_URL, page);
    request.addRequestParam('isSubscribed', String(isSubscribed));
    if (name) request.addRequestParam('name', name);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as SubscribeEmmAppPageResponse;
    return new Result<SubscribeEmmAppDTO>(resp);
  }

  async subscribeEmmApp(appId: number): Promise<Result<string>> {
    const validationErrs = validateId(appId, 'parameter.id.invalid', 'appId');
    if (validationErrs.length > 0) return new Result<string>(validationErrs);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(EmmAppApi.RESELLER_SUBSCRIBE_EMM_APP_URL.replace('{appId}', String(appId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(resp);
  }

  async unSubscribeEmmApp(appId: number): Promise<Result<string>> {
    const validationErrs = validateId(appId, 'parameter.id.invalid', 'appId');
    if (validationErrs.length > 0) return new Result<string>(validationErrs);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(EmmAppApi.RESELLER_UNSUBSCRIBE_EMM_APP_URL.replace('{appId}', String(appId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(resp);
  }

  async getEmmAppPermissionList(appId: number): Promise<Result<EmmAppPermissionDTO>> {
    const validationErrs = validateId(appId, 'parameter.id.invalid', 'appId');
    if (validationErrs.length > 0) return new Result<EmmAppPermissionDTO>(validationErrs);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(EmmAppApi.GET_PERMISSION_LIST_FOR_EMM_APP_URL.replace('{appId}', String(appId)));
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as EmmAppPermissionResponse;
    return new Result<EmmAppPermissionDTO>(resp);
  }

  async getAvailableTestTrackVersionList(appId: number): Promise<Result<EmmAppAvailableTestVersionDTO>> {
    const validationErrs = validateId(appId, 'parameter.id.invalid', 'appId');
    if (validationErrs.length > 0) return new Result<EmmAppAvailableTestVersionDTO>(validationErrs);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(EmmAppApi.GET_AVAILABLE_TEST_TRACK_VERSION_LIST_APP_URL.replace('{appId}', String(appId)));
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as EmmAppAvailableTestVersionResponse;
    return new Result<EmmAppAvailableTestVersionDTO>(resp);
  }
}
