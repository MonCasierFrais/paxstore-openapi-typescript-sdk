import { TerminalDeviceSimpleDTO } from './terminalDeviceSimpleDTO';
import { TerminalDeviceHistoryDTO } from './terminalDeviceHistoryDTO';

export interface TerminalAccessoryDTO {
  relatedTerminalName?: string;
  basic?: TerminalDeviceSimpleDTO[];
  hardware?: TerminalDeviceSimpleDTO[];
  installApps?: TerminalDeviceSimpleDTO[];
  history?: TerminalDeviceHistoryDTO[];
}
