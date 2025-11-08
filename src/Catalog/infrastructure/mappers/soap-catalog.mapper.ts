import {
  Catalog,
  CatalogData,
  ExternalVerification,
  GroupCriterion,
  GroupCriterionElement,
  PhysicalConfiguration,
  Area,
  Product,
  CrossSellProductLink,
  Pass,
  PassItem,
  ItemPrice,
  SalePeriod,
} from '../../domain/entities/catalog.entity';

type SoapCatalogResponse = {
  CatalogResultDetailed?: {
    statusCode?: string;
    requestId?: string | null;
    statusDetail?: string | null;
    catalogData?: {
      externalVerifications?: any[];
      groupCriterions?: any[];
      physicalConfigurations?: any[];
      products?: any[];
    };
  };
};

export class SoapCatalogMapper {
  static toDomain(response: SoapCatalogResponse): Catalog {
    const result = response.CatalogResultDetailed;
    
    if (!result) {
      throw new Error('Invalid SOAP response: Missing CatalogResultDetailed');
    }

    const catalogData = result.catalogData || {};
    
    return new Catalog(
      result.statusCode || 'error',
      result.requestId || null,
      result.statusDetail || null,
      new CatalogData(
        this.mapExternalVerifications(catalogData.externalVerifications || []),
        this.mapGroupCriterions(catalogData.groupCriterions || []),
        this.mapPhysicalConfigurations(catalogData.physicalConfigurations || []),
        this.mapProducts(catalogData.products || []),
      ),
    );
  }

  private static mapExternalVerifications(verifications: any[]): ExternalVerification[] {
    return verifications.map(v => new ExternalVerification(
      String(v.id || ''),
      this.getTranslation(v.description) || '',
      this.getTranslation(v.externalName) || '',
      v.field1Name || null,
      v.field2Name || null,
      v.numberOfTicketsPerCard || null,
    ));
  }

  private static mapGroupCriterions(criterions: any[]): GroupCriterion[] {
    return criterions.map(c => new GroupCriterion(
      c.code || '',
      String(c.id || ''),
      this.getTranslation(c.externalName) || '',
      c.rank || null,
      c.planningRequirement || false,
      this.mapGroupCriterionElements(c.elements || []),
    ));
  }

  private static mapGroupCriterionElements(elements: any[]): GroupCriterionElement[] {
    return elements.map(e => new GroupCriterionElement(
      e.code || '',
      String(e.id || ''),
      this.getTranslation(e.externalName) || '',
      e.rank || null,
    ));
  }

  private static mapPhysicalConfigurations(configs: any[]): PhysicalConfiguration[] {
    return configs.map(c => new PhysicalConfiguration(
      c.code || '',
      String(c.id || ''),
      c.countryCode || '',
      this.getTranslation(c.externalName) || '',
      c.siteCode || '',
      String(c.siteId || ''),
      this.getTranslation(c.siteExternalName) || '',
      c.formattedAddress || null,
      c.street || null,
      c.town || null,
      c.zipcode || null,
      c.securityGauge || null,
      c.mapType || null,
      c.spaceCode || '',
      this.getTranslation(c.spaceExternalName) || '',
      String(c.spaceId || ''),
      c.spaceType || '',
      this.mapAreas(c.areas || []),
      c.physicalGauge || null,
      c.type || '',
      c.kind || '',
    ));
  }

  private static mapAreas(areas: any[]): Area[] {
    return areas.map(a => new Area(
      a.code || '',
      String(a.id || ''),
    ));
  }

  private static mapProducts(products: any[]): Product[] {
    return products.map(p => new Product(
      String(p.id || ''),
      this.getTranslation(p.externalName) || '',
      this.getTranslation(p.internalName) || null,
      this.getTranslation(p.description) || null,
      p.exchangeable || false,
      p.grantedToTourPromoter || false,
      p.minQuantity || 1,
      p.largeImageUrl || null,
      p.mediumImageUrl || null,
      p.logo || null,
      this.mapCrossSellProductLinks(p.crossSellProductLinks || []),
      p.pass ? this.mapPass(p.pass) : null,
    ));
  }

  private static mapCrossSellProductLinks(links: any[]): CrossSellProductLink[] {
    return links.map(l => new CrossSellProductLink(
      String(l.id || ''),
      this.getTranslation(l.externalName) || '',
      l.type || '',
      l.baseMinQuantity || 0,
      String(l.targetProductId || ''),
      l.targetProductRank || 0,
      l.targetQuantityType || '',
      l.targetSameDateAsBase || false,
      l.start || null,
      l.end || null,
    ));
  }

  private static mapPass(pass: any): Pass {
    return new Pass(
      pass.consecutive || 'INDIFFERENT',
      pass.dateMandatory || false,
      pass.guided || false,
      this.mapPassItems(pass.items || []),
    );
  }

  private static mapPassItems(items: any[]): PassItem[] {
    return items.map(i => new PassItem(
      String(i.itemId || ''),
      this.mapItemPrices(i.itemPrices || []),
      (i.timeslotIds || []).map((id: any) => String(id)),
    ));
  }

  private static mapItemPrices(prices: any[]): ItemPrice[] {
    return prices.map(p => new ItemPrice(
      p.amount || 0,
      String(p.audSubCatId || ''),
      p.maxQty || null,
      p.minQty || null,
      p.priceLevelId ? String(p.priceLevelId) : null,
      p.rateTypeId ? String(p.rateTypeId) : null,
      this.mapSalePeriods(p.salePeriods || []),
      p.startDate || null,
      p.endDate || null,
      p.startTime || null,
      p.salesTolerance || null,
      p.quota || null,
      p.duration || null,
      p.allVisitLanguages || false,
      p.allVisitThemes || false,
    ));
  }

  private static mapSalePeriods(periods: any[]): SalePeriod[] {
    return periods.map(p => new SalePeriod(
      (p.audienceSubCatIds || []).map((id: any) => String(id)),
    ));
  }

  private static getTranslation(translatable: any): string | null {
    if (!translatable) return null;
    
    if (typeof translatable === 'string') {
      return translatable;
    }
    
    if (translatable.translations && Array.isArray(translatable.translations)) {
      const firstTranslation = translatable.translations.find((t: any) => t.value);
      return firstTranslation?.value || null;
    }
    
    if (translatable.value) {
      return translatable.value;
    }
    
    return null;
  }
}

