import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-dots-menu',
  templateUrl: './dots-menu.component.html',
  styleUrls: ['./dots-menu.component.scss'],
})
export class DotsMenuComponent implements OnInit {
  @Input() order: any;
  @Output() GetOrderDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() GetPaymentDetails: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  onDetailTransaction(e: any) {
    this.GetOrderDetails.emit({
      order: e,
      paytmentDialogStatus: false,
    });
  }
  onGetPayment(e: any) {
    this.GetPaymentDetails.emit({
      order: e,
      paymentDialogStatus: true,
    });
  }
}
