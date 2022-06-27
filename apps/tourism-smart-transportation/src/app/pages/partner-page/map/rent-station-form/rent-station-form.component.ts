import { LocalStorageService } from './../../../../auth/localstorage.service';
import { RentStation } from './../../../../models/RentStationResponse';
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
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { RentStationResponse } from '../../../../models/RentStationResponse';

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
  //
  locationForm!: FormGroup;
  editMode = false;
  constructor(
    private mapboxService: MapBoxService,
    private fb: FormBuilder,
    private mapService: MapService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);

    if (this.rentStationId) {
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
    this.getDetailsRentStation();
  }
  ngOnDestroy(): void {
    // this.mapboxService.initViewMiniMapPartner$.unsubscribe();
  }
  getDetailsRentStation() {
    if (this._dialog && !this.mapboxService.initViewMiniMapPartner$.value) {
      this.mapboxService.initializeMiniMap();
      this.mapboxService.miniMap.resize();
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
        this.setEmtyInitForm();
        this.addMarker();
        this.editMode = false;
      }
      this.mapboxService.initViewMiniMapPartner$.next(true);
    }
  }
  setEmtyInitForm() {
    this._locationForm['id'].setValue(null);
    this._locationForm['partnerId'].setValue(null);
    this._locationForm['longitude'].setValue(null);
    this._locationForm['latitude'].setValue(null);
    this._locationForm['title'].setValue(null);
    this._locationForm['description'].setValue(null);
    this._locationForm['address'].setValue(null);
  }
  cancelDialog() {
    this._dialog = false;
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {
        this._dialog = true;
        this.mapboxService.initViewMiniMapPartner$.next(false);
        console.log(this.rentStationId);
      },
      reject: () => {
        this.onCloseDialog();
      },
    });
  }
  onCloseDialog() {
    this.setEmtyInitForm();
    this.mapboxService.initViewMiniMapPartner$.next(true);
    this.hiddenDialog.emit();
    this._dialog = false;
  }
  _initLocationForm() {
    this.locationForm = this.fb.group({
      id: [''],
      partnerId: [''],
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
  setRentSationMarker(longitude: number, latitude: number) {
    const el = document.createElement('div');
    const width = 30;
    const height = 30;
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
      this._locationForm['longitude'].setValue(lngLat.lng);
      this._locationForm['latitude'].setValue(lngLat.lat);
    });
  }
  onSaveRentStation() {
    this._locationForm['longitude'].enable();
    this._locationForm['latitude'].enable();
    if (this.locationForm.invalid) return;
    if (this.editMode) {
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
      const user = this.localStorageService.getUser;
      const partnerId = user.id;
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
      this.mapService
        .createRentStationForPartner(rentStation)
        .subscribe((response) => {
          // console.log(stationRes);
          if (response.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: response.message,
            });
          }
        });
      this.editMode = false;
    }
    this._locationForm['longitude'].disable();
    this._locationForm['latitude'].disable();
    this.onCloseDialog();
  }
}
