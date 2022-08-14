export enum ServiceTypeEnum {
  RentCarService = '5168511d-57f1-460a-8c7c-14664e3dbccc',
  BusService = 'd3d43e77-1602-4e16-a8d7-485d4f309db7',
  BookCarService = 'c6ca1cf7-08bb-4f06-8d5d-48ba93251a6d',
}
export const SERVICE_TYPE_MAPING = {
  [ServiceTypeEnum.BookCarService]: { name: 'Đặt xe' },
  [ServiceTypeEnum.BusService]: { name: 'Đi xe buýt' },
  [ServiceTypeEnum.RentCarService]: { name: 'Thuê xe' },
};
export const ServiceTypeFilter = [
  { label: 'Thuê xe', value: 'Thuê xe' },
  { label: 'Đi xe buýt', value: 'Đi xe buýt' },
  { label: 'Đặt xe', value: 'Đặt xe' },
];
export const OrderServiceTypeFilter = [
  { label: 'Thuê xe', value: 'Thuê xe' },
  { label: 'Đi xe buýt', value: 'Đi xe buýt' },
  { label: 'Đặt xe', value: 'Đặt xe' },
  { label: 'Nạp tiền', value: 'Nạp tiền' },
  { label: 'Mua gói dịch vụ', value: 'Mua gói dịch vụ' },
];
