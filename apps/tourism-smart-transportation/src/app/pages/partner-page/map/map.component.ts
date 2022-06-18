import { Subscription } from 'rxjs';
import { Route } from './../../../models/RouteResponse';
import { Vehicle } from './../../../models/VehicleResponse';
import { RentStation } from './../../../models/RentStationResponse';
import { Station } from './../../../models/StationResponse';
import { MenuDataMap } from './../../../constant/menu-filter-status';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { MapBoxService } from '../../../services/map-box.service';

@Component({
  selector: 'tourism-smart-transportation-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  coordinates: any;

  headerMenu = MenuDataMap;
  fillterMenu?: string = 'vehicle';
  //
  // fillterDriverName = '';
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
  idStation = '';
  checkBoxValue: string[] = [];

  currentRentStationMarkers: any = [];
  currentBusStationMarkers: any = [];
  geojson: any;
  trackingIntervel: any;

  private subscription?: Subscription;
  constructor(private mapboxService: MapBoxService) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.mapboxService.initializeMap(103.9967, 10.22698, 12);
  }
  ngAfterViewChecked(): void {
    this.mapboxService.map.resize();
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
      // this.getAllStations();
    } else if (this.fillterMenu === 'rent-station') {
      // this.getAllRentStations();
    } else if (this.fillterMenu === 'vehicle') {
      // this.getAllVehicles();
    } else if (this.fillterMenu === 'route') {
      // this.getAllRoutes();
    }
  }

  onGetValueCheckBox(valueCheckbox: []) {
    // console.log(valueCheckbox);

    this.checkBoxValue = valueCheckbox;
    if (valueCheckbox.length <= 0) {
      // clearInterval(this.trackingIntervel);
      // this.removeBusStationMarker();
      // this.removeRentStationMarker();
      // this.mapboxService.removeLayerTracking();
    } else if (valueCheckbox.length > 0) {
      // this.getBusStationMarkers();
      // this.getRentStationMarkers();
      switch (valueCheckbox.sort().join('-')) {
        case 'vehicle':
          // clearInterval(this.trackingIntervel);
          // this.removeBusStationMarker();
          // this.removeRentStationMarker();
          // this.trackingIntervel = setInterval(() => {
          //   this.getVehicleTrackingOnMap();
          // }, 2000);
          break;
        case 'bus-station':
          // clearInterval(this.trackingIntervel);
          // this.mapboxService.removeLayerTracking();
          // this.removeBusStationMarker();
          // this.setBusStationMarkers(this.busStationsOnMap);
          // this.removeRentStationMarker();

          break;
        case 'rent-station':
          // clearInterval(this.trackingIntervel);
          // this.mapboxService.removeLayerTracking();
          // this.removeRentStationMarker();
          // this.setRentStationMarkers(this.rentStationsOnMap);
          // this.removeBusStationMarker();
          break;
        case 'rent-station-vehicle':
          // clearInterval(this.trackingIntervel);
          // this.removeBusStationMarker();
          // this.setRentStationMarkers(this.rentStationsOnMap);
          // this.trackingIntervel = setInterval(() => {
          //   this.getVehicleTrackingOnMap();
          // }, 2000);
          break;
        case 'bus-station-vehicle':
          // clearInterval(this.trackingIntervel);
          // this.removeRentStationMarker();
          // this.setBusStationMarkers(this.busStationsOnMap);
          // this.trackingIntervel = setInterval(() => {
          //   this.getVehicleTrackingOnMap();
          // }, 2000);
          break;
        case 'bus-station-rent-station':
          // clearInterval(this.trackingIntervel);
          // this.mapboxService.removeLayerTracking();
          // this.removeRentStationMarker();
          // this.removeBusStationMarker();
          // this.setBusStationMarkers(this.busStationsOnMap);
          // this.setRentStationMarkers(this.rentStationsOnMap);
          break;
        case 'bus-station-rent-station-vehicle':
          // clearInterval(this.trackingIntervel);
          // this.setBusStationMarkers(this.busStationsOnMap);
          // this.setRentStationMarkers(this.rentStationsOnMap);
          // this.trackingIntervel = setInterval(() => {
          //   this.getVehicleTrackingOnMap();
          // }, 2000);
          break;
        default:
          // clearInterval(this.trackingIntervel);
          // this.mapboxService.removeLayerTracking();
          // this.removeBusStationMarker();
          // this.removeRentStationMarker();
          break;
      }
    }
  }
  // onFillterDriverByName(name: any) {}
  onFillterVehicleByName(name: any) {
    // this.getAllVehicles(name);
  }
  onFillterStationByName(title: any) {
    // this.getAllStations(title);
  }
  onFillterRentStationByName(title: any) {
    // this.getAllRentStations(title);
  }
  onFillterRouteByName(name: any) {
    // this.getAllRoutes(name);
  }
  getDetailVehicle(event: any) {}

  getDetailStation(event: any) {}
  getDetailRentStation(event: any) {}
  getDetailRoute(event: any) {}
  createRentStation() {}
  onEditRentStation(event: any) {}
  onHiddenDialog() {
    this.idStation = '';
    this.showDialog = false;
    this.onShowSideBarList();
    // this.getAllStations();
  }
}
