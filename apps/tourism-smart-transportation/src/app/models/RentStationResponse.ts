import { UtilPaging } from './UtilPaging';
export class RentStation {
  id!: string;
  title?: string;
  address?: string;
  partnerId?: string;
  companyName?: string;
  longitude?: number;
  latitude?: number;
  status?: number;
}
export abstract class RentStationsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<RentStation[]>;
}
export abstract class RentStationResponse extends RentStation {
  statusCode?: number;
  message?: string;
  body!: RentStation;
}
