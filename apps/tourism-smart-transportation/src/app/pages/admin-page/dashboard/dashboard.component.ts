import { Subject } from 'rxjs';
import { MapBoxService } from './../../../services/map-box.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  $sub: Subject<any> = new Subject();
  dialog = true;
  constructor(private mapboxService: MapBoxService) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    // this.mapboxService.initializeMap2();
  }
  ngOnDestroy(): void {
    this.mapboxService.map.remove();
  }
}
