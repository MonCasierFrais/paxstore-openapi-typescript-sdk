import { TerminalLocationDTO } from './terminalLocationDTO';
import { TerminalInstalledFirmwareDTO } from './terminalInstalledFirmwareDTO';
import { TerminalInstalledApkDTO } from './terminalInstalledApkDTO';
import { TerminalDetailDTO } from './terminalDetailDTO';
import { TerminalAccessoryDTO } from './terminalAccessoryDTO';

export interface TerminalDTO {
  id?: number;
  name?: string;
  tid?: string;
  serialNo?: string;
  status?: string;
  merchantName?: string;
  modelName?: string;
  resellerName?: string;
  createdDate?: number;
  updatedDate?: number;
  lastActiveTime?: number;
  lastAccessTime?: number;
  location?: string;
  remark?: string;
  geoLocation?: TerminalLocationDTO;
  installedFirmware?: TerminalInstalledFirmwareDTO;
  installedApks?: TerminalInstalledApkDTO[];
  terminalDetail?: TerminalDetailDTO;
  terminalAccessoryList?: TerminalAccessoryDTO[];
  masterTerminalSerialNo?: string;
}
