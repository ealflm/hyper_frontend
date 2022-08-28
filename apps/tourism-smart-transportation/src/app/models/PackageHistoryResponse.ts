import { UtilPaging } from './UtilPaging';

export class PackageHistory {
  id?: string;
  customerId?: string;
  tierId?: string;
  tierName?: string;
  name?: string;
  timeStart!: Date;
  timeEnd!: Date;
  status?: number;
}

export class PackageHistorysResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<PackageHistory[]>;
}
export class PackageHistoryResponse extends PackageHistory {
  statusCode?: number;
  message?: string;
  body!: PackageHistory;
}
