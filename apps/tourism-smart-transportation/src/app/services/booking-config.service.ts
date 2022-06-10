import {
  BookingPrice,
  BookingPriceResponse,
  BookingPricesResponse,
} from './../models/BookingPriceResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingConfigService {
  apiURL = environment.apiURL + 'admin/price-booking-service-config';
  constructor(private http: HttpClient) {}
  getListBookingConfig(
    status?: number | null
  ): Observable<BookingPricesResponse> {
    let queryParams = new HttpParams();
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }

    return this.http.get<BookingPricesResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
  getBookingPriceById(id: string): Observable<BookingPriceResponse> {
    return this.http.get<BookingPriceResponse>(`${this.apiURL}/${id}`);
  }
  deleteBookingPrice(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
  createBookingPrice(BookingPrice: BookingPrice): Observable<any> {
    return this.http.post<BookingPrice>(`${this.apiURL}`, BookingPrice);
  }
  updateBookingPrice(id: string, BookingPrice: BookingPrice): Observable<any> {
    return this.http.put<BookingPrice>(`${this.apiURL}/${id}`, BookingPrice);
  }
}
