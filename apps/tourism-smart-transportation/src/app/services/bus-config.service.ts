import { BusPriceResponse } from './../models/BusPriceResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { BusPrice, BusPricesResponse } from '../models/BusPriceResponse';

@Injectable({
  providedIn: 'root',
})
export class BusConfigService {
  apiUrl = environment.apiURL + 'admin/price-bus-service-config';
  constructor(private http: HttpClient) {}
  getListBusPrice(status?: number | null): Observable<BusPricesResponse> {
    let queryParams = new HttpParams();
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    return this.http.get<BusPricesResponse>(`${this.apiUrl}`, {
      params: queryParams,
    });
  }
  getBusPriceById(id: string): Observable<BusPriceResponse> {
    return this.http.get<BusPriceResponse>(`${this.apiUrl}/${id}`);
  }
  deleteBusPrice(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  createBusPrice(busPrice: BusPrice): Observable<any> {
    return this.http.post<BusPrice>(`${this.apiUrl}`, busPrice);
  }
  updateBusPrice(id: string, busPrice: BusPrice): Observable<any> {
    return this.http.put<BusPrice>(`${this.apiUrl}/${id}`, busPrice);
  }
}
