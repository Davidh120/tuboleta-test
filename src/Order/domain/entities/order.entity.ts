export class Order {
  constructor(
    public orderId: string,
    public orderSecretId: string | null,
    public statusCode: string,
    public requestId: string | null,
    public statusDetail: string | null,
    public orderData: OrderData | null,
  ) {}
}

export class OrderData {
  constructor(
    public catalogCurrency: Currency,
    public generatedContactQualities: any[],
    public mainOperationId: string,
    public movementDataUpdates: MovementDataUpdate[],
    public operationDataUpdates: OperationDataUpdate[],
    public orderId: string,
    public orderSecretId: string | null,
    public origin: OrderOrigin | null,
    public orderState: string,
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

export class MovementDataUpdate {
  constructor(
    public attributionMatch: string,
    public contingent: string,
    public contingentId: string,
    public endValidityDate: string | null,
    public instanceNumber: string,
    public movementId: string,
    public operationId: string,
    public resumed: boolean,
    public startValidityDate: string | null,
    public transferable: boolean,
    public type: string,
  ) {}
}

export class OperationDataUpdate {
  constructor(
    public audienceCatId: string,
    public audienceSubCategory: string,
    public audienceSubCategoryExternalDescription: string | null,
    public audienceSubCategoryId: string,
    public audienceSubCategoryRank: number,
    public audienceSubCategoryRequireAttachment: boolean,
    public basePrice: number,
    public catalogCurrency: Currency,
    public comfortVariableValues: any[],
    public contingent: string,
    public contingentId: string,
    public exchangeable: boolean,
    public fileId: string | null,
    public isNominative: boolean,
    public itemDisplayExternalDesignation: string,
    public itemId: string,
    public kind: string,
    public locations: Location[],
    public numbered: boolean,
    public operationId: string,
    public operationNumber: number,
    public product: string,
    public productCode: string,
    public productFamilySubType: string,
    public productFamilyType: string,
    public productId: string,
    public quantity: number,
    public season: string | null,
    public selfPaidVat: boolean,
    public totalAmount: number,
    public type: string,
    public unitPrice: number,
    public vatCountryCode: string,
    public vatRate: number,
    public waitingAccountBalance: number,
    public withoutVatTotalAmount: number,
  ) {}
}

export class Location {
  constructor(
    public siteAddress: SiteAddress,
    public siteCode: string,
    public siteExternalName: string,
    public spaceCode: string,
    public spaceExternalName: string,
  ) {}
}

export class SiteAddress {
  constructor(
    public countryCode: string,
    public firstAddressLine: string,
    public locality: string,
    public zipCode: string,
  ) {}
}

export class OrderOrigin {
  constructor(
    public toCreateToken: boolean,
  ) {}
}

export class CreateOrderRequest {
  constructor(
    public pointOfSalesId: string,
    public orderType: string,
    public purchasersInfo: PurchasersInfo,
    public simpleProductOperations: SimpleProductOperation[],
  ) {}
}

export class PurchasersInfo {
  constructor(
    public contactReference: string,
  ) {}
}

export class SimpleProductOperation {
  constructor(
    public audienceSubCategoryId: string,
    public quantity: number,
    public itemId: string,
  ) {}
}

export class CloseOrderRequest {
  constructor(
    public purchaserInfo: PurchasersInfo,
    public orderId: string,
    public generateBarCodes: boolean,
    public maxWaitingTime: number,
    public orderType: string,
  ) {}
}

export class GetOrderDetailsRequest {
  constructor(
    public orderId: string,
  ) {}
}

