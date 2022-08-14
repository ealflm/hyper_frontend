import { UtilPaging } from './UtilPaging';

export abstract class Transaction {
  orderId?: string;
  paymentId?: string;
  walletId?: string;
  amount?: number;
  content?: string;
  createdDate!: Date;
  status?: number;
  customerName?: string;
  companyName?: string;
}
export class TransactionsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Transaction[]>;
}
