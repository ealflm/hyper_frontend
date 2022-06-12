import { MessageService } from 'primeng/api';
import { MapService } from './../../../../services/map.service';
import { Station, StationResponse } from './../../../../models/StationResponse';
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
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy, OnChanges
{
  private _dialog = false;
  afterViewInit = false;
  @Input() idStation?: string;
  @Input() set showDialog(value: boolean) {
    this._dialog = value;
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
  editMode = false;
  constructor(
    private mapboxService: MapBoxService,
    private fb: FormBuilder,
    private mapService: MapService,
    private messageService: MessageService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);

    if (this.idStation) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }
  ngOnInit(): void {
    this._initLocationForm();
  }
  // khoi tao dom
  ngAfterViewInit() {}
  // sau khi khoi tao xong dom
  ngAfterViewChecked(): void {
    if (this._dialog && !this.mapboxService.initView$.value) {
      this.mapboxService.initializeMiniMap();
      this.mapboxService.miniMap.resize();
      if (this.idStation) {
        this.editMode = true;
        this.mapService
          .getStationById(this.idStation)
          .subscribe((stationRes: StationResponse) => {
            this._locationForm['id'].setValue(stationRes.body.id);
            this._locationForm['longitude'].setValue(stationRes.body.longitude);
            this._locationForm['latitude'].setValue(stationRes.body.latitude);
            this._locationForm['title'].setValue(stationRes.body.title);
            this._locationForm['description'].setValue(
              stationRes.body.description
            );
            this._locationForm['address'].setValue(stationRes.body.address);
            if (stationRes.body.longitude && stationRes.body.latitude) {
              this.setSationMarker(
                stationRes.body.longitude,
                stationRes.body.latitude
              );
              this.mapboxService.flyToMarkerMiniMap(
                stationRes.body.longitude,
                stationRes.body.latitude
              );
            }
          });
      } else if (!this.idStation) {
        this.setEmtyInitForm();
        this.addMarker();
        this.editMode = false;
      }
      this.mapboxService.initView$.next(true);
    }
  }
  ngOnDestroy(): void {
    // this.mapboxService.initView$.unsubscribe();
  }
  setEmtyInitForm() {
    this._locationForm['id'].setValue('');
    this._locationForm['longitude'].setValue('');
    this._locationForm['latitude'].setValue('');
    this._locationForm['title'].setValue('');
    this._locationForm['description'].setValue('');
    this._locationForm['address'].setValue('');
  }
  cancelDialog() {
    this.setEmtyInitForm();
    this.onCloseDialog();
    this.editMode = false;
  }
  onCloseDialog() {
    this.setEmtyInitForm();

    this.hiddenDialog.emit();
    this._dialog = false;
  }
  _initLocationForm() {
    this.locationForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      description: [''],
      address: ['', Validators.required],
      longitude: [{ value: '', disabled: true }, [Validators.required]],
      latitude: [{ value: '', disabled: true }, [Validators.required]],
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
  setSationMarker(longitude: number, latitude: number) {
    const el = document.createElement('div');
    const width = 40;
    const height = 40;
    el.className = 'marker';
    el.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';
    el.style.cursor = 'pointer';
    const marker = new mapboxgl.Marker(el, { draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(this.mapboxService.miniMap);
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      this._locationForm['longitude'].setValue(lngLat.lng);
      this._locationForm['latitude'].setValue(lngLat.lat);
    });
  }
  onSaveStation() {
    this._locationForm['longitude'].enable();
    this._locationForm['latitude'].enable();
    if (this.locationForm.invalid) return;
    if (this.editMode) {
      const station: Station = {
        id: this._locationForm['id'].value,
        title: this._locationForm['title'].value,
        description: this._locationForm['description'].value,
        address: this._locationForm['address'].value,
        longitude: this._locationForm['longitude'].value,
        latitude: this._locationForm['latitude'].value,
        status: 1,
      };
      this.mapService
        .updateStation(station.id, station)
        .subscribe((response) => {
          if (response.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: response.message,
            });
          }
          this.editMode = false;
        });
    } else {
      const station: Station = {
        id: '',
        title: this._locationForm['title'].value,
        description: this._locationForm['description'].value,
        address: this._locationForm['address'].value,
        longitude: this._locationForm['longitude'].value,
        latitude: this._locationForm['latitude'].value,
        status: 1,
      };
      this.mapService.createStation(station).subscribe((stationRes) => {
        // console.log(stationRes);
        if (stationRes.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: stationRes.message,
          });
        }
      });
      this.editMode = false;
    }
    this._locationForm['longitude'].disable();
    this._locationForm['latitude'].disable();
    this.onCloseDialog();
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
