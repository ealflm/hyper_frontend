import { UtilPaging } from './UtilPaging';

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

export abstract class TiersResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Tier[]>;
}
export abstract class TierResponse extends Tier {
  statusCode?: number;
  message?: string;
  body!: Tier;
}
