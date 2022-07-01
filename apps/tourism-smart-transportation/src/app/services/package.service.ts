import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PackagesResponse } from '../models/PackageResponse';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  apiURL = environment.apiURL + 'admin/package';
  constructor(private http: HttpClient) {}
  getAllPackage(
    name?: string | null,
    status?: number | null,
    pageIndex?: number | null,
    itemsPerPage?: number | null,
    sortBy?: string | null
  ): Observable<PackagesResponse> {
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
    return this.http.get<PackagesResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
  deletePackage(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
  createPackage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiURL}`, formData);
  }
  getPackageById(id: string): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }
  updatePackagebyId(PackageID: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiURL}/${PackageID}`, formData);
  }
}
