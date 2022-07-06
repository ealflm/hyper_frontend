import { Trip, TripsResponse } from './../models/TripResponse';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  partnerTripAPI = environment.apiURL + 'partner/trip';
  constructor(private http: HttpClient) {}
  getListTrip(
    partnerId: string,
    tripName?: string | null
  ): Observable<TripsResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('PartnerId', partnerId);
    if (tripName != null) {
      queryParams = queryParams.append('TripName', tripName);
    }
    return this.http.get<TripsResponse>(`${this.partnerTripAPI}`, {
      params: queryParams,
    });
  }
  createTrip(trip: Trip): Observable<any> {
    return this.http.post<Trip>(`${this.partnerTripAPI}`, trip);
  }
}
