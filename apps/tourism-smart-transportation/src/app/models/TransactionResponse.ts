export abstract class Transaction {
  id?: string;
  paymentId?: string;
  walletId?: string;
  amount?: number;
  content?: string;
  createdDate?: Date;
  status?: number;
}
