import { TransactionsResponse } from './../models/TransactionResponse';
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
  apiURLPayment = environment.apiURL + 'admin/transaction';
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
  getTransactionsByOrderId(orderId: string): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(
      `${this.apiURLPayment}/${orderId}`
    );
  }
}
