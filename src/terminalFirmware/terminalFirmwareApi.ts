import { BaseThirdPartySysApi, SearchOrderBy, PushStatus } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import * as Validators from '../validate/validators';
import { DisablePushFirmwareTask } from './dto/disablePushFirmwareTask';
import { PushFirmware2TerminalRequest } from './dto/pushFirmware2TerminalRequest';
import { PushFirmwareTaskDTO } from './dto/pushFirmwareTaskDTO';
import { PushFirmwareTaskPageResponse } from './dto/pushFirmwareTaskPageResponse';
import { PushFirmwareTaskResponse } from './dto/pushFirmwareTaskResponse';
import * as PushFirmwareTaskBasicRequestValidator from './validator/pushFirmwareTaskBasicRequestValidator';

const CREATE_TERMINAL_FIRMWARE_URL = '/v1/3rdsys/terminalFirmwares';
const SEARCH_TERMINAL_FIRMWARE_LIST_URL = '/v1/3rdsys/terminalFirmwares';
const GET_TERMINAL_FIRMWARE_URL = '/v1/3rdsys/terminalFirmwares/{terminalFirmwareId}';
const SUSPEND_TERMINAL_FIRMWARE_URL = '/v1/3rdsys/terminalFirmwares/suspend';
const DELETE_TERMINAL_FIRMWARE_URL = '/v1/3rdsys/terminalFirmwares/{terminalFirmwareId}';

export class TerminalFirmwareApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async pushFirmware2Terminal(
    pushFirmware2TerminalRequest: PushFirmware2TerminalRequest
  ): Promise<Result<PushFirmwareTaskDTO>> {
    const validationErrs = PushFirmwareTaskBasicRequestValidator.validate(
      pushFirmware2TerminalRequest,
      'pushFirmware2TerminalRequest'
    );
    if (validationErrs.length > 0) {
      return new Result<PushFirmwareTaskDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_TERMINAL_FIRMWARE_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(pushFirmware2TerminalRequest));

    const responseJson = await client.execute(request);
    const response = JSON.parse(responseJson) as PushFirmwareTaskResponse;
    return new Result<PushFirmwareTaskDTO>(response);
  }

  async searchPushFirmwareTasksWithSerialNo(
    pageNo: number,
    pageSize: number,
    orderBy?: SearchOrderBy,
    terminalTid?: string,
    fmName?: string,
    status?: PushStatus,
    serialNo?: string
  ): Promise<Result<PushFirmwareTaskDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const request = this.getPageRequest(SEARCH_TERMINAL_FIRMWARE_LIST_URL, page);
    if (terminalTid) {
      request.addRequestParam('terminalTid', terminalTid);
    }
    if (serialNo) {
      request.addRequestParam('serialNo', serialNo);
    }
    if (fmName) {
      request.addRequestParam('fmName', fmName);
    }
    if (status) {
      request.addRequestParam('status', status);
    }

    const responseJson = await client.execute(request);
    const pageResponse = JSON.parse(responseJson) as PushFirmwareTaskPageResponse;
    return new Result<PushFirmwareTaskDTO>(pageResponse);
  }

  async searchPushFirmwareTasks(
    pageNo: number,
    pageSize: number,
    orderBy?: SearchOrderBy,
    terminalTid?: string,
    fmName?: string,
    status?: PushStatus
  ): Promise<Result<PushFirmwareTaskDTO>> {
    const validationErrs = Validators.validateStr(terminalTid, 'parameter.not.null', 'terminalTid');
    if (validationErrs.length > 0) {
      return new Result<PushFirmwareTaskDTO>(validationErrs);
    }

    return this.searchPushFirmwareTasksWithSerialNo(pageNo, pageSize, orderBy, terminalTid, fmName, status);
  }

  async getPushFirmwareTask(pushFirmwareTaskId: number): Promise<Result<PushFirmwareTaskDTO>> {
    const validationErrs = Validators.validateId(pushFirmwareTaskId, 'parameter.id.invalid', 'pushFirmwareTaskId');
    if (validationErrs.length > 0) {
      return new Result<PushFirmwareTaskDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GET_TERMINAL_FIRMWARE_URL.replace('{terminalFirmwareId}', String(pushFirmwareTaskId))
    );
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as PushFirmwareTaskResponse;
    return new Result<PushFirmwareTaskDTO>(resp);
  }

  async disablePushFirmwareTask(
    disablePushFirmwareTask: DisablePushFirmwareTask
  ): Promise<Result<string>> {
    const validationErrs = PushFirmwareTaskBasicRequestValidator.validate(
      disablePushFirmwareTask,
      'disablePushFirmwareTask'
    );
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(SUSPEND_TERMINAL_FIRMWARE_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(disablePushFirmwareTask));

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as import('../base/dto/response').Response<string>;
    return new Result<string>(resp);
  }

  async deleteTerminalFirmware(terminalFirmwareId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalFirmwareId, 'parameter.id.invalid', 'terminalFirmwareId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      DELETE_TERMINAL_FIRMWARE_URL.replace('{terminalFirmwareId}', String(terminalFirmwareId))
    );
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
