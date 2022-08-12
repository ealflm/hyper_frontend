import { UtilPaging } from './UtilPaging';

export abstract class Package {
  id?: string;
  name?: string;
  peopleQuanitty!: number;
  duration!: number;
  photoUrl?: string;
  description?: string;
  price?: number;
  promotedTitle?: string;
  packageItems?: any[];
  status?: number;
}

export abstract class PackagesResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Package[]>;
}
export abstract class PackageResponse extends Package {
  statusCode?: number;
  message?: string;
  body!: Package;
}
