import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuDataMap } from './../../../constant/menu-filter-status';
import {
  VehicleTracking,
  VehicleTrackingsResponse,
} from './../../../models/VehicleTrackingResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { VehiclesResponse } from './../../../models/VehicleResponse';
import { VehicleService } from './../../../services/vehicle.service';
import {
  Route,
  RoutesResponse,
  RouteResponse,
} from './../../../models/RouteResponse';
import {
  RentStation,
  RentStationResponse,
} from './../../../models/RentStationResponse';
import { forkJoin, map, mergeMap, Subscription, of } from 'rxjs';
import { MapBoxService } from '../../../services/map-box.service';
import { Validators, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../../../services/map.service';
import { StationsResponse, Station } from '../../../models/StationResponse';
import { RentStationsResponse } from '../../../models/RentStationResponse';
import { ReturnStatement } from '@angular/compiler';
import { Vehicle } from '../../../models/VehicleResponse';

@Component({
  selector: 'tourism-smart-transportation-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked
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
  checkBoxValue = '';

  currentRentStationMarkers: any = [];
  currentBusStationMarkers: any = [];
  geojson: any;
  trackingIntervel: any;
  listVehicleTracking: any;
  loading = true;
  private subscription?: Subscription;
  constructor(
    private mapboxService: MapBoxService,
    private fb: FormBuilder,
    private mapService: MapService,
    private vehicleService: VehicleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this._initLocationFormArray();
    // this.addMarker();
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    this.getBusStationMarkers();
    this.getRentStationMarkers();
    // this.getVehicleTrackingOnMap();
    // this.getVehicleTrackingOnMap();
    // setInterval(() => {

    // }, 2000);
  }
  ngAfterViewInit() {
    if (this.loading) {
      this.mapboxService.initializeMap(103.9967, 10.22698, 12);
      this.listVehicleTracking = setInterval(() => {
        this.getAllVehicles();
      }, 2000);
    }

    // this.mapboxService.setMarker();
    // console.log('map page after view init');
    // this.mapboxService.getCoordinates().subscribe((res: any) => {
    //   this.coordinates = res;
    // });
  }
  ngAfterViewChecked(): void {
    this.mapboxService.map.resize();
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    clearInterval(this.trackingIntervel);
    clearInterval(this.listVehicleTracking);
  }
  onSaveLocation() {
    // console.log(this.locationForm.get('locations')?.value);
    // this.locationForm
    //   .get('locations')
    //   ?.value.map((value: any, index: number) => {
    //     console.log(value);
    //   });
    // this.getObject(this.locationForm.get('locations')?.value);
    // console.log(this.getObject(this.locationForm.get('locations')?.value));
    // this.getObject2(this.locationForm.get('locations')?.value);
  }
  //thuật toán O(n^2)
  getObject(arr: []) {
    const result: any = {};
    arr.map((item: any) => {
      console.log(item);

      Object.keys(item).map((ele) => {
        result[ele] ? result[ele].push(item[ele]) : (result[ele] = [item[ele]]);
        console.log(ele);
      });
      console.log(result);
    });
    return result;
  }

  getObject2(arr: any[]) {
    const result: any = {};
    arr.reduce((previousValue, currentValue) => {
      Object.keys(currentValue).map((key: string, index) => {
        result[key]
          ? result[key].push(currentValue[key])
          : (result[key] = [previousValue[key], currentValue[key]]);
      });
    });
    console.log(result);

    return result;
  }
  // show right side bar
  showRightSideBar() {
    this.showRightSideBarStatus = !this.showRightSideBarStatus;
    clearInterval(this.trackingIntervel);
    this.mapboxService.removeLayerTracking();
    this.removeBusStationMarker();
    this.removeRentStationMarker();
  }
  // show or hidden each sidebar
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
  // recive data menu form child components
  onGetFillterMenu(event: any) {
    this.fillterMenu = event;
    this.showSideBarList = true;
    this.showSideBarDetail = false;
    // console.log(this.fillterMenu);
    if (this.fillterMenu === 'bus-station') {
      clearInterval(this.listVehicleTracking);
      this.getAllStations();
    } else if (this.fillterMenu === 'rent-station') {
      clearInterval(this.listVehicleTracking);
      this.getAllRentStations();
    } else if (this.fillterMenu === 'vehicle') {
      clearInterval(this.listVehicleTracking);
      this.listVehicleTracking = setInterval(() => {
        this.getAllVehicles();
      }, 2000);
    } else if (this.fillterMenu === 'route') {
      clearInterval(this.listVehicleTracking);
      this.getAllRoutes();
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
      this.getBusStationMarkers();
      this.getRentStationMarkers();
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
  // action in form child components
  createStation() {
    this.idStation = '';
    this.showDialog = true;
    this.mapboxService.initView$.next(false);
  }
  onEditStation(stationId: string) {
    this.showDialog = true;
    this.mapboxService.initView$.next(false);
    this.idStation = stationId;
  }
  onDeleteStation(stationId: string) {
    this.confirmationService.confirm({
      key: 'confirmDelete',
      accept: () => {
        this.mapService.deleteStation(stationId).subscribe((res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã xóa trạm!',
            });
            this.getAllStations();
          }
        });
      },
    });
  }
  onHiddenDialog(event: any) {
    this.idStation = '';
    this.showDialog = false;
    if (event) {
      this.getAllStations();
    }
    this.onShowSideBarList();
  }

  // fillter function
  // onFillterDriverByName(name: any) {}
  onFillterVehicleByName(name: any) {
    this.getAllVehicles(name);
  }
  onFillterStationByName(title: any) {
    this.getAllStations(title);
  }
  onFillterRentStationByName(title: any) {
    this.getAllRentStations(title);
  }
  onFillterRouteByName(name: any) {
    this.getAllRoutes(name);
  }

  // Get detail function
  getDetailRoute(event: any) {
    this.checkBoxValue = 'bus-station';
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    this.mapService
      .getRouteById(event.id)
      .subscribe((routeRes: RouteResponse) => {
        this.routeDetail = routeRes.body;
        let stationList: any = [];
        routeRes.body.stationList?.map((stations: Station) => {
          const lnglat = stations.longitude + ',' + stations.latitude;
          stationList = [...stationList, lnglat];
        });
        const coordinates = stationList.join(';');
        this.mapService.getRouteDirection(coordinates).subscribe((res) => {
          console.log(res.routes[0]);
          this.mapboxService.getRoute(res.routes[0]);
        });
      });
  }
  // getDetailDriver(event: any) {
  //   this.showSideBarList = false;
  //   this.showSideBarDetail = true;
  //   console.log(event);
  // }
  getDetailVehicle(event: any) {
    this.checkBoxValue = 'vehicle';
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    const callApiVehicleDetail = this.mapService
      .getVehicleById(event.id)
      .pipe(catchError((error: any) => of(error)));
    const callApiTrackingVehicle = this.mapService
      .getVehicleTrackingById(event.id)
      .pipe(catchError((error: any) => of(error)));
    forkJoin([callApiVehicleDetail, callApiTrackingVehicle]).subscribe(
      (res) => {
        this.vehicleDetail = {
          id: res[0].body.id,
          name: res[0].body.name,
          licensePlates: res[0].body.licensePlates,
          color: res[0].body.color,
          vehicleTypeName: res[0].body.vehicleTypeName,
          serviceTypeName: res[0].body.serviceTypeName,
          companyName: res[0].body.companyName,
          isRunning: res[0].body.isRunning,
          location: {
            longitude: res[1]?.body?.longitude,
            latitude: res[1]?.body?.latitude,
          },
        };
        if (res[1]?.body?.longitude && res[1]?.body?.latitude) {
          this.mapboxService.flyToMarker(
            res[1]?.body?.longitude,
            res[1]?.body?.latitude
          );
        }
      },
      (error) => of(error)
    );
  }
  getDetailStation(event: any) {
    this.checkBoxValue = 'bus-station';
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    this.mapService.getStationById(event.id).subscribe((stationRes) => {
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
      .getRentStationById(event.id)
      .subscribe((rentStations: RentStationResponse) => {
        this.rentStationDetail = rentStations.body;
        if (rentStations.body.longitude && rentStations.body.latitude)
          this.mapboxService.flyToMarker(
            rentStations.body.longitude,
            rentStations.body.latitude
          );
      });
  }

  //Call API Station
  getBusStationMarkers() {
    this.mapService
      .getStationOnMap()
      .pipe(
        map((stationRes: StationsResponse) => {
          this.busStationsOnMap = stationRes.body.items.map(
            (station: Station) => {
              return {
                id: station.id,
                title: station.title,
                description: station.description,
                address: station.address,
                longitude: station.longitude,
                latitude: station.latitude,
                status: station.status,
              };
            }
          );
        })
      )
      .subscribe();
  }
  //
  getAllStations(fillterTitle?: string) {
    this.mapService
      .getAllStation(fillterTitle)
      .subscribe((stationsRes: StationsResponse) => {
        this.stations = stationsRes.body.items;
      });
  }

  // call API rent-station
  getAllRentStations(fillterTitle?: string) {
    this.mapService
      .getAllRentStation(fillterTitle)
      .subscribe((rentStationRes: RentStationsResponse) => {
        this.rent_stations = rentStationRes.body.items;
      });
  }
  getRentStationMarkers() {
    this.mapService
      .getRentStationOnMap()
      .pipe(
        map((rentStationRes: RentStationsResponse) => {
          this.rentStationsOnMap = rentStationRes.body.items.map(
            (rentStation: RentStation) => {
              return {
                id: rentStation.id,
                address: rentStation.address,
                companyName: rentStation.companyName,
                longitude: rentStation.longitude,
                latitude: rentStation.latitude,
                partnerId: rentStation.partnerId,
                status: rentStation.status,
                title: rentStation.title,
              };
            }
          );
        })
      )
      .subscribe();
  }

  // call API routes
  getAllRoutes(fillterName?: string) {
    this.mapService
      .getAllRoutes(fillterName)
      .subscribe((routeRes: RoutesResponse) => {
        this.routes = routeRes.body.items;
      });
  }
  // call API vehilce
  getAllVehicles(vehicleName?: string) {
    this.mapService
      .getListVehicle(vehicleName)
      .subscribe((res: VehiclesResponse) => {
        this.vehicles = res.body;
      });
  }

  // Map
  setRentStationMarkers(rentStations: RentStation[]) {
    rentStations.map((marker) => {
      const el = document.createElement('div');
      el.id = marker.id;
      const width = 40;
      const height = 40;
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

  setBusStationMarkers(busStations: Station[]) {
    busStations.map((marker) => {
      const elStationMarker = document.createElement('div');
      elStationMarker.id = marker.id;
      const width = 40;
      const height = 40;
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

  getVehicleTrackingOnMap() {
    this.mapService
      .getVehicleTrackingOnMap()
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
        // const geojsontest = {
        //   type: 'FeatureCollection',
        //   features: [
        //     {
        //       type: 'Feature',
        //       geometry: {
        //         type: 'Point',
        //         coordinates: [103.97229998962916, 10.162733227959748],
        //       },
        //     },
        //     {
        //       type: 'Feature',
        //       geometry: {
        //         type: 'Point',
        //         coordinates: [103.98259194267769, 10.213039497518153],
        //       },
        //     },
        //   ],
        // };
        this.mapboxService.trackingVehicle(this.geojson);
      });
  }
}
