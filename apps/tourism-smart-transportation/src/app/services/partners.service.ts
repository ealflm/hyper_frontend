import { catchError } from 'rxjs/operators';
import { Partner, PartnerResponse } from './../models/PartnerResponse';
import { map, Observable, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  apiURL = environment.apiURL + 'admin/companies';
  constructor(private http: HttpClient) {}
  getAllPartners(): Observable<PartnerResponse> {
    return this.http.get<PartnerResponse>(this.apiURL);
  }
  getPartnerById(id: string): Observable<Partner> {
    return this.http.get<Partner>(`${this.apiURL}/${id}`);
  }
  updatePartnerById(id: string, formData: FormData): Observable<any> {
    return this.http
      .put<Partner>(`${this.apiURL}/${id}`, formData)
      .pipe(catchError(this.errorMgmt));
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
