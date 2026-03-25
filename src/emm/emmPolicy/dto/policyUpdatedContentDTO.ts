export interface UpdatedNetworkConfiguration {
  ssid?: string;
  cipherType?: string;
  eapMethod?: string;
  phaseMethod?: string;
  userID?: string;
  userPass?: string;
  anoID?: string;
  idCert?: CertFileData;
  caCert?: CertFileData;
  domain?: string;
  password?: string;
  proxyType?: string;
  hostName?: string;
  port?: number;
  pacUrl?: string;
}

export interface CertFileData {
  fileKey?: string;
  fileName?: string;
  content?: string;
}

export interface UpdatedAdvancedSecurityOverrides {
  developerSettings?: string;
  googlePlayProtectVerifyApps?: string;
  untrustedAppsPolicy?: string;
}

export interface UpdatedAlwaysOnVpnPackage {
  lockdownEnabled?: boolean;
  packageName?: string;
}

export interface UpdatedPermissionGrant {
  permission?: string;
  policy?: string;
}

export interface UpdatedAppPermissionGrant {
  permission?: string;
  policy?: string;
}

export interface UpdatedDeviceRadioState {
  airplaneModeState?: string;
  minimumWifiSecurityLevel?: string;
}

export interface UpdatedKioskCustomization {
  deviceSettings?: string;
  powerButtonActions?: string;
  statusBar?: string;
  systemErrorWarnings?: string;
  systemNavigation?: string;
}

export interface UpdatedPasswordRequirements {
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

export interface UpdatedCustomDate {
  month?: number;
  day?: number;
}

export interface UpdatedFreezePeriod {
  startDate?: UpdatedCustomDate;
  endDate?: UpdatedCustomDate;
}

export interface UpdatedSystemUpdate {
  startToEndMinutes?: string;
  freezePeriods?: UpdatedFreezePeriod[];
  type?: string;
}

export interface UpdatedApnSetting {
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

export interface UpdatedApnPolicy {
  overrideApns?: boolean;
  apnSettings?: UpdatedApnSetting[];
}

export interface UpdatedDeviceConnectivityManagement {
  tetheringSettings?: string;
  usbDataAccess?: string;
  apnPolicy?: UpdatedApnPolicy;
}

export interface UpdatedBlockAction {
  blockAfterDays?: number;
}

export interface UpdatedWipeAction {
  preserveFrp?: boolean;
  wipeAfterDays?: number;
}

export interface UpdatedPolicyEnforcementRule {
  blockAction?: UpdatedBlockAction;
  settingName?: string;
  wipeAction?: UpdatedWipeAction;
}

export interface UpdatedApplicationPolicy {
  packageName?: string;
  autoUpdateMode?: string;
  defaultPermissionPolicy?: string;
  installPriority?: string;
  accessibleTrackId?: number;
  installType?: string;
  permissionGrants?: UpdatedAppPermissionGrant[];
}

export interface PolicyUpdatedContentDTO {
  adjustVolumeDisabled?: boolean;
  advancedSecurityOverrides?: UpdatedAdvancedSecurityOverrides;
  alwaysOnVpnPackage?: UpdatedAlwaysOnVpnPackage;
  appAutoUpdatePolicy?: string;
  autoDateAndTimeZone?: string;
  bluetoothDisabled?: boolean;
  cameraAccess?: string;
  cellBroadcastsConfigDisabled?: boolean;
  dataRoamingDisabled?: boolean;
  deviceRadioState?: UpdatedDeviceRadioState;
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
  kioskCustomization?: UpdatedKioskCustomization;
  enableRemoteControl?: boolean;
  locationMode?: string;
  maximumTimeToLock?: number;
  microphoneAccess?: string;
  minimumApiLevel?: number;
  mobileNetworksConfigDisabled?: boolean;
  mountPhysicalMediaDisabled?: boolean;
  networkEscapeHatchEnabled?: boolean;
  networkResetDisabled?: boolean;
  networkConfigurations?: UpdatedNetworkConfiguration[];
  outgoingCallsDisabled?: boolean;
  passwordPolicies?: UpdatedPasswordRequirements;
  permissionGrants?: UpdatedPermissionGrant[];
  permittedAccessibilityServices?: string[];
  permittedInputMethods?: string[];
  playStoreMode?: string;
  printingPolicy?: string;
  screenCaptureDisabled?: boolean;
  setWallpaperDisabled?: boolean;
  shareLocationDisabled?: boolean;
  smsDisabled?: boolean;
  stayOnPluggedModes?: string[];
  systemUpdate?: UpdatedSystemUpdate;
  uninstallAppsDisabled?: boolean;
  vpnConfigDisabled?: boolean;
  deviceConnectivityManagement?: UpdatedDeviceConnectivityManagement;
  deviceOwnerLockScreenInfo?: string;
  hideEnterpriseName?: boolean;
  policyEnforcementRules?: UpdatedPolicyEnforcementRule[];
  applications?: UpdatedApplicationPolicy[];
}
