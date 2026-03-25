import { BaseThirdPartySysApi } from '../../base/baseThirdPartySysApi';
import { EmptyResponse } from '../../base/dto/emptyResponse';
import { createPageRequest } from '../../base/dto/pageRequestDTO';
import { Result } from '../../base/dto/result';
import { SdkRequest, RequestMethod } from '../../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../../client/thirdPartySysApiClient';
import { Constants } from '../../constant/constants';
import * as Validators from '../../validate/validators';
import { EmmDeviceDTO } from './dto/emmDeviceDTO';
import { EmmDeviceDetailDTO } from './dto/emmDeviceDetailDTO';
import { EmmDevicePageResponse } from './dto/emmDevicePageResponse';
import { EmmDeviceDetailResponse } from './dto/emmDeviceDetailResponse';
import { EmmDeviceRegisterQRCodeCreateDTO } from './dto/emmDeviceRegisterQRCodeCreateDTO';
import { EmmDeviceRegisterQRCodeCreateRequest } from './dto/emmDeviceRegisterQRCodeCreateRequest';
import { EmmDeviceRegisterQRCodeCreateResponse } from './dto/emmDeviceRegisterQRCodeCreateResponse';
import { EmmDeviceUpdateRequest } from './dto/emmDeviceUpdateRequest';
import { EmmDeviceBatchMoveRequest } from './dto/emmDeviceBatchMoveRequest';
import { EmmDeviceBatchDeleteRequest } from './dto/emmDeviceBatchDeleteRequest';
import { EmmDeviceResetPasswordRequest } from './dto/emmDeviceResetPasswordRequest';
import { EmmDeviceLostModeRequest } from './dto/emmDeviceLostModeRequest';
import { EmmZteQuickUploadRecordCreateRequest } from './dto/emmZteQuickUploadRecordCreateRequest';
import * as EmmDeviceRegisterQRCodeCreateRequestValidator from './validator/emmDeviceRegisterQRCodeCreateRequestValidator';
import * as EmmDeviceUpdateRequestValidator from './validator/emmDeviceUpdateRequestValidator';
import * as EmmDeviceBatchMoveRequestValidator from './validator/emmDeviceBatchMoveRequestValidator';
import * as EmmDeviceBatchDeleteRequestValidator from './validator/emmDeviceBatchDeleteRequestValidator';
import * as EmmDeviceResetPasswordRequestValidator from './validator/emmDeviceResetPasswordRequestValidator';
import * as EmmDeviceLostModeRequestValidator from './validator/emmDeviceLostModeRequestValidator';
import * as EmmZteQuickUploadRecordCreateRequestValidator from './validator/emmZteQuickUploadRecordCreateRequestValidator';

export enum EmmDeviceSearchOrderBy {
  EmmDeviceSN_desc = 'a.serial_no DESC',
  EmmDeviceSN_asc = 'a.serial_no ASC',
  EmmDeviceRegisterTime_desc = 'a.register_time DESC',
  EmmDeviceRegisterTime_asc = 'a.register_time ASC',
}

export enum EmmDeviceType {
  COMPANY_OWNER = 'C',
}

export enum EmmDeviceStatus {
  UN_CERTIFICATED = 'U',
  ACTIVE = 'A',
  LOST = 'L',
}

export enum EmmZteIdentifierType {
  IMEI = 'I',
  SERIAL_NUMBER = 'S',
}

const CREATE_REGISTER_QR_CODE_URL = '/v1/3rdsys/emm/devices/register-qrcode';
const SEARCH_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices';
const GET_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices/{deviceId}';
const UPDATE_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices/{deviceId}';
const BATCH_MOVE_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices/batch/move';
const DELETE_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices/{deviceId}';
const BATCH_DELETE_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices/batch/delete';
const REBOOT_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices/{deviceId}/reboot';
const LOCK_EMM_DEVICE_SCREEN_URL = '/v1/3rdsys/emm/devices/{deviceId}/lockscreen';
const RESET_EMM_DEVICE_PASSWORD_URL = '/v1/3rdsys/emm/devices/{deviceId}/resetpw';
const START_EMM_DEVICE_LOST_MODE_URL = '/v1/3rdsys/emm/devices/{deviceId}/startlost';
const RESUME_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices/{deviceId}/resume';
const DISABLE_EMM_DEVICE_URL = '/v1/3rdsys/emm/devices/{deviceId}/disable';
const SYNC_EMM_DEVICE_DETAIL_URL = '/v1/3rdsys/emm/devices/{deviceId}/sync';
const STOP_EMM_DEVICE_LOST_MODE_URL = '/v1/3rdsys/emm/devices/{deviceId}/stoplost';
const SUBMIT_EMM_ZTE_QUICK_UPLOAD_RECORD_URL = '/v1/3rdsys/emm/devices/zte/quick-upload';
const CLEAR_EMM_DEVICE_APP_DATA_URL = '/v1/3rdsys/emm/devices/{deviceId}/app/clear';

const INVALID_ID = 'parameter.id.invalid';
const DEVICE_ID = 'deviceId';

