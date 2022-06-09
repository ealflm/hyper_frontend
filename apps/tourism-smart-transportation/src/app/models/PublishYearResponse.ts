import { UtilPaging } from './UtilPaging';

export class PublishYear {
  id?: string;
  name?: string;
  description?: string;
  status?: number;
}
export class PublishYearsResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<PublishYear[]>;
}

export class PublishYearResponse {
  statusCode?: number;
  message?: string;
  body!: PublishYear;
}
