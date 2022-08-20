import { Component, Input, OnInit } from '@angular/core';
import { STATUS_TRANSACTION } from '../../constant/status';
import { Order } from '../../models/OrderResponse';

@Component({
  selector: 'tourism-smart-transportation-invoice-bill',
  templateUrl: './invoice-bill.component.html',
  styleUrls: ['./invoice-bill.component.scss'],
})
export class InvoiceBillComponent implements OnInit {
  private displayDialog = false;
  @Input() set invoiceDialog(dialog: boolean) {
    this.displayDialog = dialog;
  }
  get invoiceDialog(): boolean {
    return this.displayDialog;
  }
  @Input() invoiceDetails: any;
  @Input() invoiceTotal?: any;
  orderStatus = STATUS_TRANSACTION;
  constructor() {}

  ngOnInit(): void {}
}
