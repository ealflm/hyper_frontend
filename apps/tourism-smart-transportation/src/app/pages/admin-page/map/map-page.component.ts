import { MapBoxService } from '../../../services/map-box.service';
import { Validators, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Component({
  selector: 'tourism-smart-transportation-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent implements OnInit {
  coordinates: any;
  locationForm!: FormGroup;
  markers: any[] = [];
  markerIndex = 1;
  markerArray: any[] = [];
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
  showRightSideBarStatus = true;
  drivers: any = [];
  stations: any = [];
  rent_stations: any = [];
  routes: any = [];
  constructor(private mapboxService: MapBoxService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mapboxService.initializeMap();
    this.mapboxService.setMarker();
    this.mapboxService.getCoordinates().subscribe((res: any) => {
      this.coordinates = res;
    });
    // this._initLocationFormArray();
    // this.addMarker();
  }
  _initLocationFormArray() {
    this.locationForm = this.fb.group({
      locations: this.fb.array([]),
    });
  }
  get locationsForm() {
    return this.locationForm.controls['locations'] as FormArray;
  }
  addNewLocationForm(markerLnglat: any) {
    const locationForm = this.fb.group({
      stationName: ['', [Validators.required]],
      longitude: [markerLnglat.lng, [Validators.required]],
      latitude: [markerLnglat.lat, [Validators.required]],
    });
    this.locationsForm.push(locationForm);
  }
  deleteLocationForm(i: number) {
    this.locationsForm.removeAt(i);
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
    this.getObject2(this.locationForm.get('locations')?.value);
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

  // recive data form child components
  onGetFillterMenu(event: any) {
    this.fillterMenu = event;
    console.log(this.fillterMenu);
  }
  onGetValueCheckBox(event: any) {
    console.log(event);
  }
  // show right side bar
  showRightSideBar() {
    this.showRightSideBarStatus = !this.showRightSideBarStatus;
  }
  onFillterDriverByName(e: any) {
    console.log(e);
  }
  createStation() {}
  onChangeFillterMapDriver(e: any) {}
  onFillterStationByName(e: any) {}
  onFillterRentStationByName(e: any) {}
  onFillterRouteByName(e: any) {}
  addMarker() {
    this.mapboxService.map.on('click', (e) => {
      const el = document.createElement('div');
      el.id = 'marker' + this.markerIndex;
      const divElement = document.createElement('div');
      const assignBtn = document.createElement('div');

      assignBtn.innerHTML = `
      <button type="button" class="buttonPopup" click="delete(${el.id})">Delete</button>`;
      divElement.appendChild(assignBtn);

      const width = 40;
      const height = 40;
      el.className = 'marker';
      el.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el, {
        draggable: true,
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(this.mapboxService.map)
        .setPopup(new mapboxgl.Popup().setDOMContent(assignBtn));
      marker
        .getElement()
        .addEventListener('mouseenter', () => marker.togglePopup());
      this.markers.push(el.id);
      this.markerArray.push(marker);
      const markerLnglat: any = marker.getLngLat();
      this.addNewLocationForm(markerLnglat);

      // console.log(this.markerArray);
      assignBtn.addEventListener('click', (e) => {
        const idElement = document.getElementById(el.id);
        const index = this.markers.find(
          (idAtribute) => idAtribute == idElement?.getAttribute('id')
        );
        this.markers.splice(index, 1);
        marker.remove();
        const markerLnglat: any = marker.getLngLat();

        //remove marker and return index
        const indexMarker = this.markerArray.findIndex(
          (marker: any) =>
            marker._lngLat.lng == markerLnglat.lng &&
            marker._lngLat.lat == markerLnglat.lat
        );
        this.deleteLocationForm(indexMarker);
        this.markerArray.splice(indexMarker, 1);
        // console.log(this.markerArray);
      });
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        console.log(lngLat);
        el.style.display = 'block';
        assignBtn.innerHTML = `
        <p>${lngLat.lng}--${lngLat.lat}</p>
        <button type="button" class="buttonPopup" click="delete(${el.id})">Delete</button>
        `;
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setDOMContent(assignBtn)
        );
        //update lng and lat marker
        const indexMarker = this.markerArray.findIndex(
          (marker: any) =>
            marker._lngLat.lng == lngLat.lng && marker._lngLat.lat == lngLat.lat
        );
        this.markerArray[indexMarker]._lngLat.lng = lngLat.lng;
        this.markerArray[indexMarker]._lngLat.lat = lngLat.lat;
        this.locationsForm.at(indexMarker).patchValue({
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        });
        // console.log(this.markerArray);
      });
      this.markerIndex++;
    });
  }
}
