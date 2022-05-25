import { OrdersResponse } from '../models/OrderResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { PaymentsResponse } from '../models/PaymentResponse';

@Injectable({
  providedIn: 'root',
})
export class PurchaseHistoryService {
  apiURL = environment.apiURL + 'admin/order';
  // đợi đổi tên api
  apiURLPayment = environment.apiURL + 'admin/payment';

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
  getOrderDetailsByOrderId(orderId: string) {}
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
