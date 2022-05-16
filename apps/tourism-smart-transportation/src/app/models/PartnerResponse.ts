export abstract class Partner {
  id?: string;
  name?: string;
  userName?: string;
  address?: string;
  photoUrl?: string;
  status?: string;
}
export abstract class UtilPaging {
  pageSize?: number;
  totalItems?: number;
  items?: Partner[];
}
export abstract class PartnerResponse extends Partner {
  statusCode?: number;
  message?: string;
  body?: Partner;
}
export interface PartnersResponse extends UtilPaging {
  statusCode?: number;
  message?: string;
  body: UtilPaging;
}
