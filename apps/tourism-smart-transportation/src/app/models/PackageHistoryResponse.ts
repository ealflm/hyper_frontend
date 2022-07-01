import { UtilPaging } from './UtilPaging';

export abstract class PackageHistory {
  id?: string;
  customerId?: string;
  tierId?: string;
  tierName?: string;
  name?: string;
  timeStart?: Date;
  timeEnd?: Date;
  status?: number;
}

export abstract class PackageHistorysResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<PackageHistory[]>;
}
export abstract class PackageHistoryResponse extends PackageHistory {
  statusCode?: number;
  message?: string;
  body!: PackageHistory;
}
