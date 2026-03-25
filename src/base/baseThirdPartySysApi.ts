import { PageRequestDTO } from './dto/pageRequestDTO';
import { SdkRequest } from './request/sdkRequest';
import { InvalidParamException } from '../exception/invalidParamException';
import { getMessage } from '../util/messageBundleUtils';
import * as stringUtils from '../util/stringUtils';

export enum SearchOrderBy {
  CreatedDate_desc = 'a.created_date DESC',
  CreatedDate_asc = 'a.created_date ASC',
}

export enum PushStatus {
  Active = 'A',
  Suspend = 'S',
  Completed = 'C',
}

export class BaseThirdPartySysApi {
  static connectTimeout: number = 0;
  static readTimeout: number = 0;
  static retryTimes: number = 5;

  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private apiTimeZone: string;

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    }
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.apiTimeZone = timeZone ?? 'UTC';
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  getApiSecret(): string {
    return this.apiSecret;
  }

  setApiSecret(apiSecret: string): void {
    this.apiSecret = apiSecret;
  }

  protected createSdkRequest(requestMappingUrl: string): SdkRequest {
    const request = new SdkRequest(requestMappingUrl);
    request.addHeader('content-language', 'en');
    request.addHeader('Time-Zone', this.apiTimeZone);
    return request;
  }

  protected getPageRequest(requestUrl: string, page: PageRequestDTO): SdkRequest {
    const request = this.createSdkRequest(requestUrl);
    request.addRequestParam('limit', String(page.pageSize));
    request.addRequestParam('pageNo', String(page.pageNo));
    if (stringUtils.isNotEmpty(page.orderBy)) {
      request.addRequestParam('orderBy', page.orderBy!);
    }
    return request;
  }

  protected static getMessage(key: string, ...args: unknown[]): string {
    return getMessage(key, ...args);
  }

  setSDKConnectTimeout(connectTimeout: number): void {
    if (connectTimeout < 0) {
      throw new InvalidParamException('timeout can not be negative');
    }
    BaseThirdPartySysApi.connectTimeout = connectTimeout;
  }

  setSDKReadTimeout(readTimeout: number): void {
    if (readTimeout < 0) {
      throw new InvalidParamException('timeout can not be negative');
    }
    BaseThirdPartySysApi.readTimeout = readTimeout;
  }

  setRetryTimes(retryTimes: number): void {
    if (retryTimes < 1 || retryTimes > 5) {
      throw new InvalidParamException('retryTimes cannot less than 0 and grate than 5');
    }
    BaseThirdPartySysApi.retryTimes = retryTimes;
  }
}
