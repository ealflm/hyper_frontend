import { Station } from './StationResponse';
import { UtilPaging } from './UtilPaging';
export class Route {
  id?: string;
  partnerId?: string;
  name?: string;
  totalStation?: number;
  distance?: number;
  stationList?: Station[];
  status?: number;
}
export class RoutesResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Route[]>;
}

export class RouteResponse {
  statusCode?: number;
  message?: string;
  body!: Route;
}
