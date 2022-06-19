import { LocalStorageService } from './../../auth/localstorage.service';
import { Station } from './../../models/StationResponse';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
})
export class StationDetailComponent implements OnInit {
  @Input() StationDetail?: Station;
  @Output() GetStationId: EventEmitter<any> = new EventEmitter<any>();
  @Output() DeleteStationId: EventEmitter<any> = new EventEmitter<any>();

  roleUser = '';
  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    this.roleUser = user.role;
  }
  editStation(stationId: string) {
    this.GetStationId.emit(stationId);
  }
  deleteStation(stationId: string) {
    this.DeleteStationId.emit(stationId);
  }
}
