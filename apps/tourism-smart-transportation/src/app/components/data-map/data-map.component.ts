import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-data-map',
  templateUrl: './data-map.component.html',
  styleUrls: ['./data-map.component.scss'],
})
export class DataMapComponent implements OnInit {
  @Input() DataMapValue: any = [];
  @Output() GetFillterValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() GetValueCheckBox: EventEmitter<any> = new EventEmitter<any>();
  selectedCheckBox: string[] = [];
  fillterValue?: string = 'driver';
  constructor() {}

  ngOnInit(): void {
    console.log(this.selectedCheckBox);
  }
  onChangeFillterValue(value: string) {
    this.fillterValue = value;
    this.GetFillterValue.emit(this.fillterValue);
  }
  onChangeCheckBox() {
    this.GetValueCheckBox.emit(this.selectedCheckBox);
  }
}
