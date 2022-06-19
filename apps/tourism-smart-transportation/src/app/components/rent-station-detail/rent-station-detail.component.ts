import { LocalStorageService } from './../../auth/localstorage.service';
import { RentStation } from './../../models/RentStationResponse';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-rent-station-detail',
  templateUrl: './rent-station-detail.component.html',
  styleUrls: ['./rent-station-detail.component.scss'],
})
export class RentStationDetailComponent implements OnInit {
  @Input() RentStation!: RentStation;
  @Output() GetRentStationId: EventEmitter<any> = new EventEmitter<any>();
  @Output() DeleteRentStationId: EventEmitter<any> = new EventEmitter<any>();

  roleUser = '';
  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    this.roleUser = user.role;
  }
  editRentStation(id: string) {
    this.GetRentStationId.emit(id);
  }
  deleteRentStation(id: string) {
    this.DeleteRentStationId.emit(id);
  }
}
