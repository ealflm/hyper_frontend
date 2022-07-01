import { OrderDetailsResponse } from './../models/OrderResponse';
import { OrdersResponse } from '../models/OrderResponse';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { PaymentsResponse } from '../models/PaymentResponse';

@Injectable({
  providedIn: 'root',
})
export class PurchaseHistoryService {
  apiURL = environment.apiURL + 'admin/order';
  apiURLPayment = environment.apiURL + 'admin/payment';
  apiURLOderDetail = environment.apiURL + 'admin/order-detail';
  constructor(private http: HttpClient) {}
  getOrderByCusId(idCus: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiURL}/${idCus}`);
  }
  getOrderDetailsByOrderId(orderId: string): Observable<OrderDetailsResponse> {
    return this.http.get<OrderDetailsResponse>(
      `${this.apiURLOderDetail}/${orderId}`
    );
  }
  getPaymentsByOrderId(orderId: string): Observable<PaymentsResponse> {
    let queryParams = new HttpParams();
    if (orderId) {
      queryParams = queryParams.append('orderId', orderId);
    }
    return this.http.get<PaymentsResponse>(`${this.apiURLPayment}`, {
      params: queryParams,
    });
  }
}
