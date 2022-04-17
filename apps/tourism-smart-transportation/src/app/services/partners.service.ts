import { Partner } from './../models/partner';
import { Observable, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  apiURL = environment.apiURL + 'admin/companies';
  constructor(private http: HttpClient) {}
  getAllPartners(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.apiURL);
  }
  getPartnerById(id: string): Observable<any> {
    return this.http.get<Partner>(`${this.apiURL}/${id}`);
  }
}
