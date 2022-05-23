import { catchError } from 'rxjs/operators';
import {
  Partner,
  PartnerResponse,
  PartnersResponse,
} from './../models/PartnerResponse';
import { map, Observable, retry, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpParams,
} from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  apiURL = environment.apiURL + 'admin/partners';
  constructor(private http: HttpClient) {}
  getAllPartners(
    userName?: string | null,
    status?: number | null,
    pageIndex?: number | null,
    itemsPerPage?: number | null,
    sortBy?: string | null
  ): Observable<PartnersResponse> {
    let queryParams = new HttpParams();
    if (userName != null) {
      queryParams = queryParams.append('Username', userName);
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
  getPartnerById(id?: string): Observable<PartnerResponse> {
    return this.http.get<PartnerResponse>(`${this.apiURL}/${id}`);
  }
  updatePartnerById(id: string, formData: FormData): Observable<any> {
    return this.http
      .put<Partner>(`${this.apiURL}/${id}`, formData)
      .pipe(catchError(this.errorMgmt));
  }
  deletePartnerById(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
  createPartner(partnerFromData: FormData): Observable<any> {
    return this.http.post<Partner>(`${this.apiURL}`, partnerFromData);
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
