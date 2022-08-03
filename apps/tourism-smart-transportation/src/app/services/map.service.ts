import {
  VehicleTracking,
  VehicleTrackingResponse,
  VehicleTrackingsResponse,
} from './../models/VehicleTrackingResponse';
import { VehicleResponse } from './../models/VehicleResponse';
import { VehiclesResponse } from './../models/VehicleResponse';
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
  mapboxAPIDirection = 'https://api.mapbox.com/directions';
  //API for admin
  stationApiURL = environment.apiURL + 'admin/stations';
  rentStationApiUrl = environment.apiURL + 'admin/rent-station';
  routeApiUrl = environment.apiURL + 'admin/route';
  // Tracking vehicle
  vehicleApiUrl = environment.apiURL + 'admin/vehicle';
  vehicleAdminTrackingApiUrl = environment.apiURL + 'admin/tracking-vehicle';
  vehicleIdAminTrackingApiUrl =
    environment.apiURL + 'admin/tracking-vehicle/vehicle';

  // API for partner
  partnerApiRentStationUrl = environment.apiURL + 'partner/rent-station';
  partnerApiStation = environment.apiURL + 'partner/station';
  partnerApiRoute = environment.apiURL + 'partner/routes';
  // tracking vehicle by parter id
  partnerApiVehicle = environment.apiURL + 'partner/vehicle';
  partnerApiTrackingVehicle = environment.apiURL + 'partner/tracking-vehicle';
  partnerVehicleIdTrackingApiUrl =
    environment.apiURL + 'partner/tracking-vehicle/vehicle';
  constructor(private http: HttpClient) {}
  //API FOR ADMIN
  // station
  getAllStation(title?: string): Observable<StationsResponse> {
    let queryParams = new HttpParams();
    if (title) {
      queryParams = queryParams.append('Title', title);
    }
    queryParams = queryParams.append('Status', 1);
    return this.http.get<StationsResponse>(`${this.stationApiURL}`, {
      params: queryParams,
    });
  }
  getStationOnMap(): Observable<StationsResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Status', 1);
    return this.http.get<StationsResponse>(`${this.stationApiURL}`, {
      params: queryParams,
    });
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
  deleteStation(idStation: string): Observable<any> {
    return this.http.delete(`${this.stationApiURL}/${idStation}`);
  }
  // rent-station
  getAllRentStation(title?: string): Observable<RentStationsResponse> {
    let queryParams = new HttpParams();
    if (title) {
      queryParams = queryParams.append('Title', title);
    }
    queryParams = queryParams.append('Status', 1);
    return this.http.get<RentStationsResponse>(`${this.rentStationApiUrl}`, {
      params: queryParams,
    });
  }
  getRentStationOnMap(): Observable<RentStationsResponse> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('Status', 1);
    return this.http.get<RentStationsResponse>(`${this.rentStationApiUrl}`, {
      params: queryParams,
    });
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
    queryParams = queryParams.append('Status', 1);
    return this.http.get<RentStationsResponse>(`${this.routeApiUrl}`, {
      params: queryParams,
    });
  }
  getRouteById(routeId: string): Observable<RouteResponse> {
    return this.http.get<RouteResponse>(`${this.routeApiUrl}/${routeId}`);
  }
  getRouteDirection(coordinates: string): Observable<any> {
    return this.http.get<any>(
      `${this.mapboxAPIDirection}/v5/mapbox/driving-traffic/${coordinates}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${environment.mapbox.accessToken}`
    );
  }
  // getAllVehicle
  getListVehicle(vehicleName?: string): Observable<VehiclesResponse> {
    let queryParams = new HttpParams();
    if (vehicleName) {
      queryParams = queryParams.append('Name', vehicleName);
    }
    // queryParams = queryParams.append('Status', 1);
    return this.http.get<VehiclesResponse>(`${this.vehicleApiUrl}`, {
      params: queryParams,
    });
  }
  getVehicleById(id: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.vehicleApiUrl}/${id}`);
  }
  getVehicleTrackingOnMap(): Observable<VehicleTracking[]> {
    return this.http.get<VehicleTracking[]>(
      `${this.vehicleAdminTrackingApiUrl}`
    );
  }
  getVehicleTrackingById(id: string): Observable<VehicleTrackingResponse> {
    let queryParams = new HttpParams();
    if (id) {
      queryParams = queryParams.append('vehicleId', id);
    }
    return this.http.get<VehicleTrackingResponse>(
      `${this.vehicleIdAminTrackingApiUrl}`,
      { params: queryParams }
    );
  }

  //  API FOR PARTNER
  // Rentstation
  getListRentStationForPartner(
    partnerId?: string,
    title?: string | null,
    status?: number | null
  ): Observable<RentStationsResponse> {
    let queryParams = new HttpParams();
    if (partnerId != null) {
      queryParams = queryParams.append('PartnerId', partnerId);
    }
    if (title != null) {
      queryParams = queryParams.append('Title', title);
    }
    if (status != null) {
      queryParams = queryParams.append('Status', status);
    }
    return this.http.get<RentStationsResponse>(
      `${this.partnerApiRentStationUrl}`,
      { params: queryParams }
    );
  }
  getRentStationDetailForPartner(
    rentStationId: string
  ): Observable<RentStationResponse> {
    return this.http.get<RentStationResponse>(
      `${this.partnerApiRentStationUrl}/${rentStationId}`
    );
  }
  createRentStationForPartner(rentStation: RentStation): Observable<any> {
    return this.http.post<RentStation>(
      `${this.partnerApiRentStationUrl}`,
      rentStation
    );
  }
  deleteRentStationForPartner(rentStationId: string): Observable<any> {
    return this.http.delete(
      `${this.partnerApiRentStationUrl}/${rentStationId}`
    );
  }
  updateRentStationForPartner(
    rentStationId: string,
    rentStation: RentStation
  ): Observable<any> {
    return this.http.put<RentStation>(
      `${this.partnerApiRentStationUrl}/${rentStationId}`,
      rentStation
    );
  }
  // STATION PARTNER
  getListStationForPartner(title?: string): Observable<StationsResponse> {
    let queryParams = new HttpParams();
    if (title) {
      queryParams = queryParams.append('Title', title);
    }
    queryParams = queryParams.append('Status', 1);
    return this.http.get<StationsResponse>(`${this.partnerApiStation}`, {
      params: queryParams,
    });
  }
  getStationByIdForPartner(id?: string): Observable<StationResponse> {
    return this.http.get<StationResponse>(`${this.partnerApiStation}/${id}`);
  }
  // VEHICLE FOR PARTNER
  getListVehicleForPartner(
    partnerId: string,
    vehicleName?: string | null
  ): Observable<VehiclesResponse> {
    let queryParams = new HttpParams();
    if (vehicleName) {
      queryParams = queryParams.append('Name', vehicleName);
    }
    queryParams = queryParams.append('PartnerId', partnerId);
    return this.http.get<VehiclesResponse>(`${this.partnerApiVehicle}`, {
      params: queryParams,
    });
  }
  getVehicleByIdForPartner(id: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.partnerApiVehicle}/${id}`);
  }
  getVehicleTrackingOnMapForPartner(
    partnerId: string
  ): Observable<VehicleTracking[]> {
    let queryParam = new HttpParams();
    if (partnerId) {
      queryParam = queryParam.append('partnerId', partnerId);
    }
    return this.http.get<VehicleTracking[]>(
      `${this.partnerApiTrackingVehicle}`,
      { params: queryParam }
    );
  }
  getVehicleTrackingByIdForPartner(
    vehicleId: string
  ): Observable<VehicleTrackingResponse> {
    let queryParams = new HttpParams();
    if (vehicleId) {
      queryParams = queryParams.append('vehicleId', vehicleId);
    }
    return this.http.get<VehicleTrackingResponse>(
      `${this.vehicleIdAminTrackingApiUrl}`,
      { params: queryParams }
    );
  }
  getListRoutesForPartner(
    partnerId: string,
    name?: string
  ): Observable<RoutesResponse> {
    let queryParam = new HttpParams();
    queryParam = queryParam.append('PartnerId', partnerId);
    if (name) {
      queryParam = queryParam.append('Name', name);
    }
    return this.http.get<RoutesResponse>(`${this.partnerApiRoute}`, {
      params: queryParam,
    });
  }
}
