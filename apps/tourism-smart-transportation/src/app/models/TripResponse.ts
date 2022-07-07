import { UtilPaging } from './UtilPaging';
export class Trip {
  tripId?: string;
  routeId?: string;
  vehicleId?: string;
  driverId?: string;
  tripName?: string;
  dayOfWeek?: number;
  timeStart!: string;
  timeEnd!: string;
  driverFirstName?: string;
  driverLastName?: string;
  driverPhotoUrl?: string;
  vehicleName?: string;
  status?: number;
}

export class TripsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Trip[]>;
}

export class TripResponse {
  statusCode?: number;
  message?: string;
  body!: Trip;
}
