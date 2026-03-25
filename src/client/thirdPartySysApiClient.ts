import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { SdkRequest } from '../base/request/sdkRequest';
import { Constants } from '../constant/constants';
import { ResultCode } from '../constant/resultCode';
import { signRequest } from '../util/cryptoUtils';
import { getSdkJson } from '../util/enhancedJsonUtils';
import * as httpUtils from '../util/httpUtils';

export class ThirdPartySysApiClient {
  protected baseUrl: string;
  protected apiKey: string;
  protected apiSecret: string;
  protected signMethod: string = Constants.SIGN_METHOD_HMAC_SHA256;
  protected connectTimeout: number = 10000;
  protected readTimeout: number = 10000;
  private isThirdPartySys: boolean = false;
  protected retryTimes: number = 5;

  constructor(baseUrl: string, apiKey: string, apiSecret: string, isThirdPartySys?: boolean);
  constructor(baseUrl: string, apiKey: string, apiSecret: string, connectTimeout: number, readTimeout: number);
  constructor(
    baseUrl: string,
    apiKey: string,
    apiSecret: string,
    connectTimeoutOrIsThirdParty?: number | boolean,
    readTimeout?: number
  ) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl;

    if (typeof connectTimeoutOrIsThirdParty === 'boolean') {
      this.isThirdPartySys = connectTimeoutOrIsThirdParty;
    } else if (typeof connectTimeoutOrIsThirdParty === 'number') {
      this.connectTimeout = connectTimeoutOrIsThirdParty;
      this.readTimeout = readTimeout!;
      this.isThirdPartySys = true;
    } else {
      this.isThirdPartySys = true;
    }

    if (BaseThirdPartySysApi.connectTimeout > 0) {
      this.connectTimeout = BaseThirdPartySysApi.connectTimeout;
    }
    if (BaseThirdPartySysApi.readTimeout > 0) {
      this.readTimeout = BaseThirdPartySysApi.readTimeout;
    }
    this.retryTimes = BaseThirdPartySysApi.retryTimes;
  }

  async execute(request: SdkRequest): Promise<string> {
    request.addHeader(Constants.REQ_HEADER_SDK_LANG, Constants.THIRD_PARTY_API_SDK_LANGUAGE);
    request.addHeader(Constants.REQ_HEADER_SDK_VERSION, Constants.THIRD_PARTY_API_SDK_VERSION);
    try {
      return await this._execute(request);
    } catch (e) {
      console.error('Exception occurred when executing request:', e);
    }
    return getSdkJson(ResultCode.SDK_RQUEST_EXCEPTION);
  }

  protected async _execute(request: SdkRequest): Promise<string> {
    if (this.apiKey) {
      if (this.isThirdPartySys) {
        request.addRequestParam('sysKey', this.apiKey);
      } else {
        request.addRequestParam(Constants.APP_KEY, this.apiKey);
      }
    }

    const timestamp = request.getTimestamp() ?? Date.now();
    request.addRequestParam(Constants.TIMESTAMP, String(timestamp));

    const query = httpUtils.buildQuery(request.getRequestParams());

    if (this.apiSecret) {
      const signature = signRequest(query ?? '', null, this.apiSecret, this.signMethod);
      request.addHeader(Constants.SIGNATURE, signature);
    }

    const requestUrl = httpUtils.buildRequestUrl(
      this.baseUrl + request.getRequestMappingUrl(),
      query
    );

    console.info(` --> ${request.getRequestMethod()} ${requestUrl}`);

    if (!request.isCompressData()) {
      return httpUtils.request(
        requestUrl,
        request.getRequestMethod(),
        this.connectTimeout,
        this.readTimeout,
        request.getRequestBody() ?? null,
        request.getHeaderMap(),
        request.getSaveFilePath() ?? null,
        this.retryTimes
      );
    } else {
      return httpUtils.compressRequest(
        requestUrl,
        request.getRequestMethod(),
        this.connectTimeout,
        this.readTimeout,
        request.getRequestBody() ?? null,
        request.getHeaderMap(),
        request.getSaveFilePath() ?? null,
        this.retryTimes
      );
    }
  }

  setConnectTimeout(connectTimeout: number): void {
    this.connectTimeout = connectTimeout;
  }

  setReadTimeout(readTimeout: number): void {
    this.readTimeout = readTimeout;
  }
}
