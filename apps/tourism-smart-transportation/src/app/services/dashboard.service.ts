import { environment } from './../../environments/environment';
import { ConfigResponse } from './../models/ConfigResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class DashboardService {
  powerBIAPI = environment.apiURL + 'admin/power-bi';
  partnerDashBoardAPI = environment.apiURL + 'partner/dashboard';
  constructor(private httpClient: HttpClient) {}
  getEmbedConfig(endpoint: string): Observable<ConfigResponse> {
    return this.httpClient.get<ConfigResponse>(endpoint);
  }
  getEmbeddedTokenPowerBI(): Observable<any> {
    return this.httpClient.get(`${this.powerBIAPI}`);
  }
  getStatistic(partnerId?: string | null): Observable<any> {
    let queryParams = new HttpParams();
    if (partnerId != null) {
      queryParams = queryParams.append('PartnerId', partnerId);
    }
    return this.httpClient.get(`${this.partnerDashBoardAPI}/statistic`, {
      params: queryParams,
    });
  }
  getStatisticVehicleOfServiceType(partnerId?: string | null): Observable<any> {
    let queryParams = new HttpParams();
    if (partnerId != null) {
      queryParams = queryParams.append('PartnerId', partnerId);
    }
    return this.httpClient.get<any>(
      `${this.partnerDashBoardAPI}/vehicle-service-type`,
      {
        params: queryParams,
      }
    );
  }
  getRevenueOfMonthForPartner(partnerId?: string | null): Observable<any> {
    let queryParams = new HttpParams();
    if (partnerId != null) {
      queryParams = queryParams.append('PartnerId', partnerId);
    }
    return this.httpClient.get<any>(`${this.partnerDashBoardAPI}/revenue`, {
      params: queryParams,
    });
  }
}
