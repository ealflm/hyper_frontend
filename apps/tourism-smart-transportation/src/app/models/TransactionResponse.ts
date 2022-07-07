import { UtilPaging } from './UtilPaging';

export abstract class Transaction {
  id?: string;
  paymentId?: string;
  walletId?: string;
  amount?: number;
  content?: string;
  createdDate?: Date;
  status?: number;
}
export class TransactionsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Transaction[]>;
}
