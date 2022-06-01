import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-list-stations',
  templateUrl: './list-stations.component.html',
  styleUrls: ['./list-stations.component.scss'],
})
export class ListStationsComponent implements OnInit {
  @Input() stations: any = [];
  @Output() FillterStation: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  onChangeFillterMapStation(event: any) {
    this.FillterStation.emit(event.target.value);
    console.log(event);
  }
}
