import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { getMessage } from '../util/messageBundleUtils';
import * as stringUtils from '../util/stringUtils';
import * as Validators from '../validate/validators';
import { aesEncrypt, byte2hex, encryptMD5 } from '../util/cryptoUtils';
import { ParameterVariable } from '../variable/dto/parameterVariable';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import { MerchantVariableDTO } from './dto/merchantVariableDTO';
import { MerchantVariableCreateRequest } from './dto/merchantVariableCreateRequest';
import { MerchantVariableUpdateRequest } from './dto/merchantVariableUpdateRequest';
import { MerchantVariableDeleteRequest } from './dto/merchantVariableDeleteRequest';
import { MerchantVariablePageResponse } from './dto/merchantVariablePageResponse';

export enum SearchOrderBy {
  Variable_desc = 'createdDate DESC',
  Variable_asc = 'createdDate ASC',
}

export enum VariableSource {
  MARKET = 'M',
  MERCHANT = 'C',
}

export class MerchantVariableApi extends BaseThirdPartySysApi {
  private static readonly SEARCH_MERCHANT_VARIABLE_URL = '/v1/3rdsys/merchant/variables';
  private static readonly CREATE_MERCHANT_VARIABLE_URL = '/v1/3rdsys/merchant/variables';
  private static readonly UPDATE_MERCHANT_VARIABLE_URL = '/v1/3rdsys/merchant/variables/{merchantVariableId}';
  private static readonly DELETE_MERCHANT_VARIABLE_URL = '/v1/3rdsys/merchant/variables/{merchantVariableId}';
  private static readonly BATCH_DELETE_MERCHANT_VARIABLE_URL = '/v1/3rdsys/merchant/variables/batch/deletion';

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchMerchantVariable(
    pageNo: number,
    pageSize: number,
    orderBy: SearchOrderBy | null,
    merchantId: number,
    packageName: string | null,
    key: string | null,
    source: VariableSource | null
  ): Promise<Result<MerchantVariableDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize);
    const validationErrs = Validators.validatePageRequest(page);
    validationErrs.push(...Validators.validateId(merchantId, 'parameter.id.invalid', 'merchantId'));
    if (validationErrs.length > 0) {
      return new Result<MerchantVariableDTO>(validationErrs);
    }
    if (orderBy != null) {
      page.orderBy = orderBy;
    }
    const request = this.getPageRequest(MerchantVariableApi.SEARCH_MERCHANT_VARIABLE_URL, page);

    request.addRequestParam('merchantId', String(merchantId));

    if (key != null) {
      request.addRequestParam('key', key);
    }
    if (packageName != null) {
      request.addRequestParam('packageName', packageName);
    }
    if (source != null) {
      request.addRequestParam('source', source);
    }
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as MerchantVariablePageResponse;
    return new Result<MerchantVariableDTO>(resp);
  }

  private encryptPasswordVariable(parameterVariable: ParameterVariable): void {
    if (parameterVariable.type === 'P' && stringUtils.isNotEmpty(parameterVariable.value)) {
      try {
        const encrypted = aesEncrypt(
          Buffer.from(parameterVariable.value!, 'utf-8'),
          encryptMD5(this.getApiSecret())
        );
        parameterVariable.value = byte2hex(encrypted);
      } catch {
        // ignore
      }
    }
  }

  async createMerchantVariable(createRequest: MerchantVariableCreateRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateObject(createRequest, 'merchantVariableCreateRequest');
    validationErrs.push(...Validators.validateId(createRequest.merchantId, 'parameter.id.invalid', 'merchantId'));
    if (!createRequest.variableList || createRequest.variableList.length === 0) {
      validationErrs.push(getMessage('parameter.not.null', 'merchantVariable list'));
    }
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    for (const parameterVariable of createRequest.variableList!) {
      this.encryptPasswordVariable(parameterVariable);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(MerchantVariableApi.CREATE_MERCHANT_VARIABLE_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createRequest));
    return this.emptyResult(client, request);
  }

  async updateMerchantVariable(
    merchantVariableId: number,
    updateRequest: MerchantVariableUpdateRequest
  ): Promise<Result<string>> {
    const validationErrs = Validators.validateId(merchantVariableId, 'parameter.id.invalid', 'merchantVariableId');
    validationErrs.push(...Validators.validateObject(updateRequest, 'merchantVariableUpdateRequest'));
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }
    this.encryptPasswordVariable(updateRequest);
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      MerchantVariableApi.UPDATE_MERCHANT_VARIABLE_URL.replace('{merchantVariableId}', String(merchantVariableId))
    );
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(updateRequest));
    return this.emptyResult(client, request);
  }

  async deleteMerchantVariable(merchantVariableId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(merchantVariableId, 'parameter.id.invalid', 'merchantVariableId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      MerchantVariableApi.DELETE_MERCHANT_VARIABLE_URL.replace('{merchantVariableId}', String(merchantVariableId))
    );
    request.setRequestMethod(RequestMethod.DELETE);
    return this.emptyResult(client, request);
  }

  async batchDeletionMerchantVariable(batchDeleteRequest: MerchantVariableDeleteRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateObject(batchDeleteRequest, 'merchantVariableDeleteRequest');
    if (batchDeleteRequest != null) {
      if (!batchDeleteRequest.variableIds || batchDeleteRequest.variableIds.length === 0) {
        validationErrs.push(getMessage('variableIds.is.empty'));
      }
    }
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(MerchantVariableApi.BATCH_DELETE_MERCHANT_VARIABLE_URL);
    request.setRequestMethod(RequestMethod.DELETE);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(batchDeleteRequest));
    return this.emptyResult(client, request);
  }

  private async emptyResult(client: ThirdPartySysApiClient, request: SdkRequest): Promise<Result<string>> {
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
