import { Transaction } from './TransactionResponse';
import { UtilPaging } from './UtilPaging';
export class Payment {
  id?: string;
  orderId?: string;
  amount?: number;
  createdDate?: Date;
  content?: string;
  transactionList?: Transaction[];
  status?: number;
}

export class PaymentsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Payment[]>;
}
export class PaymentResponse extends Transaction {
  statusCode?: number;
  message?: string;
  body!: Transaction;
}
