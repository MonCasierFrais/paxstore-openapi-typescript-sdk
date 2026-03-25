export const Constants = {
  APP_KEY: 'appKey',
  TIMESTAMP: 'timestamp',
  SIGNATURE: 'signature',

  DATE_TIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  TIMEZONE_DATE_TIME_FORMAT: 'yyyy-MM-dd HH:mm:ss Z',

  CHARSET_UTF8: 'UTF-8',
  CONTENT_ENCODING_GZIP: 'gzip',
  ACCESS_LANGUAGE: 'Accept-Language',

  SIGN_METHOD_HMAC_SHA256: 'HmacSHA256',
  CONTENT_TYPE: 'Content-Type',
  CONTENT_TYPE_JSON: 'application/json;charset=utf-8',

  THIRD_PARTY_API_SDK_LANGUAGE: 'TypeScript',
  THIRD_PARTY_API_SDK_VERSION: '10.1.0',
  REQ_HEADER_SDK_LANG: 'SDK-Language',
  REQ_HEADER_SDK_VERSION: 'SDK-Version',

  DEFAULT_PAGE_SIZE: 10 as number,
  MIN_PAGE_NO: 1 as number,
  MIN_PAGE_SIZE: 1 as number,
  MAX_PAGE_SIZE: 100 as number,
  MAX_16: 16 as number,
  MAX_32: 32 as number,
  MAX_64: 64 as number,
  MAX_128: 128 as number,
  MAX_255: 255 as number,
  MAX_256: 256 as number,
  MAX_500: 500 as number,
  MAX_3000: 3000 as number,
  MIN_0: 0 as number,
  MIN_8: 8 as number,
  HTTP_NO_CONTENT: 204 as number,
} as const;
