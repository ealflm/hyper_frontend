import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-list-drivers',
  templateUrl: './list-drivers.component.html',
  styleUrls: ['./list-drivers.component.scss'],
})
export class ListDriversComponent implements OnInit {
  @Input() drivers: any = [];
  @Output() GetFillterDriverName: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  onChangeFillterMapDriver(e: any) {
    this.GetFillterDriverName.emit(e.event.tagert);
  }
}
