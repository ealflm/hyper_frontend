import { environment } from './../../../environments/environment';
import { MapService } from './../../services/map.service';
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'tourism-smart-transportation-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewChecked {
  coordinates: any;
  constructor(private mapboxService: MapService) {}

  ngOnInit(): void {
    this.mapboxService.getCoordinates().subscribe((res: any) => {
      this.coordinates = res;
      // console.log(res);
    });
  }
  ngOnDestroy(): void {}
  ngAfterViewChecked(): void {
    this.mapboxService.map.resize();
  }
  deleteMarkers() {
    this.mapboxService.deleteMarkers();
  }
}
