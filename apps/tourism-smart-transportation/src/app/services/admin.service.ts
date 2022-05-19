import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  apiURL = environment.apiURL + 'admin';
  constructor(private http: HttpClient) {}
  getAllAdmin(): Observable<any> {
    return this.http.get<any>(this.apiURL);
  }
}
