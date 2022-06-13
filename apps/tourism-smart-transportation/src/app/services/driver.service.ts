import { DriversResponse } from './../models/DriverResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  apiURL = environment.apiURL + 'admin/driver';
  constructor(private http: HttpClient) {}
  getListDriverByPartnerId(
    partnerId: string | null
  ): Observable<DriversResponse> {
    let queryParams = new HttpParams();
    if (partnerId != null) {
      queryParams = queryParams.append('PartnerId', partnerId);
    }
    return this.http.get<DriversResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
}
