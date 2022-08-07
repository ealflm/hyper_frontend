import { UtilPaging } from './UtilPaging';

export abstract class Order {
  id?: string;
  customerId?: string;
  serviceTypeId?: string;
  serviceTypeName?: string;
  discountId?: string;
  createdDate!: Date;
  totalPrice?: number;
  status?: number;
}
export class OrderDetail {
  id?: string;
  orderId?: string;
  price!: number;
  quantity!: number;
  content?: string;
  status?: number;
}
export class OrdersResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Order[]>;
}

export class OrderResponse extends Order {
  statusCode?: number;
  message?: string;
  body?: Order;
}
export class OrderDetailsResponse extends OrderDetail {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<OrderDetail[]>;
}
