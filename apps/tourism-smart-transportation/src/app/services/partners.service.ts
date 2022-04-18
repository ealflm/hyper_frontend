import { Partner, PartnerResponse } from './../models/PartnerResponse';
import { map, Observable, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  getPartnerById(id: string): Observable<any> {
    return this.http.get<Partner>(`${this.apiURL}/${id}`);
  }
}
