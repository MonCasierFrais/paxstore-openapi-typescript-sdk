import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export function deleteFile(filePath: string | null | undefined): boolean {
  if (!filePath || filePath.trim() === '') return false;
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export function generateMixString(length: number): string {
  const allChar = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += allChar[bytes[i] % allChar.length];
  }
  return result;
}

export function getBase64FileSize(base64Str: string | null | undefined): number {
  if (!base64Str) return 0;
  let str = base64Str.substring(base64Str.lastIndexOf(',') + 1);
  const equalIndex = str.indexOf('=');
  if (equalIndex > 0) {
    str = str.substring(0, equalIndex);
  }
  const strLength = str.length;
  return strLength - Math.floor(strLength / 8) * 2;
}

export function getBase64FileSizeKB(base64Str: string | null | undefined): number {
  return Math.floor(getBase64FileSize(base64Str) / 1024);
}
