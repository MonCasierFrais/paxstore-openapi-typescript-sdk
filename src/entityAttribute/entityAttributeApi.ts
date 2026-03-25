import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { Result } from '../base/dto/result';
import { Response } from '../base/dto/response';
import { PageResponse } from '../base/dto/pageResponse';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import * as Validators from '../validate/validators';
import { getMessage } from '../util/messageBundleUtils';
import { EntityAttributeDTO } from './dto/entityAttributeDTO';
import { EntityAttributeCreateRequest } from './dto/entityAttributeCreateRequest';
import { EntityAttributeUpdateRequest } from './dto/entityAttributeUpdateRequest';
import { EntityAttributeLabelUpdateRequest } from './dto/entityAttributeLabelUpdateRequest';

export enum SearchOrderBy {
  EntityType_desc = 'a.entity_type DESC',
  EntityType_asc = 'a.entity_type ASC',
}

export enum EntityAttributeType {
  Merchant = 'Merchant',
  Reseller = 'Reseller',
  App = 'App',
}

export enum EntityInputType {
  Text = 'TEXT',
  Selector = 'SELECTOR',
}

export class EntityAttributeApi extends BaseThirdPartySysApi {
  private static readonly GET_ENTITY_ATTRIBUTES_URL = '/v1/3rdsys/attributes/{attributeId}';
  private static readonly SEARCH_ENTITY_ATTRIBUTES_URL = '/v1/3rdsys/attributes';
  private static readonly CREATE_ENTITY_ATTRIBUTES_URL = '/v1/3rdsys/attributes';
  private static readonly UPDATE_ENTITY_ATTRIBUTES_URL = '/v1/3rdsys/attributes/{attributeId}';
  private static readonly UPDATE_ENTITY_ATTRIBUTES_LABEL_URL = '/v1/3rdsys/attributes/{attributeId}/label';
  private static readonly DELETE_ENTITY_ATTRIBUTES_URL = '/v1/3rdsys/attributes/{attributeId}';

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async getEntityAttribute(attributeId: number): Promise<Result<EntityAttributeDTO>> {
    const validationErrs = Validators.validateId(attributeId, 'parameter.id.invalid', 'attributeId');
    if (validationErrs.length > 0) {
      return new Result<EntityAttributeDTO>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      EntityAttributeApi.GET_ENTITY_ATTRIBUTES_URL.replace('{attributeId}', String(attributeId)),
    );
    request.setRequestMethod(RequestMethod.GET);
    const responseJson = await client.execute(request);
    const entityAttributeResponse = JSON.parse(responseJson) as Response<EntityAttributeDTO>;
    return new Result<EntityAttributeDTO>(entityAttributeResponse);
  }

  async searchEntityAttributes(
    pageNo: number,
    pageSize: number,
    orderBy?: SearchOrderBy,
    key?: string,
    entityType?: EntityAttributeType,
  ): Promise<Result<EntityAttributeDTO>> {
    const page = createPageRequest(pageNo, pageSize, orderBy);
    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<EntityAttributeDTO>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.getPageRequest(EntityAttributeApi.SEARCH_ENTITY_ATTRIBUTES_URL, page);
    if (key != null) {
      request.addRequestParam('key', key);
    }
    if (entityType != null) {
      request.addRequestParam('entityType', entityType);
    }
    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as PageResponse<EntityAttributeDTO>;
    return new Result<EntityAttributeDTO>(resp);
  }

  async createEntityAttribute(createRequest: EntityAttributeCreateRequest): Promise<Result<EntityAttributeDTO>> {
    const validationErrs = Validators.validateObject(createRequest, 'attributeCreateRequest');
    if (validationErrs.length > 0) {
      return new Result<EntityAttributeDTO>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(EntityAttributeApi.CREATE_ENTITY_ATTRIBUTES_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createRequest));
    const responseJson = await client.execute(request);
    const entityAttributeResponse = JSON.parse(responseJson) as Response<EntityAttributeDTO>;
    return new Result<EntityAttributeDTO>(entityAttributeResponse);
  }

  async updateEntityAttribute(
    attributeId: number,
    updateRequest: EntityAttributeUpdateRequest,
  ): Promise<Result<EntityAttributeDTO>> {
    const validationErrs = Validators.validateId(attributeId, 'parameter.id.invalid', 'attributeId');
    validationErrs.push(...Validators.validateObject(updateRequest, 'attributeUpdateRequest'));
    if (validationErrs.length > 0) {
      return new Result<EntityAttributeDTO>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      EntityAttributeApi.UPDATE_ENTITY_ATTRIBUTES_URL.replace('{attributeId}', String(attributeId)),
    );
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(updateRequest));
    const responseJson = await client.execute(request);
    const entityAttributeResponse = JSON.parse(responseJson) as Response<EntityAttributeDTO>;
    return new Result<EntityAttributeDTO>(entityAttributeResponse);
  }

  async updateEntityAttributeLabel(
    attributeId: number,
    updateLabelRequest: EntityAttributeLabelUpdateRequest,
  ): Promise<Result<string>> {
    const validationErr = this.validateAttributeId(attributeId);
    if (updateLabelRequest == null) {
      validationErr.push(getMessage('parameter.not.null', 'updateLabelRequest'));
    }
    if (validationErr.length > 0) {
      return new Result<string>(validationErr);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      EntityAttributeApi.UPDATE_ENTITY_ATTRIBUTES_LABEL_URL.replace('{attributeId}', String(attributeId)),
    );
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(updateLabelRequest));
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async deleteEntityAttribute(attributeId: number): Promise<Result<string>> {
    const validationErrs = this.validateAttributeId(attributeId);
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      EntityAttributeApi.DELETE_ENTITY_ATTRIBUTES_URL.replace('{attributeId}', String(attributeId)),
    );
    request.setRequestMethod(RequestMethod.DELETE);
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  private validateAttributeId(attributeId: number): string[] {
    return Validators.validateId(attributeId, 'parameter.id.invalid', 'attributeId');
  }
}
