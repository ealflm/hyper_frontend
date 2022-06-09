export class VehicleType {
  id?: string;
  label?: string;
  seats?: number;
  fuel?: string;
  status?: number;
}
export class VehicleTypeResponse {
  statusCode?: number;
  message?: string;
  body!: VehicleType;
}

export class VehicleTypesResponse {
  statusCode?: number;
  message?: string;
  body!: VehicleType[];
}
