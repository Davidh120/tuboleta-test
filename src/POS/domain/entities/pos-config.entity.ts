export class POSConfig {
  constructor(
    public statusCode: string,
    public requestId: string | null,
    public statusDetail: string | null,
    public posConfigData: POSConfigData,
  ) {}
}

export class POSConfigData {
  constructor(
    public allowedChars: string,
    public amazonS3InstitutionBucketName: string,
    public catalogCurrencies: Currency,
    public charges: Charge[],
    public contactAccountCreationAllowed: boolean,
    public contactFileAccessAllowed: boolean,
    public contactLoginMode: string,
    public countries: Country[],
    public currencyCode: string,
    public currencySymbol: string,
    public customizationFile: string | null,
    public guestLoginAvailable: boolean,
    public hub: Hub | null,
    public institCode: string,
    public institutionCurrency: Currency,
    public invoicingAllowed: boolean,
    public languageList: string,
    public loginPosition: string,
    public mainLanguage: string,
    public maxAutoSuggestedSeatsTrials: number,
    public maxSeatsPerPerformance: number,
    public modeOfUse: string,
    public multiCatalogCurrencyEnabled: boolean,
    public netPrices: boolean,
    public orderAbandonDelay: number,
    public orderOrigins: OrderOrigin[],
    public organizationCode: string,
    public organizationCurrency: Currency,
    public organizationId: string,
    public organizationName: string,
    public organizationTimeZone: string,
    public paymentMethods: PaymentMethod[],
    public placeAddress: string | null,
    public placeAddressData: PlaceAddressData | null,
    public posActivityState: string,
    public posCode: string,
    public posCustomizationFile: string | null,
    public posId: string,
    public posNumber: string,
    public posParameters: POSParameter[],
    public posType: string,
    public productFamilies: ProductFamily[],
    public pspAccessMethod: string,
    public pspParameters: PSPParameter[],
    public salesChannelActivityState: string,
    public salesChannelCode: string,
    public salesChannelId: string,
    public seatSelectionMode: string,
    public testInstitution: boolean,
    public virtualOperatorName: string,
  ) {}
}

export class Currency {
  constructor(
    public currencyCode: string,
    public fractionDigit: number,
    public minAmount: number,
    public symbol: string,
  ) {}
}

export class Charge {
  constructor(
    public code: string,
    public id: string,
    public externalName: string,
    public modifiable: boolean,
    public type: string,
  ) {}
}

export class Country {
  constructor(
    public code: string,
    public internationalPhonePrefix: string,
    public name: string,
    public phoneFormat: string,
    public currencyCode: string | null,
  ) {}
}

export class Hub {
  constructor(
    public id: string,
    public pointsOfSales: PointOfSale[],
  ) {}
}

export class PointOfSale {
  constructor(
    public allCountriesAllowed: boolean,
    public code: string,
    public id: string,
    public internetUrl: string,
    public rank: number,
    public running: boolean,
  ) {}
}

export class OrderOrigin {
  constructor(
    public idCode: string,
    public externalName: string,
  ) {}
}

export class PaymentMethod {
  constructor(
    public code: string,
    public id: string,
    public externalName: string,
    public externalDescription: string | null,
    public authorizationMode: string,
    public changeReturnAllowed: boolean,
    public forPayment: boolean,
    public forReimbursement: boolean,
    public inSplitPaymentAllowed: boolean,
    public manualValidation: boolean,
    public paymentType: string,
    public rank: number,
    public tooMuchPerceivedAllowed: boolean,
    public withFollowUp: boolean,
  ) {}
}

export class PlaceAddressData {
  constructor(
    public countryCode: string,
    public email: string | null,
    public firstAddressLine: string,
    public gpsLatitude: number | null,
    public gpsLongitude: number | null,
    public locality: string,
    public website: string | null,
    public zipCode: string,
  ) {}
}

export class POSParameter {
  constructor(
    public key: string,
    public value: string,
  ) {}
}

export class ProductFamily {
  constructor(
    public id: string,
    public externalName: string,
    public productFamilyType: string,
    public productFamilySubType: string,
    public contactRequired: boolean,
    public defaultQuantity: number,
    public directOption: string,
    public netPrices: boolean,
    public reservable: string,
  ) {}
}

export class PSPParameter {
  constructor(
    public key: string,
    public value: string,
  ) {}
}

