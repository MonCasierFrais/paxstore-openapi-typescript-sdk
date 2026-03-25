import { ApkDTO } from '../../app/dto/apkDTO';

export interface ApkParameterDTO {
  id?: number;
  apk?: ApkDTO;
  name?: string;
  paramTemplateName?: string;
  createdDate?: number;
  updatedDate?: number;
  apkAvailable?: boolean;
}
