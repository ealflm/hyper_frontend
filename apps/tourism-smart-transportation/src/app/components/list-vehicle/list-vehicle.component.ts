import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-list-vehicle',
  templateUrl: './list-vehicle.component.html',
  styleUrls: ['./list-vehicle.component.scss'],
})
export class ListVehicleComponent implements OnInit {
  @Input() vehicles: any = [];

  @Output() GetFillterVehicleName: EventEmitter<any> = new EventEmitter<any>();
  @Output() GetIdVehicle: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  onChangeFillterMapVehicle(e: any) {
    this.GetFillterVehicleName.emit(e.target.value);
  }
  showDetail(id?: string) {
    this.GetIdVehicle.emit({
      showDetailStatus: true,
      id: id,
    });
  }
}
