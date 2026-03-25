export class GatewayException extends Error {
  readonly responseCode: number;

  constructor(responseCode: number, message: string) {
    super(message);
    this.name = 'GatewayException';
    this.responseCode = responseCode;
  }
}
