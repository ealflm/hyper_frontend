import { ServiceType } from './ServiceTypeResponse';
import { Service } from './ServicesResponse';
import { UtilPaging } from './UtilPaging';

export class Partner {
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
  createdDate!: Date;
  modifiedDate!: Date;
  status?: number;
  companyName?: string;
  serviceTypeList?: ServiceType[];
}
export class PartnersResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Partner[]>;
}
export class PartnerResponse extends Partner {
  statusCode?: number;
  message?: string;
  body!: Partner;
}
