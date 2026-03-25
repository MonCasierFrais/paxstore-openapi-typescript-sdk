import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { DownloadTaskDTO } from '../base/dto/downloadTaskDTO';
import { DownloadTaskResponse } from '../base/dto/downloadTaskResponse';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { getMessage } from '../util/messageBundleUtils';
import * as stringUtils from '../util/stringUtils';
import * as Validators from '../validate/validators';
import { TerminalConfigDTO } from './dto/terminalConfigDTO';
import { TerminalConfigResponse } from './dto/terminalConfigResponse';
import { TerminalConfigUpdateRequest } from './dto/terminalConfigUpdateRequest';
import { TerminalCopyRequest } from './dto/terminalCopyRequest';
import { TerminalCreateRequest } from './dto/terminalCreateRequest';
import { TerminalDTO } from './dto/terminalDTO';
import { TerminalLogDTO } from './dto/terminalLogDTO';
import { TerminalLogPageResponse } from './dto/terminalLogPageResponse';
import { TerminalLogRequest } from './dto/terminalLogRequest';
import { TerminalMessageRequest } from './dto/terminalMessageRequest';
import { TerminalMoveRequest } from './dto/terminalMoveRequest';
import { TerminalNetworkDTO } from './dto/terminalNetworkDTO';
import { TerminalNetworkResponse } from './dto/terminalNetworkResponse';
import { TerminalPageResponse } from './dto/terminalPageResponse';
import { TerminalPedDTO } from './dto/terminalPedDTO';
import { TerminalPedResponse } from './dto/terminalPedResponse';
import { TerminalResponseDTO } from './dto/terminalResponseDTO';
import { TerminalSnCopyRequest } from './dto/terminalSnCopyRequest';
import { TerminalSystemUsageDTO } from './dto/terminalSystemUsageDTO';
import { TerminalSystemUsageResponse } from './dto/terminalSystemUsageResponse';
import { TerminalUpdateRequest } from './dto/terminalUpdateRequest';
import { TerminalGroupRequest } from '../terminalGroup/dto/terminalGroupRequest';
import { TerminalSnGroupRequest } from '../terminalGroup/dto/terminalSnGroupRequest';
import * as TerminalCopyRequestValidator from './validator/terminalCopyRequestValidator';
import * as TerminalMessageRequestValidator from './validator/terminalMessageRequestValidator';
import * as TerminalMoveRequestValidator from './validator/terminalMoveRequestValidator';
import * as TerminalRequestValidator from './validator/terminalRequestValidator';

export enum TerminalStatus {
  Active = 'A',
  Inactive = 'P',
  Suspend = 'S',
}

export enum TerminalSearchOrderBy {
  Name = 'name',
  Tid = 'tid',
  SerialNo = 'serialNo',
}

export enum TerminalPushCmd {
  Restart = 'Restart',
  Lock = 'Lock',
  Unlock = 'Unlock',
}

const SEARCH_TERMINAL_URL = '/v1/3rdsys/terminals';
const GET_TERMINAL_URL = '/v1/3rdsys/terminals/{terminalId}';
const ACTIVE_TERMINAL_URL = '/v1/3rdsys/terminals/{terminalId}/active';
const DISABLE_TERMINAL_URL = '/v1/3rdsys/terminals/{terminalId}/disable';
const MOVE_TERMINAL_URL = '/v1/3rdsys/terminals/{terminalId}/move';
const DELETE_TERMINAL_URL = '/v1/3rdsys/terminals/{terminalId}';
const CREATE_TERMINAL_URL = '/v1/3rdsys/terminals';
const UPDATE_TERMINAL_URL = '/v1/3rdsys/terminals/{terminalId}';
const COPY_TERMINAL_URL = '/v1/3rdsys/terminals/copy';
const ADD_TERMINAL_TO_GROUP_URL = '/v1/3rdsys/terminals/groups';
const UPDATE_TERMINAL_REMOTE_CONFIG_URL = '/v1/3rdsys/terminals/{terminalId}/config';
const GET_TERMINAL_REMOTE_CONFIG_URL = '/v1/3rdsys/terminals/{terminalId}/config';
const GET_TERMINAL_PED_STATUS_URL = '/v1/3rdsys/terminals/{terminalId}/ped';
const PUSH_TERMINAL_ACTION_URL = '/v1/3rdsys/terminals/{terminalId}/operation';
const GET_TERMINAL_NETWORK_URL = '/v1/3rdsys/terminals/network';

