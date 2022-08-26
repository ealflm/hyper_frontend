import { UtilPaging } from './UtilPaging';

export class DiscountsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Discount[]>;
}

export class Discount {
  id?: string;
  title?: string;
  serviceTypeId?: string;
  description?: string;
  code?: string;
  timeStart!: Date;
  timeEnd!: Date;
  photoUrl?: string;
  value?: number;
  status?: number;
}
export class DiscountResponse extends Discount {
  statusCode?: number;
  message?: string;
  body!: Discount;
}
