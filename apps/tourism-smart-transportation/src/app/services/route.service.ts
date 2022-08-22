import { Observable } from 'rxjs';
import { Route, RoutesResponse } from './../models/RouteResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private partnerAPIRoute = environment.apiURL + 'partner/routes';
  constructor(private http: HttpClient) {}

  createRouteForPartner(route: Route): Observable<any> {
    return this.http.post<Route>(`${this.partnerAPIRoute}`, route);
  }
  creatRouteAlreadyForPartner(
    routeId: string,
    partnerId: string
  ): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('partnerId', partnerId);
    queryParams = queryParams.append('routeId', routeId);
    return this.http.get<Route>(`${this.partnerAPIRoute}`, {
      params: queryParams,
    });
  }
  getRouteForPartner(partnerID: string): Observable<RoutesResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PartnerId', partnerID);
    return this.http.get<RoutesResponse>(`${this.partnerAPIRoute}`, {
      params: queryParams,
    });
  }
}
