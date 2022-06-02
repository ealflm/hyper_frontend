import { map } from 'rxjs';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { environment } from './../../../../../environments/environment.prod';
import { MapBoxService } from './../../../../services/map-box.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnChanges,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'tourism-smart-transportation-form-station',
  templateUrl: './form-station.component.html',
  styleUrls: ['./form-station.component.scss'],
})
export class FormStationComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  private _dialog = false;
  afterViewInit = false;
  @Input() set showDialog(value: boolean) {
    // console.log('this.value ', value);
    // console.log('after', this.afterViewInit);

    // if (value && this.afterViewInit) {
    this._dialog = value;
    // console.log('this   ppp   ', value);
    // }
  }
  get showDialog(): boolean {
    return this._dialog;
  }

  @Output() hiddenDialog: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('mapChild') mapChild!: ElementRef;

  markers: any[] = [];
  markerIndex = 1;
  markerArray: any[] = [];
  //
  locationForm!: FormGroup;
  constructor(private mapboxService: MapBoxService, private fb: FormBuilder) {
    // console.log('contructor');
  }

  ngOnInit(): void {
    // console.log('OnInit');
    // this.mapboxService.setMarker();

    this._initLocationForm();
  }
  // khoi tao dom
  ngAfterViewInit() {
    // console.log('form after view init');
    // this.afterViewInit = true;
  }
  // sau khi khoi tao xong dom
  ngAfterViewChecked(): void {
    if (this._dialog && !this.mapboxService.initView$.value) {
      this.mapboxService.initializeMiniMap();
      this.mapboxService.miniMap.resize();
      this.addMarker();

      this.mapboxService.initView$.next(true);
    }
  }
  ngOnDestroy(): void {
    // this.mapboxService.initView$.unsubscribe();
  }
  cancelDialog() {
    this.onCloseDialog();
  }
  onCloseDialog() {
    this.hiddenDialog.emit();
    this._dialog = false;
  }
  onSaveStation() {}

  _initLocationForm() {
    this.locationForm = this.fb.group({
      longitude: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
    });
  }
  get _locationForm() {
    return this.locationForm.controls;
  }

  addMarker() {
    const el = document.createElement('div');
    const width = 40;
    const height = 40;
    el.className = 'marker';
    el.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';
    el.style.cursor = 'pointer';
    const marker = new mapboxgl.Marker(el, { draggable: true });
    this.mapboxService.miniMap.on('click', (e) => {
      marker
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(this.mapboxService.miniMap);
      this._locationForm['longitude'].setValue(e.lngLat.lng);
      this._locationForm['latitude'].setValue(e.lngLat.lat);
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        this._locationForm['longitude'].setValue(lngLat.lng);
        this._locationForm['latitude'].setValue(lngLat.lat);
      });
    });
  }
  // FORM ARRAY
  // _initLocationFormArray() {
  // this.locationForm = this.fb.group({
  // locations: this.fb.array([]),
  // });
  // }
  // get locationsForm() {
  //   return this.locationForm.controls['locations'] as FormArray;
  // }
  // addNewLocationForm(markerLnglat: any) {
  //   const locationForm = this.fb.group({
  //     stationName: ['', [Validators.required]],
  //     longitude: [markerLnglat.lng, [Validators.required]],
  //     latitude: [markerLnglat.lat, [Validators.required]],
  //   });
  //   this.locationsForm.push(locationForm);
  // }
  // deleteLocationForm(i: number) {
  //   this.locationsForm.removeAt(i);
  // }
  //
  addMutipleMarkers() {
    this.mapboxService.miniMap.on('click', (e) => {
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
        .addTo(this.mapboxService.miniMap)
        .setPopup(new mapboxgl.Popup().setDOMContent(assignBtn));
      marker
        .getElement()
        .addEventListener('mouseenter', () => marker.togglePopup());
      this.markers.push(el.id);
      this.markerArray.push(marker);
      // form array
      // const markerLnglat: any = marker.getLngLat();
      // this.addNewLocationForm(markerLnglat);
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
        // form array delete in form and delete in map
        // const indexMarker = this.markerArray.findIndex(
        //   (marker: any) =>
        //     marker._lngLat.lng == markerLnglat.lng &&
        //     marker._lngLat.lat == markerLnglat.lat
        // );
        // this.deleteLocationForm(indexMarker);
        // this.markerArray.splice(indexMarker, 1);
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
        //update lng and lat marker at index for form array
        //
        // const indexMarker = this.markerArray.findIndex(
        //   (marker: any) =>
        //     marker._lngLat.lng == lngLat.lng && marker._lngLat.lat == lngLat.lat
        // );
        // this.markerArray[indexMarker]._lngLat.lng = lngLat.lng;
        // this.markerArray[indexMarker]._lngLat.lat = lngLat.lat;
        // this.locationsForm.at(indexMarker).patchValue({
        //   longitude: lngLat.lng,
        //   latitude: lngLat.lat,
        // });
        // console.log(this.markerArray);
      });
      this.markerIndex++;
    });
  }
}

//
