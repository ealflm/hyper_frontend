import {
  Route,
  RoutesResponse,
  RouteResponse,
} from './../../../models/RouteResponse';
import {
  RentStation,
  RentStationResponse,
} from './../../../models/RentStationResponse';
import { map } from 'rxjs';
import { MapBoxService } from '../../../services/map-box.service';
import { Validators, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../../../services/map.service';
import { StationsResponse, Station } from '../../../models/StationResponse';
import { RentStationsResponse } from '../../../models/RentStationResponse';

@Component({
  selector: 'tourism-smart-transportation-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent
  implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked
{
  coordinates: any;

  headerMenu: any = [
    {
      name: 'driver',
      class: '',
      hiddenCheckbox: false,
      icon: 'person',
      lable: 'Tài xế',
    },
    {
      name: 'bus-station',
      class: '',
      hiddenCheckbox: false,
      icon: 'directions_bus_filled',
      lable: 'Trạm xe bus',
    },
    {
      name: 'rent-station',
      class: '',
      hiddenCheckbox: false,
      icon: 'car_rental',
      lable: 'Trạm thuê xe',
    },
    {
      name: 'route',
      class: '',
      hiddenCheckbox: true,
      icon: 'route',
      lable: 'Tuyến',
    },
  ];
  fillterMenu?: string = 'driver';
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
  drivers: any = [];
  stations: Station[] = [];
  rent_stations: RentStation[] = [];
  routes: Route[] = [];
  //
  stationDetail!: Station;
  rentStationDetail!: RentStation;
  routeDetail!: Route;
  //
  idStation = '';
  checkBoxValue = [];
  constructor(
    private mapboxService: MapBoxService,
    private fb: FormBuilder,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    // this._initLocationFormArray();
    // this.addMarker();
    this.getBusStationMarkers();
    this.getRentStationMarkers();
  }
  ngAfterViewInit() {
    this.mapboxService.initializeMap(103.9967, 10.22698, 12);
    // this.mapboxService.setMarker();
    // console.log('map page after view init');
    // this.mapboxService.getCoordinates().subscribe((res: any) => {
    //   this.coordinates = res;
    // });
  }
  ngAfterViewChecked(): void {
    this.mapboxService.map.resize();
  }
  ngOnDestroy() {}

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
  }
  // recive data menu form child components
  onGetFillterMenu(event: any) {
    this.fillterMenu = event;
    this.showSideBarList = true;
    this.showSideBarDetail = false;
    // console.log(this.fillterMenu);

    if (this.fillterMenu === 'bus-station') {
      this.getAllStations();
    } else if (this.fillterMenu === 'rent-station') {
      this.getAllRentStations();
    } else if (this.fillterMenu === 'driver') {
      console.log('............');
    } else if (this.fillterMenu === 'route') {
      this.getAllRoutes();
    }
  }
  onGetValueCheckBox(valueCheckbox: []) {
    this.checkBoxValue = valueCheckbox;
    if (valueCheckbox.length <= 0) {
      this.mapboxService.removeBusStationMarker();
      this.mapboxService.removeRentStationMarker();
    } else if (valueCheckbox.length > 0) {
      this.getBusStationMarkers();
      this.getRentStationMarkers();
      switch (valueCheckbox.sort().join('-')) {
        case 'driver':
          console.log('driver');
          this.mapboxService.removeBusStationMarker();
          this.mapboxService.removeRentStationMarker();
          break;
        case 'bus-station':
          this.mapboxService.removeBusStationMarker();

          this.mapboxService.setBusStationMarkers(this.busStationsOnMap);
          this.mapboxService.removeRentStationMarker();
          break;
        case 'rent-station':
          this.mapboxService.removeRentStationMarker();

          this.mapboxService.setRentStationMarkers(this.rentStationsOnMap);
          this.mapboxService.removeBusStationMarker();
          break;
        case 'driver-rent-station':
          this.mapboxService.removeBusStationMarker();
          console.log('1');
          break;
        case 'bus-station-driver':
          this.mapboxService.removeRentStationMarker();
          console.log('2');
          break;
        case 'bus-station-rent-station':
          this.mapboxService.removeRentStationMarker();
          this.mapboxService.removeBusStationMarker();

          this.mapboxService.setBusStationMarkers(this.busStationsOnMap);
          this.mapboxService.setRentStationMarkers(this.rentStationsOnMap);
          break;
        case 'bus-station-driver-rent-station':
          console.log('4');
          break;
        default:
          this.mapboxService.removeBusStationMarker();
          this.mapboxService.removeRentStationMarker();
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
  onHiddenDialog() {
    this.idStation = '';
    this.showDialog = false;
    this.onShowSideBarList();
    this.getAllStations();
  }

  // fillter function
  onFillterDriverByName(name: any) {}
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
  getDetailDriver(event: any) {
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    console.log(event);
  }
  getDetailStation(event: any) {
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
}
