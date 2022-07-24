export class Driver {
  id?: string;
  partnerId?: string;
  vehicleId?: string;
  licensePlates?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  gender?: boolean;
  phone?: string;
  dateOfBirth?: string;
  createdDate?: Date;
  modifiedDate?: Date;
  status?: number;
  vehicleName?: string;
  vehicleTypeLabel?: string;
  vehicleTypeName?: string;
  serviceTypeName?: string;
  name?: string;
  feedbackRating?: number;
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
