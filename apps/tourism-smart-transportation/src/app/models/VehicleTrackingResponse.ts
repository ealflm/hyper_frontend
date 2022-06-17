export class VehicleTracking {
  id?: string;
  vehicleId?: string;
  longitude?: number;
  latitude?: number;
  createdDate?: number;
  modifiedDate?: number;
}

export class VehicleTrackingResponse {
  statusCode?: number;
  message?: string;
  body!: VehicleTracking;
}

export class VehicleTrackingsResponse {
  statusCode?: number;
  message?: string;
  body!: VehicleTracking[];
}
