export function hexStringToBytes(hex: string | null): Buffer | null {
  if (!hex || hex.length % 2 !== 0) return null;
  return Buffer.from(hex, 'hex');
}

export function bytes2HexString(bytes: Buffer): string {
  return bytes.toString('hex').toUpperCase();
}

export function bytesToHexs(bytes: Buffer | null): string {
  if (!bytes) return '';
  return bytes.toString('hex').toUpperCase();
}

export function byteToHex(byte: number): string {
  return byte.toString(16).padStart(2, '0').toUpperCase();
}
