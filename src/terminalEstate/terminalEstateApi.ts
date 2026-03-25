import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { Result } from '../base/dto/result';
import { RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { EmptyResponse } from '../base/dto/emptyResponse';
import * as Validators from '../validate/validators';

export class TerminalEstateApi extends BaseThirdPartySysApi {
  protected static readonly VERIFY_ESTATE_URL = '/v1/3rdsys/estates/verify/{serialNo}';

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async verifyTerminalEstate(serialNo: string): Promise<Result<string>> {
    const validationErrs = Validators.validateStr(serialNo, 'parameter.serialNo.invalid');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      TerminalEstateApi.VERIFY_ESTATE_URL.replace('{serialNo}', serialNo)
    );
    request.setRequestMethod(RequestMethod.GET);
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
