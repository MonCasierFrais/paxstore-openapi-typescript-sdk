import * as crypto from 'crypto';
import { Constants } from '../constant/constants';

export function signRequest(
  queryOrParams: string | Record<string, string>,
  body: string | null,
  secret: string,
  signMethod: string
): string {
  let query: string;

  if (typeof queryOrParams === 'string') {
    query = queryOrParams ?? '';
    if (body) query += body;
  } else {
    const keys = Object.keys(queryOrParams).sort();
    const sb: string[] = [];
    for (const key of keys) {
      const value = queryOrParams[key];
      if (key && value) {
        sb.push(key + value);
      }
    }
    query = sb.join('');
    if (body) query += body;
  }

  let bytes: Buffer;
  if (signMethod === Constants.SIGN_METHOD_HMAC_SHA256) {
    bytes = encryptHmacSha256(query, secret);
  } else {
    query += secret;
    bytes = encryptMD5(query);
  }

  return byte2hex(bytes);
}

function encryptHmacSha256(data: string, secret: string): Buffer {
  const hmac = crypto.createHmac('sha256', Buffer.from(secret, 'utf-8'));
  hmac.update(Buffer.from(data, 'utf-8'));
  return hmac.digest();
}

export function encryptMD5(data: string): Buffer {
  return crypto.createHash('md5').update(Buffer.from(data, 'utf-8')).digest();
}

export function byte2hex(bytes: Buffer): string {
  return bytes.toString('hex').toUpperCase();
}

export function aesEncrypt(data: Buffer, key: Buffer): Buffer {
  const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(data), cipher.final()]);
}

export function bytesToHexString(bytes: Buffer): string {
  return bytes.toString('hex');
}

export function hexStringToBytes(hex: string): Buffer {
  return Buffer.from(hex, 'hex');
}
