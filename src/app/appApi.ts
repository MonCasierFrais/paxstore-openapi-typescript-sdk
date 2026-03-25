import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { Result } from '../base/dto/result';
import { RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import * as Validators from '../validate/validators';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { AppPageDTO } from './dto/appPageDTO';
import { AppPageResponse } from './dto/appPageResponse';
import { AppCostDTO } from './dto/appCostDTO';
import { AppCostResponse } from './dto/appCostResponse';
import { ApkParamPidDTO } from './dto/apkParamPidDTO';
import { ApkParamPidResponse } from './dto/apkParamPidResponse';

export enum ApkStatus {
  Pending = 'P',
  Online = 'O',
  Rejected = 'R',
  Offline = 'U',
}

export enum AppStatus {
  Active = 'A',
  Suspend = 'S',
}

export enum AppBaseType {
  Normal = 'N',
  Parameter = 'P',
}

export enum AppChargeType {
  Free = 0,
  Charging = 1,
}

export enum AppOsType {
  Android = 'A',
  Traditional = 'T',
}

export enum AppSearchOrderBy {
  AppName_desc = 'app.name DESC',
  AppName_asc = 'app.name ASC',
  UpdatedDate_desc = 'app.updated_date DESC',
  UpdatedDate_asc = 'app.updated_date ASC',
}

export class AppApi extends BaseThirdPartySysApi {
  private static readonly SEARCH_APP_URL = '/v1/3rdsys/apps';
  private static readonly GET_APP_COST_URL = '/v1/3rdsys/apps/app-cost';
  private static readonly SEARCH_APK_PARAM_PID_LIST_URL = '/v1/3rdsys/apps/param/pid/list';

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchApp(
    pageNo: number,
    pageSize: number,
    orderBy: AppSearchOrderBy | null,
    name: string | null,
    osType: AppOsType | null,
    chargeType: AppChargeType | null,
    baseType: AppBaseType | null,
    appStatus: AppStatus | null,
    apkStatus: ApkStatus | null,
    specificReseller: boolean | null,
    specificMerchantCategory: boolean | null,
    includeSubscribedApp?: boolean | null,
    resellerName?: string | null,
    modelName?: string | null
  ): Promise<Result<AppPageDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize);
    if (orderBy != null) {
      page.orderBy = orderBy;
    }

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<AppPageDTO>(validationErrs);
    }
    const request = this.getPageRequest(AppApi.SEARCH_APP_URL, page);
    if (name != null) {
      request.addRequestParam('name', name);
    }
    if (apkStatus != null) {
      request.addRequestParam('apkStatus', apkStatus);
    }
    if (appStatus != null) {
      request.addRequestParam('appStatus', appStatus);
    }
    if (baseType != null) {
      request.addRequestParam('baseType', baseType);
    }
    if (chargeType != null) {
      request.addRequestParam('chargeType', String(chargeType));
    }
    if (osType != null) {
      request.addRequestParam('osType', osType);
    }
    if (specificReseller != null) {
      request.addRequestParam('specificReseller', String(specificReseller));
    }
    if (specificMerchantCategory != null) {
      request.addRequestParam('specificMerchantCategory', String(specificMerchantCategory));
    }
    if (includeSubscribedApp != null) {
      request.addRequestParam('includeSubscribedApp', String(includeSubscribedApp));
    }
    if (resellerName != null) {
      request.addRequestParam('resellerName', resellerName);
    }
    if (modelName != null) {
      request.addRequestParam('modelName', modelName);
    }

    request.setRequestMethod(RequestMethod.GET);
    const responseJson = await client.execute(request);
    const appPageResponse = JSON.parse(responseJson) as AppPageResponse;
    return new Result<AppPageDTO>(appPageResponse);
  }

  async getAppCost(resellerId: number, appId: number): Promise<Result<AppCostDTO>> {
    const validationErrs = Validators.validateId(resellerId, 'parameter.not.empty', 'resellerId');
    validationErrs.push(...Validators.validateId(appId, 'parameter.not.empty', 'appId'));
    if (validationErrs.length > 0) {
      return new Result<AppCostDTO>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(AppApi.GET_APP_COST_URL);
    request.setRequestMethod(RequestMethod.GET);
    request.addRequestParam('resellerId', String(resellerId));
    request.addRequestParam('appId', String(appId));
    const responseJson = await client.execute(request);
    const appCostResponse = JSON.parse(responseJson) as AppCostResponse;
    return new Result<AppCostDTO>(appCostResponse);
  }

  async searchApkParamPidList(
    paramTemplateName: string,
    packageName: string,
    versionName: string
  ): Promise<Result<ApkParamPidDTO>> {
    const validationErrs: string[] = [];
    validationErrs.push(...Validators.validateStr(paramTemplateName, 'parameter.not.null', 'paramTemplateName'));
    validationErrs.push(...Validators.validateStr(packageName, 'parameter.not.null', 'packageName'));
    validationErrs.push(...Validators.validateStr(versionName, 'parameter.not.null', 'versionName'));
    if (validationErrs.length > 0) {
      return new Result<ApkParamPidDTO>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(AppApi.SEARCH_APK_PARAM_PID_LIST_URL);
    request.setRequestMethod(RequestMethod.GET);
    request.addRequestParam('paramTemplateName', paramTemplateName);
    request.addRequestParam('packageName', packageName);
    request.addRequestParam('versionName', versionName);
    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as ApkParamPidResponse;
    return new Result<ApkParamPidDTO>(resp);
  }
}
