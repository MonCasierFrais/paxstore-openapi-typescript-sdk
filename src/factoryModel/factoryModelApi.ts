import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { Result } from '../base/dto/result';
import { PageResponse } from '../base/dto/pageResponse';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { createPageRequest } from '../base/dto/pageRequestDTO';
import * as Validators from '../validate/validators';
import { FactoryDTO } from './dto/factoryDTO';

export enum SearchOrderBy {
  name_desc = 'a.name DESC',
  name_asc = 'a.name ASC',
}

export class FactoryModelApi extends BaseThirdPartySysApi {
  private static readonly SEARCH_FACTORY_MODELS_URL = '/v1/3rdsys/factory/models';

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async searchFactoryModels(
    pageNo: number,
    pageSize: number,
    orderBy?: SearchOrderBy,
    factoryName?: string,
    modelName?: string,
    productType?: string,
  ): Promise<Result<FactoryDTO>> {
    const page = createPageRequest(pageNo, pageSize, orderBy);
    const validationErrs = Validators.validatePageRequest(page);
    if (validationErrs.length > 0) {
      return new Result<FactoryDTO>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.getPageRequest(FactoryModelApi.SEARCH_FACTORY_MODELS_URL, page);
    if (factoryName != null) {
      request.addRequestParam('factoryName', factoryName);
    }
    if (modelName != null) {
      request.addRequestParam('modelName', modelName);
    }
    if (productType != null) {
      request.addRequestParam('productType', productType);
    }
    const responseJson = await client.execute(request);
    const factoryPageResponse = JSON.parse(responseJson) as PageResponse<FactoryDTO>;
    return new Result<FactoryDTO>(factoryPageResponse);
  }
}