const GET_TERMINAL_URL_BY_SN = '/v1/3rdsys/terminal';
const ACTIVE_TERMINAL_URL_BY_SN = '/v1/3rdsys/terminal/active';
const DISABLE_TERMINAL_URL_BY_SN = '/v1/3rdsys/terminal/disable';
const MOVE_TERMINAL_URL_BY_SN = '/v1/3rdsys/terminal/move';
const DELETE_TERMINAL_URL_BY_SN = '/v1/3rdsys/terminal';
const UPDATE_TERMINAL_URL_BY_SN = '/v1/3rdsys/terminal';
const COPY_TERMINAL_URL_BY_SN = '/v1/3rdsys/terminal/copy';
const ADD_TERMINAL_TO_GROUP_URL_BY_SN = '/v1/3rdsys/terminal/groups';
const UPDATE_TERMINAL_REMOTE_CONFIG_URL_BY_SN = '/v1/3rdsys/terminal/config';
const GET_TERMINAL_REMOTE_CONFIG_URL_BY_SN = '/v1/3rdsys/terminal/config';
const GET_TERMINAL_PED_STATUS_URL_BY_SN = '/v1/3rdsys/terminal/ped';
const PUSH_TERMINAL_ACTION_URL_BY_SN = '/v1/3rdsys/terminal/operation';
const PUSH_TERMINAL_MESSAGE = '/v1/3rdsys/terminals/{terminalId}/push/message';
const PUSH_TERMINAL_MESSAGE_BY_SN = '/v1/3rdsys/terminal/push/message';
const GET_TERMINAL_SYSTEM_USAGE_BY_ID = '/v1/3rdsys/terminals/{terminalId}/system/usage';
const GET_TERMINAL_SYSTEM_USAGE_BY_SN = '/v1/3rdsys/terminal/system/usage';
const COLLECT_TERMINAL_LOG = '/v1/3rdsys/terminals/{terminalId}/collect/log';
const COLLECT_TERMINAL_LOG_BY_SN = '/v1/3rdsys/terminal/collect/log';
const SEARCH_TERMINAL_LOG = '/v1/3rdsys/terminals/{terminalId}/logs';
const SEARCH_TERMINAL_LOG_BY_SN = '/v1/3rdsys/terminal/logs';
const GET_TERMINAL_LOG_DOWNLOAD_URL = '/v1/3rdsys/terminals/{terminalId}/logs/{terminalLogId}/download-task';
const GET_TERMINAL_LOG_DOWNLOAD_URL_BY_SN = '/v1/3rdsys/terminal/logs/{terminalLogId}/download-task';
const CHANGE_TERMINAL_MODEL_BY_ID = '/v1/3rdsys/terminals/{terminalId}/model';
const CHANGE_TERMINAL_MODEL_BY_SN = '/v1/3rdsys/terminal/model';
const PUSH_TERMINAL_SET_LAUNCHER_ACTION = '/v1/3rdsys/terminals/{terminalId}/launcher';
const PUSH_TERMINAL_SET_LAUNCHER_ACTION_BY_SN = '/v1/3rdsys/terminal/launcher';

