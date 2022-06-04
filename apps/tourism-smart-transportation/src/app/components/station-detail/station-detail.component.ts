import { Station } from './../../models/Station';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
})
export class StationDetailComponent implements OnInit {
  @Input() StationDetail?: Station;
  @Output() GetStationId: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  editStation(stationId: string) {
    this.GetStationId.emit(stationId);
  }
}
