import {
  PublishYear,
  PublishYearResponse,
  PublishYearsResponse,
} from './../models/PublishYearResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PublishYearService {
  apiUrl = environment.apiURL + 'admin/publish-year';
  constructor(private http: HttpClient) {}
  getListPublishYear(status?: number | null): Observable<PublishYearsResponse> {
    let queryParams = new HttpParams();
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    return this.http.get<PublishYearsResponse>(`${this.apiUrl}`, {
      params: queryParams,
    });
  }
  getPublishYearById(id: string): Observable<PublishYearResponse> {
    return this.http.get<PublishYearResponse>(`${this.apiUrl}/${id}`);
  }
  createPublishYear(publishYear: PublishYear): Observable<any> {
    return this.http.post<PublishYear>(`${this.apiUrl}`, publishYear);
  }
  updatePublishYearById(id: string, publishYear: PublishYear): Observable<any> {
    return this.http.put<PublishYear>(`${this.apiUrl}/${id}`, publishYear);
  }
  deletePublishYearByid(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