export class TerminalApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchTerminal(
    pageNo: number,
    pageSize: number,
    orderBy?: TerminalSearchOrderBy,
    status?: TerminalStatus,
    snNameTID?: string,
    includeGeoLocation: boolean = false,
    includeInstalledApks: boolean = false,
    includeInstalledFirmware: boolean = false,
    resellerName?: string,
    merchantName?: string
  ): Promise<Result<TerminalDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<TerminalDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_TERMINAL_URL, page);
    if (resellerName) {
      request.addRequestParam('resellerName', resellerName);
    }
    if (merchantName) {
      request.addRequestParam('merchantName', merchantName);
    }
    if (status) {
      request.addRequestParam('status', status);
    }
    if (snNameTID) {
      request.addRequestParam('snNameTID', snNameTID);
    }
    request.addRequestParam('includeGeoLocation', String(includeGeoLocation));
    request.addRequestParam('includeInstalledFirmware', String(includeInstalledFirmware));
    request.addRequestParam('includeInstalledApks', String(includeInstalledApks));

    const responseJson = await client.execute(request);
    const terminalPageResponse = JSON.parse(responseJson) as TerminalPageResponse;
    return new Result<TerminalDTO>(terminalPageResponse);
  }

  async getTerminal(
    terminalId: number,
    includeDetailInfoList: boolean = false,
    includeInstalledApks: boolean = false,
    includeInstalledFirmware: boolean = false,
    includeMasterTerminal: boolean = false
  ): Promise<Result<TerminalDTO>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<TerminalDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_URL.replace('{terminalId}', String(terminalId)));
    request.addRequestParam('includeDetailInfoList', String(includeDetailInfoList));
    request.addRequestParam('includeInstalledApks', String(includeInstalledApks));
    request.addRequestParam('includeInstalledFirmware', String(includeInstalledFirmware));
    request.addRequestParam('includeMasterTerminal', String(includeMasterTerminal));

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalResponseDTO;
    return new Result<TerminalDTO>(terminalResponse);
  }

  async activateTerminal(terminalId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(ACTIVE_TERMINAL_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.PUT);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async disableTerminal(terminalId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DISABLE_TERMINAL_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.PUT);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async moveTerminal(terminalId: number, resellerName: string, merchantName: string): Promise<Result<string>> {
    const validationErrs = TerminalMoveRequestValidator.validate(terminalId, resellerName, merchantName);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(MOVE_TERMINAL_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    const terminalMoveRequest: TerminalMoveRequest = { resellerName, merchantName };
    request.setRequestBody(JSON.stringify(terminalMoveRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async deleteTerminal(terminalId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DELETE_TERMINAL_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async createTerminal(terminalCreateRequest: TerminalCreateRequest): Promise<Result<TerminalDTO>> {
    const validationErrs = TerminalRequestValidator.validate(terminalCreateRequest, 'terminalCreateRequest');
    if (validationErrs.length > 0) {
      return new Result<TerminalDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_TERMINAL_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalCreateRequest));

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalResponseDTO;
    return new Result<TerminalDTO>(terminalResponse);
  }

  async updateTerminal(terminalId: number, terminalUpdateRequest: TerminalUpdateRequest): Promise<Result<TerminalDTO>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    validationErrs.push(...TerminalRequestValidator.validate(terminalUpdateRequest, 'terminalUpdateRequest'));
    if (validationErrs.length > 0) {
      return new Result<TerminalDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_TERMINAL_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalUpdateRequest));

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalResponseDTO;
    return new Result<TerminalDTO>(terminalResponse);
  }

  async copyTerminal(terminalCopyRequest: TerminalCopyRequest): Promise<Result<TerminalDTO>> {
    const validationErrs = TerminalCopyRequestValidator.validate(terminalCopyRequest);
    if (validationErrs.length > 0) {
      return new Result<TerminalDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(COPY_TERMINAL_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalCopyRequest));

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalResponseDTO;
    return new Result<TerminalDTO>(terminalResponse);
  }

  async batchAddTerminalToGroup(groupRequest: TerminalGroupRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateObject(groupRequest, 'terminalGroupRequest');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(ADD_TERMINAL_TO_GROUP_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(groupRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async updateTerminalConfig(terminalId: number, terminalConfigUpdateRequest: TerminalConfigUpdateRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    validationErrs.push(...Validators.validateObject(terminalConfigUpdateRequest, 'terminalRemoteConfigRequest'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_TERMINAL_REMOTE_CONFIG_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalConfigUpdateRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async getTerminalConfig(terminalId: number): Promise<Result<TerminalConfigDTO>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<TerminalConfigDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_REMOTE_CONFIG_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const terminalConfigResponse = JSON.parse(responseJson) as TerminalConfigResponse;
    return new Result<TerminalConfigDTO>(terminalConfigResponse);
  }

  async getTerminalPed(terminalId: number): Promise<Result<TerminalPedDTO>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<TerminalPedDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_PED_STATUS_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const terminalPedResponse = JSON.parse(responseJson) as TerminalPedResponse;
    return new Result<TerminalPedDTO>(terminalPedResponse);
  }

  async pushCmdToTerminal(terminalId: number, command: TerminalPushCmd): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    validationErrs.push(...Validators.validateObject(command, 'terminalPushCmdRequest'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(PUSH_TERMINAL_ACTION_URL.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('command', command);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async getTerminalNetwork(serialNo?: string, tid?: string): Promise<Result<TerminalNetworkDTO>> {
    const validationErrs: string[] = [];
    if (stringUtils.isEmpty(serialNo) && stringUtils.isEmpty(tid)) {
      validationErrs.push(getMessage('parameter.sn.tid.empty'));
    }
    if (validationErrs.length > 0) {
      return new Result<TerminalNetworkDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_NETWORK_URL);
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    if (serialNo) {
      request.addRequestParam('serialNo', serialNo.trim());
    }
    if (tid) {
      request.addRequestParam('tid', tid.trim());
    }

    const responseJson = await client.execute(request);
    const terminalNetworkResponse = JSON.parse(responseJson) as TerminalNetworkResponse;
    return new Result<TerminalNetworkDTO>(terminalNetworkResponse);
  }

  async pushTerminalMessage(terminalId: number, terminalMessageRequest: TerminalMessageRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    validationErrs.push(...TerminalMessageRequestValidator.validate(terminalMessageRequest, 'terminalMessageRequest'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(PUSH_TERMINAL_MESSAGE.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalMessageRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  // --- By Serial Number (SN) methods ---

  async getTerminalBySn(
    serialNo: string,
    includeDetailInfoList: boolean = false,
    includeInstalledApks: boolean = false,
    includeInstalledFirmware: boolean = false,
    includeMasterTerminal: boolean = false
  ): Promise<Result<TerminalDTO>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<TerminalDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_URL_BY_SN);
    request.addRequestParam('includeDetailInfoList', String(includeDetailInfoList));
    request.addRequestParam('includeInstalledApks', String(includeInstalledApks));
    request.addRequestParam('includeInstalledFirmware', String(includeInstalledFirmware));
    request.addRequestParam('includeMasterTerminal', String(includeMasterTerminal));
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalResponseDTO;
    return new Result<TerminalDTO>(terminalResponse);
  }

  async activateTerminalBySn(serialNo: string): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(ACTIVE_TERMINAL_URL_BY_SN);
    request.setRequestMethod(RequestMethod.PUT);
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async disableTerminalBySn(serialNo: string): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DISABLE_TERMINAL_URL_BY_SN);
    request.setRequestMethod(RequestMethod.PUT);
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async moveTerminalBySn(serialNo: string, resellerName: string, merchantName: string): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(MOVE_TERMINAL_URL_BY_SN);
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    const terminalMoveRequest: TerminalMoveRequest = { resellerName, merchantName };
    request.addRequestParam('serialNo', serialNo.trim());
    request.setRequestBody(JSON.stringify(terminalMoveRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async deleteTerminalBySn(serialNo: string): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DELETE_TERMINAL_URL_BY_SN);
    request.setRequestMethod(RequestMethod.DELETE);
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async updateTerminalBySn(serialNo: string, terminalUpdateRequest: TerminalUpdateRequest): Promise<Result<TerminalDTO>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    validationErrs.push(...TerminalRequestValidator.validate(terminalUpdateRequest, 'terminalUpdateRequest'));
    if (validationErrs.length > 0) {
      return new Result<TerminalDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_TERMINAL_URL_BY_SN);
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());
    request.setRequestBody(JSON.stringify(terminalUpdateRequest));

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalResponseDTO;
    return new Result<TerminalDTO>(terminalResponse);
  }

  async copyTerminalBySn(terminalCopyRequest: TerminalSnCopyRequest): Promise<Result<TerminalDTO>> {
    const validationErrs = TerminalCopyRequestValidator.validateSerialNo(terminalCopyRequest);
    if (validationErrs.length > 0) {
      return new Result<TerminalDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(COPY_TERMINAL_URL_BY_SN);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalCopyRequest));

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalResponseDTO;
    return new Result<TerminalDTO>(terminalResponse);
  }

  async batchAddTerminalToGroupBySn(groupRequest: TerminalSnGroupRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateObject(groupRequest, 'terminalGroupRequest');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(ADD_TERMINAL_TO_GROUP_URL_BY_SN);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(groupRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async updateTerminalConfigBySn(serialNo: string, terminalConfigUpdateRequest: TerminalConfigUpdateRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    validationErrs.push(...Validators.validateObject(terminalConfigUpdateRequest, 'terminalRemoteConfigRequest'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_TERMINAL_REMOTE_CONFIG_URL_BY_SN);
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());
    request.setRequestBody(JSON.stringify(terminalConfigUpdateRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async getTerminalConfigBySn(serialNo: string): Promise<Result<TerminalConfigDTO>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<TerminalConfigDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_REMOTE_CONFIG_URL_BY_SN);
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const terminalConfigResponse = JSON.parse(responseJson) as TerminalConfigResponse;
    return new Result<TerminalConfigDTO>(terminalConfigResponse);
  }

  async getTerminalPedBySn(serialNo: string): Promise<Result<TerminalPedDTO>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<TerminalPedDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_PED_STATUS_URL_BY_SN);
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const terminalPedResponse = JSON.parse(responseJson) as TerminalPedResponse;
    return new Result<TerminalPedDTO>(terminalPedResponse);
  }

  async pushCmdToTerminalBySn(serialNo: string, command: TerminalPushCmd): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    validationErrs.push(...Validators.validateObject(command, 'terminalPushCmdRequest'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(PUSH_TERMINAL_ACTION_URL_BY_SN);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());
    request.addRequestParam('command', command);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async pushTerminalMessageBySn(serialNo: string, terminalMessageRequest: TerminalMessageRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    validationErrs.push(...TerminalMessageRequestValidator.validate(terminalMessageRequest, 'terminalMessageRequest'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(PUSH_TERMINAL_MESSAGE_BY_SN);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());
    request.setRequestBody(JSON.stringify(terminalMessageRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async getTerminalSystemUsageById(terminalId: number): Promise<Result<TerminalSystemUsageDTO>> {
    const validationErrs = Validators.validateStr(String(terminalId), 'parameter.not.empty', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<TerminalSystemUsageDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_SYSTEM_USAGE_BY_ID.replace('{terminalId}', String(terminalId).trim()));

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalSystemUsageResponse;
    return new Result<TerminalSystemUsageDTO>(terminalResponse);
  }

  async getTerminalSystemUsageBySn(serialNo: string): Promise<Result<TerminalSystemUsageDTO>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<TerminalSystemUsageDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_TERMINAL_SYSTEM_USAGE_BY_SN);
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const terminalResponse = JSON.parse(responseJson) as TerminalSystemUsageResponse;
    return new Result<TerminalSystemUsageDTO>(terminalResponse);
  }

  async collectTerminalLog(terminalId: number, terminalLogRequest: TerminalLogRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(String(terminalId), 'parameter.not.empty', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(COLLECT_TERMINAL_LOG.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(terminalLogRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async collectTerminalLogBySn(serialNo: string, terminalLogRequest: TerminalLogRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(COLLECT_TERMINAL_LOG_BY_SN);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());
    request.setRequestBody(JSON.stringify(terminalLogRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async searchTerminalLog(pageNo: number, pageSize: number, terminalId: number): Promise<Result<TerminalLogDTO>> {
    const validationErrs = Validators.validateStr(String(terminalId), 'parameter.not.empty', 'terminalId');
    if (validationErrs.length > 0) {
      return new Result<TerminalLogDTO>(validationErrs);
    }

    const page = createPageRequest(pageNo, pageSize);
    const pageValidationErrs = Validators.validatePageRequest(page);
    if (pageValidationErrs.length > 0) {
      return new Result<TerminalLogDTO>(pageValidationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.getPageRequest(SEARCH_TERMINAL_LOG.replace('{terminalId}', String(terminalId)), page);
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const terminalLogPageResponse = JSON.parse(responseJson) as TerminalLogPageResponse;
    return new Result<TerminalLogDTO>(terminalLogPageResponse);
  }

  async searchTerminalLogBySn(pageNo: number, pageSize: number, serialNo: string): Promise<Result<TerminalLogDTO>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    if (validationErrs.length > 0) {
      return new Result<TerminalLogDTO>(validationErrs);
    }

    const page = createPageRequest(pageNo, pageSize);
    const pageValidationErrs = Validators.validatePageRequest(page);
    if (pageValidationErrs.length > 0) {
      return new Result<TerminalLogDTO>(pageValidationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.getPageRequest(SEARCH_TERMINAL_LOG_BY_SN, page);
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const terminalLogPageResponse = JSON.parse(responseJson) as TerminalLogPageResponse;
    return new Result<TerminalLogDTO>(terminalLogPageResponse);
  }

  async getTerminalLogDownloadTask(terminalId: number, terminalLogId: number): Promise<Result<DownloadTaskDTO>> {
    const validationErrs = Validators.validateStr(String(terminalId), 'parameter.not.empty', 'terminalId');
    validationErrs.push(...Validators.validateStr(String(terminalLogId), 'parameter.not.empty', 'terminalLogId'));
    if (validationErrs.length > 0) {
      return new Result<DownloadTaskDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GET_TERMINAL_LOG_DOWNLOAD_URL
        .replace('{terminalId}', String(terminalId))
        .replace('{terminalLogId}', String(terminalLogId))
    );
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const downloadTaskResponse = JSON.parse(responseJson) as DownloadTaskResponse;
    return new Result<DownloadTaskDTO>(downloadTaskResponse);
  }

  async getTerminalLogDownloadTaskBySn(serialNo: string, terminalLogId: number): Promise<Result<DownloadTaskDTO>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    validationErrs.push(...Validators.validateStr(String(terminalLogId), 'parameter.not.empty', 'terminalLogId'));
    if (validationErrs.length > 0) {
      return new Result<DownloadTaskDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GET_TERMINAL_LOG_DOWNLOAD_URL_BY_SN.replace('{terminalLogId}', String(terminalLogId))
    );
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());

    const responseJson = await client.execute(request);
    const downloadTaskResponse = JSON.parse(responseJson) as DownloadTaskResponse;
    return new Result<DownloadTaskDTO>(downloadTaskResponse);
  }

  async changeModel(terminalId: number, modelName: string): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(String(terminalId), 'parameter.not.empty', 'terminalId');
    validationErrs.push(...Validators.validateStr(String(modelName), 'parameter.not.empty', 'modelName'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CHANGE_TERMINAL_MODEL_BY_ID.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('modelName', modelName.trim());

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async changeModelBySN(serialNo: string, modelName: string): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    validationErrs.push(...Validators.validateStr(String(modelName), 'parameter.not.empty', 'modelName'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CHANGE_TERMINAL_MODEL_BY_SN);
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());
    request.addRequestParam('modelName', modelName.trim());

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async pushTerminalSetLauncherAction(terminalId: number, packageName: string): Promise<Result<string>> {
    const validationErrs = Validators.validateId(terminalId, 'parameter.id.invalid', 'terminalId');
    validationErrs.push(...Validators.validateStr(String(packageName), 'parameter.not.empty', 'packageName'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(PUSH_TERMINAL_SET_LAUNCHER_ACTION.replace('{terminalId}', String(terminalId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('packageName', packageName.trim());

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async pushTerminalSetLauncherActionBySN(serialNo: string, packageName: string): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.not.empty', 'serialNo');
    validationErrs.push(...Validators.validateStr(String(packageName), 'parameter.not.empty', 'packageName'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(PUSH_TERMINAL_SET_LAUNCHER_ACTION_BY_SN);
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo.trim());
    request.addRequestParam('packageName', packageName.trim());

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
