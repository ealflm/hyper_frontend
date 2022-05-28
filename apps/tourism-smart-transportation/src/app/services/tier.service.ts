import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TierResponse, TiersResponse } from '../models/TierResponse';

@Injectable({
  providedIn: 'root',
})
export class TierService {
  apiURL = environment.apiURL + 'admin/tier';
  constructor(private http: HttpClient) {}
  getAllTier(
    name?: string | null,
    status?: number | null,
    pageIndex?: number | null,
    itemsPerPage?: number | null,
    sortBy?: string | null
  ): Observable<TiersResponse> {
    let queryParams = new HttpParams();
    if (name != null) {
      queryParams = queryParams.append('Name', name);
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
    return this.http.get<TiersResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
  deleteTier(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
  createTỉer(formData: FormData): Observable<any> {
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(`https://localhost:5001/api/v1.0/admin/tier`, formData,  { headers: headers});
  }
}
