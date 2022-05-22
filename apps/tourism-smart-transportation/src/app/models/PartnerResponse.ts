export abstract class Partner {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  photoUrl?: string;
  gender?: boolean;
  phone?: string;
  address1?: null | string;
  address2?: null | string;
  dateOfBirth!: Date;
  email?: null;
  createdDate?: Date;
  modifiedDate?: Date;
  status?: number;
  companyName?: string;
}
export interface PartnersResponse extends UtilPaging {
  statusCode?: number;
  message?: string;
  body: UtilPaging;
}
export abstract class UtilPaging {
  pageSize?: number;
  totalItems!: number;
  items!: Partner[];
}
export abstract class PartnerResponse extends Partner {
  statusCode?: number;
  message?: string;
  body!: Partner;
}
