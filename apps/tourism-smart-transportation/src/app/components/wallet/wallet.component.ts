import { Component, Input, OnInit } from '@angular/core';
import { add7Hours } from '../../providers/ConvertDate';

@Component({
  selector: 'tourism-smart-transportation-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  // @Input() Wallet?: any;

  _wallet: any;
  transaction: any = [];

  @Input() set Wallet(wallet: any) {
    if (wallet) {
      this._wallet = wallet;
      this._wallet.orders.map((order: any) => {
        order.transactions.map((transaction: any) => {
          if (
            this._wallet?.wallet?.walletId === transaction?.walletId &&
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

          return;
        });
      });
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
