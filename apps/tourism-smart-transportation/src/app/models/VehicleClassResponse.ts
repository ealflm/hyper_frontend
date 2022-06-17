import { UtilPaging } from './UtilPaging';
export class VehicleClass {
  id?: string;
  name?: string;
  description?: string;
  status?: number;
}

export class VehiclesClassResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<VehicleClass[]>;
}

export class VehicleClassResponse {
  statusCode?: number;
  message?: string;
  body!: VehicleClass;
}
