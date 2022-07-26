import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  AfterViewChecked,
  DoCheck,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-data-map',
  templateUrl: './data-map.component.html',
  styleUrls: ['./data-map.component.scss'],
})
export class DataMapComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewChecked
{
  selectedCheckBox: string[] = [];
  @Input() DataMapValue: any = [];
  @Input() set CheckBoxValue(value: string) {
    if (value) {
      if (!this.selectedCheckBox.includes(value)) {
        this.selectedCheckBox = [...this.selectedCheckBox, value];
        this.GetValueCheckBox.emit(this.selectedCheckBox);
        console.log(this.selectedCheckBox);
      }
    }
  }

  @Output() GetFillterValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() GetValueCheckBox: EventEmitter<any> = new EventEmitter<any>();
  @Input() fillterValue?: string = 'vehicle';
  constructor(private cd: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}
  onChangeFillterValue(value: string) {
    this.fillterValue = value;
    this.GetFillterValue.emit(this.fillterValue);
  }
  onChangeCheckBox() {
    this.GetValueCheckBox.emit(this.selectedCheckBox);
  }
}
