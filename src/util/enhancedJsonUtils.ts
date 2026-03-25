import { SdkObject } from '../base/dto/sdkObject';
import { getMessage } from './messageBundleUtils';

export function toJson(object: unknown): string {
  return JSON.stringify(object);
}

export function fromJson<T>(jsonStr: string): T {
  return JSON.parse(jsonStr) as T;
}

export function getSdkJson(resultCode: number, message?: string): string {
  const msg = message ?? getMessage(String(resultCode));
  const sdkObject: SdkObject = {
    businessCode: resultCode,
    message: msg,
  };
  return toJson(sdkObject);
}
