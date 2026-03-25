import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { getMessage } from '../util/messageBundleUtils';
import * as Validators from '../validate/validators';
import { CreateTerminalGroupRequest } from './dto/createTerminalGroupRequest';
import { SimpleTerminalDTO } from './dto/simpleTerminalDTO';
import { SimpleTerminalPageResponse } from './dto/simpleTerminalPageResponse';
import { TerminalGroupDTO } from './dto/terminalGroupDTO';
import { TerminalGroupPageResponse } from './dto/terminalGroupPageResponse';
import { TerminalGroupResponse } from './dto/terminalGroupResponse';
import { UpdateTerminalGroupRequest } from './dto/updateTerminalGroupRequest';

const GET_TERMINAL_GROUP_URL = '/v1/3rdsys/terminalGroups/{groupId}';
const SEARCH_TERMINAL_GROUP_URL = '/v1/3rdsys/terminalGroups';
const CREATE_TERMINAL_GROUP_URL = '/v1/3rdsys/terminalGroups';
const SEARCH_TERMINAL_URL = '/v1/3rdsys/terminalGroups/terminal';
const UPDATE_TERMINAL_GROUP_URL = '/v1/3rdsys/terminalGroups/{groupId}';
const ACTIVE_TERMINAL_GROUP_URL = '/v1/3rdsys/terminalGroups/{groupId}/active';
const DISABLE_TERMINAL_GROUP_URL = '/v1/3rdsys/terminalGroups/{groupId}/disable';
const DELETE_TERMINAL_GROUP_URL = '/v1/3rdsys/terminalGroups/{groupId}';
const SEARCH_TERMINAL_IN_GROUP_URL = '/v1/3rdsys/terminalGroups/{groupId}/terminals';
const ADD_TERMINAL_IN_GROUP_URL = '/v1/3rdsys/terminalGroups/{groupId}/terminals';
const REMOVE_TERMINAL_OUT_GROUP_URL = '/v1/3rdsys/terminalGroups/{groupId}/terminals';

export enum TerminalGroupSearchOrderBy {
  Name = 'name',
  CreatedDate_desc = 'createdDate DESC',
  CreatedDate_asc = 'createdDate ASC',
}

export enum TerminalGroupStatus {
  Pending = 'P',
  Active = 'A',
  Suspend = 'S',
}

export enum TerminalSearchOrderBy {
  Name = 'name',
  Tid = 'tid',
  SerialNo = 'serialNo',
}

export enum TerminalStatus {
  Active = 'A',
  Inactive = 'P',
  Suspend = 'S',
}

