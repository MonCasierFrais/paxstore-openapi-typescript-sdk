import { PushRkiBasicRequest } from './pushRkiBasicRequest';

export interface PushRki2TerminalRequest extends PushRkiBasicRequest {
  effectiveTime?: string;
  expiredTime?: string;
}
