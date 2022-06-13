import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-data-map',
  templateUrl: './data-map.component.html',
  styleUrls: ['./data-map.component.scss'],
})
export class DataMapComponent implements OnInit, OnChanges {
  @Input() DataMapValue: any = [];
  @Input() CheckBoxValue: string[] = [];
  @Output() GetFillterValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() GetValueCheckBox: EventEmitter<any> = new EventEmitter<any>();
  selectedCheckBox: string[] = [];
  fillterValue?: string = 'vehicle';
  constructor() {}

  ngOnInit(): void {
    console.log(this.selectedCheckBox);
    this.selectedCheckBox = this.CheckBoxValue;
  }
  ngOnChanges(changes: SimpleChanges): void {}
  onChangeFillterValue(value: string) {
    this.fillterValue = value;
    this.GetFillterValue.emit(this.fillterValue);
  }
  onChangeCheckBox() {
    this.GetValueCheckBox.emit(this.selectedCheckBox);
  }
}