export class TerminalGroupApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchTerminalGroup(
    pageNo: number,
    pageSize: number,
    orderBy?: TerminalGroupSearchOrderBy,
    status?: TerminalGroupStatus,
    name?: string,
    resellerNames?: string,
    modelNames?: string,
    isDynamic?: boolean
  ): Promise<Result<TerminalGroupDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<TerminalGroupDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_TERMINAL_GROUP_URL, page);
    request.setRequestMethod(RequestMethod.GET);
    if (status) {
      request.addRequestParam('status', status);
    }
    if (modelNames) {
      request.addRequestParam('modelNames', modelNames);
    }
    if (resellerNames) {
      request.addRequestParam('resellerNames', resellerNames);
    }
    if (name) {
      request.addRequestParam('name', name);
    }
    if (isDynamic !== undefined && isDynamic !== null) {
      request.addRequestParam('isDynamic', String(isDynamic));
    }

    const responseJson = await client.execute(request);
    const terminalGroupPageResponse = JSON.parse(responseJson) as TerminalGroupPageResponse;
    return new Result<TerminalGroupDTO>(terminalGroupPageResponse);
  }

  async getTerminalGroup(groupId: number): Promise<Result<TerminalGroupDTO>> {
    const validationErrs = this.validateGroupId(groupId);
    if (validationErrs.length > 0) {
      return new Result<TerminalGroupDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_GROUP_URL.replace('{groupId}', String(groupId)));
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalGroupResponse;
    return new Result<TerminalGroupDTO>(resp);
  }

  async createTerminalGroup(
    createRequest: CreateTerminalGroupRequest
  ): Promise<Result<TerminalGroupDTO>> {
    const validationErrs = Validators.validateObject(createRequest, 'terminalGroupCreateRequest');
    if (validationErrs.length > 0) {
      return new Result<TerminalGroupDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_TERMINAL_GROUP_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createRequest));

    const responseJson = await client.execute(request);
    const terminalGroupResponse = JSON.parse(responseJson) as TerminalGroupResponse;
    return new Result<TerminalGroupDTO>(terminalGroupResponse);
  }

  async searchTerminal(
    pageNo: number,
    pageSize: number,
    orderBy?: TerminalSearchOrderBy,
    status?: TerminalStatus,
    modelName?: string,
    resellerName?: string,
    serialNo?: string,
    excludeGroupId?: string
  ): Promise<Result<SimpleTerminalDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<SimpleTerminalDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_TERMINAL_URL, page);
    request.setRequestMethod(RequestMethod.GET);
    if (status) {
      request.addRequestParam('status', status);
    }
    if (modelName) {
      request.addRequestParam('modelName', modelName);
    }
    if (resellerName) {
      request.addRequestParam('resellerName', resellerName);
    }
    if (serialNo) {
      request.addRequestParam('serialNo', serialNo);
    }
    if (excludeGroupId) {
      request.addRequestParam('excludeGroupId', excludeGroupId);
    }

    const responseJson = await client.execute(request);
    const terminalPageResponse = JSON.parse(responseJson) as SimpleTerminalPageResponse;
    return new Result<SimpleTerminalDTO>(terminalPageResponse);
  }

  async updateTerminalGroup(
    groupId: number,
    updateRequest: UpdateTerminalGroupRequest
  ): Promise<Result<TerminalGroupDTO>> {
    const validationErrs = Validators.validateId(groupId, 'parameter.id.invalid', 'terminalGroupId');
    validationErrs.push(...Validators.validateObject(updateRequest, 'terminalGroupUpdateRequest'));
    if (validationErrs.length > 0) {
      return new Result<TerminalGroupDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_TERMINAL_GROUP_URL.replace('{groupId}', String(groupId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(updateRequest));

    const responseJson = await client.execute(request);
    const terminalGroupResponse = JSON.parse(responseJson) as TerminalGroupResponse;
    return new Result<TerminalGroupDTO>(terminalGroupResponse);
  }

  async activeGroup(groupId: number): Promise<Result<string>> {
    const validationErrs = this.validateGroupId(groupId);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(ACTIVE_TERMINAL_GROUP_URL.replace('{groupId}', String(groupId)));
    request.setRequestMethod(RequestMethod.PUT);

    return this.emptyResult(client, request);
  }

  async disableGroup(groupId: number): Promise<Result<string>> {
    const validationErrs = this.validateGroupId(groupId);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DISABLE_TERMINAL_GROUP_URL.replace('{groupId}', String(groupId)));
    request.setRequestMethod(RequestMethod.PUT);

    return this.emptyResult(client, request);
  }

  async deleteGroup(groupId: number): Promise<Result<string>> {
    const validationErrs = this.validateGroupId(groupId);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DELETE_TERMINAL_GROUP_URL.replace('{groupId}', String(groupId)));
    request.setRequestMethod(RequestMethod.DELETE);

    return this.emptyResult(client, request);
  }

  async searchTerminalsInGroup(
    pageNo: number,
    pageSize: number,
    orderBy?: TerminalSearchOrderBy,
    groupId?: number,
    serialNo?: string,
    merchantNames?: string
  ): Promise<Result<SimpleTerminalDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());

    let orderByValue: string | undefined = orderBy;
    if (orderBy === TerminalSearchOrderBy.SerialNo) {
      orderByValue = 'a.serial_no ASC, a.id ASC';
    }
    const page = createPageRequest(pageNo, pageSize, orderByValue);

    const validationErrs = Validators.validatePageRequest(page);
    if (groupId === null || groupId === undefined) {
      validationErrs.push(getMessage('parameter.id.null', 'groupId'));
    }
    if (validationErrs.length > 0) {
      return new Result<SimpleTerminalDTO>(validationErrs);
    }

    const request = this.getPageRequest(
      SEARCH_TERMINAL_IN_GROUP_URL.replace('{groupId}', String(groupId)),
      page
    );
    request.setRequestMethod(RequestMethod.GET);
    if (serialNo) {
      request.addRequestParam('serialNo', serialNo);
    }
    if (merchantNames) {
      request.addRequestParam('merchantNames', merchantNames);
    }

    const responseJson = await client.execute(request);
    const terminalPageResponse = JSON.parse(responseJson) as SimpleTerminalPageResponse;
    return new Result<SimpleTerminalDTO>(terminalPageResponse);
  }

  async addTerminalToGroup(groupId: number, terminalIds: number[]): Promise<Result<string>> {
    const validationErrs = this.validateGroupId(groupId);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(ADD_TERMINAL_IN_GROUP_URL.replace('{groupId}', String(groupId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalIds));

    return this.emptyResult(client, request);
  }

  async removeTerminalOutGroup(groupId: number, terminalIds: number[]): Promise<Result<string>> {
    const validationErrs = this.validateGroupId(groupId);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(REMOVE_TERMINAL_OUT_GROUP_URL.replace('{groupId}', String(groupId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalIds));

    return this.emptyResult(client, request);
  }

  private validateGroupId(groupId: number | null | undefined): string[] {
    return Validators.validateId(groupId, 'parameter.id.invalid', 'terminalGroupId');
  }

  private async emptyResult(client: ThirdPartySysApiClient, request: SdkRequest): Promise<Result<string>> {
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
