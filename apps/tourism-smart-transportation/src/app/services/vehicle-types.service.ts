import {
  VehicleType,
  VehicleTypeResponse,
  VehicleTypesResponse,
} from './../models/VehicleTypeResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VehicleTypesService {
  apiURL = environment.apiURL + 'admin/vehicles/types';
  partnerApiURL = environment.apiURL + 'partner/get-config/vehicle-types';
  constructor(private http: HttpClient) {}
  getAllVehicleType(
    label?: string,
    status?: number | null
  ): Observable<VehicleTypesResponse> {
    let queryParams = new HttpParams();
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    if (label != null) {
      queryParams = queryParams.append('Label', label);
    }
    return this.http.get<VehicleTypesResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
  getVehicleById(id: string): Observable<VehicleTypeResponse> {
    return this.http.get<VehicleTypeResponse>(`${this.apiURL}/${id}`);
  }
  createVehicleType(vehicleType: VehicleType): Observable<any> {
    return this.http.post<VehicleType>(`${this.apiURL}`, vehicleType);
  }
  updateVehicleType(id: string, vehicleType: VehicleType): Observable<any> {
    return this.http.put<VehicleType>(`${this.apiURL}/${id}`, vehicleType);
  }
  deleteVehicleType(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  getListVehicleTypeForPartner(
    status?: number | null
  ): Observable<VehicleTypesResponse> {
    let queryParams = new HttpParams();
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    return this.http.get<VehicleTypesResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
}
