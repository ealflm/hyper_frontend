import { UtilPaging } from './UtilPaging';

export abstract class Customer {
  id?: string;
  tierId?: string;
  firstName?: string;
  lastName?: string;
  gender?: boolean;
  phone?: string;
  address1?: string;
  address2?: string;
  photoUrl?: string;
  cardUid?: string;
  dateOfBirth!: Date;
  email?: string;
  purchaseMoney?: number;
  createdDate?: Date;
  modifiedDate?: Date;
  status?: number;
}
export abstract class CustomersResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Customer[]>;
}
export abstract class CustomerResponse extends Customer {
  statusCode?: number;
  message?: string;
  body!: Customer;
}
