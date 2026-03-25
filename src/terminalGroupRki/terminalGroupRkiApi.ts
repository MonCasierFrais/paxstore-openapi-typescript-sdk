import { BaseThirdPartySysApi, SearchOrderBy } from '../base/baseThirdPartySysApi';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import * as Validators from '../validate/validators';
import { CreateTerminalGroupRkiRequest } from './dto/createTerminalGroupRkiRequest';
import { TerminalGroupRkiDTO } from './dto/terminalGroupRkiDTO';
import { TerminalGroupRkiPageResponse } from './dto/terminalGroupRkiPageResponse';
import { TerminalGroupRkiResponse } from './dto/terminalGroupRkiResponse';
import * as CreateTerminalGroupRkiRequestValidator from './validator/createTerminalGroupRkiRequestValidator';

const GET_TERMINAL_GROUP_RKI_URL = '/v1/3rdsys/terminalGroupRki/{groupRkiId}';
const SEARCH_TERMINAL_GROUP_RKI_URL = '/v1/3rdsys/terminalGroupRki';
const CREATE_TERMINAL_GROUP_RKI_URL = '/v1/3rdsys/terminalGroupRki';
const SUSPEND_TERMINAL_GROUP_RKI_URL = '/v1/3rdsys/terminalGroupRki/{groupRkiId}/suspend';

export class TerminalGroupRkiApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchGroupPushRkiTask(
    pageNo: number,
    pageSize: number,
    orderBy?: SearchOrderBy,
    groupId?: number,
    pendingOnly?: boolean,
    historyOnly?: boolean,
    keyWords?: string
  ): Promise<Result<TerminalGroupRkiDTO>> {
    const validationErrId = Validators.validateId(groupId, 'parameter.id.invalid', 'terminalGroupId');
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    validationErrs.push(...validationErrId);
    if (validationErrs.length > 0) {
      return new Result<TerminalGroupRkiDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_TERMINAL_GROUP_RKI_URL, page);
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
    const resp = JSON.parse(responseJson) as TerminalGroupRkiPageResponse;
    return new Result<TerminalGroupRkiDTO>(resp);
  }

  async getGroupPushRkiTask(
    groupPushRkiTaskId: number
  ): Promise<Result<TerminalGroupRkiDTO>> {
    const validationErrs = Validators.validateId(groupPushRkiTaskId, 'parameter.id.invalid', 'groupPushRkiTaskId');
    if (validationErrs.length > 0) {
      return new Result<TerminalGroupRkiDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GET_TERMINAL_GROUP_RKI_URL.replace('{groupRkiId}', String(groupPushRkiTaskId))
    );
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalGroupRkiResponse;
    return new Result<TerminalGroupRkiDTO>(resp);
  }

  async pushRkiKey2Group(
    createRequest: CreateTerminalGroupRkiRequest
  ): Promise<Result<TerminalGroupRkiDTO>> {
    const validationErrs = CreateTerminalGroupRkiRequestValidator.validate(createRequest);
    if (validationErrs.length > 0) {
      return new Result<TerminalGroupRkiDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_TERMINAL_GROUP_RKI_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createRequest));

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalGroupRkiResponse;
    return new Result<TerminalGroupRkiDTO>(resp);
  }

  async disableGroupRkiPushTask(
    groupPushRkiTaskId: number
  ): Promise<Result<TerminalGroupRkiDTO>> {
    const validationErrs = Validators.validateId(groupPushRkiTaskId, 'parameter.id.invalid', 'groupPushRkiTaskId');
    if (validationErrs.length > 0) {
      return new Result<TerminalGroupRkiDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      SUSPEND_TERMINAL_GROUP_RKI_URL.replace('{groupRkiId}', String(groupPushRkiTaskId))
    );
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalGroupRkiResponse;
    return new Result<TerminalGroupRkiDTO>(resp);
  }
}
