import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { URL } from 'url';
import { Constants } from '../constant/constants';
import { ResultCode } from '../constant/resultCode';
import { GatewayException } from '../exception/gatewayException';
import { getSdkJson } from './enhancedJsonUtils';
import { deleteFile, generateMixString } from './fileUtils';
import * as stringUtils from './stringUtils';
import { retry } from './retryUtils';
import { bytes2HexString } from './algHelper';

function isRetryableError(e: unknown): boolean {
  if (e instanceof GatewayException && e.responseCode === 502) return true;
  if (e instanceof Error) {
    const msg = e.message.toLowerCase();
    if (msg.includes('econnrefused') || msg.includes('econnreset') || msg.includes('etimedout') || msg.includes('socket hang up')) {
      return true;
    }
  }
  return false;
}

function compressData(data: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zlib.gzip(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export function buildQuery(params: Record<string, string> | null | undefined): string | null {
  if (!params || Object.keys(params).length === 0) return null;
  const parts: string[] = [];
  for (const [name, value] of Object.entries(params)) {
    if (name && value) {
      parts.push(`${name}=${encodeURIComponent(value)}`);
    }
  }
  return parts.length > 0 ? parts.join('&') : null;
}

export function buildRequestUrl(baseUrl: string, ...queries: (string | null | undefined)[]): string {
  if (!queries || queries.length === 0) return baseUrl;
  let newUrl = baseUrl;
  let hasQuery = baseUrl.includes('?');
  let hasPrepend = baseUrl.endsWith('?') || baseUrl.endsWith('&');

  for (const query of queries) {
    if (query) {
      if (!hasPrepend) {
        if (hasQuery) {
          newUrl += '&';
        } else {
          newUrl += '?';
          hasQuery = true;
        }
      }
      newUrl += query;
      hasPrepend = false;
    }
  }
  return newUrl;
}

function makeRequest(
  requestUrl: string,
  method: string,
  connectTimeout: number,
  readTimeout: number,
  body: string | null | undefined,
  compress: boolean,
  headerMap: Record<string, string> | null,
  saveFilePath: string | null | undefined
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedUrl = new URL(requestUrl);
      const isHttps = parsedUrl.protocol === 'https:';
      const transport = isHttps ? https : http;

      const options: http.RequestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        timeout: connectTimeout + readTimeout,
        headers: {},
      };

      if (isHttps) {
        (options as https.RequestOptions).rejectUnauthorized = false;
      }

      if (headerMap) {
        for (const [key, value] of Object.entries(headerMap)) {
          (options.headers as Record<string, string>)[key] = value;
        }
      }

      const req = transport.request(options, (res) => {
        const statusCode = res.statusCode ?? 0;
        const rateLimit = res.headers['x-ratelimit-limit'] as string ?? '';
        const rateLimitRemain = res.headers['x-ratelimit-remaining'] as string ?? '';
        const rateLimitReset = res.headers['x-ratelimit-reset'] as string ?? '';
        const contentType = res.headers['content-type'] ?? '';

        if (statusCode === 502) {
          reject(new GatewayException(502, 'Encounter 502 response code'));
          return;
        }
        if (statusCode === 504) {
          reject(new GatewayException(504, 'Encounter 504 response code'));
          return;
        }

        if (saveFilePath) {
          const filePath = path.join(saveFilePath, generateMixString(16));
          fs.mkdirSync(saveFilePath, { recursive: true });
          const fileStream = fs.createWriteStream(filePath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(getSdkJson(ResultCode.SUCCESS, filePath));
          });
          fileStream.on('error', (err) => reject(err));
          return;
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const responseBody = Buffer.concat(chunks).toString('utf-8');

          if (statusCode === 200 || statusCode === 201 || statusCode === 204) {
            if (!contentType.toLowerCase().includes('json') && statusCode !== Constants.HTTP_NO_CONTENT) {
              console.error(`Response code ${statusCode}, ContentType ${contentType} is not supported`);
              resolve(getSdkJson(ResultCode.SDK_JSON_ERROR));
              return;
            }

            try {
              let json: Record<string, unknown>;
              if (!responseBody && statusCode === Constants.HTTP_NO_CONTENT) {
                json = {};
              } else {
                json = JSON.parse(responseBody);
              }
              json.rateLimit = rateLimit;
              json.rateLimitRemain = rateLimitRemain;
              json.rateLimitReset = rateLimitReset;
              resolve(JSON.stringify(json));
            } catch {
              resolve(getSdkJson(ResultCode.SDK_JSON_ERROR));
            }
          } else {
            try {
              const json = JSON.parse(responseBody);
              json.rateLimit = rateLimit;
              json.rateLimitRemain = rateLimitRemain;
              json.rateLimitReset = rateLimitReset;
              resolve(JSON.stringify(json));
            } catch {
              resolve(getSdkJson(ResultCode.SDK_RQUEST_EXCEPTION));
            }
          }
        });
        res.on('error', (err) => reject(err));
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(getSdkJson(ResultCode.SDK_CONNECT_TIMEOUT));
      });

      req.on('error', (err) => reject(err));

      if (body && method !== 'GET') {
        if (!compress) {
          req.write(body, 'utf-8');
        } else {
          const compressed = await compressData(Buffer.from(body, 'utf-8'));
          const hexString = bytes2HexString(compressed);
          req.write(hexString);
        }
      }

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

export async function request(
  requestUrl: string,
  requestMethod: string,
  connectTimeout: number,
  readTimeout: number,
  userData: string | null | undefined,
  headerMap: Record<string, string> | null,
  saveFilePath: string | null | undefined,
  retryTimes: number
): Promise<string> {
  try {
    return await retry(
      () => makeRequest(requestUrl, requestMethod, connectTimeout, readTimeout, userData, false, headerMap, saveFilePath),
      isRetryableError,
      retryTimes
    );
  } catch (e) {
    if (e instanceof GatewayException) {
      return e.responseCode === 502
        ? getSdkJson(ResultCode.BAD_GATEWAY)
        : getSdkJson(ResultCode.GATEWAY_TIMEOUT);
    }
    console.error('Exception Occurred', e);
    if (e instanceof Error && (e.message.includes('ECONNREFUSED') || e.message.includes('ENOTFOUND'))) {
      return getSdkJson(ResultCode.SDK_UN_CONNECT);
    }
    return getSdkJson(ResultCode.SDK_RQUEST_EXCEPTION);
  } finally {
    if (stringUtils.isNotBlank(saveFilePath)) {
      deleteFile(saveFilePath!);
    }
  }
}

export async function compressRequest(
  requestUrl: string,
  requestMethod: string,
  connectTimeout: number,
  readTimeout: number,
  userData: string | null | undefined,
  headerMap: Record<string, string> | null,
  saveFilePath: string | null | undefined,
  retryTimes: number
): Promise<string> {
  try {
    return await retry(
      () => makeRequest(requestUrl, requestMethod, connectTimeout, readTimeout, userData, true, headerMap, saveFilePath),
      isRetryableError,
      retryTimes
    );
  } catch (e) {
    if (e instanceof GatewayException) {
      return e.responseCode === 502
        ? getSdkJson(ResultCode.BAD_GATEWAY)
        : getSdkJson(ResultCode.GATEWAY_TIMEOUT);
    }
    console.error('Exception Occurred', e);
    return getSdkJson(ResultCode.SDK_UN_CONNECT);
  } finally {
    if (stringUtils.isNotBlank(saveFilePath)) {
      deleteFile(saveFilePath!);
    }
  }
}
