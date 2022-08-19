import {
  Driver,
  DriverResponse,
  DriversResponse,
} from './../models/DriverResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  apiURL = environment.apiURL + 'admin/driver';
  partnerApiURL = environment.apiURL + 'partner/driver';
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

  getListDriverOfPartner(
    partnerId: string,
    filterName?: string | null,
    status?: number | null
  ): Observable<DriversResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PartnerId', partnerId);
    if (filterName != null) {
      queryParams = queryParams.append('FirstName', filterName);
    }
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    return this.http.get<DriversResponse>(`${this.partnerApiURL}`, {
      params: queryParams,
    });
  }
  // getDriverByPartnerIdDropdown(
  //   partnerId: string | null
  // ): Observable<DriversResponse> {
  //   let queryParams = new HttpParams();
  //   if (partnerId != null) {
  //     queryParams = queryParams.append('PartnerId', partnerId);
  //   }
  //   return this.http.get<DriversResponse>(
  //     `${this.partnerApiURL}/dropdown-options`,
  //     {
  //       params: queryParams,
  //     }
  //   );
  // }
  getDriverById(id: string): Observable<DriverResponse> {
    return this.http.get<DriverResponse>(`${this.partnerApiURL}/${id}`);
  }
  deleteDriverById(id: string): Observable<any> {
    return this.http.delete(`${this.partnerApiURL}/${id}`);
  }
  updateDriverById(id: string, driver: Driver): Observable<any> {
    return this.http.put(`${this.partnerApiURL}/${id}`, driver);
  }
  createDriver(driver: Driver): Observable<any> {
    return this.http.post<Driver>(`${this.partnerApiURL}`, driver);
  }
  getHistoryTrip(driverId: string): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('DriverId', driverId);
    return this.http.get<any>(`${this.partnerApiURL}/history-trip`, {
      params: queryParams,
    });
  }
}
