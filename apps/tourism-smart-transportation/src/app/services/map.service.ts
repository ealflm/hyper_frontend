import { RouteResponse, RoutesResponse } from './../models/RouteResponse';
import {
  RentStation,
  RentStationResponse,
  RentStationsResponse,
} from './../models/RentStationResponse';
import {
  Station,
  StationResponse,
  StationsResponse,
} from './../models/StationResponse';
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
  getAllRentStation(title?: string): Observable<RentStationsResponse> {
    let queryParams = new HttpParams();
    if (title) {
      queryParams = queryParams.append('Title', title);
    }
    return this.http.get<RentStationsResponse>(`${this.rentStationApiUrl}`, {
      params: queryParams,
    });
  }
  getRentStationOnMap(): Observable<RentStationsResponse> {
    return this.http.get<RentStationsResponse>(`${this.rentStationApiUrl}`);
  }
  getRentStationById(id: string): Observable<RentStationResponse> {
    return this.http.get<RentStationResponse>(
      `${this.rentStationApiUrl}/${id}`
    );
  }

  // get all route
  getAllRoutes(name?: string): Observable<RoutesResponse> {
    let queryParams = new HttpParams();
    if (name) {
      queryParams = queryParams.append('Name', name);
    }
    return this.http.get<RentStationsResponse>(`${this.routeApiUrl}`, {
      params: queryParams,
    });
  }
  getRouteById(routeId: string): Observable<RouteResponse> {
    return this.http.get<RouteResponse>(`${this.routeApiUrl}/${routeId}`);
  }
  getRouteDirection(coordinates: string): Observable<any> {
    return this.http.get<any>(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coordinates}?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=${environment.mapbox.accessToken}`
    );
  }
}
