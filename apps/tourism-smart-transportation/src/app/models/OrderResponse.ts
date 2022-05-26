import { UtilPaging } from './UtilPaging';

export abstract class Order {
  id?: string;
  customerId?: string;
  createdDate?: Date;
  totalPrice?: number;
  status?: number;
}
export class OrderDetail {
  id?: string;
  orderId?: string;
  tierId?: string;
  price!: number;
  quantity!: number;
  content?: string;
  status?: number;
  totalPrice?: number;
}
export class OrdersResponse extends UtilPaging {
  statusCode?: number;
  message?: string;
  body!: UtilPaging;
}

export class OrderResponse extends Order {
  statusCode?: number;
  message?: string;
  body?: Order;
}
export class OrderDetailsResponse extends OrderDetail {
  statusCode?: number;
  message?: string;
  body!: UtilPaging;
}
