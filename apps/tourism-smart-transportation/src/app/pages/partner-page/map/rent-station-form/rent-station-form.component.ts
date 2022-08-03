import { GongMapService } from './../../../../services/gong-map.service';
import {
  checkDistance,
  validateEmty,
} from '../../../../providers/CustomValidators';
import { LocalStorageService } from './../../../../auth/localstorage.service';
import {
  RentStation,
  RentStationsResponse,
} from './../../../../models/RentStationResponse';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MapService } from './../../../../services/map.service';
import { MapBoxService } from './../../../../services/map-box.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  ElementRef,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { RentStationResponse } from '../../../../models/RentStationResponse';
import { map } from 'rxjs';

@Component({
  selector: 'tourism-smart-transportation-rent-station-form',
  templateUrl: './rent-station-form.component.html',
  styleUrls: ['./rent-station-form.component.scss'],
})
export class RentStationFormComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy, OnChanges
{
  private _dialog = false;
  afterViewInit = false;
  @Input() rentStationId?: string;
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
  // If dataType is any ex : currentRentStationMarkers: any then the ngAfterViewinitChecked dectect change compoent infinity request
  currentRentStationMarkers: any = [];
  rentStationOnMap: RentStation[] = [];
  //
  locationForm!: FormGroup;
  isSubmit = false;
  editMode = false;
  successChange = false;
  loading = false;
  isInsidePolygon = false;
  isNearOtherRentStaion = false;
  lnglat: any = [];
  constructor(
    private mapboxService: MapBoxService,
    private fb: FormBuilder,
    private mapService: MapService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
    private gongMapService: GongMapService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // console.log(this.mapChild);

    if (this.rentStationId) {
      this.editMode = true;
      this.isSubmit = false;
    } else {
      this.editMode = false;
      this.isSubmit = false;
    }
  }
  ngOnInit(): void {
    this._initLocationForm();
    this.getRentStationMarkers();
    // console.log(this.mapChild);
  }
  // khoi tao dom
  ngAfterViewInit() {
    this.cdr.detectChanges();
    // console.log(this.mapChild);
  }
  // sau khi khoi tao xong dom
  ngAfterViewChecked(): void {
    if (this._dialog && !this.mapboxService.initViewMiniMapPartner$.value) {
      // console.log(this.mapChild);
      this.mapboxService.initializeMiniMap();
      this.mapboxService.miniMap.resize();
      this.getRentStationMarkers();
      if (this.rentStationId) {
        this.editMode = true;
        this.mapService
          .getRentStationById(this.rentStationId)
          .subscribe((stationRes: RentStationResponse) => {
            this._locationForm['id'].setValue(stationRes.body.id);
            this._locationForm['partnerId'].setValue(stationRes.body.partnerId);
            this._locationForm['longitude'].setValue(stationRes.body.longitude);
            this._locationForm['latitude'].setValue(stationRes.body.latitude);
            this._locationForm['title'].setValue(stationRes.body.title);
            this._locationForm['description'].setValue(
              stationRes.body.description
            );
            this._locationForm['address'].setValue(stationRes.body.address);
            this.filterRentStationWillEdit(
              this.rentStationOnMap,
              stationRes.body.id
            );
            if (stationRes.body.longitude && stationRes.body.latitude) {
              this.setRentSationMarker(
                stationRes.body.longitude,
                stationRes.body.latitude
              );
              this.mapboxService.flyToMarkerMiniMap(
                stationRes.body.longitude,
                stationRes.body.latitude
              );
            }
          });
      } else if (!this.rentStationId) {
        this.getRentStationAndSetMarkers();
        this.setEmtyInitForm();
        this.addMarker();
        this.editMode = false;
        this.isSubmit = false;
      }
      this.mapboxService.initViewMiniMapPartner$.next(true);
    }
  }
  ngOnDestroy(): void {
    // this.mapboxService.initViewMiniMapPartner$.unsubscribe();
  }

