import { ServiceType } from './ServiceTypeResponse';
import { Service } from './ServicesResponse';
import { UtilPaging } from './UtilPaging';

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
  createdDate!: Date;
  modifiedDate!: Date;
  status?: number;
  companyName?: string;
  serviceTypeList?: ServiceType[];
}
export abstract class PartnersResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Partner[]>;
}
export abstract class PartnerResponse extends Partner {
  statusCode?: number;
  message?: string;
  body!: Partner;
}
