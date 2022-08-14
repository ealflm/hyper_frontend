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
export const STATUS_CUSTOMER_TRIP_FILTER = [
  {
    label: 'Đã Hủy',
    value: 0,
  },
  {
    label: 'Mới tạo',
    value: 1,
  },
  {
    label: 'Đã chấp thuận',
    value: 2,
  },
  {
    label: 'Đã đón khách',
    value: 3,
  },
  {
    label: 'Đang thuê',
    value: 4,
  },
  {
    label: 'Quá hạn',
    value: 5,
  },
  {
    label: 'Hoàn Thành',
    value: 6,
  },
  {
    label: 'Yêu cầu trả phương tiện',
    value: 7,
  },
];
