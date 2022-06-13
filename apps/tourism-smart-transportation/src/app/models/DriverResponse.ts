export class Driver {
  id?: string;
  partnerId?: string;
  vehicleId?: string;
  licensePlates?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: null;
  gender?: boolean;
  phone?: string;
  dateOfBirth?: Date;
  createdDate?: Date;
  modifiedDate?: Date;
  status?: number;
}

export class DriversResponse {
  statusCode?: number;
  message?: string;
  body!: Driver[];
}

export class DriverResponse {
  statusCode?: number;
  message?: string;
  body!: Driver;
}
