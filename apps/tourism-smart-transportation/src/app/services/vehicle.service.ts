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
  getListVehicle(name?: string | null): Observable<any> {
    return this.http.get(`${this.apiURLVehicle}`);
  }
  getListVehicleTracking(): Observable<any> {
    return this.http.get(`${this.apiURLTrackingVehicle}`);
  }
  getVehicleById(id: string): Observable<any> {
    return this.http.get(`${this.apiURLVehicle}/${id}`);
  }
  getVehicleTrackingById(id: string): Observable<any> {
    return this.http.get(`${this.apiURLTrackingVehicle}/${id}`);
  }
}
