import { UtilPaging } from './UtilPaging';

export abstract class Station {
  id?: string;
  title?: string;
  description?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  status?: number;
}
export abstract class StationsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Station[]>;
}
export abstract class StationResponse {
  statusCode?: number;
  message?: string;
  body!: Station;
}
