export interface EmmAppAvailableTestVersion {
  trackId?: number;
  trackAlias?: string;
  versionName?: string;
}

export interface EmmAppAvailableTestVersionDTO {
  appAvailableTestVersionList?: EmmAppAvailableTestVersion[];
}
