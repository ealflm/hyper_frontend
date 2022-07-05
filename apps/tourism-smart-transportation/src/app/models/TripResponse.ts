import { UtilPaging } from './UtilPaging';
export class Trip {
  routeId?: string;
  vehicleId?: string;
  driverId?: string;
  tripName?: string;
  dayOfWeek?: number;
  timeStart!: string;
  timeEnd!: string;
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
