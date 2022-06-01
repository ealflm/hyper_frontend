import { Transaction } from './TransactionResponse';
import { UtilPaging } from './UtilPaging';
export abstract class Payment {
  id?: string;
  orderId?: string;
  amount?: number;
  createdDate?: Date;
  content?: string;
  transactionList?: Transaction[];
  status?: number;
}

export abstract class PaymentsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Payment[]>;
}
export abstract class PaymentResponse extends Transaction {
  statusCode?: number;
  message?: string;
  body!: Transaction;
}
