export interface CustomerTrip {
  customerTripId?: string;
  customerId?: string;
  customerName?: string;
  tripId?: string;
  vehicleId?: string;
  distance?: number;
  createdDate?: Date;
  modifiedDate?: Date;
  rentDeadline?: null;
  coordinates?: string;
  serviceTypeName?: string;
  vehicleName?: string;
  licensePlates?: string;
  status?: number;
}
export class CustomerTripResponse {
  statusCode?: number;
  message?: string;
  body!: CustomerTrip[];
}
