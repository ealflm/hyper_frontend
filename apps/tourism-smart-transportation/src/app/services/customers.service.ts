import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  Customer,
  CustomerResponse,
  CustomersResponse,
} from '../models/CustomerResponse';
import { PartnersResponse } from '../models/PartnerResponse';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  apiURL = environment.apiURL + 'admin/customers';
  apiCusTierHis = environment.apiURL + 'admin/cus-tier-his';
  constructor(private http: HttpClient) {}
  getAllCustomers(
    lastName?: string | null,
    phone?: string | null,
    status?: number | null,
    pageIndex?: number | null,
    itemsPerPage?: number | null,
    sortBy?: string | null
  ): Observable<CustomersResponse> {
    let queryParams = new HttpParams();
    if (lastName != null) {
      queryParams = queryParams.append('LastName', lastName);
    }
    if (phone != null) {
      queryParams = queryParams.append('Phone', phone);
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
    return this.http.get<PartnersResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }

  deleteCustomerById(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
  getCustomerById(id: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiURL}/${id}`);
  }
  updateCustomerById(id: string, formCusData: FormData): Observable<any> {
    return this.http.put<Customer>(`${this.apiURL}/${id}`, formCusData);
  }
  getTierByCustomerId(id: string): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('CustomerId', id ? id : '');
    return this.http.get(`${this.apiCusTierHis}`, { params: queryParams });
  }
}
