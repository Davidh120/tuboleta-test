import {
  POSConfig,
  POSConfigData,
  Currency,
  Charge,
  Country,
  Hub,
  PointOfSale,
  OrderOrigin,
  PaymentMethod,
  PlaceAddressData,
  POSParameter,
  ProductFamily,
  PSPParameter,
} from '../../domain/entities/pos-config.entity';

type SoapPOSConfigResponse = {
  POSConfigResult?: {
    statusCode?: string;
    requestId?: string | null;
    statusDetail?: string | null;
    posConfigData?: any;
  };
};

export class SoapPOSMapper {
  static toDomain(response: SoapPOSConfigResponse): POSConfig {
    const result = response.POSConfigResult;
    
    if (!result) {
      throw new Error('Invalid SOAP response: Missing POSConfigResult');
    }

    const data = result.posConfigData || {};
    
    return new POSConfig(
      result.statusCode || 'error',
      result.requestId || null,
      result.statusDetail || null,
      new POSConfigData(
        data.allowedChars || '',
        data.amazonS3InstitutionBucketName || '',
        this.mapCurrency(data.catalogCurrencies),
        this.mapCharges(data.charges || []),
        data.contactAccountCreationAllowed || false,
        data.contactFileAccessAllowed || false,
        data.contactLoginMode || '',
        this.mapCountries(data.countries || []),
        data.currencyCode || '',
        data.currencySymbol || '',
        data.customizationFile || null,
        data.guestLoginAvailable || false,
        data.hub ? this.mapHub(data.hub) : null,
        data.institCode || '',
        this.mapCurrency(data.institutionCurrency),
        data.invoicingAllowed || false,
        data.languageList || '',
        data.loginPosition || '',
        data.mainLanguage || '',
        data.maxAutoSuggestedSeatsTrials || 0,
        data.maxSeatsPerPerformance || 0,
        data.modeOfUse || '',
        data.multiCatalogCurrencyEnabled || false,
        data.netPrices || false,
        data.orderAbandonDelay || 0,
        this.mapOrderOrigins(data.orderOrigins || []),
        data.organizationCode || '',
        this.mapCurrency(data.organizationCurrency),
        String(data.organizationId || ''),
        this.getTranslation(data.organizationName) || '',
        data.organizationTimeZone || '',
        this.mapPaymentMethods(data.paymentMethods || []),
        data.placeAddress || null,
        data.placeAddressData ? this.mapPlaceAddressData(data.placeAddressData) : null,
        data.posActivityState || '',
        data.posCode || '',
        data.posCustomizationFile || null,
        String(data.posId || ''),
        String(data.posNumber || ''),
        this.mapPOSParameters(data.posParameters || []),
        data.posType || '',
        this.mapProductFamilies(data.productFamilies || []),
        data.pspAccessMethod || '',
        this.mapPSPParameters(data.pspParameters || []),
        data.salesChannelActivityState || '',
        data.salesChannelCode || '',
        String(data.salesChannelId || ''),
        data.seatSelectionMode || '',
        data.testInstitution || false,
        data.virtualOperatorName || '',
      ),
    );
  }

  private static mapCurrency(currency: any): Currency {
    if (!currency) {
      return new Currency('EUR', 2, 10, '€');
    }
    return new Currency(
      currency.currencyCode || 'EUR',
      currency.fractionDigit || 2,
      currency.minAmount || 10,
      currency.symbol || '€',
    );
  }

  private static mapCharges(charges: any[]): Charge[] {
    return charges.map(charge => new Charge(
      charge.code || '',
      String(charge.id || ''),
      this.getTranslation(charge.externalName) || '',
      charge.modifiable || false,
      charge.type || '',
    ));
  }

  private static mapCountries(countries: any[]): Country[] {
    return countries.map(country => new Country(
      country.code || '',
      country.internationalPhonePrefix || '',
      this.getTranslation(country.name) || '',
      country.phoneFormat || '',
      country.currencyCode || null,
    ));
  }

  private static mapHub(hub: any): Hub {
    return new Hub(
      String(hub.id || ''),
      this.mapPointsOfSales(hub.pointsOfSales || []),
    );
  }

  private static mapPointsOfSales(points: any[]): PointOfSale[] {
    return points.map(point => new PointOfSale(
      point.allCountriesAllowed || false,
      point.code || '',
      String(point.id || ''),
      point.internetUrl || '',
      point.rank || 0,
      point.running || false,
    ));
  }

  private static mapOrderOrigins(origins: any[]): OrderOrigin[] {
    return origins.map(o => new OrderOrigin(
      o.idCode || '',
      this.getTranslation(o.externalName) || '',
    ));
  }

  private static mapPaymentMethods(methods: any[]): PaymentMethod[] {
    return methods.map(method => new PaymentMethod(
      method.code || '',
      String(method.id || ''),
      this.getTranslation(method.externalName) || '',
      this.getTranslation(method.externalDescription) || null,
      method.authorizationMode || '',
      method.changeReturnAllowed || false,
      method.forPayment || false,
      method.forReimbursement || false,
      method.inSplitPaymentAllowed || false,
      method.manualValidation || false,
      method.paymentType || '',
      method.rank || 0,
      method.tooMuchPerceivedAllowed || false,
      method.withFollowUp || false,
    ));
  }

  private static mapPlaceAddressData(data: any): PlaceAddressData {
    return new PlaceAddressData(
      data.countryCode || '',
      data.email || null,
      data.firstAddressLine || '',
      data.gpsLatitude || null,
      data.gpsLongitude || null,
      data.locality || '',
      data.website || null,
      data.zipCode || '',
    );
  }

  private static mapPOSParameters(params: any): POSParameter[] {
    if (!params) {
      return [];
    }
    
    if (Array.isArray(params)) {
      const result: POSParameter[] = [];
      for (const param of params) {
        if (param.entry) {
          result.push(new POSParameter(
            param.entry.key || '',
            String(param.entry.value || ''),
          ));
        } else if (param.key && param.value !== undefined) {
          result.push(new POSParameter(
            param.key || '',
            String(param.value || ''),
          ));
        }
      }
      return result;
    }
    
    if (params.entry && Array.isArray(params.entry)) {
      return params.entry.map((entry: any) => new POSParameter(
        entry.key || '',
        String(entry.value || ''),
      ));
    }
    
    return [];
  }

  private static mapProductFamilies(families: any[]): ProductFamily[] {
    return families.map(family => new ProductFamily(
      String(family.id || ''),
      this.getTranslation(family.externalName) || '',
      family.productFamilyType || '',
      family.productFamilySubType || '',
      family.contactRequired || false,
      family.defaultQuantity || 1,
      family.directOption || '',
      family.netPrices || false,
      family.reservable || '',
    ));
  }

  private static mapPSPParameters(params: any): PSPParameter[] {
    if (!params) {
      return [];
    }
    
    if (Array.isArray(params)) {
      const result: PSPParameter[] = [];
      for (const param of params) {
        if (param.entry) {
          result.push(new PSPParameter(
            param.entry.key || '',
            String(param.entry.value || ''),
          ));
        } else if (param.key && param.value !== undefined) {
          result.push(new PSPParameter(
            param.key || '',
            String(param.value || ''),
          ));
        }
      }
      return result;
    }
    
    if (params.entry && Array.isArray(params.entry)) {
      return params.entry.map((entry: any) => new PSPParameter(
        entry.key || '',
        String(entry.value || ''),
      ));
    }
    
    return [];
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

