import { BaseThirdPartySysApi } from '../../base/baseThirdPartySysApi';
import { EmptyResponse } from '../../base/dto/emptyResponse';
import { Result } from '../../base/dto/result';
import { SdkRequest, RequestMethod } from '../../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../../client/thirdPartySysApiClient';
import { Constants } from '../../constant/constants';
import * as stringUtils from '../../util/stringUtils';
import * as Validators from '../../validate/validators';
import { MerchantCategoryCreateRequest } from './dto/merchantCategoryCreateRequest';
import { MerchantCategoryDTO } from './dto/merchantCategoryDTO';
import { MerchantCategoryListResponseDTO } from './dto/merchantCategoryListResponseDTO';
import { MerchantCategoryResponseDTO } from './dto/merchantCategoryResponseDTO';
import { MerchantCategoryUpdateRequest } from './dto/merchantCategoryUpdateRequest';
import * as MerchantCategoryCreateRequestValidator from './validator/merchantCategoryCreateRequestValidator';
import * as MerchantCategoryUpdateRequestValidator from './validator/merchantCategoryUpdateRequestValidator';
import * as MerchantCategoryBatchCreateRequestValidator from './validator/merchantCategoryBatchCreateRequestValidator';

const GET_CATEGORIES_URL = '/v1/3rdsys/merchantCategories';
const CREATE_CATEGORY_URL = '/v1/3rdsys/merchantCategories';
const UPDATE_CATEGORY_URL = '/v1/3rdsys/merchantCategories/{merchantCategoryId}';
const DELETE_CATEGORY_URL = '/v1/3rdsys/merchantCategories/{merchantCategoryId}';
const BATCH_CREATE_CATEGORY_URL = '/v1/3rdsys/merchantCategories/batch';

export class MerchantCategoryApi extends BaseThirdPartySysApi {

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async getMerchantCategories(name?: string): Promise<Result<MerchantCategoryDTO[]>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_CATEGORIES_URL);
    if (stringUtils.isNotEmpty(name)) {
      request.addRequestParam('name', name!);
    }

    const responseJson = await client.execute(request);
    const categoryList = JSON.parse(responseJson) as MerchantCategoryListResponseDTO;
    const result = new Result<MerchantCategoryDTO[]>(categoryList);
    return result;
  }

  async createMerchantCategory(merchantCategoryCreateRequest: MerchantCategoryCreateRequest): Promise<Result<MerchantCategoryDTO>> {
    const validationErrs = MerchantCategoryCreateRequestValidator.validate(merchantCategoryCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<MerchantCategoryDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_CATEGORY_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(merchantCategoryCreateRequest));

    const responseJson = await client.execute(request);
    const merchantCategoryResponseDTO = JSON.parse(responseJson) as MerchantCategoryResponseDTO;
    const result = new Result<MerchantCategoryDTO>(merchantCategoryResponseDTO);
    return result;
  }

  async updateMerchantCategory(merchantCategoryId: number, merchantCategoryUpdateRequest: MerchantCategoryUpdateRequest): Promise<Result<MerchantCategoryDTO>> {
    const validationErrs = MerchantCategoryUpdateRequestValidator.validate(merchantCategoryId, merchantCategoryUpdateRequest);
    if (validationErrs.length > 0) {
      return new Result<MerchantCategoryDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_CATEGORY_URL.replace('{merchantCategoryId}', String(merchantCategoryId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(merchantCategoryUpdateRequest));

    const responseJson = await client.execute(request);
    const merchantCategoryResponseDTO = JSON.parse(responseJson) as MerchantCategoryResponseDTO;
    const result = new Result<MerchantCategoryDTO>(merchantCategoryResponseDTO);
    return result;
  }

  async deleteMerchantCategory(merchantCategoryId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(merchantCategoryId, 'parameter.id.invalid', 'merchantCategoryId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DELETE_CATEGORY_URL.replace('{merchantCategoryId}', String(merchantCategoryId)));
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async batchCreateMerchantCategory(merchantCategoryBatchCreateRequest: MerchantCategoryCreateRequest[], skipExist: boolean): Promise<Result<MerchantCategoryDTO[]>> {
    const validationErrs = MerchantCategoryBatchCreateRequestValidator.validate(merchantCategoryBatchCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<MerchantCategoryDTO[]>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(BATCH_CREATE_CATEGORY_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addRequestParam('skipExist', String(skipExist));
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(merchantCategoryBatchCreateRequest));

    const responseJson = await client.execute(request);
    const categoryList = JSON.parse(responseJson) as MerchantCategoryListResponseDTO;
    return new Result<MerchantCategoryDTO[]>(categoryList);
  }
}
