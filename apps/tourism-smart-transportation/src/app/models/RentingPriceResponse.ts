import { UtilPaging } from '../models/UtilPaging';
export class RentingPrice {
  id?: string;
  publishYearId?: string;
  publishYearName?: string;
  categoryId?: string;
  categoryName?: string;
  minTime?: number;
  maxTime?: number;
  pricePerHour?: number;
  fixedPrice?: number;
  weekendPrice?: number;
  holidayPrice?: number;
  status?: number;
}
export class RentingPriceResponse {
  statusCode?: number;
  message?: string;
  body!: RentingPrice;
}

export class RentingPricesResponse {
  statusCode?: number;
  message?: string;
  body!: RentingPrice[];
}
