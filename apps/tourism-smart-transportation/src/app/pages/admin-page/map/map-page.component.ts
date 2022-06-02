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
  showRightSideBarStatus = true;
  showSideBarList = true;
  showSideBarDetail = false;
  //
  showDialog = false;
  //
  drivers: any = [];
  stations: any = [];
  rent_stations: any = [];
  routes: any = [];
  constructor(private mapboxService: MapBoxService, private fb: FormBuilder) {}

  ngOnInit(): void {
    // this._initLocationFormArray();
    // this.addMarker();
  }
  ngAfterViewInit() {
    this.mapboxService.initializeMap();
    this.mapboxService.setMarker();
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
    console.log(this.fillterMenu);
    this.showSideBarList = true;
    this.showSideBarDetail = false;
  }
  onGetValueCheckBox(event: any) {
    console.log(event);
  }

  createStation() {
    this.showDialog = true;
    this.mapboxService.initView$.next(false);
  }
  onHiddenDialog() {
    this.showDialog = false;
  }

  // fillter function
  onFillterDriverByName(e: any) {
    console.log(e);
  }
  onFillterStationByName(e: any) {}
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
    console.log(event);
  }
  getDetailRentStation(event: any) {
    this.showSideBarList = false;
    this.showSideBarDetail = true;
    console.log(event);
  }
}