  setEmtyInitForm() {
    this.locationForm.reset();
    this.cdr.detectChanges();
    // this._locationForm['id'].setValue(null);
    // this._locationForm['partnerId'].setValue(null);
    // this._locationForm['longitude'].setValue(null);
    // this._locationForm['latitude'].setValue(null);
    // this._locationForm['title'].setValue('');
    // this._locationForm['description'].setValue(null);
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
    this.mapboxService.initViewMiniMapPartner$.next(true);
    this.hiddenDialog.emit({ successChange: this.successChange });
    this._dialog = false;
  }
  private _initLocationForm() {
    this.locationForm = this.fb.group({
      id: [''],
      partnerId: [''],
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
    const width = 30;
    const height = 30;
    el.className = 'marker';
    el.style.backgroundImage = `url('../../../assets/image/rent-station.png')`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';
    el.style.cursor = 'pointer';
    const marker = new mapboxgl.Marker(el, { draggable: true });
    this.mapboxService.miniMap.on('click', (e) => {
      if (checkDistance(this.lnglat, [e.lngLat.lng, e.lngLat.lat])) {
        this.isNearOtherRentStaion = false;

        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: 'Trạm thuê xe phải cách xa trạm khác 1 km',
        });
        return;
      }
      if (
        this.mapboxService.checkMarkerInsidePolygon(e.lngLat.lng, e.lngLat.lat)
      ) {
        marker
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(this.mapboxService.miniMap);
        this._locationForm['longitude'].setValue(e.lngLat.lng);
        this._locationForm['latitude'].setValue(e.lngLat.lat);
        this._setAddressAutoComplete(e.lngLat.lat + ',' + e.lngLat.lng);
        this.isNearOtherRentStaion = true;
        this.isInsidePolygon = true;
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          if (checkDistance(this.lnglat, [lngLat.lng, lngLat.lat])) {
            this.isNearOtherRentStaion = false;
            this.messageService.add({
              severity: 'warn',
              summary: 'Cảnh báo',
              detail: 'Trạm thuê xe phải cách xa trạm khác 1 km',
            });
            return;
          }
          if (
            this.mapboxService.checkMarkerInsidePolygon(lngLat.lng, lngLat.lat)
          ) {
            this.isNearOtherRentStaion = true;
            this.isInsidePolygon = true;
            this._locationForm['longitude'].setValue(lngLat.lng);
            this._locationForm['latitude'].setValue(lngLat.lat);
            this._setAddressAutoComplete(lngLat.lat + ',' + lngLat.lng);
          } else {
            this.isInsidePolygon = false;
            this.messageService.add({
              severity: 'warn',
              summary: 'Cảnh báo',
              detail: 'Trạm thuê xe không được nằm ngoài Phú Quốc',
            });
          }
        });
      } else {
        this.isInsidePolygon = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: 'Trạm thuê xe không được nằm ngoài Phú Quốc',
        });
      }
    });
  }

  //
  getRentStationMarkers() {
    this.mapService
      .getListRentStationForPartner()
      .pipe(
        map((rentStationRes: RentStationsResponse) => {
          this.lnglat = rentStationRes.body.items.map((value) => {
            return [value.longitude, value.latitude];
          });
          this.rentStationOnMap = rentStationRes.body.items.map(
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
  getRentStationAndSetMarkers() {
    this.mapService
      .getListRentStationForPartner()
      .pipe(
        map((rentStationRes: RentStationsResponse) => {
          this.lnglat = rentStationRes.body.items.map((value) => {
            return [value.longitude, value.latitude];
          });
          this.rentStationOnMap = rentStationRes.body.items.map(
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
          this.setListRentStationMarkers(this.rentStationOnMap);
        })
      )
      .subscribe();
  }
  filterRentStationWillEdit(rentStations: RentStation[], id: string) {
    this.rentStationOnMap = rentStations.filter((value) => value.id !== id);
    this.setListRentStationMarkers(this.rentStationOnMap);
  }
  setRentSationMarker(longitude: number, latitude: number) {
    this.isInsidePolygon = true;
    const el = document.createElement('div');
    const width = 40;
    const height = 40;
    el.className = 'marker';
    el.style.backgroundImage = `url('../../../assets/image/rent-station.png')`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';
    el.style.cursor = 'pointer';
    const marker = new mapboxgl.Marker(el, { draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(this.mapboxService.miniMap);
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      if (checkDistance(this.lnglat, [lngLat.lng, lngLat.lat])) {
        this.isNearOtherRentStaion = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: 'Trạm thuê xe phải cách xa trạm khác 1 km',
        });
        return;
      }
      if (this.mapboxService.checkMarkerInsidePolygon(lngLat.lng, lngLat.lat)) {
        this.isInsidePolygon = true;
        this.isNearOtherRentStaion = true;
        this._locationForm['longitude'].setValue(lngLat.lng);
        this._locationForm['latitude'].setValue(lngLat.lat);
        this._setAddressAutoComplete(lngLat.lat + ',' + lngLat.lng);
      } else {
        this.isInsidePolygon = false;
        this.messageService.add({
          severity: 'warn',
          summary: 'Cảnh báo',
          detail: 'Trạm thuê xe không được nằm ngoài Phú Quốc',
        });
      }
    });
  }
  setListRentStationMarkers(rentStations: RentStation[]) {
    rentStations.map((marker) => {
      const el = document.createElement('div');
      el.id = marker.id;
      const width = 35;
      const height = 35;
      el.className = 'marker';
      el.style.backgroundImage = `url('../../../assets/image/rent-station-grey.svg')`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';
      const markerDiv = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude] as [number, number])
        .addTo(this.mapboxService.miniMap);
      markerDiv.getElement().addEventListener('click', () => {});
    });
  }
  onSaveRentStation() {
    this.cdr.detectChanges();
    this.isSubmit = true;
    if (this.locationForm.invalid) return;
    if (!this.isNearOtherRentStaion) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Trạm thuê xe phải cách xa trạm khác 1 km',
      });
      return;
    }
    if (!this.isInsidePolygon) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Trạm thuê xe không được nằm ngoài Phú Quốc',
      });
      return;
    }
    this.loading = true;
    if (this.editMode) {
      this._locationForm['longitude'].enable();
      this._locationForm['latitude'].enable();
      const rentStation: RentStation = {
        id: this._locationForm['id'].value,
        title: this._locationForm['title'].value,
        description: this._locationForm['description'].value,
        address: this._locationForm['address'].value,
        longitude: this._locationForm['longitude'].value,
        latitude: this._locationForm['latitude'].value,
      };
      this.mapService
        .updateRentStationForPartner(rentStation.id, rentStation)
        .subscribe(
          (response) => {
            if (response.statusCode === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: response.message,
              });
              this.editMode = false;
              this.loading = false;
              this.successChange = true;
              this.isSubmit = false;
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
      const user = this.localStorageService.getUser;
      const partnerId = user.id;
      this._locationForm['longitude'].enable();
      this._locationForm['latitude'].enable();
      const rentStation: RentStation = {
        id: '',
        partnerId: partnerId,
        title: this._locationForm['title'].value,
        description: this._locationForm['description'].value,
        address: this._locationForm['address'].value,
        longitude: this._locationForm['longitude'].value,
        latitude: this._locationForm['latitude'].value,
        status: 1,
      };
      this.mapService.createRentStationForPartner(rentStation).subscribe(
        (response) => {
          // console.log(stationRes);
          if (response.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: response.message,
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
}
