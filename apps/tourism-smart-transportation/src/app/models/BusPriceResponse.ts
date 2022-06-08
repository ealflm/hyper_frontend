export class BusPrice {
  id?: string;
  minRouteDistance?: number;
  maxRouteDistance?: number;
  minDistance?: number;
  maxDistance?: number;
  price?: number;
  minStation?: number;
  maxStation?: number;
  mode?: string;
  status?: number;
}
export class BusPricesResponse {
  statusCode?: number;
  message?: string;
  body!: BusPrice[];
}

export class BusPriceResponse {
  statusCode?: number;
  message?: string;
  body!: BusPrice;
}
