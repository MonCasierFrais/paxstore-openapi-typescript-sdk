export interface EmmAppDetailDTO {
  id?: number;
  name?: string;
  packageName?: string;
  iconUrl?: string;
  type?: string;
  developerName?: string;
  supportManagedConfig?: boolean;
  minAndroidSdkVersion?: number;
  screenshotUrls?: string[];
  updateTime?: number;
  appPricing?: string;
  fullDescription?: string;
  appVersions?: string[];
}
