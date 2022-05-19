import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = environment.apiURL + 'admin';
  constructor(private http: HttpClient) {}
  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiURL}/authorization/login`, {
      userName: email,
      password: password,
    });
  }
}
