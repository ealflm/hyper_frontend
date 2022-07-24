import { GongMapService } from './../../../../services/gong-map.service';
import { validateEmty } from '../../../../providers/CustomValidators';
import { MessageService, ConfirmationService } from 'primeng/api';
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
  ChangeDetectorRef,
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
  successChange = false;
  isSubmit = false;
  isInsidePolygon = false;
  loading = false;
  constructor(
    private mapboxService: MapBoxService,
    private fb: FormBuilder,
    private mapService: MapService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private gongMapService: GongMapService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);

    if (this.idStation) {
      this.editMode = true;
      this.isSubmit = false;
    } else {
      this.editMode = false;
      this.isSubmit = false;
    }
  }
  ngOnInit(): void {
    this._initLocationForm();
  }
  // khoi tao dom
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  // sau khi khoi tao xong dom
  ngAfterViewChecked(): void {
    if (this._dialog && !this.mapboxService.iniViewMiniMapAdmin$.value) {
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
        this.isSubmit = false;
      }
      this.mapboxService.iniViewMiniMapAdmin$.next(true);
    }
  }
  ngOnDestroy(): void {
    // this.mapboxService.initView$.unsubscribe();
  }
  setEmtyInitForm() {
    this.locationForm.reset();
    // this._locationForm['id'].setValue('');
    // this._locationForm['longitude'].setValue('');
    // this._locationForm['latitude'].setValue('');
    // this._locationForm['title'].setValue('');
    // this._locationForm['description'].setValue('');
    // this._locationForm['address'].setValue('');
  }
  cancelDialog() {
    this._dialog = false;
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {
        this.successChange = false;
        this._dialog = true;
        this.mapboxService.initViewMiniMapPartner$.next(false);
      },
      reject: () => {
        this.onCloseDialog();
      },
    });
  }
  onCloseDialog() {
    this.setEmtyInitForm();
    this.mapboxService.iniViewMiniMapAdmin$.next(true);
    this.hiddenDialog.emit({ successChange: this.successChange });
    this._dialog = false;
  }
  private _initLocationForm() {
    this.locationForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, validateEmty]],
      description: ['', [Validators.required, validateEmty]],
      address: ['', [Validators.required, validateEmty]],
      longitude: [{ value: '', disabled: true }, [Validators.required]],
      latitude: [{ value: '', disabled: true }, [Validators.required]],
    });
  }
  get _locationForm() {
    return this.locationForm.controls;
  }
  private _setAddressAutoComplete(latlng: string) {
    this.gongMapService.getAddressAutoCompleGongMap(latlng).subscribe((res) => {
      res.results[0].formatted_address;
      console.log(res.results[0].formatted_address);
      this._locationForm['address'].setValue(res.results[0].formatted_address);
    });
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
      if (
        this.mapboxService.checkMarkerInsidePolygon(e.lngLat.lng, e.lngLat.lat)
      ) {
        marker
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(this.mapboxService.miniMap);
        this._locationForm['longitude'].setValue(e.lngLat.lng);
        this._locationForm['latitude'].setValue(e.lngLat.lat);
        this._setAddressAutoComplete(e.lngLat.lat + ',' + e.lngLat.lng);
        this.isInsidePolygon = true;
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          if (
            this.mapboxService.checkMarkerInsidePolygon(lngLat.lng, lngLat.lat)
          ) {
            this.isInsidePolygon = true;
            this._locationForm['longitude'].setValue(lngLat.lng);
            this._locationForm['latitude'].setValue(lngLat.lat);
            this._setAddressAutoComplete(lngLat.lat + ',' + lngLat.lng);
          } else {
            this.isInsidePolygon = false;
            this.messageService.add({
              severity: 'warn',
              summary: 'Cảnh báo',
              detail: 'Trạm xe buýt không được nằm ngoài Phú Quốc',
            });
          }
        });
      } else {
        this.isInsidePolygon = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: 'Trạm xe buýt không được nằm ngoài Phú Quốc',
        });
      }
    });
  }
  setSationMarker(longitude: number, latitude: number) {
    this.isInsidePolygon = true;
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
      if (this.mapboxService.checkMarkerInsidePolygon(lngLat.lng, lngLat.lat)) {
        this.isInsidePolygon = true;
        this._locationForm['longitude'].setValue(lngLat.lng);
        this._locationForm['latitude'].setValue(lngLat.lat);
        this._setAddressAutoComplete(lngLat.lat + ',' + lngLat.lng);
      } else {
        this.isInsidePolygon = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: 'Trạm xe buýt không được nằm ngoài Phú Quốc',
        });
      }
    });
  }
  onSaveStation() {
    this.cdr.detectChanges();
    this.isSubmit = true;

    if (this.locationForm.invalid) return;
    if (this.isInsidePolygon == false) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Trạm xe buýt không được nằm ngoài Phú Quốc',
      });
      return;
    }
    this.loading = true;
    if (this.editMode) {
      this._locationForm['longitude'].enable();
      this._locationForm['latitude'].enable();
      const station: Station = {
        id: this._locationForm['id'].value,
        title: this._locationForm['title'].value,
        description: this._locationForm['description'].value,
        address: this._locationForm['address'].value,
        longitude: this._locationForm['longitude'].value,
        latitude: this._locationForm['latitude'].value,
        status: 1,
      };
      this.mapService.updateStation(station.id, station).subscribe(
        (response) => {
          if (response.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: response.message,
            });
            this.isSubmit = false;
            this.editMode = false;
            this.successChange = true;
            this.loading = false;
            this.onCloseDialog();
          }
        },
        (error) => {
          this.isSubmit = false;
          this.editMode = true;
          this.loading = false;
          this.successChange = false;
        }
      );
    } else {
      this._locationForm['longitude'].enable();
      this._locationForm['latitude'].enable();
      const station: Station = {
        id: '',
        title: this._locationForm['title'].value,
        description: this._locationForm['description'].value,
        address: this._locationForm['address'].value,
        longitude: this._locationForm['longitude'].value,
        latitude: this._locationForm['latitude'].value,
        status: 1,
      };
      this.mapService.createStation(station).subscribe(
        (stationRes) => {
          // console.log(stationRes);
          if (stationRes.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: stationRes.message,
            });
            this.isSubmit = false;
            this.successChange = true;
            this.editMode = false;
            this.loading = false;
            this.onCloseDialog();
          }
        },
        (error) => {
          this.isSubmit = false;
          this.editMode = false;
          this.loading = false;
          this.successChange = false;
        }
      );
    }
    this._locationForm['longitude'].disable();
    this._locationForm['latitude'].disable();
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
