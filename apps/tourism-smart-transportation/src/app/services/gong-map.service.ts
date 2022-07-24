import { query } from '@angular/animations';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GongMapService {
  geocodeApi_url = environment.gongmap.api_URL + 'Geocode';
  api_key = environment.gongmap.api_key;
  constructor(private http: HttpClient) {}
  getAddressAutoCompleGongMap(latlng: string): Observable<any> {
    let queryParams = new HttpParams();
    if (latlng) {
      queryParams = queryParams.append('latlng', latlng);
      queryParams = queryParams.append('api_key', this.api_key);
    }
    return this.http.get(`${this.geocodeApi_url}`, {
      params: queryParams,
    });
  }
}
