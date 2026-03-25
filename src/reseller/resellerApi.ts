import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { PageRequestDTO } from '../base/dto/pageRequestDTO';
import { Result } from '../base/dto/result';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { ResellerCreateRequest } from './dto/resellerCreateRequest';
import { ResellerDTO } from './dto/resellerDTO';
import { ResellerPageDTO } from './dto/resellerPageDTO';
import { ResellerPageResponse } from './dto/resellerPageResponse';
import { ResellerResponseDTO } from './dto/resellerResponse';
import { ResellerRkiKeyPageDTO } from './dto/resellerRkiKeyPageDTO';
import { ResellerRkiKeyPageResponse } from './dto/resellerRkiKeyPageResponse';
import { ResellerUpdateRequest } from './dto/resellerUpdateRequest';
import * as ResellerCreateRequestValidator from './validator/resellerCreateRequestValidator';
import * as ResellerUpdateRequestValidator from './validator/resellerUpdateRequestValidator';
import { getMessage } from '../util/messageBundleUtils';
import * as stringUtils from '../util/stringUtils';
import * as Validators from '../validate/validators';

const SEARCH_RESELLER_URL = '/v1/3rdsys/resellers';
const GET_RESELLER_URL = '/v1/3rdsys/resellers/{resellerId}';
const CREATE_RESELLER_URL = '/v1/3rdsys/resellers';
const UPDATE_RESELLER_URL = '/v1/3rdsys/resellers/{resellerId}';
const ACTIVATE_RESELLER_URL = '/v1/3rdsys/resellers/{resellerId}/active';
const DISABLE_RESELLER_URL = '/v1/3rdsys/resellers/{resellerId}/disable';
const DELETE_RESELLER_URL = '/v1/3rdsys/resellers/{resellerId}';
const REPLACE_RESELLER_EMAIL_URL = '/v1/3rdsys/resellers/{resellerId}/replaceEmail';
const SEARCH_RESELLER_RKI_KET_TEMPLATE_LIST_URL = '/v1/3rdsys/resellers/{resellerId}/rki/template';

export enum ResellerStatus {
  Active = 'A',
  Inactive = 'P',
  Suspend = 'S',
}

export enum ResellerSearchOrderBy {
  Name = 'name',
  Contact = 'contact',
  Phone = 'phone',
}

export class ResellerApi extends BaseThirdPartySysApi {
  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchReseller(
    pageNo: number,
    pageSize: number,
    orderBy?: ResellerSearchOrderBy,
    name?: string,
    status?: ResellerStatus
  ): Promise<Result<ResellerPageDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page: PageRequestDTO = {
      pageNo,
      pageSize,
      orderBy: orderBy ?? undefined,
    };

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<ResellerPageDTO>(validationErrs);
    }

    const request = this.getPageRequest(SEARCH_RESELLER_URL, page);
    if (name) {
      request.addRequestParam('name', name);
    }
    if (status) {
      request.addRequestParam('status', status);
    }

    const responseJson = await client.execute(request);
    const resellerPageResponse = JSON.parse(responseJson) as ResellerPageResponse;
    return new Result<ResellerPageDTO>(resellerPageResponse);
  }

  async getReseller(resellerId: number): Promise<Result<ResellerDTO>> {
    const validationErrs = Validators.validateId(resellerId, 'parameter.id.invalid', 'resellerId');
    if (validationErrs.length > 0) {
      return new Result<ResellerDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(GET_RESELLER_URL.replace('{resellerId}', String(resellerId)));
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const resellerResponse = JSON.parse(responseJson) as ResellerResponseDTO;
    return new Result<ResellerDTO>(resellerResponse);
  }

  async createReseller(resellerCreateRequest: ResellerCreateRequest): Promise<Result<ResellerDTO>> {
    const validationErrs = ResellerCreateRequestValidator.validate(resellerCreateRequest);
    if (validationErrs.length > 0) {
      return new Result<ResellerDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(CREATE_RESELLER_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(resellerCreateRequest));

    const responseJson = await client.execute(request);
    const resellerResponse = JSON.parse(responseJson) as ResellerResponseDTO;
    return new Result<ResellerDTO>(resellerResponse);
  }

  async updateReseller(
    resellerId: number,
    resellerUpdateRequest: ResellerUpdateRequest
  ): Promise<Result<ResellerDTO>> {
    const validationErrs = ResellerUpdateRequestValidator.validate(resellerId, resellerUpdateRequest);
    if (validationErrs.length > 0) {
      return new Result<ResellerDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(UPDATE_RESELLER_URL.replace('{resellerId}', String(resellerId)));
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(resellerUpdateRequest));

    const responseJson = await client.execute(request);
    const resellerResponse = JSON.parse(responseJson) as ResellerResponseDTO;
    return new Result<ResellerDTO>(resellerResponse);
  }

  async activateReseller(resellerId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(resellerId, 'parameter.id.invalid', 'resellerId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(ACTIVATE_RESELLER_URL.replace('{resellerId}', String(resellerId)));
    request.setRequestMethod(RequestMethod.PUT);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async disableReseller(resellerId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(resellerId, 'parameter.id.invalid', 'resellerId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DISABLE_RESELLER_URL.replace('{resellerId}', String(resellerId)));
    request.setRequestMethod(RequestMethod.PUT);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async deleteReseller(resellerId: number): Promise<Result<string>> {
    const validationErrs = Validators.validateId(resellerId, 'parameter.id.invalid', 'resellerId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(DELETE_RESELLER_URL.replace('{resellerId}', String(resellerId)));
    request.setRequestMethod(RequestMethod.DELETE);

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async replaceResellerEmail(resellerId: number, email: string): Promise<Result<string>> {
    const validationErrs = Validators.validateId(resellerId, 'parameter.id.invalid', 'resellerId');

    if (!stringUtils.isValidEmailAddress(email)) {
      validationErrs.push(getMessage('parameter.email.invalid'));
    }
    if (email != null && email.length > Constants.MAX_255) {
      validationErrs.push(getMessage('parameter.too.long', 'email'));
    }
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const requestBodyMap: Record<string, string> = { email };
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(REPLACE_RESELLER_EMAIL_URL.replace('{resellerId}', String(resellerId)));
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(requestBodyMap));

    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async searchResellerRkiKeyList(
    resellerId: number,
    pageNo: number,
    pageSize: number,
    rkiKey?: string
  ): Promise<Result<ResellerRkiKeyPageDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page: PageRequestDTO = { pageNo, pageSize };

    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<ResellerRkiKeyPageDTO>(validationErrs);
    }

    const request = this.getPageRequest(
      SEARCH_RESELLER_RKI_KET_TEMPLATE_LIST_URL.replace('{resellerId}', String(resellerId)),
      page
    );
    if (rkiKey) {
      request.addRequestParam('key', rkiKey);
    }

    const responseJson = await client.execute(request);
    const pageResponse = JSON.parse(responseJson) as ResellerRkiKeyPageResponse;
    return new Result<ResellerRkiKeyPageDTO>(pageResponse);
  }
}
