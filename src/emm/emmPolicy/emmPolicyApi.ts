import { BaseThirdPartySysApi } from '../../base/baseThirdPartySysApi';
import { EmptyResponse } from '../../base/dto/emptyResponse';
import { Result } from '../../base/dto/result';
import { SdkRequest, RequestMethod } from '../../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../../client/thirdPartySysApiClient';
import { Constants } from '../../constant/constants';
import * as Validators from '../../validate/validators';
import { EmmPolicyDTO } from './dto/emmPolicyDTO';
import { EmmPolicyResponse } from './dto/emmPolicyResponse';
import { ResellerEmmPolicyCreateRequest } from './dto/resellerEmmPolicyCreateRequest';
import { MerchantEmmPolicyCreateRequest } from './dto/merchantEmmPolicyCreateRequest';
import { DeviceEmmPolicyCreateRequest } from './dto/deviceEmmPolicyCreateRequest';
import * as ResellerEmmPolicyCreateRequestValidator from './validator/resellerEmmPolicyCreateRequestValidator';
import * as MerchantEmmPolicyCreateRequestValidator from './validator/merchantEmmPolicyCreateRequestValidator';
import * as DeviceEmmPolicyCreateRequestValidator from './validator/deviceEmmPolicyCreateRequestValidator';

const GET_RESELLER_EMM_POLICY_URL = '/v1/3rdsys/emm/policy/reseller';
const GET_MERCHANT_EMM_POLICY_URL = '/v1/3rdsys/emm/policy/merchant';
const GET_DEVICE_EMM_POLICY_URL = '/v1/3rdsys/emm/policy/device';
const CREATE_RESELLER_EMM_POLICY_URL = '/v1/3rdsys/emm/policy/reseller';
const CREATE_MERCHANT_EMM_POLICY_URL = '/v1/3rdsys/emm/policy/merchant';
const CREATE_DEVICE_EMM_POLICY_URL = '/v1/3rdsys/emm/policy/device';

export class EmmPolicyApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async getResellerEmmPolicy(resellerName: string): Promise<Result<EmmPolicyDTO>> {
    const validationErrs = Validators.validateStrNullAndMax(resellerName, 'resellerName', Constants.MAX_64);
    if (validationErrs.length > 0) {
      return new Result<EmmPolicyDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_RESELLER_EMM_POLICY_URL);
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('resellerName', resellerName);

    const responseJson = await client.execute(request);
    const emmPolicyResponse = JSON.parse(responseJson) as EmmPolicyResponse;
    return new Result<EmmPolicyDTO>(emmPolicyResponse);
  }

  async getMerchantEmmPolicy(resellerName: string, merchantName: string): Promise<Result<EmmPolicyDTO>> {
    const validationErrR = Validators.validateStrNullAndMax(resellerName, 'resellerName', Constants.MAX_64);
    if (validationErrR.length > 0) {
      return new Result<EmmPolicyDTO>(validationErrR);
    }

    const validationErrM = Validators.validateStrNullAndMax(merchantName, 'merchantName', Constants.MAX_64);
    if (validationErrM.length > 0) {
      return new Result<EmmPolicyDTO>(validationErrM);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_MERCHANT_EMM_POLICY_URL);
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('resellerName', resellerName);
    request.addRequestParam('merchantName', merchantName);

    const responseJson = await client.execute(request);
    const emmPolicyResponse = JSON.parse(responseJson) as EmmPolicyResponse;
    return new Result<EmmPolicyDTO>(emmPolicyResponse);
  }

  async getDeviceEmmPolicy(serialNo: string): Promise<Result<EmmPolicyDTO>> {
    const validationErrs = Validators.validateStrNullAndMax(serialNo, 'serialNo', Constants.MAX_16);
    if (validationErrs.length > 0) {
      return new Result<EmmPolicyDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_DEVICE_EMM_POLICY_URL);
    request.setRequestMethod(RequestMethod.GET);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.addRequestParam('serialNo', serialNo);

    const responseJson = await client.execute(request);
    const emmPolicyResponse = JSON.parse(responseJson) as EmmPolicyResponse;
    return new Result<EmmPolicyDTO>(emmPolicyResponse);
  }

  async createResellerEmmPolicy(resellerEmmPolicyCreateRequest: ResellerEmmPolicyCreateRequest): Promise<Result<string>> {
    const validationErrs = ResellerEmmPolicyCreateRequestValidator.validate(resellerEmmPolicyCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_RESELLER_EMM_POLICY_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(resellerEmmPolicyCreateRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async createMerchantEmmPolicy(merchantEmmPolicyCreateRequest: MerchantEmmPolicyCreateRequest): Promise<Result<string>> {
    const validationErrs = MerchantEmmPolicyCreateRequestValidator.validate(merchantEmmPolicyCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_MERCHANT_EMM_POLICY_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(merchantEmmPolicyCreateRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async createDeviceEmmPolicy(deviceEmmPolicyCreateRequest: DeviceEmmPolicyCreateRequest): Promise<Result<string>> {
    const validationErrs = DeviceEmmPolicyCreateRequestValidator.validate(deviceEmmPolicyCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_DEVICE_EMM_POLICY_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(deviceEmmPolicyCreateRequest));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
