import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceTypeService {
  apiURL = environment.apiURL + 'admin/service-type';
  constructor(private http: HttpClient) {}
  getAllServiceType(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}`);
  }
}
