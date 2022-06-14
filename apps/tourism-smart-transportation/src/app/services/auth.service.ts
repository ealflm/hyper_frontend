import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = environment.apiURL + 'admin';
  apiURLPartner = environment.apiURL + 'partner';
  constructor(private http: HttpClient) {}
  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiURL}/authorization/login`, {
      userName: email,
      password: password,
    });
  }
  signWithPartner(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiURLPartner}/authorization/login`, {
      userName: username,
      password: password,
    });
  }
}
