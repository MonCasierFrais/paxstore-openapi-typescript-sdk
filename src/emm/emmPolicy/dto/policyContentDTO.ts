export interface NetworkConfiguration {
  ssid?: string;
  cipherType?: string;
  password?: string;
  proxyType?: string;
  hostName?: string;
  port?: number;
  pacUrl?: string;
}

export interface AdvancedSecurityOverrides {
  developerSettings?: string;
  googlePlayProtectVerifyApps?: string;
  untrustedAppsPolicy?: string;
}

export interface AlwaysOnVpnPackage {
  lockdownEnabled?: boolean;
  packageName?: string;
}

export interface PermissionGrant {
  permission?: string;
  policy?: string;
}

export interface AppPermissionGrant {
  permission?: string;
  policy?: string;
}

export interface DeviceRadioState {
  airplaneModeState?: string;
  minimumWifiSecurityLevel?: string;
}

export interface KioskCustomization {
  deviceSettings?: string;
  powerButtonActions?: string;
  statusBar?: string;
  systemErrorWarnings?: string;
  systemNavigation?: string;
}

export interface PasswordRequirements {
  maximumFailedPasswordsForWipe?: number;
  passwordExpirationTimeout?: string;
  passwordHistoryLength?: number;
  passwordMinimumLength?: number;
  passwordMinimumLetters?: number;
  passwordMinimumLowerCase?: number;
  passwordMinimumNumeric?: number;
  passwordMinimumSymbols?: number;
  passwordMinimumUpperCase?: number;
  passwordQuality?: string;
  requirePasswordUnlock?: string;
}

export interface CustomDate {
  month?: number;
  day?: number;
}

export interface FreezePeriod {
  startDate?: CustomDate;
  endDate?: CustomDate;
}

export interface SystemUpdate {
  startToEndMinutes?: string;
  freezePeriods?: FreezePeriod[];
  type?: string;
}

export interface ApnSetting {
  alwaysOnSetting?: string;
  apn?: string;
  apnTypes?: string[];
  authType?: string;
  carrierId?: number;
  displayName?: string;
  mmsProxyAddress?: string;
  mmsProxyPort?: number;
  mmsc?: string;
  mtuV4?: number;
  mtuV6?: number;
  mvnoType?: string;
  networkTypes?: string[];
  numericOperatorId?: string;
  password?: string;
  protocol?: string;
  proxyAddress?: string;
  proxyPort?: number;
  roamingProtocol?: string;
  username?: string;
}

export interface ApnPolicy {
  overrideApns?: boolean;
  apnSettings?: ApnSetting[];
}

export interface DeviceConnectivityManagement {
  tetheringSettings?: string;
  usbDataAccess?: string;
  apnPolicy?: ApnPolicy;
}

export interface BlockAction {
  blockAfterDays?: number;
}

export interface WipeAction {
  preserveFrp?: boolean;
  wipeAfterDays?: number;
}

export interface PolicyEnforcementRule {
  blockAction?: BlockAction;
  settingName?: string;
  wipeAction?: WipeAction;
}

export interface ApplicationPolicy {
  appId?: number;
  packageName?: string;
  autoUpdateMode?: string;
  defaultPermissionPolicy?: string;
  installPriority?: string;
  accessibleTrackId?: number;
  installType?: string;
  permissionGrants?: AppPermissionGrant[];
}

export interface PolicyContentDTO {
  adjustVolumeDisabled?: boolean;
  advancedSecurityOverrides?: AdvancedSecurityOverrides;
  alwaysOnVpnPackage?: AlwaysOnVpnPackage;
  appAutoUpdatePolicy?: string;
  autoDateAndTimeZone?: string;
  bluetoothDisabled?: boolean;
  cameraAccess?: string;
  cellBroadcastsConfigDisabled?: boolean;
  dataRoamingDisabled?: boolean;
  deviceRadioState?: DeviceRadioState;
  encryptionPolicy?: string;
  factoryResetDisabled?: boolean;
  funDisabled?: boolean;
  installAppsDisabled?: boolean;
  disableNotificationsOnLockScreens?: boolean;
  disableUnredactedNotificationsOnLockScreens?: boolean;
  ignoreTrustAgentStateOnLockScreens?: boolean;
  disableFingerprintSensorOnLockScreens?: boolean;
  disableFaceAuthentication?: boolean;
  disableAllBiometricAuthentication?: boolean;
  disableAllShortcutsOnLockScreen?: boolean;
  disableAllKeyguardFeatures?: boolean;
  kioskCustomLauncherEnabled?: boolean;
  kioskCustomization?: KioskCustomization;
  enableRemoteControl?: boolean;
  locationMode?: string;
  maximumTimeToLock?: number;
  microphoneAccess?: string;
  minimumApiLevel?: number;
  mobileNetworksConfigDisabled?: boolean;
  mountPhysicalMediaDisabled?: boolean;
  networkEscapeHatchEnabled?: boolean;
  networkResetDisabled?: boolean;
  networkConfigurations?: NetworkConfiguration[];
  outgoingCallsDisabled?: boolean;
  passwordPolicies?: PasswordRequirements;
  permissionGrants?: PermissionGrant[];
  permittedAccessibilityServices?: string[];
  permittedInputMethods?: string[];
  playStoreMode?: string;
  printingPolicy?: string;
  screenCaptureDisabled?: boolean;
  setWallpaperDisabled?: boolean;
  shareLocationDisabled?: boolean;
  smsDisabled?: boolean;
  stayOnPluggedModes?: string[];
  systemUpdate?: SystemUpdate;
  uninstallAppsDisabled?: boolean;
  vpnConfigDisabled?: boolean;
  deviceConnectivityManagement?: DeviceConnectivityManagement;
  deviceOwnerLockScreenInfo?: string;
  hideEnterpriseName?: boolean;
  policyEnforcementRules?: PolicyEnforcementRule[];
  applications?: ApplicationPolicy[];
}
