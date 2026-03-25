export interface EmmDeviceInstalledAppDTO {
  id?: number;
  terminalId?: number;
  name?: string;
  packageName?: string;
  version?: string;
  type?: string;
  size?: number;
  iconUrl?: string;
  installTime?: number;
  lastTimeUpdate?: number;
  isLauncher?: boolean;
  isDefaultLauncher?: boolean;
}
