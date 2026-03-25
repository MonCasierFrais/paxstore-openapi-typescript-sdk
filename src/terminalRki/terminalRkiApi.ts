import { BaseThirdPartySysApi, SearchOrderBy, PushStatus } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { getMessage } from '../util/messageBundleUtils';
import * as stringUtils from '../util/stringUtils';
import * as Validators from '../validate/validators';
import { DisablePushRkiTask } from './dto/disablePushRkiTask';
import { PushRki2TerminalRequest } from './dto/pushRki2TerminalRequest';
import { PushRkiTaskDTO } from './dto/pushRkiTaskDTO';
import { PushRkiTaskPageResponse } from './dto/pushRkiTaskPageResponse';
import { PushRkiTaskResponse } from './dto/pushRkiTaskResponse';
import * as PushRkiBasicRequestValidator from './validator/pushRkiBasicRequestValidator';

const CREATE_TERMINAL_RKI_KEY_URL = '/v1/3rdsys/terminalRkis';
const SEARCH_TERMINAL_RKI_KEY_LIST_URL = '/v1/3rdsys/terminalRkis';
const GET_TERMINAL_RKI_KEY_URL = '/v1/3rdsys/terminalRkis/{terminalRkiId}';
const SUSPEND_TERMINAL_RKI_KEY_URL = '/v1/3rdsys/terminalRkis/suspend';
const DELETE_TERMINAL_RKI_KEY_URL = '/v1/3rdsys/terminalRkis/{terminalRkiId}';

export class TerminalRkiApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async pushRkiKey2Terminal(
    pushRki2TerminalRequest: PushRki2TerminalRequest
  ): Promise<Result<PushRkiTaskDTO>> {
    const validationErrs = PushRkiBasicRequestValidator.validate(
      pushRki2TerminalRequest,
      'pushRki2TerminalRequest'
    );
    if (validationErrs.length > 0) {
      return new Result<PushRkiTaskDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_TERMINAL_RKI_KEY_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(pushRki2TerminalRequest));

    const responseJson = await client.execute(request);
    const response = JSON.parse(responseJson) as PushRkiTaskResponse;
    return new Result<PushRkiTaskDTO>(response);
  }

  async searchPushRkiTasks(
    pageNo: number,
    pageSize: number,
    orderBy?: SearchOrderBy,
    terminalTid?: string,
    rkiKey?: string,
    status?: PushStatus,
    serialNo?: string
  ): Promise<Result<PushRkiTaskDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<PushRkiTaskDTO>(validationErrs);
    }

    if (stringUtils.isEmpty(terminalTid) && stringUtils.isEmpty(serialNo)) {
      validationErrs.push(getMessage('parameter.sn.tid.empty'));
      return new Result<PushRkiTaskDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_TERMINAL_RKI_KEY_LIST_URL, page);
    if (terminalTid) {
      request.addRequestParam('terminalTid', terminalTid);
    }
    if (serialNo) {
      request.addRequestParam('serialNo', serialNo);
    }
    if (rkiKey) {
      request.addRequestParam('rkiKey', rkiKey);
    }
    if (status) {
      request.addRequestParam('status', status);
    }

    const responseJson = await client.execute(request);
    const pageResponse = JSON.parse(responseJson) as PushRkiTaskPageResponse;
    return new Result<PushRkiTaskDTO>(pageResponse);
  }

  async getPushRkiTask(pushRkiTaskId: number): Promise<Result<PushRkiTaskDTO>> {
    const validationErrs = Validators.validateId(pushRkiTaskId, 'parameter.id.invalid', 'pushRkiTaskId');
    if (validationErrs.length > 0) {
      return new Result<PushRkiTaskDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GET_TERMINAL_RKI_KEY_URL.replace('{terminalRkiId}', String(pushRkiTaskId))
    );
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as PushRkiTaskResponse;
    return new Result<PushRkiTaskDTO>(resp);
  }

  async disablePushRkiTask(
    disablePushRkiTask: DisablePushRkiTask
  ): Promise<Result<string>> {
    const validationErrs = PushRkiBasicRequestValidator.validate(
      disablePushRkiTask,
      'disablePushRkiTask'
    );
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(SUSPEND_TERMINAL_RKI_KEY_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(disablePushRkiTask));

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as import('../base/dto/response').Response<string>;
    return new Result<string>(resp);
  }

  async deleteTerminalRki(terminalRkiId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalRkiId, 'parameter.id.invalid', 'terminalRkiId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      DELETE_TERMINAL_RKI_KEY_URL.replace('{terminalRkiId}', String(terminalRkiId))
    );
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
