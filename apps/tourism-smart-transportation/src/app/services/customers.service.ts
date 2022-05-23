import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomersResponse } from '../models/CustomerResponse';
import { PartnersResponse } from '../models/PartnerResponse';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  apiURL = environment.apiURL + 'admin/customers';
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
}
