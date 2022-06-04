import { UtilPaging } from './UtilPaging';
export class Station {
  id!: string;
  title?: string;
  description?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  status?: number;
}

export class StationsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Station[]>;
}
export class StationResponse {
  statusCode?: number;
  message?: string;
  body!: Station;
}
