import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-dots-menu',
  templateUrl: './dots-menu.component.html',
  styleUrls: ['./dots-menu.component.scss'],
})
export class DotsMenuComponent implements OnInit {
  @Input() orderId: any;
  @Output() GetDetails: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  onDetailTransaction(e: any) {
    this.GetDetails.emit(e);
  }
}
