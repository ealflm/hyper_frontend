import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet/wallet.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PaymentComponent } from './payment/payment.component';

const FINANCE_ROUTE: Routes = [
  {
    path: 'finance',
    redirectTo: 'finance/wallet',
    pathMatch: 'full',
  },
  {
    path: 'wallet',
    component: WalletComponent,
  },
  {
    path: 'transaction',
    component: TransactionComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
];

@NgModule({
  declarations: [WalletComponent, TransactionComponent, PaymentComponent],
  imports: [CommonModule, RouterModule.forChild(FINANCE_ROUTE)],
})
export class FinanceModule {}
