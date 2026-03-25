import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { getMessage } from '../util/messageBundleUtils';
import * as stringUtils from '../util/stringUtils';
import * as Validators from '../validate/validators';
import { MerchantCreateRequest } from './dto/merchantCreateRequest';
import { MerchantDTO } from './dto/merchantDTO';
import { MerchantPageDTO } from './dto/merchantPageDTO';
import { MerchantPageResponse } from './dto/merchantPageResponse';
import { MerchantResponseDTO } from './dto/merchantResponseDTO';
import { MerchantUpdateRequest } from './dto/merchantUpdateRequest';
import * as MerchantCreateRequestValidator from './validator/merchantCreateRequestValidator';
import * as MerchantUpdateRequestValidator from './validator/merchantUpdateRequestValidator';

export enum MerchantStatus {
  Active = 'A',
  Inactive = 'P',
  Suspend = 'S',
}

export enum MerchantSearchOrderBy {
  Name = 'name',
  Phone = 'phone',
  Contact = 'contact',
}

const SEARCH_MERCHANT_URL = '/v1/3rdsys/merchants';
const GET_MERCHANT_URL = '/v1/3rdsys/merchants/{merchantId}';
const CREATE_MERCHANT_URL = '/v1/3rdsys/merchants';
const UPDATE_MERCHANT_URL = '/v1/3rdsys/merchants/{merchantId}';
const ACTIVATE_MERCHANT_URL = '/v1/3rdsys/merchants/{merchantId}/active';
const DISABLE_MERCHANT_URL = '/v1/3rdsys/merchants/{merchantId}/disable';
const DELETE_MERCHANT_URL = '/v1/3rdsys/merchants/{merchantId}';
const REPLACE_MERCHANT_EMAIL_URL = '/v1/3rdsys/merchants/{merchantId}/replaceEmail';
const INVALID_ID = 'parameter.id.invalid';
const MERCHANT_ID = 'merchantId';

export class MerchantApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchMerchant(
    pageNo: number,
    pageSize: number,
    orderBy?: MerchantSearchOrderBy,
    name?: string,
    status?: MerchantStatus
  ): Promise<Result<MerchantPageDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize, orderBy);

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<MerchantPageDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_MERCHANT_URL, page);
    if (name) {
      request.addRequestParam('name', name);
    }
    if (status) {
      request.addRequestParam('status', status);
    }

    const responseJson = await client.execute(request);
    const merchantPageResponse = JSON.parse(responseJson) as MerchantPageResponse;
    const result = new Result<MerchantPageDTO>(merchantPageResponse);
    return result;
  }

  async getMerchant(merchantId: number): Promise<Result<MerchantDTO>> {
    const validationErrs = Validators.validateId(merchantId, INVALID_ID, MERCHANT_ID);
    if (validationErrs.length > 0) {
      return new Result<MerchantDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_MERCHANT_URL.replace('{merchantId}', String(merchantId)));
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const merchantResponseDTO = JSON.parse(responseJson) as MerchantResponseDTO;
    const result = new Result<MerchantDTO>(merchantResponseDTO);
    return result;
  }

  async createMerchant(merchantCreateRequest: MerchantCreateRequest): Promise<Result<MerchantDTO>> {
    const validationErrs = MerchantCreateRequestValidator.validate(merchantCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<MerchantDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_MERCHANT_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(merchantCreateRequest));

    const responseJson = await client.execute(request);
    const merchantResponseDTO = JSON.parse(responseJson) as MerchantResponseDTO;
    return new Result<MerchantDTO>(merchantResponseDTO);
  }

  async updateMerchant(merchantId: number, merchantUpdateRequest: MerchantUpdateRequest): Promise<Result<MerchantDTO>> {
    const validationErrs = MerchantUpdateRequestValidator.validate(merchantId, merchantUpdateRequest);
    if (validationErrs.length > 0) {
      return new Result<MerchantDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_MERCHANT_URL.replace('{merchantId}', String(merchantId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(merchantUpdateRequest));

    const responseJson = await client.execute(request);
    const merchantResponseDTO = JSON.parse(responseJson) as MerchantResponseDTO;
    return new Result<MerchantDTO>(merchantResponseDTO);
  }

  async activateMerchant(merchantId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(merchantId, INVALID_ID, MERCHANT_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(ACTIVATE_MERCHANT_URL.replace('{merchantId}', String(merchantId)));
    request.setRequestMethod(RequestMethod.PUT);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async disableMerchant(merchantId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(merchantId, INVALID_ID, MERCHANT_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DISABLE_MERCHANT_URL.replace('{merchantId}', String(merchantId)));
    request.setRequestMethod(RequestMethod.PUT);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async deleteMerchant(merchantId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(merchantId, INVALID_ID, MERCHANT_ID);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DELETE_MERCHANT_URL.replace('{merchantId}', String(merchantId)));
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async replaceMerchantEmail(merchantId: number, email: string, createUser: boolean): Promise<Result<string>> {
    const validationErrs = Validators.validateId(merchantId, INVALID_ID, MERCHANT_ID);
    if (stringUtils.isNotBlank(email) && !stringUtils.isValidEmailAddress(email)) {
      validationErrs.push(getMessage('parameter.email.invalid'));
    }
    if (email && email.length > Constants.MAX_255) {
      validationErrs.push(getMessage('parameter.too.long', 'email'));
    }
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(REPLACE_MERCHANT_EMAIL_URL.replace('{merchantId}', String(merchantId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify({ email, createUser }));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
