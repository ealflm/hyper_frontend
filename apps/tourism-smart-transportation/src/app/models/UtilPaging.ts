export abstract class UtilPaging<Type> {
  pageSize?: number;
  totalItems!: number;
  items!: Type;
}
