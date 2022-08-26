import { UtilPaging } from './UtilPaging';

export class Package {
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

export class PackagesResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Package[]>;
}
export class PackageResponse extends Package {
  statusCode?: number;
  message?: string;
  body!: Package;
}
