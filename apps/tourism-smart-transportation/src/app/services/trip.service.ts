import { Trip, TripsResponse } from './../models/TripResponse';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  partnerTripAPI = environment.apiURL + 'partner/trip';
  constructor(private http: HttpClient) {}
  createTrip(trip: Trip): Observable<any> {
    return this.http.post<Trip>(`${this.partnerTripAPI}`, trip);
  }
}
