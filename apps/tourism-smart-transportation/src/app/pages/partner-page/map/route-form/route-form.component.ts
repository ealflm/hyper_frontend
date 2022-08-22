import { RouteResponse } from './../../../../models/RouteResponse';
import { ActivatedRoute, Router, Routes } from '@angular/router';
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
  routes: Route[] = [];
  currentBusStationSelectedRoute: any = [];
  currentBusStationMarkers: any = [];
  blockLayout = false;
  private partnerId = '';
  private childrenStationList: any[] = [];
  loadingProgress = false;
  distance: any;
  createFormStatus = false;
  busStationsOnMap: Station[] = [];
  routeId = '';
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
    this._getListRouteOfSystem();
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
  private _getListRouteOfSystem() {
    this.routeService.getRoutesOfSystem(this.partnerId).subscribe((res) => {
      this.routes = res.body.items;
    });
  }
  private _getListStationsMarker() {
    this.mapService.getListStationForPartner().subscribe((stationRes) => {
      this.busStationsOnMap = stationRes.body.items;
      this.setBusStationMarkers(this.busStationsOnMap);
    });
  }
  setBusStationMarkers(busStations: Station[]) {
    busStations.map((marker) => {
      const elStationMarker = document.createElement('div');
      elStationMarker.id = marker.id;
      const width = 25;
      const height = 25;
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
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
      });
      popup.setHTML(`<p>${marker.title}</p>`).addTo(this.mapBoxService.miniMap);
      markerDiv.setPopup(popup);
      popup.remove();
      markerDiv.getElement().addEventListener('mouseover', () => {
        markerDiv.togglePopup();
      });
      markerDiv.getElement().addEventListener('mouseleave', () => {
        popup.remove();
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
  public setBusStationSelectedRoute(
    busStations: Station[],
    busOnRoute?: Station[]
  ) {
    busStations.map((marker) => {
      const elStationMarker = document.createElement('div');
      elStationMarker.id = marker.id;
      let width = 25;
      let height = 25;
      elStationMarker.className = 'marker';
      elStationMarker.style.backgroundImage = `url('../../../assets/image/google-maps-bus-icon-14.jpg')`;
      elStationMarker.style.width = `${width}px`;
      elStationMarker.style.height = `${height}px`;
      elStationMarker.style.backgroundSize = '100%';
      const markerDiv = new mapboxgl.Marker(elStationMarker)
        .setLngLat([marker.longitude, marker.latitude] as [number, number])
        .addTo(this.mapBoxService.miniMap);
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
      });
      if (busOnRoute) {
        busOnRoute.map((value) => {
          if (value.id === marker.id) {
            width = 30;
            height = 30;
            elStationMarker.style.backgroundImage = `url('../../../assets/icons/bus-station-selected.svg')`;
            popup
              .setHTML(`<p>${marker.title}</p>`)
              .addTo(this.mapBoxService.miniMap);
            markerDiv.setPopup(popup);
            popup.remove();
            markerDiv.getElement().addEventListener('mouseover', () => {
              markerDiv.togglePopup();
            });
            markerDiv.getElement().addEventListener('mouseleave', () => {
              popup.remove();
            });
          }
        });
      }

      this.currentBusStationSelectedRoute.push(markerDiv);
    });
  }
  public removeBusStationSelectedRoute() {
    if (this.currentBusStationSelectedRoute !== null) {
      for (
        let i = this.currentBusStationSelectedRoute.length - 1;
        i >= 0;
        i--
      ) {
        this.currentBusStationSelectedRoute[i].remove();
      }
    }
  }
  getDetailRoute(event: any) {
    this.routeId = event.id;
    this.removeBusStationSelectedRoute();
    this.removeBusStationMarker();
    this.mapService
      .getRouteById(event.id)
      .subscribe((routeRes: RouteResponse) => {
        this.removeBusStationMarker();
        this.setBusStationSelectedRoute(
          this.busStationsOnMap,
          routeRes.body.stationList
        );
        this.distance = routeRes.body.distance;
        let stationList: any = [];
        routeRes.body.stationList?.map((stations: Station, index) => {
          if (index == 1) {
            this.mapBoxService.flyToMarkerMiniMap(
              stations.longitude,
              stations.latitude,
              12
            );
          }

          const lnglat = stations.longitude + ',' + stations.latitude;
          stationList = [...stationList, lnglat];
        });
        const coordinates = stationList.join(';');
        this.mapService.getRouteDirection(coordinates).subscribe((res) => {
          this.mapBoxService.getRouteMiniMap(res.routes[0]);
        });
      });
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
          this.distance = res.routes[0]?.distance;
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
          let distance;
          for (
            let index = 1;
            index < this.childrenStationList.length;
            index++
          ) {
            distance = this.childrenStationList[index].distance +=
              this.childrenStationList[index - 1]?.distance;
            this.childrenStationList[index].distance = distance;
          }

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
    this.loadingProgress = true;
    const routesDataSend: Route = {
      partnerId: this.partnerId,
      name: this._routesForm['routeName'].value,
      totalStation: this._routesForm['stationList'].value.length,
      distance: this._routesForm['distance'].value,
      stationList: this.childrenStationList,
    };
    if (this.blockLayout && this.isSubmit) {
      this.routeService.createRouteForPartner(routesDataSend).subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo tuyến đường thành công!',
            });
            setTimeout(() => {
              this.loadingProgress = false;
              this.location.back();
            }, 500);
          }
        },
        (error) => {
          this.loadingProgress = false;
        }
      );
    }
  }
  onChangeCreateFormStatus() {
    this.blockLayout = false;
    if (this.createFormStatus) {
      this.distance = '';
      this.removeBusStationSelectedRoute();
      this.mapBoxService.removeRouteMiniMap();
      this.setBusStationMarkers(this.busStationsOnMap);
    } else {
      this.routeId = '';
      this.distance = '';
      this.mapBoxService.removeRouteMiniMap();
      this.removeBusStationMarker();
      this.stations = [];
      this.setBusStationMarkers(this.busStationsOnMap);
    }
  }
  onAddRoute() {
    if (this.routeId == '' || this.routeId == null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Hãy chọn tuyến trước khi xác nhận',
      });
      return;
    }
    this.loadingProgress = true;
    this.routeService
      .creatRouteAlreadyForPartner(this.routeId, this.partnerId)
      .subscribe(
        (res) => {
          if (res.statusCode === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Thêm tuyến thành công',
            });
            setTimeout(() => {
              this.loadingProgress = false;
              this.location.back();
            }, 500);
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Có lỗi xẩy ra',
          });
          this.loadingProgress = false;
        }
      );
  }
}
