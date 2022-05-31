import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

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
  isOpenIconFillter?: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  onToggle() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
  }
}
