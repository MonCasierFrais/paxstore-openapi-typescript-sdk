import { BaseThirdPartySysApi, SearchOrderBy } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import * as stringUtils from '../util/stringUtils';
import * as Validators from '../validate/validators';
import { CreateTerminalGroupApkRequest } from './dto/createTerminalGroupApkRequest';
import { SimpleTerminalGroupApkDTO } from './dto/simpleTerminalGroupApkDTO';
import { TerminalGroupApkPageResponse } from './dto/terminalGroupApkPageResponse';
import { TerminalGroupApkResponse } from './dto/terminalGroupApkResponse';
import * as CreateTerminalGroupApkRequestValidator from './validator/createTerminalGroupApkRequestValidator';

const GET_TERMINAL_GROUP_APK_URL = '/v1/3rdsys/terminalGroupApks/{groupApkId}';
const SEARCH_TERMINAL_GROUP_APK_URL = '/v1/3rdsys/terminalGroupApks';
const CREATE_TERMINAL_GROUP_APK_URL = '/v1/3rdsys/terminalGroupApks';
const SUSPEND_TERMINAL_GROUP_APK_URL = '/v1/3rdsys/terminalGroupApks/{groupApkId}/suspend';
const DELETE_TERMINAL_GROUP_APK_URL = '/v1/3rdsys/terminalGroupApks/{groupApkId}';

export class TerminalGroupApkApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async getTerminalGroupApk(
    groupApkId: number,
    pidList?: string[]
  ): Promise<Result<SimpleTerminalGroupApkDTO>> {
    const validationErrs = Validators.validateId(groupApkId, 'parameter.id.invalid', 'terminalGroupApkId');
    if (validationErrs.length > 0) {
      return new Result<SimpleTerminalGroupApkDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GET_TERMINAL_GROUP_APK_URL.replace('{groupApkId}', String(groupApkId))
    );
    request.setRequestMethod(RequestMethod.GET);
    if (pidList && pidList.length > 0) {
      request.addRequestParam('pidList', pidList.join(','));
    }

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalGroupApkResponse;
    return new Result<SimpleTerminalGroupApkDTO>(resp);
  }

  async searchTerminalGroupApk(
    pageNo: number,
    pageSize: number,
    orderBy?: SearchOrderBy,
    groupId?: number,
    pendingOnly?: boolean,
    historyOnly?: boolean,
    keyWords?: string
  ): Promise<Result<SimpleTerminalGroupApkDTO>> {
    const validationErrId = Validators.validateId(groupId, 'parameter.id.invalid', 'terminalGroupId');
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    validationErrs.push(...validationErrId);
    if (validationErrs.length > 0) {
      return new Result<SimpleTerminalGroupApkDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_TERMINAL_GROUP_APK_URL, page);
    request.setRequestMethod(RequestMethod.GET);
    if (groupId !== null && groupId !== undefined) {
      request.addRequestParam('groupId', String(groupId));
    }
    if (pendingOnly !== null && pendingOnly !== undefined) {
      request.addRequestParam('pendingOnly', String(pendingOnly));
    }
    if (historyOnly !== null && historyOnly !== undefined) {
      request.addRequestParam('historyOnly', String(historyOnly));
    }
    if (keyWords) {
      request.addRequestParam('keyWords', keyWords);
    }

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalGroupApkPageResponse;
    return new Result<SimpleTerminalGroupApkDTO>(resp);
  }

  async createAndActiveGroupApk(
    createRequest: CreateTerminalGroupApkRequest
  ): Promise<Result<SimpleTerminalGroupApkDTO>> {
    const validationErrs = CreateTerminalGroupApkRequestValidator.validate(createRequest);
    if (validationErrs.length > 0) {
      return new Result<SimpleTerminalGroupApkDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_TERMINAL_GROUP_APK_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createRequest));

    const responseJson = await client.execute(request);
    const terminalGroupApkResponse = JSON.parse(responseJson) as TerminalGroupApkResponse;
    return new Result<SimpleTerminalGroupApkDTO>(terminalGroupApkResponse);
  }

  async suspendTerminalGroupApk(
    groupApkId: number
  ): Promise<Result<SimpleTerminalGroupApkDTO>> {
    const validationErrs = Validators.validateId(groupApkId, 'parameter.id.invalid', 'terminalGroupApkId');
    if (validationErrs.length > 0) {
      return new Result<SimpleTerminalGroupApkDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      SUSPEND_TERMINAL_GROUP_APK_URL.replace('{groupApkId}', String(groupApkId))
    );
    request.setRequestMethod(RequestMethod.POST);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalGroupApkResponse;
    return new Result<SimpleTerminalGroupApkDTO>(resp);
  }

  async deleteTerminalGroupApk(groupApkId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(groupApkId, 'parameter.id.invalid', 'terminalGroupApkId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      DELETE_TERMINAL_GROUP_APK_URL.replace('{groupApkId}', String(groupApkId))
    );
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
