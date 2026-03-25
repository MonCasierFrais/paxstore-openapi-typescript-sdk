import { Response } from './response';
import { PageResponse } from './pageResponse';
import { PageInfo } from './pageInfo';
import { EmptyResponse } from './emptyResponse';

export class Result<T> {
  businessCode: number = 0;
  message?: string;
  validationErrors?: string[];
  data?: T;
  rateLimit?: string;
  rateLimitRemain?: string;
  rateLimitReset?: string;
  pageInfo?: PageInfo<T>;

  constructor();
  constructor(errors: string[]);
  constructor(response: Response<T>);
  constructor(response: PageResponse<T>);
  constructor(response: EmptyResponse);
  constructor(arg?: string[] | Response<T> | PageResponse<T> | EmptyResponse) {
    if (!arg) return;

    if (Array.isArray(arg)) {
      this.businessCode = -1;
      this.validationErrors = arg;
      return;
    }

    this.businessCode = arg.businessCode;
    this.message = arg.message;
    this.rateLimit = arg.rateLimit;
    this.rateLimitRemain = arg.rateLimitRemain;
    this.rateLimitReset = arg.rateLimitReset;

    if ('data' in arg) {
      this.data = (arg as Response<T>).data;
    }

    if ('dataset' in arg) {
      const pageResp = arg as PageResponse<T>;
      this.pageInfo = {
        dataSet: pageResp.dataset,
        hasNext: pageResp.hasNext,
        limit: pageResp.limit,
        orderBy: pageResp.orderBy,
        pageNo: pageResp.pageNo,
        totalCount: pageResp.totalCount,
      };
    }
  }

  toString(): string {
    return `Result [businessCode=${this.businessCode}, message=${this.message}, validationErrors=${this.validationErrors}, data=${this.data}, rateLimit=${this.rateLimit}, rateLimitRemain=${this.rateLimitRemain}, rateLimitReset=${this.rateLimitReset}, pageInfo=${JSON.stringify(this.pageInfo)}]`;
  }
}
