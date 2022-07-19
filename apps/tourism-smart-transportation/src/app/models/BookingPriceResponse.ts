export class BookingPrice {
  id?: string;
  vehicleTypeId?: string;
  vehicleLabel?: string;
  vehicleSeats?: string;
  vehicleFuel?: string;
  fixedPrice!: number;
  fixedDistance!: number;
  pricePerKilometer!: number;
  status!: number;
}
export class BookingPriceResponse {
  statusCode?: number;
  message?: string;
  body!: BookingPrice;
}
export class BookingPricesResponse {
  statusCode?: number;
  message?: string;
  body!: BookingPrice[];
}
