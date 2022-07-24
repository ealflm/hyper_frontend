import { ActivatedRoute, Router } from '@angular/router';
import { RouteService } from './../../../../services/route.service';
import { LocalStorageService } from './../../../../auth/localstorage.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { exhaustMap, take, takeLast, map } from 'rxjs';
import { MapService } from './../../../../services/map.service';
import { MapBoxService } from './../../../../services/map-box.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Station } from '../../../../models/StationResponse';
import * as mapboxgl from 'mapbox-gl';
import { Route } from '../../../../models/RouteResponse';
import { Location } from '@angular/common';
import { validateEmty } from '../../../../providers/CustomValidators';

@Component({
  selector: 'tourism-smart-transportation-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss'],
})
export class RouteFormComponent implements OnInit, AfterContentChecked {
  routeForm!: FormGroup;
  isSubmit = false;
  editMode = false;
  stations: Station[] = [];
  currentBusStationMarkers: any = [];
  blockLayout = false;
  private partnerId = '';
  private childrenStationList: any[] = [];
  loadingProgress = false;
  constructor(
    private fb: FormBuilder,
    private mapBoxService: MapBoxService,
    private mapService: MapService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private routeService: RouteService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    if (user) {
      this.partnerId = user.id;
    }
    this.mapBoxService.initializeMiniMap();
    this._getListStationsMarker();
    this.initRouteForm();
  }
  ngAfterContentChecked(): void {
    this.mapBoxService.miniMap.resize();
  }
  private initRouteForm() {
    this.routeForm = this.fb.group({
      routeName: ['', [Validators.required, validateEmty]],
      routeDescription: [''],
      distance: [''],
      stationList: [null, Validators.required],
    });
  }
  private _getListStationsMarker() {
    let busStationsOnMap: Station[] = [];
    this.mapService.getListStationForPartner().subscribe((stationRes) => {
      busStationsOnMap = stationRes.body.items;
      this.setBusStationMarkers(busStationsOnMap);
    });
  }
  setBusStationMarkers(busStations: Station[]) {
    busStations.map((marker) => {
      const elStationMarker = document.createElement('div');
      elStationMarker.id = marker.id;
      const width = 35;
      const height = 35;
      elStationMarker.className = 'marker';
      elStationMarker.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
      elStationMarker.style.width = `${width}px`;
      elStationMarker.style.height = `${height}px`;
      elStationMarker.style.backgroundSize = '100%';
      elStationMarker.style.cursor = 'pointer';

      const markerDiv = new mapboxgl.Marker(elStationMarker)
        .setLngLat([marker.longitude, marker.latitude] as [number, number])
        .addTo(this.mapBoxService.miniMap);
      markerDiv.getElement().addEventListener('click', () => {
        if (!this.stations.includes(marker)) {
          this.stations = [...this.stations, marker];
          this.stations.map((value) => {
            elStationMarker.style.backgroundImage = `url('../../../assets/icons/bus-station-selected.svg')`;
          });
          this._routesForm['stationList'].setValue(this.stations);
        } else {
          this.removeSationFormList(marker.id);
          elStationMarker.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
          // this.messageService.add({
          //   severity: 'warn',
          //   summary: 'Cảnh báo',
          //   detail: 'Trạm đã tồn tại!',
          // });
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
  removeSationFormList(stationId: string) {
    this.stations = this.stations.filter((value) => value.id !== stationId);
  }
  get _routesForm() {
    return this.routeForm.controls;
  }
  onReoderStations() {
    this._routesForm['stationList'].setValue(this.stations);
  }
  onConfirmListStation(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Bạn có chắc xác nhận thay đổi?',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Hủy',
      acceptLabel: 'Đồng ý',
      accept: () => {
        this.loadingProgress = true;
        let lnglatList: any = [];
        if (
          this._routesForm['stationList'].value == null ||
          !this._routesForm['stationList'].value
        ) {
          this.loadingProgress = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Cảnh báo',
            detail: 'Xin hãy chọn trạm!',
          });
          return;
        }
        this._routesForm['stationList'].value.map((station: Station) => {
          const lnglat = station.longitude + ',' + station.latitude;
          lnglatList = [...lnglatList, lnglat];
        });
        const coordinates = lnglatList.join(';');
        this.mapService.getRouteDirection(coordinates).subscribe((res) => {
          this.mapBoxService.getRouteMiniMap(res.routes[0]);
          this._routesForm['distance'].setValue(res.routes[0]?.distance);
          this.childrenStationList = this._routesForm['stationList'].value.map(
            (station: Station, index: number) => {
              // console.log(index);
              // console.log(res.routes[0].legs[index]);

              return {
                orderNumber: index,
                stationId: station.id,
                distance:
                  index === 0 ? 0 : res.routes[0].legs[index - 1]?.distance,
              };
            }
          );
          // console.log(this.childrenStationList);
          this.loadingProgress = false;
        });
        this.blockLayout = true;
      },
      reject: () => {},
    });
  }
  onEditAgain() {
    this.blockLayout = false;
    this.mapBoxService.removeRouteMiniMap();
  }
  onCancle() {
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {},
      reject: () => {
        this.location.back();
      },
    });
  }
  onSave() {
    this.isSubmit = true;
    if (this.routeForm.invalid) return;
    if (!this.blockLayout) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Hãy xát nhận trạm!',
      });
      return;
    }
    const routesDataSend: Route = {
      partnerId: this.partnerId,
      name: this._routesForm['routeName'].value,
      totalStation: this._routesForm['stationList'].value.length,
      distance: this._routesForm['distance'].value,
      stationList: this.childrenStationList,
    };
    if (this.blockLayout && this.isSubmit) {
      this.routeService
        .createRouteForPartner(routesDataSend)
        .subscribe((res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo tuyến đường thành công!',
            });
            setTimeout(() => {
              this.location.back();
            }, 2000);
          }
        });
    }
  }
}
