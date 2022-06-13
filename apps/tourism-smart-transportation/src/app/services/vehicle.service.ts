import { HttpClient } from '@angular/common/http';
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
  getListVehicle(): Observable<any> {
    return this.http.get(`${this.apiURLTrackingVehicle}`);
  }
}
