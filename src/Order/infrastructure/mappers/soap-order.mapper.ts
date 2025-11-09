import {
  Order,
  OrderData,
  Currency,
  MovementDataUpdate,
  OperationDataUpdate,
  Location,
  SiteAddress,
  OrderOrigin,
} from '../../domain/entities/order.entity';

type SoapCreateOrderResponse = {
  createOrUpdateOrderResponse?: {
    OrderUpdateResult?: {
      statusCode?: string;
      requestId?: string | null;
      statusDetail?: string | null;
      expectedException?: boolean;
      orderUpdateData?: any;
    };
  };
};

type SoapCloseOrderResponse = {
  closeOrderResponse?: {
    OrderResult?: {
      statusCode?: string;
      requestId?: string | null;
      statusDetail?: string | null;
      orderData?: any;
    };
  };
};

type SoapGetOrderDetailsResponse = {
  getOrderDetailsResponse?: {
    OrderResult?: {
      statusCode?: string;
      requestId?: string | null;
      statusDetail?: string | null;
      orderData?: any;
    };
  };
};

export class SoapOrderMapper {
  static toDomainFromCreate(response: any): Order {
    const result =
      response?.result?.OrderUpdateResult ||
      response?.createOrUpdateOrderResponse?.OrderUpdateResult ||
      response?.OrderUpdateResult;

    if (!result) {
      console.error(
        'Invalid SOAP response structure in toDomainFromCreate:',
        JSON.stringify(response, null, 2),
      );
      throw new Error('Invalid SOAP response: Missing OrderUpdateResult');
    }

    const orderData = result.orderUpdateData;

    return new Order(
      String(orderData?.orderId ?? ''),
      orderData?.orderSecretId ?? null,
      result.statusCode ?? 'error',
      result.requestId ?? null,
      result.statusDetail ?? null,
      orderData ? this.mapOrderData(orderData) : null,
    );
  }


  static toDomainFromClose(response: any): Order {  
    const result =
    response?.closeOrderResponse?.CloseOrderResult ||
    response?.result?.CloseOrderResult ||
    response?.CloseOrderResult;
    
    if (!result) {
      console.error(
        'Invalid SOAP response structure in toDomainFromClose:',
        JSON.stringify(response, null, 2),
      );
      throw new Error('Invalid SOAP response: Missing OrderResult');
    }

    const orderData = result.orderData;
    
    return new Order(
      orderData?.orderId || '',
      orderData?.orderSecretId || null,
      result.statusCode || 'error',
      result.requestId || null,
      result.statusDetail || null,
      orderData ? this.mapOrderData(orderData) : null,
    );
  }

  static toDomainFromGetDetails(response: any): Order {
  const result =
    response?.getOrderDetailsResponse?.OrderDetailResult ||
    response?.result?.OrderDetailResult ||
    response?.OrderDetailResult;

  if (!result) {
    console.error(
      'Invalid SOAP response structure in toDomainFromGetDetails:',
      JSON.stringify(response, null, 2),
    );
    throw new Error('Invalid SOAP response: Missing OrderDetailResult');
  }

  const orderData =
    result.orderData ||
    result.orderDetailsData ||
    result.OrderDetailsData ||
    result.orderDetailData;

  return new Order(
    orderData?.orderId || '',
    orderData?.orderSecretId || null,
    result.statusCode || 'error',
    result.requestId || null,
    result.statusDetail || null,
    orderData ? this.mapOrderData(orderData) : null,
  );
}


  private static mapOrderData(data: any): OrderData {
    return new OrderData(
      this.mapCurrency(data.catalogCurrency),
      data.generatedContactQualities || [],
      String(data.mainOperationId || ''),
      this.mapMovementDataUpdates(data.movementDataUpdates || []),
      this.mapOperationDataUpdates(data.operationDataUpdates || []),
      String(data.orderId || ''),
      data.orderSecretId || null,
      data.origin ? this.mapOrderOrigin(data.origin) : null,
      data.orderState || 'error',
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

  private static mapMovementDataUpdates(updates: any[]): MovementDataUpdate[] {
    return updates.map(m => new MovementDataUpdate(
      m.attributionMatch || '',
      m.contingent || '',
      String(m.contingentId || ''),
      m.endValidityDate || null,
      String(m.instanceNumber || ''),
      String(m.movementId || ''),
      String(m.operationId || ''),
      m.resumed || false,
      m.startValidityDate || null,
      m.transferable || false,
      m.type || '',
    ));
  }

  private static mapOperationDataUpdates(updates: any[]): OperationDataUpdate[] {
    return updates.map(o => new OperationDataUpdate(
      String(o.audienceCatId || ''),
      o.audienceSubCategory || '',
      o.audienceSubCategoryExternalDescription || null,
      String(o.audienceSubCategoryId || ''),
      o.audienceSubCategoryRank || 0,
      o.audienceSubCategoryRequireAttachment || false,
      o.basePrice || 0,
      this.mapCurrency(o.catalogCurrency),
      o.comfortVariableValues || [],
      o.contingent || '',
      String(o.contingentId || ''),
      o.exchangeable || false,
      o.fileId ? String(o.fileId) : null,
      o.isNominative || false,
      o.itemDisplayExternalDesignation || '',
      String(o.itemId || ''),
      o.kind || '',
      this.mapLocations(o.locations || []),
      o.numbered || false,
      String(o.operationId || ''),
      o.operationNumber || 0,
      o.product || '',
      o.productCode || '',
      o.productFamilySubType || '',
      o.productFamilyType || '',
      String(o.productId || ''),
      o.quantity || 0,
      o.season || null,
      o.selfPaidVat || false,
      o.totalAmount || 0,
      o.type || '',
      o.unitPrice || 0,
      o.vatCountryCode || '',
      o.vatRate || 0,
      o.waitingAccountBalance || 0,
      o.withoutVatTotalAmount || 0,
    ));
  }

  private static mapLocations(locations: any[]): Location[] {
    return locations.map(l => new Location(
      this.mapSiteAddress(l.siteAddress),
      l.siteCode || '',
      this.getTranslation(l.siteExternalName) || '',
      l.spaceCode || '',
      this.getTranslation(l.spaceExternalName) || '',
    ));
  }

  private static mapSiteAddress(address: any): SiteAddress {
    if (!address) {
      return new SiteAddress('', '', '', '');
    }
    return new SiteAddress(
      address.countryCode || '',
      address.firstAddressLine || '',
      address.locality || '',
      address.zipCode || '',
    );
  }

  private static mapOrderOrigin(origin: any): OrderOrigin {
    return new OrderOrigin(
      origin.toCreateToken || false,
    );
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

