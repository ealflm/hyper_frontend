import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-header-status',
  templateUrl: './header-status.component.html',
  styleUrls: ['./header-status.component.scss'],
  animations: [
    trigger('openCloseIcon', [
      state(
        'openIcon',
        style({
          transform: 'rotate(0deg)',
        })
      ),
      state(
        'closeIcon',
        style({
          transform: 'rotate(90deg)',
        })
      ),
      transition('openIcon <=> closeIcon', [animate('1s')]),
    ]),
  ],
})
export class HeaderStatusComponent implements OnInit {
  isOpenIconFillter?: boolean = true;
  fillterStatus?: number = 1;
  @Input() menuValue: any = [];

  @Output() GetValueMenu: EventEmitter<any> = new EventEmitter<any>();
  @Input() set filterStatus(menu: any) {
    this.fillterStatus = menu;
    console.log(menu);
    console.log(this.fillterStatus);
  }
  constructor() {}

  ngOnInit(): void {}
  onToggleIconFillter() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
  }
  navmenuclick(numberValue: any) {
    this.fillterStatus = numberValue;
    this.GetValueMenu.emit(numberValue);
  }
}
