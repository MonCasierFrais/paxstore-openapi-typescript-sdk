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
import { ParameterVariableDTO } from '../variable/dto/parameterVariableDTO';
import { TerminalParameterVariableRequest } from './dto/terminalParameterVariableRequest';
import { TerminalParameterVariableDeleteRequest } from './dto/terminalParameterVariableDeleteRequest';
import { TerminalParameterVariablePageResponse } from './dto/terminalParameterVariablePageResponse';
import { EmptyResponse } from '../base/dto/emptyResponse';
import { createPageRequest } from '../base/dto/pageRequestDTO';

export enum SearchOrderBy {
  Variable_desc = 'createdDate DESC',
  Variable_asc = 'createdDate ASC',
}

export enum VariableSource {
  TERMINAL = 'T',
  MARKET = 'M',
  MERCHANT = 'C',
}

export class TerminalVariableApi extends BaseThirdPartySysApi {
  private static readonly GET_TERMINAL_VARIABLE_URL = '/v1/3rdsys/terminalVariables';
  private static readonly CREATE_TERMINAL_VARIABLE_URL = '/v1/3rdsys/terminalVariables';
  private static readonly UPDATE_TERMINAL_VARIABLE_URL = '/v1/3rdsys/terminalVariables/{terminalVariableId}';
  private static readonly DELETE_TERMINAL_VARIABLE_URL = '/v1/3rdsys/terminalVariables/{terminalVariableId}';
  private static readonly BATCH_DELETION_TERMINAL_VARIABLE_URL = '/v1/3rdsys/terminalVariables/batch/deletion';

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async getTerminalVariable(
    pageNo: number,
    pageSize: number,
    orderBy: SearchOrderBy | null,
    tid: string | null,
    serialNo: string | null,
    packageName: string | null,
    key: string | null,
    source: VariableSource | null
  ): Promise<Result<ParameterVariableDTO>> {
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const page = createPageRequest(pageNo, pageSize);
    const validationErrs = Validators.validatePageRequest(page);

    if (stringUtils.isEmpty(tid) && stringUtils.isEmpty(serialNo)) {
      validationErrs.push(getMessage('param.tid.serialNo.empty.atSameTime'));
    }
    if (orderBy != null) {
      page.orderBy = orderBy;
    }
    if (!validationErrs.length === false && validationErrs.length > 0) {
      return new Result<ParameterVariableDTO>(validationErrs);
    }

    const request = this.getPageRequest(TerminalVariableApi.GET_TERMINAL_VARIABLE_URL, page);

    if (tid != null) {
      request.addRequestParam('tid', tid);
    }
    if (serialNo != null) {
      request.addRequestParam('serialNo', serialNo);
    }
    if (packageName != null) {
      request.addRequestParam('packageName', packageName);
    }
    if (key != null) {
      request.addRequestParam('key', key);
    }
    if (source != null) {
      request.addRequestParam('source', source);
    }
    request.setRequestMethod(RequestMethod.GET);

    const responseJson = await client.execute(request);
    const resp = JSON.parse(responseJson) as TerminalParameterVariablePageResponse;
    return new Result<ParameterVariableDTO>(resp);
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

  async createTerminalVariable(createRequest: TerminalParameterVariableRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateObject(createRequest, 'terminalVariableRequest');
    if (stringUtils.isEmpty(createRequest.tid) && stringUtils.isEmpty(createRequest.serialNo)) {
      validationErrs.push(getMessage('parameter.sn.tid.empty'));
    }
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }
    if (createRequest.variableList) {
      for (const parameterVariable of createRequest.variableList) {
        this.encryptPasswordVariable(parameterVariable);
      }
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(TerminalVariableApi.CREATE_TERMINAL_VARIABLE_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(createRequest));
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async updateTerminalVariable(terminalVariableId: number, updateRequest: ParameterVariable): Promise<Result<string>> {
    const idValidation = this.validateTerminalVariableId(terminalVariableId);
    if (idValidation.validationErrors && idValidation.validationErrors.length > 0) {
      return idValidation;
    }
    this.encryptPasswordVariable(updateRequest);

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      TerminalVariableApi.UPDATE_TERMINAL_VARIABLE_URL.replace('{terminalVariableId}', String(terminalVariableId))
    );
    request.setRequestMethod(RequestMethod.PUT);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(updateRequest));
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }

  async deleteTerminalVariable(terminalVariableId: number): Promise<Result<string>> {
    const idValidation = this.validateTerminalVariableId(terminalVariableId);
    if (idValidation.validationErrors && idValidation.validationErrors.length > 0) {
      return idValidation;
    }
    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      TerminalVariableApi.DELETE_TERMINAL_VARIABLE_URL.replace('{terminalVariableId}', String(terminalVariableId))
    );
    request.setRequestMethod(RequestMethod.DELETE);
    return this.emptyResult(client, request);
  }

  async batchDeletionTerminalVariable(batchDeletionRequest: TerminalParameterVariableDeleteRequest): Promise<Result<string>> {
    const validationErrs = Validators.validateObject(batchDeletionRequest, 'batchDeletionRequest');
    if (batchDeletionRequest != null) {
      if (!batchDeletionRequest.variableIds || batchDeletionRequest.variableIds.length === 0) {
        validationErrs.push(getMessage('variableIds.is.empty'));
      }
    }
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(TerminalVariableApi.BATCH_DELETION_TERMINAL_VARIABLE_URL);
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);
    request.setRequestBody(JSON.stringify(batchDeletionRequest));
    return this.emptyResult(client, request);
  }

  private validateTerminalVariableId(terminalVariableId: number): Result<string> {
    const validationErrs = Validators.validateId(terminalVariableId, 'parameter.id.invalid', 'terminalVariableId');
    if (validationErrs.length > 0) {
      return new Result<string>(validationErrs);
    }
    return new Result<string>();
  }

  private async emptyResult(client: ThirdPartySysApiClient, request: SdkRequest): Promise<Result<string>> {
    const responseJson = await client.execute(request);
    const emptyResponse = JSON.parse(responseJson) as EmptyResponse;
    return new Result<string>(emptyResponse);
  }
}
