export class Partner {
  id?: string;
  name?: string;
  userName?: string;
  address?: string;
  photoUrl?: string;
  status?: string;
}
export interface UtilPaging {
  pageSize?: string;
  totalItems?: string;
}
export interface PartnerResponse extends UtilPaging {
  // id?: string;
  // name?: string;
  // userName?: string;
  // address?: string;
  // photoUrl?: string;
  // status?: string;

  items?: Partner[];
}
