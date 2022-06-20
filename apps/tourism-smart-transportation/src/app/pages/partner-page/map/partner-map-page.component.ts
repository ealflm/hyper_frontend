import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
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
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    if (user) {
      this.partnerId = user.id;
    }
    this.getListRentStationByPartnerId();
    this.getListRentStationByPartnerIdOnMap();
  }

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
      this.getListRentStationByPartnerId();
    } else if (this.fillterMenu === 'vehicle') {
      // this.getAllVehicles();
    } else if (this.fillterMenu === 'route') {
      // this.getAllRoutes();
    }
  }

  onGetValueCheckBox(valueCheckbox: []) {
    // console.log(valueCheckbox);
    if (valueCheckbox.length <= 0) {
      this.checkBoxValue = '';
      // clearInterval(this.trackingIntervel);
      // this.removeBusStationMarker();
      this.removeRentStationMarker();
      // this.mapboxService.removeLayerTracking();
    } else if (valueCheckbox.length > 0) {
      // this.getBusStationMarkers();
      this.getListRentStationByPartnerIdOnMap();
      switch (valueCheckbox.sort().join('-')) {
        case 'vehicle':
          // clearInterval(this.trackingIntervel);
          // this.removeBusStationMarker();
          this.removeRentStationMarker();
          // this.trackingIntervel = setInterval(() => {
          //   this.getVehicleTrackingOnMap();
          // }, 2000);
          break;
        case 'bus-station':
          // clearInterval(this.trackingIntervel);
          // this.mapboxService.removeLayerTracking();
          // this.removeBusStationMarker();
          // this.setBusStationMarkers(this.busStationsOnMap);
          this.removeRentStationMarker();

          break;
        case 'rent-station':
          // clearInterval(this.trackingIntervel);
          // this.mapboxService.removeLayerTracking();
          this.removeRentStationMarker();
          this.setRentStationMarkers(this.rentStationsOnMap);
          // this.removeBusStationMarker();
          break;
        case 'rent-station-vehicle':
          // clearInterval(this.trackingIntervel);
          // this.removeBusStationMarker();
          this.setRentStationMarkers(this.rentStationsOnMap);
          // this.trackingIntervel = setInterval(() => {
          //   this.getVehicleTrackingOnMap();
          // }, 2000);
          break;
        case 'bus-station-vehicle':
          // clearInterval(this.trackingIntervel);
          this.removeRentStationMarker();
          // this.setBusStationMarkers(this.busStationsOnMap);
          // this.trackingIntervel = setInterval(() => {
          //   this.getVehicleTrackingOnMap();
          // }, 2000);
          break;
        case 'bus-station-rent-station':
          // clearInterval(this.trackingIntervel);
          // this.mapboxService.removeLayerTracking();
          this.removeRentStationMarker();
          // this.removeBusStationMarker();
          // this.setBusStationMarkers(this.busStationsOnMap);
          this.setRentStationMarkers(this.rentStationsOnMap);
          break;
        case 'bus-station-rent-station-vehicle':
          // clearInterval(this.trackingIntervel);
          // this.setBusStationMarkers(this.busStationsOnMap);
          this.setRentStationMarkers(this.rentStationsOnMap);
          // this.trackingIntervel = setInterval(() => {
          //   this.getVehicleTrackingOnMap();
          // }, 2000);
          break;
        default:
          // clearInterval(this.trackingIntervel);
          // this.mapboxService.removeLayerTracking();
          // this.removeBusStationMarker();
          this.removeRentStationMarker();
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
    this.getListRentStationByPartnerId(title);
  }
  onFillterRouteByName(name: any) {
    // this.getAllRoutes(name);
  }
  getDetailVehicle(event: any) {}

  getDetailStation(event: any) {}
  getDetailRentStation(event: any) {
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
  getDetailRoute(event: any) {}
  createRentStation() {
    this.rentStationId = '';
    this.showDialog = true;
    this.mapboxService.initView$.next(false);
  }
  onEditRentStation(rentStationId: string) {
    this.showDialog = true;
    this.mapboxService.initView$.next(false);
    this.rentStationId = rentStationId;
  }
  onDeleteRentStation(rentStationId: string) {
    this.confirmationService.confirm({
      key: 'confirmDelete',
      accept: () => {
        this.mapService
          .deleteRentStationForPartner(rentStationId)
          .subscribe((res) => {
            if (res.statusCode === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã xóa trạm!',
              });
              this.onShowSideBarList();
              this.getListRentStationByPartnerId();
            }
          });
      },
    });
  }
  onHiddenDialog() {
    this.rentStationId = '';
    this.showDialog = false;
    this.onShowSideBarList();
    // this.getAllStations();
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
      const width = 30;
      const height = 30;
      el.className = 'marker';
      el.style.backgroundImage = `url('../../../assets/image/rent-station.png')`;
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
}
