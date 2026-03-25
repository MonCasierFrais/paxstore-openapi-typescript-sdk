export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export class SdkRequest {
  requestMethod: RequestMethod = RequestMethod.GET;
  requestMappingUrl?: string;
  private headerMap: Record<string, string> = {};
  private requestParams: Record<string, string> = {};
  timestamp?: number;
  requestBody?: string;
  saveFilePath?: string;
  compressData: boolean = false;

  constructor(requestMappingUrl?: string, requestMethod?: RequestMethod) {
    this.requestMappingUrl = requestMappingUrl;
    if (requestMethod) {
      this.requestMethod = requestMethod;
    }
  }

  getHeaderMap(): Record<string, string> {
    return this.headerMap;
  }

  setHeaderMap(headerMap: Record<string, string>): void {
    this.headerMap = headerMap;
  }

  addHeader(key: string, value: string): void {
    this.headerMap[key] = value;
  }

  getRequestParams(): Record<string, string> {
    return this.requestParams;
  }

  setRequestParams(requestParams: Record<string, string>): void {
    this.requestParams = requestParams;
  }

  addRequestParam(key: string, value: string): void {
    this.requestParams[key] = value;
  }

  getRequestMethod(): RequestMethod {
    return this.requestMethod;
  }

  setRequestMethod(method: RequestMethod): void {
    this.requestMethod = method;
  }

  getRequestMappingUrl(): string {
    return this.requestMappingUrl ?? '';
  }

  setRequestMappingUrl(url: string): void {
    this.requestMappingUrl = url;
  }

  getTimestamp(): number | undefined {
    return this.timestamp;
  }

  setTimestamp(timestamp: number): void {
    this.timestamp = timestamp;
  }

  getRequestBody(): string | undefined {
    return this.requestBody;
  }

  setRequestBody(body: string): void {
    this.requestBody = body;
  }

  getSaveFilePath(): string | undefined {
    return this.saveFilePath;
  }

  setSaveFilePath(path: string): void {
    this.saveFilePath = path;
  }

  isCompressData(): boolean {
    return this.compressData;
  }

  setCompressData(compress: boolean): void {
    this.compressData = compress;
  }
}
