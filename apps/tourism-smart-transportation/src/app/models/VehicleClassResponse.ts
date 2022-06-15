import { UtilPaging } from './UtilPaging';
export class VehicleClass {
  id?: string;
  name?: string;
  description?: string;
  status?: number;
}

export class VehiclesResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<VehicleClass[]>;
}

export class VehicleResponse {
  statusCode?: number;
  message?: string;
  body!: VehicleClass;
}
