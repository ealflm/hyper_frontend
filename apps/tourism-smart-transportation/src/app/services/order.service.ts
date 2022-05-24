import { OrdersResponse } from './../models/OrderResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiURL = environment.apiURL + 'admin/order';
  constructor(private http: HttpClient) {}
  getOrderByCusId(idCus: string): Observable<OrdersResponse> {
    let queryParams = new HttpParams();
    if (idCus) {
      queryParams = queryParams.append('customerId', idCus);
    }
    return this.http.get<OrdersResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
}
