import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  partnerWalletAPI = environment.apiURL + 'partner/profile/history';
  adminWalletAPI = environment.apiURL + 'admin/wallet';
  constructor(private http: HttpClient) {}
  getWalletAndHistoryPartner(partnerId: string): Observable<any> {
    return this.http.get(`${this.partnerWalletAPI}/${partnerId}`);
  }
}
