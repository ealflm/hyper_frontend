import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import {
  Discount,
  DiscountResponse,
  DiscountsResponse,
} from '../models/DiscountResponse';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  apiURL = environment.apiURL + 'admin/discounts';
  constructor(private http: HttpClient) {}
  getAllDiscounts(
    Name?: string | null,
    status?: number | null,
    pageIndex?: number | null,
    itemsPerPage?: number | null,
    sortBy?: string | null
  ): Observable<DiscountsResponse> {
    let queryParams = new HttpParams();
    if (Name != null) {
      queryParams = queryParams.append('Title', Name);
    }
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    if (pageIndex != null) {
      queryParams = queryParams.append('PageIndex', pageIndex);
    }
    if (itemsPerPage != null) {
      queryParams = queryParams.append('ItemsPerPage', itemsPerPage);
    }
    if (sortBy != null) {
      queryParams = queryParams.append('SortBy', sortBy);
    }
    return this.http.get<DiscountsResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
  getDiscountById(id?: string): Observable<DiscountResponse> {
    return this.http.get<DiscountResponse>(`${this.apiURL}/${id}`);
  }
  updateDiscountById(id: string, formData: FormData): Observable<any> {
    return this.http.put<Discount>(`${this.apiURL}/${id}`, formData);
  }
  deleteDiscountById(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
  createDiscount(discountFromData: FormData): Observable<any> {
    return this.http.post<Discount>(`${this.apiURL}`, discountFromData);
  }
  sendDiscountForCustomer(discount: any): Observable<any> {
    return this.http.post(`${this.apiURL}/customer`, discount);
  }
}
