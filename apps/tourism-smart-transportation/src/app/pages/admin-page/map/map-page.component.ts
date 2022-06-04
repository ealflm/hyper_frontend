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
import { Station, StationsResponse } from '../../../models/Station';

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
  busStations: Station[] = [];

  //
  drivers: any = [];
  stations: any = [];
  rent_stations: any = [];
  routes: any = [];
  //
  stationDetail!: Station;
  //
  idStation = '';
  constructor(
    private mapboxService: MapBoxService,
    private fb: FormBuilder,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    // this._initLocationFormArray();
    // this.addMarker();
    this.getBusStationMarkers();
  }
  ngAfterViewInit() {
    this.mapboxService.initializeMap();
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
    }
  }
  onGetValueCheckBox(vakueCheckbox: any) {
    if (vakueCheckbox.length === 0) {
      this.mapboxService.removeBusStationMarker();
    } else {
      this.getBusStationMarkers();
      vakueCheckbox.find((element: any) => {
        console.log(element);

        if (element === 'bus-station') {
          this.mapboxService.setBusStationMarkers(this.busStations);
        } else if (element !== 'bus-station' || element == []) {
          this.mapboxService.removeBusStationMarker();
        }
        if (element === 'rent-station') {
          console.log('rent-station == true');
        } else if (element !== 'rent-station' || element == []) {
          console.log('rent-station == false');
        }
        if (element === 'driver') {
          console.log('driver == true');
        } else if (element !== 'rent-station' || element == []) {
          console.log('driver == false');
        }
      });
    }

    // this.mapboxService.setBusStationMarkers();
  }
  // action in form child components
  createStation() {
    this.showDialog = true;
    this.mapboxService.initView$.next(false);
  }
  onEditStation(stationId: string) {
    this.showDialog = true;
    this.mapboxService.initView$.next(false);
    this.idStation = stationId;
  }
  onHiddenDialog() {
    this.showDialog = false;
    this.onShowSideBarList();
  }

  // fillter function
  onFillterDriverByName(name: any) {}
  onFillterStationByName(title: any) {
    this.getAllStations(title);
  }
  onFillterRentStationByName(e: any) {}
  onFillterRouteByName(e: any) {}

  // Get detail function
  getDetailRoute(event: any) {
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    console.log(event);
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
    });
  }
  getDetailRentStation(event: any) {
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    console.log(event);
  }

  //Call API
  getBusStationMarkers() {
    this.mapService
      .getStationOnMap()
      .pipe(
        map((stationRes: StationsResponse) => {
          this.busStations = stationRes.body.items.map((station: Station) => {
            return {
              id: station.id,
              title: station.title,
              description: station.description,
              address: station.address,
              longitude: station.longitude,
              latitude: station.latitude,
              status: station.status,
            };
          });
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
}
