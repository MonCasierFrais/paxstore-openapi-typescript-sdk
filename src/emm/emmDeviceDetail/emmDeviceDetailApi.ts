import { BaseThirdPartySysApi } from '../../base/baseThirdPartySysApi';
import { createPageRequest } from '../../base/dto/pageRequestDTO';
import { Result } from '../../base/dto/result';
import { RequestMethod } from '../../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../../client/thirdPartySysApiClient';
import { Constants } from '../../constant/constants';
import * as Validators from '../../validate/validators';
import { EmmDeviceDashboardDetailDTO } from './dto/emmDeviceDashboardDetailDTO';
import { EmmDeviceDashboardDetailPageResponse } from './dto/emmDeviceDashboardDetailPageResponse';
import { EmmDeviceDashboardMonitorDTO } from './dto/emmDeviceDashboardMonitorDTO';
import { EmmDeviceDashboardMonitorResponse } from './dto/emmDeviceDashboardMonitorResponse';
import { EmmDeviceInstalledAppDTO } from './dto/emmDeviceInstalledAppDTO';
import { EmmDeviceInstalledAppPageResponse } from './dto/emmDeviceInstalledAppPageResponse';

const GET_EMM_DEVICE_DASHBOARD_DETAIL_URL = '/v1/3rdsys/emm/device/detail/{deviceId}';
const GET_EMM_DEVICE_DASHBOARD_MONITOR_URL = '/v1/3rdsys/emm/device/detail/{deviceId}/monitor';
const GET_EMM_APP_DETAIL_URL = '/v1/3rdsys/emm/device/detail/{deviceId}/installed-apps';

const INVALID_ID = 'parameter.id.invalid';
const DEVICE_ID = 'deviceId';

export enum EmmDeviceInstalledAppOrderBy {
  AppName_desc = 'a.name DESC',
  AppName_asc = 'a.name ASC',
  AppSize_desc = 'a.size DESC',
  AppSize_asc = 'a.size ASC',
  AppInstallTime_desc = 'a.install_time DESC',
  AppInstallTime_asc = 'a.install_time ASC',
}

export class EmmDeviceDetailApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async getEmmDeviceDashboardDetail(deviceId: number): Promise<Result<EmmDeviceDashboardDetailDTO>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<EmmDeviceDashboardDetailDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_EMM_DEVICE_DASHBOARD_DETAIL_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const response = JSON.parse(responseJson) as EmmDeviceDashboardDetailPageResponse;
    return new Result<EmmDeviceDashboardDetailDTO>(response);
  }

  async getEmmDeviceDashboardMonitor(deviceId: number): Promise<Result<EmmDeviceDashboardMonitorDTO>> {
    const validationErrs = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrs.length > 0) {
      return new Result<EmmDeviceDashboardMonitorDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_EMM_DEVICE_DASHBOARD_MONITOR_URL.replace('{deviceId}', String(deviceId)));
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const responseJson = await client.execute(request);
    const response = JSON.parse(responseJson) as EmmDeviceDashboardMonitorResponse;
    return new Result<EmmDeviceDashboardMonitorDTO>(response);
  }

  async searchDeviceInstalledApp(
    pageNo: number,
    pageSize: number,
    orderBy: EmmDeviceInstalledAppOrderBy | undefined,
    deviceId: number
  ): Promise<Result<EmmDeviceInstalledAppDTO>> {
    const validationErrsI = Validators.validateId(deviceId, INVALID_ID, DEVICE_ID);
    if (validationErrsI.length > 0) {
      return new Result<EmmDeviceInstalledAppDTO>(validationErrsI);
    }

    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<EmmDeviceInstalledAppDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.getPageRequest(GET_EMM_APP_DETAIL_URL.replace('{deviceId}', String(deviceId)), page);

    const responseJson = await client.execute(request);
    const response = JSON.parse(responseJson) as EmmDeviceInstalledAppPageResponse;
    return new Result<EmmDeviceInstalledAppDTO>(response);
  }
}
