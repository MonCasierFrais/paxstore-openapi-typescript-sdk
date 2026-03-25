import { PageRequestDTO } from '../base/dto/pageRequestDTO';
import { Constants } from '../constant/constants';
import { getMessage } from '../util/messageBundleUtils';
import * as stringUtils from '../util/stringUtils';

export function validateId(id: number | null | undefined, errorMsgKey: string, fieldName?: string): string[] {
  const errors: string[] = [];
  if (id === null || id === undefined || id < 0) {
    errors.push(fieldName ? getMessage(errorMsgKey, fieldName) : getMessage(errorMsgKey));
  }
  return errors;
}

export function validateStr(str: string | null | undefined, errorMsgKey: string, fieldName?: string): string[] {
  const errors: string[] = [];
  if (stringUtils.isBlank(str)) {
    errors.push(fieldName ? getMessage(errorMsgKey, fieldName) : getMessage(errorMsgKey));
  }
  return errors;
}

export function validateCreate<T>(createReq: T | null | undefined, beanEmptyMsgKey: string): string[] {
  const errors: string[] = [];
  if (!createReq) {
    errors.push(getMessage(beanEmptyMsgKey));
  }
  return errors;
}

export function validateUpdate(
  id: number | null | undefined,
  updateReq: unknown,
  idInvalidMsgKey: string,
  beanEmptyMsgKey: string
): string[] {
  const errors: string[] = [];
  if (id === null || id === undefined || id < 0) {
    errors.push(getMessage(idInvalidMsgKey));
  }
  if (!updateReq) {
    errors.push(getMessage(beanEmptyMsgKey));
  }
  return errors;
}

export function validateObject(object: unknown, paramName: string): string[] {
  const errors: string[] = [];
  if (!object) {
    errors.push(getMessage('parameter.not.null', paramName));
  }
  return errors;
}

export function validatePageRequest(page: PageRequestDTO | null | undefined): string[] {
  const errors: string[] = [];
  if (!page) {
    errors.push(getMessage('parameter.not.null', 'page'));
  } else {
    if (page.pageNo < Constants.MIN_PAGE_NO) {
      errors.push(getMessage('parameter.pageNo.length'));
    }
    if (page.pageSize < Constants.MIN_PAGE_SIZE || page.pageSize > Constants.MAX_PAGE_SIZE) {
      errors.push(getMessage('parameter.pageSize.length'));
    }
  }
  return errors;
}

export function validateStrNullAndMax(str: string | null | undefined, paramName: string, max: number): string[] {
  const errors: string[] = [];
  if (stringUtils.isBlank(str)) {
    errors.push(getMessage('parameter.not.null', paramName));
  }
  errors.push(...validateStrMax(str, paramName, max));
  return errors;
}

export function validateStrMax(str: string | null | undefined, paramName: string, max: number): string[] {
  const errors: string[] = [];
  if (stringUtils.isNotBlank(str) && str!.length > max) {
    errors.push(getMessage('parameter.too.long', paramName, max));
  }
  return errors;
}

export function validateStrNullAndMin(str: string | null | undefined, paramName: string, min: number): string[] {
  const errors: string[] = [];
  if (stringUtils.isBlank(str)) {
    errors.push(getMessage('parameter.not.null', paramName));
  }
  errors.push(...validateStrMin(str, paramName, min));
  return errors;
}

export function validateStrMin(str: string | null | undefined, paramName: string, min: number): string[] {
  const errors: string[] = [];
  if (stringUtils.isNotBlank(str) && str!.length < min) {
    errors.push(getMessage('parameter.too.short', paramName, min));
  }
  return errors;
}

export function validateStrNullAndRange(str: string | null | undefined, paramName: string, min: number, max: number): string[] {
  const errors: string[] = [];
  if (stringUtils.isBlank(str)) {
    errors.push(getMessage('parameter.not.null', paramName));
  }
  errors.push(...validateRange(str, paramName, min, max));
  return errors;
}

export function validateRange(str: string | null | undefined, paramName: string, min: number, max: number): string[] {
  const errors: string[] = [];
  if (str !== null && str !== undefined && (str.length < min || str.length > max)) {
    errors.push(getMessage('parameter.range.length', paramName, min, max));
  }
  return errors;
}

export function validateLongNull(val: number | null | undefined, paramName: string): string[] {
  const errors: string[] = [];
  if (val === null || val === undefined || val < 0) {
    errors.push(getMessage('parameter.not.null', paramName));
  }
  return errors;
}
