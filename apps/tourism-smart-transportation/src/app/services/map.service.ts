import {
  Station,
  StationResponse,
  StationsResponse,
} from './../models/Station';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  stationApiURL = environment.apiURL + 'admin/stations';
  rentStationApiUrl = environment.apiURL + 'admin/rent-station';
  driverApiUrl = environment.apiURL + 'admin/drivers';
  routeApiUrl = environment.apiURL + 'admin/route';
  constructor(private http: HttpClient) {}
  // station
  getAllStation(title?: string): Observable<StationsResponse> {
    let queryParams = new HttpParams();
    if (title) {
      queryParams = queryParams.append('Title', title);
    }
    return this.http.get<StationsResponse>(`${this.stationApiURL}`, {
      params: queryParams,
    });
  }
  getStationOnMap(): Observable<StationsResponse> {
    return this.http.get<StationsResponse>(`${this.stationApiURL}`);
  }
  getStationById(id?: string): Observable<StationResponse> {
    return this.http.get<StationResponse>(`${this.stationApiURL}/${id}`);
  }
  //
  createStation(station: Station): Observable<any> {
    return this.http.post<Station>(`${this.stationApiURL}`, station);
  }
  updateStation(idStation: string, station: Station): Observable<any> {
    return this.http.put<Station>(
      `${this.stationApiURL}/${idStation}`,
      station
    );
  }
  // rent-station
  getAllRentStation(title?: string): Observable<any> {
    let queryParams = new HttpParams();
    if (title) {
      queryParams = queryParams.append('Title', title);
    }
    return this.http.get<any>(`${this.rentStationApiUrl}`, {
      params: queryParams,
    });
  }
  getRentStationOnMap(): Observable<any> {
    return this.http.get<any>(`${this.stationApiURL}`);
  }
}
