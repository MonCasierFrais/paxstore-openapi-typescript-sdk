import { Constants } from '../../constant/constants';

export interface PageRequestDTO {
  pageNo: number;
  pageSize: number;
  orderBy?: string;
}

export function createPageRequest(
  pageNo = 1,
  pageSize = Constants.DEFAULT_PAGE_SIZE,
  orderBy?: string
): PageRequestDTO {
  return { pageNo, pageSize, orderBy };
}
