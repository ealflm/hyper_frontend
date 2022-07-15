import { environment } from './../../environments/environment';
import { ConfigResponse } from './../models/ConfigResponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class DashboardService {
  powerBIAPI = environment.apiURL + 'admin/power-bi';

  constructor(private httpClient: HttpClient) {}
  getEmbedConfig(endpoint: string): Observable<ConfigResponse> {
    return this.httpClient.get<ConfigResponse>(endpoint);
  }
  getEmbeddedTokenPowerBI(): Observable<any> {
    return this.httpClient.get(`${this.powerBIAPI}`);
  }
}
