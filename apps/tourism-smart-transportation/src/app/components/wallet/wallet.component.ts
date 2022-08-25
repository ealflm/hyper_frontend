import { Component, Input, OnInit } from '@angular/core';
import { add7Hours } from '../../providers/ConvertDate';
import { PrimeNGConfig, MessageService } from 'primeng/api';
// import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'tourism-smart-transportation-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  // @Input() Wallet?: any;

  _wallet: any;
  transaction: any = [];
  currentTransaction: any = [];
  fromDate!: Date;
  toDate!: Date;
  @Input() set Wallet(wallet: any) {
    if (wallet) {
      this._wallet = wallet;
      this._wallet.orders.map((order: any) => {
        order.transactions.filter((transaction: any) => {
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
      this.transaction = this.transaction.sort(
        (a: any, b: any) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
      this.currentTransaction = this.transaction;
    }
  }

  constructor(
    private config: PrimeNGConfig, // private translateService: ,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // this.translateService.setDefaultLang('vn');
  }
  onFilterTransaction() {
    if (new Date(this.fromDate).getTime() >= new Date(this.toDate).getTime()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Ngày bắt đầu phải bé hơn ngày kết thúc',
      });
      return;
    }
    this.transaction = this.currentTransaction.filter(
      (element: any) =>
        new Date(this.fromDate).getTime() <=
          new Date(element.createdDate).getTime() &&
        new Date(element.createdDate).getTime() <=
          new Date(this.toDate).getTime()
    );
  }
  // translate(lang: string) {
  //   this.translateService.use(lang);
  //   this.translateService
  //     .get('primeng')
  //     .subscribe((res) => this.config.setTranslation(res));
  // }
}
