export function isEmpty(value: string | null | undefined): boolean {
  if (value === null || value === undefined || value.length === 0) return true;
  return value.trim().length === 0;
}

export function isNotEmpty(value: string | null | undefined): boolean {
  return !isEmpty(value);
}

export function isBlank(value: string | null | undefined): boolean {
  return isEmpty(value);
}

export function isNotBlank(value: string | null | undefined): boolean {
  return !isEmpty(value);
}

export function areNotEmpty(...values: (string | null | undefined)[]): boolean {
  if (!values || values.length === 0) return false;
  return values.every((v) => !isEmpty(v));
}

export function isNumeric(obj: unknown): boolean {
  if (obj === null || obj === undefined) return false;
  const str = String(obj);
  if (str.length === 0) return false;
  let i = 0;
  if (str.length > 1 && str[0] === '-') i = 1;
  for (; i < str.length; i++) {
    if (str[i] < '0' || str[i] > '9') return false;
  }
  return true;
}

export function containsIgnoreCase(str: string | null | undefined, search: string): boolean {
  if (!str) return false;
  return str.toLowerCase().includes(search.toLowerCase());
}

export function isValidEmailAddress(email: string | null | undefined): boolean {
  if (isEmpty(email)) return false;
  const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email!);
}
