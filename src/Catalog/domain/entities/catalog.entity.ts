export class Catalog {
  constructor(
    public statusCode: string,
    public requestId: string | null,
    public statusDetail: string | null,
    public catalogData: CatalogData,
  ) {}
}

export class CatalogData {
  constructor(
    public externalVerifications: ExternalVerification[],
    public groupCriterions: GroupCriterion[],
    public physicalConfigurations: PhysicalConfiguration[],
    public products: Product[],
  ) {}
}

export class ExternalVerification {
  constructor(
    public id: string,
    public description: string,
    public externalName: string,
    public field1Name: string | null,
    public field2Name: string | null,
    public numberOfTicketsPerCard: number | null,
  ) {}
}

export class GroupCriterion {
  constructor(
    public code: string,
    public id: string,
    public externalName: string,
    public rank: number | null,
    public planningRequirement: boolean,
    public elements: GroupCriterionElement[],
  ) {}
}

export class GroupCriterionElement {
  constructor(
    public code: string,
    public id: string,
    public externalName: string,
    public rank: number | null,
  ) {}
}

export class PhysicalConfiguration {
  constructor(
    public code: string,
    public id: string,
    public countryCode: string,
    public externalName: string,
    public siteCode: string,
    public siteId: string,
    public siteExternalName: string,
    public formattedAddress: string | null,
    public street: string | null,
    public town: string | null,
    public zipcode: string | null,
    public securityGauge: number | null,
    public mapType: string | null,
    public spaceCode: string,
    public spaceExternalName: string,
    public spaceId: string,
    public spaceType: string,
    public areas: Area[],
    public physicalGauge: number | null,
    public type: string,
    public kind: string,
  ) {}
}

export class Area {
  constructor(
    public code: string,
    public id: string,
  ) {}
}

export class Product {
  constructor(
    public id: string,
    public externalName: string,
    public internalName: string | null,
    public description: string | null,
    public exchangeable: boolean,
    public grantedToTourPromoter: boolean,
    public minQuantity: number,
    public largeImageUrl: string | null,
    public mediumImageUrl: string | null,
    public logo: string | null,
    public crossSellProductLinks: CrossSellProductLink[],
    public pass: Pass | null,
  ) {}
}

export class CrossSellProductLink {
  constructor(
    public id: string,
    public externalName: string,
    public type: string,
    public baseMinQuantity: number,
    public targetProductId: string,
    public targetProductRank: number,
    public targetQuantityType: string,
    public targetSameDateAsBase: boolean,
    public start: string | null,
    public end: string | null,
  ) {}
}

export class Pass {
  constructor(
    public consecutive: string,
    public dateMandatory: boolean,
    public guided: boolean,
    public items: PassItem[],
  ) {}
}

export class PassItem {
  constructor(
    public itemId: string,
    public itemPrices: ItemPrice[],
    public timeslotIds: string[],
  ) {}
}

export class ItemPrice {
  constructor(
    public amount: number,
    public audSubCatId: string,
    public maxQty: number | null,
    public minQty: number | null,
    public priceLevelId: string | null,
    public rateTypeId: string | null,
    public salePeriods: SalePeriod[],
    public startDate: string | null,
    public endDate: string | null,
    public startTime: string | null,
    public salesTolerance: number | null,
    public quota: number | null,
    public duration: number | null,
    public allVisitLanguages: boolean,
    public allVisitThemes: boolean,
  ) {}
}

export class SalePeriod {
  constructor(
    public audienceSubCatIds: string[],
  ) {}
}

