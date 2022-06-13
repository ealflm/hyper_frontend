import { VehicleResponse, VehiclesResponse } from './../models/VehicleResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  apiURLTrackingVehicle = environment.apiURL + 'admin/tracking-vehicle';
  apiURLVehicle = environment.apiURL + 'admin/vehicle';
  constructor(private http: HttpClient) {}
  getListVehicle(name?: string | null): Observable<VehiclesResponse> {
    return this.http.get<VehiclesResponse>(`${this.apiURLVehicle}`);
  }
  getListVehicleTracking(): Observable<any> {
    return this.http.get(`${this.apiURLTrackingVehicle}`);
  }
  getVehicleById(id: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiURLVehicle}/${id}`);
  }
  getVehicleTrackingById(id: string): Observable<any> {
    return this.http.get(`${this.apiURLTrackingVehicle}/${id}`);
  }
  getListVehicleByPartnerId(
    partnerId?: string | null
  ): Observable<VehiclesResponse> {
    let queryParams = new HttpParams();
    if (partnerId != null) {
      queryParams = queryParams.append('PartnerId', partnerId);
    }
    return this.http.get<VehiclesResponse>(`${this.apiURLVehicle}`, {
      params: queryParams,
    });
  }
}
