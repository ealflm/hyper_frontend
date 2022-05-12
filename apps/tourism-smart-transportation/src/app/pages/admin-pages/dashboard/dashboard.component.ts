import { MapService } from './../../../services/map.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  AfterContentInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.mapService.initializeMap();
    this.mapService.setMarker();
    this.mapService.addMarker();
  }
  delete() {
    console.log('click');
  }
}
