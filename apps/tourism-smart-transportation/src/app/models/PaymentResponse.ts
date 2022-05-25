import { Transaction } from './TransactionResponse';
export abstract class Payment {
  id?: string;
  orderId?: string;
  amount?: number;
  createdDate?: Date;
  content?: string;
  transactionList?: Transaction[];
  status?: number;
}
abstract class UtilPaging {
  pageSize?: number;
  totalItems?: number;
  items!: Payment[];
}
export abstract class PaymentsResponse extends UtilPaging {
  statusCode?: number;
  message?: string;
  body!: UtilPaging;
}
export abstract class PaymentResponse extends Transaction {
  statusCode?: number;
  message?: string;
  body!: Transaction;
}
