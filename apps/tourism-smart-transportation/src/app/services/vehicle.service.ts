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
  adminTrackingVehicleAPI = environment.apiURL + 'admin/tracking-vehicle';
  adminUrlVehicleAPI = environment.apiURL + 'admin/vehicle';
  //
  partnerUrlVehicleAPI = environment.apiURL + 'partner/vehicle';
  partnerUrlDriverAPI = environment.apiURL + 'partner/driver';
  constructor(private http: HttpClient) {}
  // ADMIN
  getListVehicle(name?: string | null): Observable<VehiclesResponse> {
    return this.http.get<VehiclesResponse>(`${this.adminUrlVehicleAPI}`);
  }
  getListVehicleTracking(): Observable<any> {
    return this.http.get(`${this.adminTrackingVehicleAPI}`);
  }
  getVehicleById(id: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.adminUrlVehicleAPI}/${id}`);
  }
  getVehicleTrackingById(id: string): Observable<any> {
    return this.http.get(`${this.adminTrackingVehicleAPI}/${id}`);
  }
  getListVehicleByPartnerId(
    partnerId?: string | null
  ): Observable<VehiclesResponse> {
    let queryParams = new HttpParams();
    if (partnerId != null) {
      queryParams = queryParams.append('PartnerId', partnerId);
    }
    return this.http.get<VehiclesResponse>(`${this.adminUrlVehicleAPI}`, {
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
    return this.http.get<VehiclesResponse>(`${this.partnerUrlVehicleAPI}`, {
      params: queryParams,
    });
  }
  getListVehicleDropdownForPartner(
    partnerId: string,
    serviceTypeId: string
  ): Observable<VehiclesResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PartnerId', partnerId);
    queryParams = queryParams.append('ServiceTypeId', serviceTypeId);

    return this.http.get<VehiclesResponse>(
      `${this.partnerUrlDriverAPI}/vehicle-dropdown-options`,
      {
        params: queryParams,
      }
    );
  }
  createVehicleForPartner(vehicle: Vehicle): Observable<any> {
    return this.http.post<Vehicle>(`${this.partnerUrlVehicleAPI}`, vehicle);
  }
  getVehicleByIdForPartner(id: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.partnerUrlVehicleAPI}/${id}`);
  }
  updateVehicleForPartner(
    vehicleId: string,
    vehicle: Vehicle
  ): Observable<any> {
    return this.http.put<Vehicle>(
      `${this.partnerUrlVehicleAPI}/${vehicleId}`,
      vehicle
    );
  }
  deleteVehicleForPartner(vehicleId: string): Observable<any> {
    return this.http.delete(`${this.partnerUrlVehicleAPI}/${vehicleId}`);
  }
}
