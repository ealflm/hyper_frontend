import { UtilPaging } from './UtilPaging';

export abstract class DiscountsResponse extends UtilPaging {
  statusCode?: number;
  message?: string;
  body!: UtilPaging;
}

export abstract class Discount {
  id?: string;
  title?: string;
  description?: string;
  code?: string;
  timeStart!: Date;
  timeEnd!: Date;
  photoUrl?: string;
  value?: number;
  status?: number;
}
export abstract class DiscountResponse extends Discount {
  statusCode?: number;
  message?: string;
  body!: Discount;
}
