import { VehicleTracking } from './VehicleTrackingResponse';
export class Vehicle {
  id?: string;
  serviceTypeId?: string;
  vehicleTypeId?: string;
  rentStationId?: null;
  partnerId?: string;
  priceRentingId?: null;
  name?: string;
  licensePlates?: string;
  serviceTypeName?: string;
  companyName?: string;
  color?: string;
  status?: number;
  rate?: number;
  vehicleTypeName?: string;
  publishYearId?: string;
  categoryId?: string;
  location?: VehicleTracking;
  isRunning?: number;
}

export class VehiclesResponse {
  statusCode?: number;
  message?: string;
  body!: Vehicle[];
}

export class VehicleResponse {
  statusCode?: number;
  message?: string;
  body!: Vehicle;
}
