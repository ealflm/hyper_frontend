import {
  RentingPrice,
  RentingPriceResponse,
  RentingPricesResponse,
} from './../models/RentingPriceResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RentingConfigService {
  apiURL = environment.apiURL + 'admin/price-renting-service-config';
  constructor(private http: HttpClient) {}
  getListRentingConfig(
    status?: number | null
  ): Observable<RentingPricesResponse> {
    let queryParams = new HttpParams();
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    return this.http.get<RentingPricesResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }

  getRentingConfigById(id: string): Observable<RentingPriceResponse> {
    return this.http.get<RentingPriceResponse>(`${this.apiURL}/${id}`);
  }
  deleteRentingConfig(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
  createRentingConfig(rentingPrice: RentingPrice): Observable<any> {
    return this.http.post<RentingPrice>(`${this.apiURL}`, rentingPrice);
  }
  updateRentingConfig(id: string, rentingPrice: RentingPrice): Observable<any> {
    return this.http.put<RentingPrice>(`${this.apiURL}/${id}`, rentingPrice);
  }
}
