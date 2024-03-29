import { UtilPaging } from './UtilPaging';
export class RentStation {
  id!: string;
  title?: string;
  address?: string;
  partnerId?: string;
  companyName?: string;
  description?: string;
  longitude!: number;
  latitude!: number;
  status?: number;
}
export class RentStationsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<RentStation[]>;
}
export class RentStationResponse extends RentStation {
  statusCode?: number;
  message?: string;
  body!: RentStation;
}
