import { MapService } from './../../services/map.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(private map: MapService) {}

  ngOnInit(): void {
    this.map.getLocation();
    this.map.buildMap();
  }
}
