import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { PageRequestDTO } from '../base/dto/pageRequestDTO';
import { Response } from '../base/dto/response';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { CreateTerminalApkRequest } from './dto/createTerminalApkRequest';
import { TerminalApkDTO } from './dto/terminalApkDTO';
import { TerminalApkPageResponse } from './dto/terminalApkPageResponse';
import { TerminalApkResponseDTO } from './dto/terminalApkResponse';
import { UpdateTerminalApkRequest } from './dto/updateTerminalApkRequest';
import * as CreateTerminalApkRequestValidator from './validator/createTerminalApkRequestValidator';
import * as UpdateTerminalApkRequestValidator from './validator/updateTerminalApkRequestValidator';
import * as stringUtils from '../util/stringUtils';
import * as Validators from '../validate/validators';

const SEARCH_TERMINAL_APK_LIST_URL = '/v1/3rdsys/terminalApks';
const CREATE_TERMINAL_APK_URL = '/v1/3rdsys/terminalApks';
const GET_TERMINAL_APK_URL = '/v1/3rdsys/terminalApks/{terminalApkId}';
const SUSPEND_TERMINAL_APK_URL = '/v1/3rdsys/terminalApks/suspend';
const DELETE_TERMINAL_APK_URL = '/v1/3rdsys/terminalApks/{terminalApkId}';
const UNINSTALL_TERMINAL_APK_URL = '/v1/3rdsys/terminalApks/uninstall';

export enum SearchOrderBy {
  CreatedDate_desc = 'a.created_date DESC',
  CreatedDate_asc = 'a.created_date ASC',
}

export enum PushStatus {
  Active = 'A',
  Suspend = 'S',
  Completed = 'C',
}

export class TerminalApkApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchTerminalApk(
    pageNo: number,
    pageSize: number,
    orderBy: SearchOrderBy | null,
    terminalTid: string | null,
    appPackageName: string | null,
    status: PushStatus | null
  ): Promise<Result<TerminalApkDTO>>;
  async searchTerminalApk(
    pageNo: number,
    pageSize: number,
    orderBy: SearchOrderBy | null,
    terminalTid: string | null,
    appPackageName: string | null,
    status: PushStatus | null,
    pidList: string[] | null
  ): Promise<Result<TerminalApkDTO>>;
  async searchTerminalApk(
    pageNo: number,
    pageSize: number,
    orderBy: SearchOrderBy | null,
    terminalTid: string | null,
    appPackageName: string | null,
    status: PushStatus | null,
    serialNo: string | null,
    pidList: string[] | null
  ): Promise<Result<TerminalApkDTO>>;
  async searchTerminalApk(
    pageNo: number,
    pageSize: number,
    orderBy: SearchOrderBy | null,
    terminalTid: string | null,
    appPackageName: string | null,
    status: PushStatus | null,
    serialNoOrPidList?: string | string[] | null,
    pidList?: string[] | null
  ): Promise<Result<TerminalApkDTO>> {
    let serialNo: string | null = null;
    let resolvedPidList: string[] | null = null;

    if (Array.isArray(serialNoOrPidList)) {
      // Called with (pageNo, pageSize, orderBy, tid, pkg, status, pidList)
      resolvedPidList = serialNoOrPidList;
    } else if (typeof serialNoOrPidList === 'string') {
      // Called with (pageNo, pageSize, orderBy, tid, pkg, status, serialNo, pidList)
      serialNo = serialNoOrPidList;
      resolvedPidList = pidList ?? null;
    } else if (pidList !== undefined) {
      resolvedPidList = pidList;
    }

    const page: PageRequestDTO = { pageNo, pageSize };
    if (orderBy) {
      page.orderBy = orderBy;
    }

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<TerminalApkDTO>(validationErrs);
    }
    if (stringUtils.isEmpty(terminalTid) && stringUtils.isEmpty(serialNo)) {
      validationErrs.push(BaseThirdPartySysApi.getMessage('parameter.sn.tid.empty'));
      return new Result<TerminalApkDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.getPageRequest(SEARCH_TERMINAL_APK_LIST_URL, page);

    if (terminalTid) {
      request.addRequestParam('terminalTid', terminalTid);
    }
    if (serialNo) {
      request.addRequestParam('serialNo', serialNo);
    }
    if (appPackageName) {
      request.addRequestParam('appPackageName', appPackageName);
    }
    if (resolvedPidList && resolvedPidList.length > 0) {
      request.addRequestParam('pidList', resolvedPidList.join(','));
    }
    if (status) {
      request.addRequestParam('status', status);
    }

    const responseJson = await client.execute(request);
    const pageResponse = JSON.parse(responseJson) as TerminalApkPageResponse;
    return new Result<TerminalApkDTO>(pageResponse);
  }

  async createTerminalApk(
    createTerminalApkRequest: CreateTerminalApkRequest
  ): Promise<Result<TerminalApkDTO>> {
    const validationErrs = CreateTerminalApkRequestValidator.validate(createTerminalApkRequest);
    if (validationErrs.length > 0) {
      return new Result<TerminalApkDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_TERMINAL_APK_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createTerminalApkRequest));

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalApkResponseDTO;
    return new Result<TerminalApkDTO>(resp);
  }

  async getTerminalApk(terminalApkId: number): Promise<Result<TerminalApkDTO>>;
  async getTerminalApk(terminalApkId: number, pidList: string[] | null): Promise<Result<TerminalApkDTO>>;
  async getTerminalApk(
    terminalApkId: number,
    pidList?: string[] | null
  ): Promise<Result<TerminalApkDTO>> {
    const validationErrs = Validators.validateId(terminalApkId, 'parameter.id.invalid', 'terminalApkId');
    if (validationErrs.length > 0) {
      return new Result<TerminalApkDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GET_TERMINAL_APK_URL.replace('{terminalApkId}', String(terminalApkId))
    );
    request.setRequestMethod(RequestMethod.GET);

    if (pidList) {
      request.addRequestParam('pidList', pidList.join(','));
    }

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalApkResponseDTO;
    return new Result<TerminalApkDTO>(resp);
  }

  async disableApkPush(
    disableTerminalApkRequest: UpdateTerminalApkRequest
  ): Promise<Result<string>> {
    const validationErrs = UpdateTerminalApkRequestValidator.validate(
      disableTerminalApkRequest,
      'suspendTerminalApkRequest'
    );
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(SUSPEND_TERMINAL_APK_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(disableTerminalApkRequest));

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as Response<string>;
    return new Result<string>(resp);
  }

  async uninstallApk(
    uninstallApkRequest: UpdateTerminalApkRequest
  ): Promise<Result<string>> {
    const validationErrs = UpdateTerminalApkRequestValidator.validate(
      uninstallApkRequest,
      'uninstallApkRequest'
    );
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UNINSTALL_TERMINAL_APK_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(uninstallApkRequest));

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as Response<string>;
    return new Result<string>(resp);
  }

  async deleteTerminalApk(terminalApkId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalApkId, 'parameter.id.invalid', 'terminalApkId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      DELETE_TERMINAL_APK_URL.replace('{terminalApkId}', String(terminalApkId))
    );
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
