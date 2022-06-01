import { environment } from './../../../environments/environment';
import { MapBoxService } from '../../services/map-box.service';
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
  constructor(private mapboxService: MapBoxService) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  ngAfterViewChecked(): void {
    this.mapboxService.map.resize();
  }
}