export class EmmDeviceApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async createRegisterQRCode(
    emmDeviceRegisterQRCodeCreateRequest: EmmDeviceRegisterQRCodeCreateRequest
  ): Promise<Result<EmmDeviceRegisterQRCodeCreateDTO>> {
    const validationErrs = EmmDeviceRegisterQRCodeCreateRequestValidator.validate(emmDeviceRegisterQRCodeCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<EmmDeviceRegisterQRCodeCreateDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_REGISTER_QR_CODE_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(emmDeviceRegisterQRCodeCreateRequest));

    const responseJson = await client.execute(request);
    const response = JSON.parse(responseJson) as EmmDeviceRegisterQRCodeCreateResponse;
    return new Result<EmmDeviceRegisterQRCodeCreateDTO>(response);
  }

  async searchEmmDevice(
    pageNo: number,
    pageSize: number,
    orderBy?: EmmDeviceSearchOrderBy,
    name?: string,
    serialNo?: string,
    mfrName?: string,
    modelName?: string,
    resellerName?: string,
    merchantName?: string,
    status?: EmmDeviceStatus,
    iccId?: string,
    imei?: string
  ): Promise<Result<EmmDeviceDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<EmmDeviceDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_EMM_DEVICE_URL, page);

    if (name) {
      request.addRequestParam('name', name);
    }
    if (serialNo) {
      request.addRequestParam('serialNo', serialNo);
    }
    if (mfrName) {
      request.addRequestParam('mfrName', mfrName);
    }
    if (modelName) {
      request.addRequestParam('modelName', modelName);
    }
    if (resellerName) {
      request.addRequestParam('resellerName', resellerName);
    }
    if (merchantName) {
      request.addRequestParam('merchantName', merchantName);
    }
    if (status) {
      request.addRequestParam('status', status);
    }
    if (imei) {
      request.addRequestParam('imei', imei);
    }
    if (iccId) {
      request.addRequestParam('iccId', iccId);
    }

    const responseJson = await client.execute(request);
    const emmDevicePageResponse = JSON.parse(responseJson) as EmmDevicePageResponse;
    return new Result<EmmDeviceDTO>(emmDevicePageResponse);
  }

  async getEmmDevice(deviceId: number): Promise<Result<EmmDeviceDetailDTO>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<EmmDeviceDetailDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_EMM_DEVICE_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const response = JSON.parse(responseJson) as EmmDeviceDetailResponse;
    return new Result<EmmDeviceDetailDTO>(response);
  }

  async updateEmmDevice(
    deviceId: number,
    emmDeviceUpdateRequest: EmmDeviceUpdateRequest
  ): Promise<Result<string>> {
    const validationErrsI = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrsI.length > 0) {
      return new Result<string>(validationErrsI);
    }

    const validationErrs = EmmDeviceUpdateRequestValidator.validate(emmDeviceUpdateRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_EMM_DEVICE_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(emmDeviceUpdateRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async batchMoveEmmDevice(
    emmDeviceBatchMoveRequest: EmmDeviceBatchMoveRequest
  ): Promise<Result<string>> {
    const validationErrs = EmmDeviceBatchMoveRequestValidator.validate(emmDeviceBatchMoveRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(BATCH_MOVE_EMM_DEVICE_URL);
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(emmDeviceBatchMoveRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async deleteEmmDevice(deviceId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DELETE_EMM_DEVICE_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.DELETE);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async batchDeleteEmmDevice(
    emmDeviceBatchDeleteRequest: EmmDeviceBatchDeleteRequest
  ): Promise<Result<string>> {
    const validationErrs = EmmDeviceBatchDeleteRequestValidator.validate(emmDeviceBatchDeleteRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(BATCH_DELETE_EMM_DEVICE_URL);
    request.setRequestMethod(RequestMethod.DELETE);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(emmDeviceBatchDeleteRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async rebootEmmDevice(deviceId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(REBOOT_EMM_DEVICE_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async lockEmmDeviceScreen(deviceId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(LOCK_EMM_DEVICE_SCREEN_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async resetEmmDevicePassword(
    deviceId: number,
    emmDeviceResetPasswordRequest: EmmDeviceResetPasswordRequest
  ): Promise<Result<string>> {
    const validationErrsI = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrsI.length > 0) {
      return new Result<string>(validationErrsI);
    }

    const validationErrs = EmmDeviceResetPasswordRequestValidator.validate(emmDeviceResetPasswordRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(RESET_EMM_DEVICE_PASSWORD_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(emmDeviceResetPasswordRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async startEmmDeviceLostMode(
    deviceId: number,
    emmDeviceLostModeRequest: EmmDeviceLostModeRequest
  ): Promise<Result<string>> {
    const validationErrsI = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrsI.length > 0) {
      return new Result<string>(validationErrsI);
    }

    const validationErrs = EmmDeviceLostModeRequestValidator.validate(emmDeviceLostModeRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(START_EMM_DEVICE_LOST_MODE_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(emmDeviceLostModeRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async resumeEmmDevice(deviceId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(RESUME_EMM_DEVICE_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async disableEmmDevice(deviceId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DISABLE_EMM_DEVICE_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async syncDeviceDetail(deviceId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(SYNC_EMM_DEVICE_DETAIL_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async stopEmmDeviceLostMode(deviceId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(STOP_EMM_DEVICE_LOST_MODE_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async clearEmmAppData(deviceId: number, installedAppIds: string): Promise<Result<string>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const validationErrsStr = Validators.validateStr(installedAppIds, INVALID_ID, 'installedAppIds');
    if (validationErrsStr.length > 0) {
      return new Result<string>(validationErrsStr);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CLEAR_EMM_DEVICE_APP_DATA_URL.replace('{deviceId}', String(deviceId)));
    request.addRequestParam('installedAppIds', installedAppIds);
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async submitEmmZteQuickUploadRecord(
    emmZteQuickUploadRecordCreateRequest: EmmZteQuickUploadRecordCreateRequest
  ): Promise<Result<string>> {
    const validationErrs = EmmZteQuickUploadRecordCreateRequestValidator.validate(emmZteQuickUploadRecordCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(SUBMIT_EMM_ZTE_QUICK_UPLOAD_RECORD_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(emmZteQuickUploadRecordCreateRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
