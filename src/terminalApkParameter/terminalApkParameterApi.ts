import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { PageRequestDTO } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { ApkParameterDTO } from './dto/apkParameterDTO';
import { ApkParameterPageResponse } from './dto/apkParameterPageResponse';
import { ApkParameterResponseDTO } from './dto/apkParameterResponse';
import { CreateApkParameterRequest } from './dto/createApkParameterRequest';
import { UpdateApkParameterRequest } from './dto/updateApkParameterRequest';
import * as CreateApkParameterRequestValidator from './validator/createApkParameterRequestValidator';
import * as UpdateApkParameterRequestValidator from './validator/updateApkParameterRequestValidator';
import * as stringUtils from '../util/stringUtils';
import * as Validators from '../validate/validators';

const GET_TERMINAL_APK_PARAMETER_URL = '/v1/3rdsys/apkParameters/{apkParameterId}';
const SEARCH_TERMINAL_APK_PARAMETER_URL = '/v1/3rdsys/apkParameters';
const CREATE_APK_PARAMETER_URL = '/v1/3rdsys/apkParameters';
const UPDATE_APK_PARAMETER_URL = '/v1/3rdsys/apkParameters/{apkParameterId}';
const DELETE_APK_PARAMETER_URL = '/v1/3rdsys/apkParameters/{apkParameterId}';

export enum SearchOrderBy {
  ApkParameter_desc = 'a.created_date DESC',
  ApkParameter_asc = 'a.created_date ASC',
}

export class TerminalApkParameterApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchTerminalApkParameter(
    pageNo: number,
    pageSize: number,
    orderBy: SearchOrderBy | null,
    templateName: string | null,
    packageName: string | null,
    versionName: string | null
  ): Promise<Result<ApkParameterDTO>> {
    const page: PageRequestDTO = { pageNo, pageSize };
    if (orderBy) {
      page.orderBy = orderBy;
    }

    const validationErrs = Validators.validatePageRequest(page);

    if (stringUtils.isEmpty(packageName)) {
      validationErrs.push(BaseThirdPartySysApi.getMessage('parameter.packageName.mandatory'));
    }
    if (stringUtils.isEmpty(versionName)) {
      validationErrs.push(BaseThirdPartySysApi.getMessage('parameter.versionName.mandatory'));
    }
    if (validationErrs.length > 0) {
      return new Result<ApkParameterDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.getPageRequest(SEARCH_TERMINAL_APK_PARAMETER_URL, page);

    if (templateName) {
      request.addRequestParam('templateName', templateName);
    }
    if (packageName) {
      request.addRequestParam('packageName', packageName);
    }
    if (versionName) {
      request.addRequestParam('versionName', versionName);
    }
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as ApkParameterPageResponse;
    return new Result<ApkParameterDTO>(resp);
  }

  async getTerminalApkParameter(apkParameterId: number): Promise<Result<ApkParameterDTO>>;
  async getTerminalApkParameter(apkParameterId: number, pidList: string[] | null): Promise<Result<ApkParameterDTO>>;
  async getTerminalApkParameter(
    apkParameterId: number,
    pidList?: string[] | null
  ): Promise<Result<ApkParameterDTO>> {
    const validationErrs = Validators.validateId(apkParameterId, 'parameter.id.invalid', 'terminalApkParameterId');
    if (validationErrs.length > 0) {
      return new Result<ApkParameterDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GET_TERMINAL_APK_PARAMETER_URL.replace('{apkParameterId}', String(apkParameterId))
    );
    request.setRequestMethod(RequestMethod.GET);

    if (pidList) {
      request.addRequestParam('pidList', pidList.join(','));
    }

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as ApkParameterResponseDTO;
    return new Result<ApkParameterDTO>(resp);
  }

  async createApkParameter(
    createApkParameterRequest: CreateApkParameterRequest
  ): Promise<Result<string>> {
    const validationErrs = CreateApkParameterRequestValidator.validate(createApkParameterRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_APK_PARAMETER_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createApkParameterRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async updateApkParameter(
    apkParameterId: number,
    updateApkParameterRequest: UpdateApkParameterRequest
  ): Promise<Result<string>> {
    const validationErrs = UpdateApkParameterRequestValidator.validate(apkParameterId, updateApkParameterRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      UPDATE_APK_PARAMETER_URL.replace('{apkParameterId}', String(apkParameterId))
    );
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(updateApkParameterRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async deleteApkParameter(apkParameterId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(apkParameterId, 'parameter.id.invalid', 'terminalApkParameterId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      DELETE_APK_PARAMETER_URL.replace('{apkParameterId}', String(apkParameterId))
    );
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
