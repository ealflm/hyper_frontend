import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { StationsResponse } from '../models/StationResponse';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  stationApiURL = environment.apiURL + 'admin/stations';
  rentStationApiUrl = environment.apiURL + 'admin/rent-station';
  driverApiUrl = environment.apiURL + 'admin/drivers';
  constructor(private http: HttpClient) {}
  getAllStation(): Observable<StationsResponse> {
    return this.http.get<StationsResponse>(`${this.stationApiURL}`);
  }
}
