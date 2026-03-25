import { ApkFileDTO } from './apkFileDTO';

export interface ApkDTO {
  name?: string;
  status?: string;
  versionCode?: number;
  fileSize?: number;
  versionName?: string;
  apkType?: string;
  apkFileType?: string;
  apkFile?: ApkFileDTO;
  osType?: string;
}
