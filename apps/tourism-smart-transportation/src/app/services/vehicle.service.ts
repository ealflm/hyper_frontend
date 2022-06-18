import { query } from '@angular/animations';
import {
  Vehicle,
  VehicleResponse,
  VehiclesResponse,
} from './../models/VehicleResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  adminApiURLTrackingVehicle = environment.apiURL + 'admin/tracking-vehicle';
  adminApiURLVehicle = environment.apiURL + 'admin/vehicle';
  //
  partnerApiURLVehicle = environment.apiURL + 'partner/vehicle';
  constructor(private http: HttpClient) {}
  // ADMIN
  getListVehicle(name?: string | null): Observable<VehiclesResponse> {
    return this.http.get<VehiclesResponse>(`${this.adminApiURLVehicle}`);
  }
  getListVehicleTracking(): Observable<any> {
    return this.http.get(`${this.adminApiURLTrackingVehicle}`);
  }
  getVehicleById(id: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.adminApiURLVehicle}/${id}`);
  }
  getVehicleTrackingById(id: string): Observable<any> {
    return this.http.get(`${this.adminApiURLTrackingVehicle}/${id}`);
  }
  getListVehicleByPartnerId(
    partnerId?: string | null
  ): Observable<VehiclesResponse> {
    let queryParams = new HttpParams();
    if (partnerId != null) {
      queryParams = queryParams.append('PartnerId', partnerId);
    }
    return this.http.get<VehiclesResponse>(`${this.adminApiURLVehicle}`, {
      params: queryParams,
    });
  }

  // Partner
  getListVehicleByPartnerIdForPartner(
    partnerID: string,
    name?: string | null,
    status?: number | null
  ): Observable<VehiclesResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PartnerId', partnerID);
    if (name != null) {
      queryParams = queryParams.append('Name', name);
    }
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    return this.http.get<VehiclesResponse>(`${this.partnerApiURLVehicle}`, {
      params: queryParams,
    });
  }
  createVehicleForPartner(vehicle: Vehicle): Observable<any> {
    return this.http.post<Vehicle>(`${this.partnerApiURLVehicle}`, vehicle);
  }
  getVehicleByIdForPartner(id: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.partnerApiURLVehicle}/${id}`);
  }
  updateVehicleForPartner(
    vehicleId: string,
    vehicle: Vehicle
  ): Observable<any> {
    return this.http.put<Vehicle>(
      `${this.partnerApiURLVehicle}/${vehicleId}`,
      vehicle
    );
  }
  deleteVehicleForPartner(vehicleId: string): Observable<any> {
    return this.http.delete(`${this.partnerApiURLVehicle}/${vehicleId}`);
  }
}
