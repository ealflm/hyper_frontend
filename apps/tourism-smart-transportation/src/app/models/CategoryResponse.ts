import { UtilPaging } from './UtilPaging';

export class Category {
  id?: string;
  name?: string;
  description?: string;
  status?: number;
}
export class CategoryResponse {
  statusCode?: number;
  message?: string;
  body!: Category;
}
export class CategorysResponse {
  statusCode?: number;
  message?: string;
  body!: UtilPaging<Category>;
}
