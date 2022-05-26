export abstract class Tier {
  id?: string;
  customerId?: string;
  tierId?: string;
  tierName?: string;
  name?: string;
  timeStart?: Date;
  timeEnd?: Date;
  status?: number;
}
abstract class UtilPaging {
  pageSize?: number;
  totalItems?: number;
  items!: Tier[];
}
export abstract class TiersResponse extends UtilPaging {
  statusCode?: number;
  message?: string;
  body!: UtilPaging;
}
export abstract class TierResponse extends Tier {
  statusCode?: number;
  message?: string;
  body!: Tier;
}
