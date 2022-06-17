import {
  Category,
  CategoryResponse,
  CategorysResponse,
} from './../models/CategoryResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategorySerivce {
  apiURL = environment.apiURL + 'admin/category';
  partnerApiUrl = environment.apiURL + 'partner/get-config/categories';
  constructor(private http: HttpClient) {}
  getListCategory(
    name?: string | null,
    status?: number | null
  ): Observable<CategorysResponse> {
    let queryParams = new HttpParams();
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    if (name != null) {
      queryParams = queryParams.append('Name', name);
    }
    return this.http.get<CategorysResponse>(`${this.apiURL}`, {
      params: queryParams,
    });
  }
  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiURL}/${id}`);
  }
  createCategory(category: Category): Observable<any> {
    return this.http.post<Category>(`${this.apiURL}`, category);
  }
  updateCategory(id: string, category: Category): Observable<any> {
    return this.http.put<Category>(`${this.apiURL}/${id}`, category);
  }
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
  getListCategoryForPartner(): Observable<CategorysResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Status', 1);
    return this.http.get<CategorysResponse>(`${this.partnerApiUrl}`, {
      params: queryParams,
    });
  }
}
