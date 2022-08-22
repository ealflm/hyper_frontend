import { Component, Input, OnInit } from '@angular/core';
import { add7Hours } from '../../providers/ConvertDate';

@Component({
  selector: 'tourism-smart-transportation-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  @Input() Wallet?: any;
  transaction: any = [];
  constructor() {}

  ngOnInit(): void {
    this.Wallet.orders.map((order: any) => {
      order.transactions.map((transaction: any) => {
        if (
          this.Wallet.wallet.walletId === transaction.walletId &&
          order?.orderId === transaction?.orderId
        ) {
          return (this.transaction = [
            ...this.transaction,
            {
              serviceTypeName: order.serviceTypeName,
              createdDate: add7Hours(transaction.createdDate),
              content: transaction.content,
              amount: transaction.amount,
            },
          ]);
        }
        return null;
      });
    });
  }
}
