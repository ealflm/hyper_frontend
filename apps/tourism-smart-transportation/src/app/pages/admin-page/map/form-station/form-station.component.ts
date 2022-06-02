import { environment } from './../../../../../environments/environment.prod';
import { MapBoxService } from './../../../../services/map-box.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  OnChanges,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'tourism-smart-transportation-form-station',
  templateUrl: './form-station.component.html',
  styleUrls: ['./form-station.component.scss'],
})
export class FormStationComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnChanges
{
  private _dialog = false;
  afterViewInit = false;
  @Input() set showDialog(value: boolean) {
    console.log('this.value ', value);
    if (value && this.afterViewInit) {
      this._dialog = value;
      console.log('this   ppp   ', value);
      // this.mapboxService.map2;
      // this.mapboxService.map2.resize();
    }
  }
  get showDialog(): boolean {
    return this._dialog;
  }
  @Output() hiddenDialog: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('mapChild') mapChild!: ElementRef;
  constructor(private mapboxService: MapBoxService) {
    console.log('contructor');
  }

  ngOnInit(): void {
    console.log('OnInit');
  }
  // khoi tao dom
  ngAfterViewInit() {
    console.log('chạy');
    this.afterViewInit = true;
  }
  // sau khi khoi tao xong dom
  ngAfterViewChecked(): void {
    if (this._dialog && this.afterViewInit) {
      this.mapboxService.initializeMap2();
      this.mapboxService.map2.resize();
      this.afterViewInit = false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('onchanges ', this.showDialog);
  }

  onCloseDialog() {
    this.hiddenDialog.emit();
  }
  onSaveStation() {}
}
