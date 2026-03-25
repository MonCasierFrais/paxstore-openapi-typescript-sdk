export interface DownloadTaskDTO {
  fileName?: string;
  downloadUrl?: string;
  signature?: string;
  expireSeconds?: number;
  keyPairId?: string;
}
