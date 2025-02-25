export enum Features {
  testing = 'do-not-remove-for-testing-only',
  // Integrate auth-api with user-profile-api.
  userProfileClaims = 'shouldAuthApiReturnUserProfileClaims',

  // Application visibility flags
  exampleApplication = 'isExampleApplicationEnabled',
  accidentNotification = 'isAccidentNotificationEnabled',
  europeanHealthInsuranceCard = 'isEuropeanHealthInsuranceCardApplicationEnabled',
  passportApplication = 'isPassportApplicationEnabled',
  passportAnnulmentApplication = 'isPassportAnnulmentApplicationEnabled',
  financialStatementInao = 'financialStatementInao',
  inheritanceReport = 'isInheritanceReportApplicationEnabled',
  transportAuthorityDigitalTachographCompanyCard = 'isTransportAuthorityDigitalTachographCompanyCardEnabled',
  transportAuthorityDigitalTachographWorkshopCard = 'isTransportAuthorityDigitalTachographWorkshopCardEnabled',
  alcoholTaxRedemption = 'isAlcoholTaxRedemptionEnabled',
  consultationPortalApplication = 'isConsultationPortalEnabled',
  childrenResidenceChangeV2 = 'isChildrenResidenceChangeV2Enabled',
  oldAgePensionApplication = 'isOldAgePensionEnable',
  householdSupplementApplication = 'isHouseholdSupplementEnable',
  signatureListCreation = 'isSignatureListCreationEnabled',
  citizenship = 'isCitizenshipEnabled',
  energyFunds = 'isEnergyFundsEnabled',
  carRecyclingApplication = 'isCarRecyclingApplicationEnabled',
  complaintsToAlthingiOmbudsman = 'isComplaintToAlthingiOmbudsmanEnabled',
  healthcareLicenseCertificate = 'isHealthcareLicenseCertificateEnabled',
  pensionSupplementApplication = 'isPensionSupplementEnable',
  transferOfMachineOwnership = 'isTransferOfMachineOwnershipEnabled',
  additionalSupportForTheElderlyApplication = 'isAdditionalSupportForTheElderlyEnable',
  homeSupport = 'isHomeSupportEnabled',
  ChangeMachineSupervisor = 'isChangeMachineSupervisorEnabled',

  // Application System Delegations active
  applicationSystemDelegations = 'applicationSystemDelegations',

  // Service portal modules
  servicePortalPetitionsModule = 'isServicePortalPetitionsModuleEnabled',
  servicePortalConsentModule = 'isServicePortalConsentModuleEnabled',
  servicePortalHealthRightsModule = 'isServicePortalHealthRightsModuleEnabled',
  servicePortalSecondaryEducationPages = 'isServicePortalSecondaryEducationPageEnabled',
  servicePortalHealthCenterDentistPage = 'isServicePortalHealthCenterPageEnabled',
  servicePortalWorkMachinesModule = 'isServicePortalWorkMachinesPageEnabled',
  servicePortalHealthMedicinePages = 'isServicePortalHealthMedicinePageEnabled',
  servicePortalHealthPaymentPages = 'isServicePortalHealthPaymentPageEnabled',
  servicePortalHealthOverviewPage = 'isServicePortalHealthOverviewPageEnabled',
  servicePortalSignatureCollection = 'isServicePortalSignatureCollectionEnabled',
  servicePortalVehicleMileagePageEnabled = 'isServicePortalVehicleMileagePageEnabled',
  servicePortalSocialInsurancePageEnabled = 'isServicePortalSocialInsurancePageEnabled',

  //Occupational License Health directorate fetch enabled
  occupationalLicensesHealthDirectorate = 'isHealthDirectorateOccupationalLicenseEnabled',

  //License service new drivers license client enabled
  licenseServiceDrivingLicenseClient = 'isLicenseServiceDrivingLicenceClientV2Enabled',

  //Enable intellectual properties fetch
  isIntellectualPropertyModuleEnabled = 'isIntellectualPropertyModuleEnabled',

  // Application delegation flags
  isFishingLicenceCustomDelegationEnabled = 'isFishingLicenceCustomDelegationEnabled',

  //Application system
  applicationSystemHistory = 'applicationSystemHistory',

  // Search indexer
  shouldSearchIndexerResolveNestedEntries = 'shouldSearchIndexerResolveNestedEntries',

  // Userprofile Collection
  isIASSpaPagesEnabled = 'isiasspapagesenabled',

  // Disable new login restrictions
  disableNewDeviceLogins = 'disableNewDeviceLogins',

  // Notifications
  isNotificationEmailWorkerEnabled = 'isnotificationemailworkerenabled',
}

export enum ServerSideFeature {
  testing = 'do-not-remove-for-testing-only',
  drivingLicense = 'driving-license-use-v1-endpoint-for-v2-comms',
}
