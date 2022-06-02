import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-list-rent-stations',
  templateUrl: './list-rent-stations.component.html',
  styleUrls: ['./list-rent-stations.component.scss'],
})
export class ListRentStationsComponent implements OnInit {
  @Input() rent_stations: any = [];
  @Output() GetFillterRentStation: EventEmitter<any> = new EventEmitter<any>();
  @Output() GetIdRentStation: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  onChangeFillterMapRentStation(e: any) {
    this.GetFillterRentStation.emit(e.target.value);
  }
  showDetail(id?: string) {
    this.GetIdRentStation.emit({
      showDetailStatus: true,
      id: id,
    });
  }
}
