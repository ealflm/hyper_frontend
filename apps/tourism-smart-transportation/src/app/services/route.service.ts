import { Observable } from 'rxjs';
import { Route } from './../models/RouteResponse';
import { HttpClient } from '@angular/common/http';
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
}
