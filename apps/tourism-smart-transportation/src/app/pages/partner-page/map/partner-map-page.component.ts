import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, map, of, Subscription, Observable, mergeMap } from 'rxjs';
import { Route } from '../../../models/RouteResponse';
import { Vehicle } from '../../../models/VehicleResponse';
import { RentStation } from '../../../models/RentStationResponse';
import { Station } from '../../../models/StationResponse';
import { MenuDataMap } from '../../../constant/menu-filter-status';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { MapBoxService } from '../../../services/map-box.service';
import { MapService } from '../../../services/map.service';
import { LocalStorageService } from '../../../auth/localstorage.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'tourism-smart-transportation-partner-map-page',
  templateUrl: './partner-map-page.component.html',
  styleUrls: ['./partner-map-page.component.scss'],
})
export class PartnerMapPageComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  coordinates: any;

  headerMenu = MenuDataMap;
  fillterMenu?: string = 'vehicle';
  //
  fillterVehicleName? = '';
  // fillterStationTitle = '';
  //
  showRightSideBarStatus = true;
  showSideBarList = true;
  showSideBarDetail = false;
  //
  showDialog = false;
  //
  busStationsOnMap: Station[] = [];
  rentStationsOnMap: RentStation[] = [];

  //
  // drivers: any = [];
  vehicles: Vehicle[] = [];
  stations: Station[] = [];
  rent_stations: RentStation[] = [];
  routes: Route[] = [];
  //
  stationDetail!: Station;
  rentStationDetail!: RentStation;
  routeDetail!: Route;
  vehicleDetail!: Vehicle;
  //
  rentStationId = '';
  checkBoxValue = '';

  currentRentStationMarkers: any = [];
  currentBusStationMarkers: any = [];
  geojson: any;
  trackingIntervel: any;
  partnerId = '';

  //

  private subscription?: Subscription;
  constructor(
    private mapboxService: MapBoxService,
    private mapService: MapService,
    private localStorageService: LocalStorageService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    if (user) {
      this.partnerId = user.id;
    }
    this.getListVehiclesByPartnerId();
    this.getListRentStationByPartnerId();
  }

  ngAfterViewInit(): void {
    this.mapboxService.initializeMap(103.9967, 10.22698, 12);
    this.getListRentStationByPartnerIdOnMap();
    this.getListStationByPartnerIdOnMap();
  }
  ngAfterViewChecked(): void {
    this.mapboxService.map.resize();
  }
  ngOnDestroy(): void {
    clearInterval(this.trackingIntervel);
  }
  showRightSideBar() {
    this.showRightSideBarStatus = !this.showRightSideBarStatus;
  }
  onCloseSibarList() {
    this.showSideBarList = false;
  }
  onHiddenSideBarDetail() {
    this.showSideBarDetail = false;
  }
  onShowSideBarList() {
    this.showSideBarList = true;
    this.showSideBarDetail = false;
    this.mapboxService.removeRoute();
  }
  onGetFillterMenu(event: any) {
    this.fillterMenu = event;
    this.showSideBarList = true;
    this.showSideBarDetail = false;
    // console.log(this.fillterMenu);

    if (this.fillterMenu === 'bus-station') {
      this.getListStation();
    } else if (this.fillterMenu === 'rent-station') {
      this.getListRentStationByPartnerId();
    } else if (this.fillterMenu === 'vehicle') {
      this.getListVehiclesByPartnerId();
    } else if (this.fillterMenu === 'route') {
      // this.getAllRoutes();
    }
  }

  onGetValueCheckBox(valueCheckbox: []) {
    if (valueCheckbox.length <= 0) {
      this.checkBoxValue = '';
      clearInterval(this.trackingIntervel);
      this.removeBusStationMarker();
      this.removeRentStationMarker();
      this.mapboxService.removeLayerTracking();
    } else if (valueCheckbox.length > 0) {
      this.getListStationByPartnerIdOnMap();
      this.getListRentStationByPartnerIdOnMap();
      switch (valueCheckbox.sort().join('-')) {
        case 'vehicle':
          clearInterval(this.trackingIntervel);
          this.removeBusStationMarker();
          this.removeRentStationMarker();
          this.trackingIntervel = setInterval(() => {
            this.getVehicleTrackingOnMap();
          }, 2000);
          break;
        case 'bus-station':
          clearInterval(this.trackingIntervel);
          this.mapboxService.removeLayerTracking();
          this.removeBusStationMarker();
          this.setBusStationMarkers(this.busStationsOnMap);
          this.removeRentStationMarker();

          break;
        case 'rent-station':
          clearInterval(this.trackingIntervel);
          this.mapboxService.removeLayerTracking();
          this.removeRentStationMarker();
          this.setRentStationMarkers(this.rentStationsOnMap);
          this.removeBusStationMarker();
          break;
        case 'rent-station-vehicle':
          clearInterval(this.trackingIntervel);
          this.removeBusStationMarker();
          this.setRentStationMarkers(this.rentStationsOnMap);
          this.trackingIntervel = setInterval(() => {
            this.getVehicleTrackingOnMap();
          }, 2000);
          break;
        case 'bus-station-vehicle':
          clearInterval(this.trackingIntervel);
          this.removeRentStationMarker();
          this.removeBusStationMarker();
          this.setBusStationMarkers(this.busStationsOnMap);
          this.trackingIntervel = setInterval(() => {
            this.getVehicleTrackingOnMap();
          }, 2000);
          break;
        case 'bus-station-rent-station':
          clearInterval(this.trackingIntervel);
          this.mapboxService.removeLayerTracking();
          this.removeRentStationMarker();
          this.removeBusStationMarker();
          this.setBusStationMarkers(this.busStationsOnMap);
          this.setRentStationMarkers(this.rentStationsOnMap);
          break;
        case 'bus-station-rent-station-vehicle':
          clearInterval(this.trackingIntervel);
          this.removeRentStationMarker();
          this.removeBusStationMarker();
          this.setBusStationMarkers(this.busStationsOnMap);
          this.setRentStationMarkers(this.rentStationsOnMap);
          this.trackingIntervel = setInterval(() => {
            this.getVehicleTrackingOnMap();
          }, 2000);
          break;
        default:
          clearInterval(this.trackingIntervel);
          this.mapboxService.removeLayerTracking();
          this.removeBusStationMarker();
          this.removeRentStationMarker();
          break;
      }
    }
  }
  // onFillterDriverByName(name: any) {}
  onFillterVehicleByName(name: string) {
    this.getListVehiclesByPartnerId(name);
  }
  onFillterStationByName(title: any) {
    this.getListStation(title);
  }
  onFillterRentStationByName(title: any) {
    this.getListRentStationByPartnerId(title);
  }
  onFillterRouteByName(name: any) {
    // this.getAllRoutes(name);
  }
  getDetailVehicle(event: any) {
    this.checkBoxValue = 'vehicle';
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    const callApiVehicleDetailForPartner = this.mapService
      .getVehicleByIdForPartner(event.id)
      .pipe(catchError((error: any) => of(error)));
    const callApiTrackingVehicleForPartner = this.mapService
      .getVehicleTrackingByIdForPartner(event.id)
      .pipe(catchError((error: any) => of(error)));
    forkJoin([
      callApiVehicleDetailForPartner,
      callApiTrackingVehicleForPartner,
    ]).subscribe(
      (res) => {
        this.vehicleDetail = {
          id: res[0]?.body.id,
          name: res[0]?.body.name,
          licensePlates: res[0]?.body.licensePlates,
          color: res[0]?.body.color,
          vehicleTypeName: res[0]?.body.vehicleTypeName,
          serviceTypeName: res[0]?.body.serviceTypeName,
          companyName: res[0]?.body.companyName,
          isRunning: res[0]?.body.isRunning,
          location: {
            longitude: res[1]?.body?.longitude,
            latitude: res[1]?.body?.latitude,
          },
          status: res[0]?.body?.status,
        };
        if (res[1]?.body?.longitude && res[1]?.body?.latitude) {
          this.mapboxService.flyToMarker(
            res[1]?.body?.longitude,
            res[1]?.body?.latitude
          );
        }
        console.log(this.vehicleDetail);
      },
      (error) => of(error)
    );
  }

  getDetailStation(event: any) {
    this.checkBoxValue = 'bus-station';
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    this.mapService
      .getStationByIdForPartner(event.id)
      .subscribe((stationRes) => {
        this.stationDetail = stationRes.body;
        if (stationRes.body.longitude && stationRes.body.latitude)
          this.mapboxService.flyToMarker(
            stationRes.body.longitude,
            stationRes.body.latitude
          );
      });
  }
  getDetailRentStation(event: any) {
    this.checkBoxValue = 'rent-station';
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    this.mapService
      .getRentStationDetailForPartner(event.id)
      .subscribe((rentStationRes) => {
        this.rentStationDetail = rentStationRes.body;
        if (rentStationRes.body.longitude && rentStationRes.body.latitude)
          this.mapboxService.flyToMarker(
            rentStationRes.body.longitude,
            rentStationRes.body.latitude
          );
      });
  }
  getDetailRoute(event: any) {
    this.checkBoxValue = 'route';
  }

  createRoute() {
    this.router.navigateByUrl('/partner/map/route');
  }
  createRentStation() {
    this.rentStationId = '';
    this.showDialog = true;
    this.mapboxService.initViewMiniMapPartner$.next(false);
  }
  onEditRentStation(rentStationId: string) {
    this.showDialog = true;
    this.mapboxService.initViewMiniMapPartner$.next(false);
    this.rentStationId = rentStationId;
  }

  onDeleteRentStation(rentStationId: string) {
    this.confirmationService.confirm({
      key: 'confirmDelete',
      accept: () => {
        this.mapService
          .deleteRentStationForPartner(rentStationId)
          .subscribe((res: any) => {
            if (res.statusCode === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã xóa trạm!',
              });
              this.mapService
                .getListRentStationForPartner(this.partnerId, null, 1)
                .subscribe((rentStationRes) => {
                  this.rentStationsOnMap = rentStationRes.body.items;
                  this.removeRentStationMarker();
                  this.setRentStationMarkers(this.rentStationsOnMap);
                });
            }
            this.onShowSideBarList();
            this.getListRentStationByPartnerId();
          });
      },
    });
  }
  onHiddenDialog(event: any) {
    this.rentStationId = '';
    this.showDialog = false;
    this.onShowSideBarList();
    if (event.successChange)
      this.mapService
        .getListRentStationForPartner(this.partnerId, null, 1)
        .subscribe((rentStationRes) => {
          this.rentStationsOnMap = rentStationRes.body.items;
          this.removeRentStationMarker();
          this.setRentStationMarkers(this.rentStationsOnMap);
        });
    this.getListRentStationByPartnerId();
  }
  // Call Api Rent Station
  getListRentStationByPartnerId(filterByTitle?: string) {
    this.mapService
      .getListRentStationForPartner(this.partnerId, filterByTitle, 1)
      .subscribe((rentStationRes) => {
        this.rent_stations = rentStationRes.body.items;
      });
  }
  getListRentStationByPartnerIdOnMap() {
    this.mapService
      .getListRentStationForPartner(this.partnerId, null, 1)
      .subscribe((rentStationRes) => {
        this.rentStationsOnMap = rentStationRes.body.items;
      });
  }
  //Set Marker on Map
  setRentStationMarkers(rentStations: RentStation[]) {
    rentStations.map((marker) => {
      const el = document.createElement('div');
      el.id = marker.id;
      const width = 40;
      const height = 40;
      el.className = 'marker-rent-station';
      el.style.backgroundImage = `url('../../../assets/image/rent-station.svg')`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';
      const markerDiv = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude] as [number, number])
        .addTo(this.mapboxService.map);
      markerDiv.getElement().addEventListener('click', () => {
        this.fillterMenu = 'rent-station';
        this.showSideBarList = false;
        this.showSideBarDetail = true;
        this.getDetailRentStation({ id: marker.id });
        if (marker.longitude && marker.latitude) {
          this.mapboxService.flyToMarker(marker.longitude, marker.latitude);
        }
      });
      this.currentRentStationMarkers.push(markerDiv);
    });
  }
  removeRentStationMarker() {
    if (this.currentRentStationMarkers !== null) {
      for (let i = this.currentRentStationMarkers.length - 1; i >= 0; i--) {
        this.currentRentStationMarkers[i].remove();
      }
    }
  }
  //CALL API STATION FORPARTNER
  getListStation(title?: string) {
    this.mapService.getListStationForPartner(title).subscribe((stationRes) => {
      this.stations = stationRes.body.items;
    });
  }
  getListStationByPartnerIdOnMap() {
    this.mapService.getListStationForPartner().subscribe((stationRes) => {
      this.busStationsOnMap = stationRes.body.items;
    });
  }
  setBusStationMarkers(busStations: Station[]) {
    busStations.map((marker) => {
      const elStationMarker = document.createElement('div');
      elStationMarker.id = marker.id;
      const width = 35;
      const height = 35;
      elStationMarker.className = 'marker';
      elStationMarker.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
      elStationMarker.style.width = `${width}px`;
      elStationMarker.style.height = `${height}px`;
      elStationMarker.style.backgroundSize = '100%';
      elStationMarker.style.cursor = 'pointer';

      const markerDiv = new mapboxgl.Marker(elStationMarker)
        .setLngLat([marker.longitude, marker.latitude] as [number, number])
        .addTo(this.mapboxService.map);
      markerDiv.getElement().addEventListener('click', () => {
        this.fillterMenu = 'bus-station';
        this.showSideBarList = false;
        this.showSideBarDetail = true;
        this.getDetailStation({ id: marker.id });
        if (marker.longitude && marker.latitude) {
          this.mapboxService.flyToMarker(marker.longitude, marker.latitude);
          markerDiv.getPopup();
        }
      });
      this.currentBusStationMarkers.push(markerDiv);
    });
  }
  removeBusStationMarker() {
    if (this.currentBusStationMarkers !== null) {
      for (let i = this.currentBusStationMarkers.length - 1; i >= 0; i--) {
        this.currentBusStationMarkers[i].remove();
      }
    }
  }
  getListVehiclesByPartnerId(vehicleName?: string) {
    this.fillterVehicleName = vehicleName;
    this.mapService
      .getListVehicleForPartner(this.partnerId, this.fillterVehicleName)
      .subscribe((res) => {
        this.vehicles = res.body;
      });
  }
  getVehicleTrackingOnMap() {
    this.mapService
      .getVehicleTrackingOnMapForPartner(this.partnerId)
      .pipe(
        map((vehicleTracking) => {
          const geojson = vehicleTracking.map((vehicle) => {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [vehicle.longitude, vehicle.latitude],
              },
            };
          });

          this.geojson = {
            type: 'FeatureCollection',
            features: geojson,
          };
        })
      )
      .subscribe(() => {
        this.mapboxService.trackingVehicle(this.geojson);
      });
  }
}
