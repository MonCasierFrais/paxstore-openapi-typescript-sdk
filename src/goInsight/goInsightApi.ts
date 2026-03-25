import { BaseThirdPartySysApi } from '../base/baseThirdPartySysApi';
import { Result } from '../base/dto/result';
import { Response } from '../base/dto/response';
import { SdkRequest, RequestMethod } from '../base/request/sdkRequest';
import { ThirdPartySysApiClient } from '../client/thirdPartySysApiClient';
import { Constants } from '../constant/constants';
import * as Validators from '../validate/validators';
import { getMessage } from '../util/messageBundleUtils';
import { DataQueryResultDTO } from './dto/dataQueryResultDTO';
import { DataQueryRequest } from './dto/dataQueryRequest';
import { GoInsightCustomFilter } from './dto/goInsightCustomFilter';

export enum TimestampRangeType {
  LAST_HOUR = 'p1h',
  YESTERDAY = 'p1d',
  LAST_WEEK = 'p1w',
  LAST_MONTH = 'p1m',
  LAST_QUARTER = 'p1q',
  LAST_YEAR = 'p1y',

  RECENT_5_MIN = 'r5min',
  RECENT_30_MIN = 'r30min',
  RECENT_HOUR = 'r1h',
  RECENT_3_HOUR = 'r3h',
  RECENT_DAY = 'r1d',
  RECENT_2_DAY = 'r2d',
  RECENT_5_DAY = 'r5d',
  RECENT_WEEK = 'r1w',
  RECENT_MONTH = 'r1m',
  RECENT_3_MONTH = 'r3m',
  RECENT_3_MONTH_BY_WEEK = 'r3mbw',
  RECENT_6_MONTH = 'r6m',
  RECENT_YEAR = 'r1y',

  THIS_HOUR = 't1h',
  TODAY = 't1d',
  THIS_WEEK = 't1w',
  THIS_MONTH = 't1m',
  THIS_QUARTER = 't1q',
  THIS_YEAR = 't1y',
}

export class GoInsightApi extends BaseThirdPartySysApi {
  private static readonly SEARCH_GO_INSIGHT_DATA_URL = '/v1/3rdsys/goInsight/data/app-biz/{queryCode}';
  private static readonly QUERY_CODE_LENGTH = 8;
  private static readonly MAX_LENGTH = 1000;
  private static readonly MAX_CUSTOM_FILTER_LENGTH = 100;

  constructor(baseUrl: string, apiKey: string, apiSecret: string, timeZone?: string) {
    super(baseUrl, apiKey, apiSecret, timeZone);
  }

  async findDataFromInsight(queryCode: string): Promise<Result<DataQueryResultDTO>>;
  async findDataFromInsight(queryCode: string, rangeType: TimestampRangeType): Promise<Result<DataQueryResultDTO>>;
  async findDataFromInsight(
    queryCode: string,
    rangeType: TimestampRangeType,
    pageNo: number,
    pageSize: number,
  ): Promise<Result<DataQueryResultDTO>>;
  async findDataFromInsight(
    queryCode: string,
    rangeType: TimestampRangeType,
    customFilterList: GoInsightCustomFilter[],
    pageNo: number,
    pageSize: number,
  ): Promise<Result<DataQueryResultDTO>>;
  async findDataFromInsight(
    queryCode: string,
    rangeType?: TimestampRangeType,
    customFilterListOrPageNo?: GoInsightCustomFilter[] | number,
    pageNoOrPageSize?: number,
    pageSize?: number,
  ): Promise<Result<DataQueryResultDTO>> {
    let customFilterList: GoInsightCustomFilter[] | undefined;
    let resolvedPageNo: number | undefined;
    let resolvedPageSize: number | undefined;

    if (Array.isArray(customFilterListOrPageNo)) {
      customFilterList = customFilterListOrPageNo;
      resolvedPageNo = pageNoOrPageSize;
      resolvedPageSize = pageSize;
    } else if (typeof customFilterListOrPageNo === 'number') {
      resolvedPageNo = customFilterListOrPageNo;
      resolvedPageSize = pageNoOrPageSize;
    }

    const validationErrs = Validators.validateStr(queryCode, 'parameter.queryCode.invalid');
    if (queryCode != null && queryCode.length !== GoInsightApi.QUERY_CODE_LENGTH) {
      validationErrs.push(getMessage('parameter.queryCode.length.invalid'));
    }
    if (resolvedPageSize != null && (resolvedPageSize <= 0 || resolvedPageSize > GoInsightApi.MAX_LENGTH)) {
      validationErrs.push(getMessage('insight.pageSize.length.invalid'));
    }
    if (customFilterList != null) {
      for (const filter of customFilterList) {
        const filterErr = this.validateCustomFilter(filter.cloName, filter.filterValue);
        if (filterErr != null) {
          validationErrs.push(filterErr);
        }
      }
    }
    if (validationErrs.length > 0) {
      return new Result<DataQueryResultDTO>(validationErrs);
    }

    const client = new ThirdPartySysApiClient(this.getBaseUrl(), this.getApiKey(), this.getApiSecret());
    const request = this.createSdkRequest(
      GoInsightApi.SEARCH_GO_INSIGHT_DATA_URL.replace('{queryCode}', queryCode),
    );
    request.setRequestMethod(RequestMethod.POST);
    request.addHeader(Constants.CONTENT_TYPE, Constants.CONTENT_TYPE_JSON);

    const queryRequest: DataQueryRequest = {};
    if (rangeType != null) {
      queryRequest.timeRangeType = rangeType;
    }
    if (customFilterList != null) {
      queryRequest.customFilterList = customFilterList;
    }
    if (resolvedPageNo != null && resolvedPageNo > 0 && resolvedPageSize != null) {
      queryRequest.pageNo = resolvedPageNo;
      queryRequest.pageSize = resolvedPageSize;
    }
    request.setRequestBody(JSON.stringify(queryRequest));

    const responseJson = await client.execute(request);
    const dataQueryResponse = JSON.parse(responseJson) as Response<DataQueryResultDTO>;
    return new Result<DataQueryResultDTO>(dataQueryResponse);
  }

  private validateCustomFilter(colName: string | undefined, filterValue: string | undefined): string | null {
    if (filterValue != null) {
      const filters = filterValue.split(',');
      if (filters.length > GoInsightApi.MAX_CUSTOM_FILTER_LENGTH) {
        return `The ${colName} filter value size can not over ${GoInsightApi.MAX_CUSTOM_FILTER_LENGTH}`;
      }
    }
    return null;
  }
}
