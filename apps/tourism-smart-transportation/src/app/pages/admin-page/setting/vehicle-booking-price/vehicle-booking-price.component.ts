import { STATUS_VEHICLE_BOOKING_PRICE } from './../../../../constant/status';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-vehicle-booking-price',
  templateUrl: './vehicle-booking-price.component.html',
  styleUrls: ['./vehicle-booking-price.component.scss'],
})
export class VehicleBookingPriceComponent implements OnInit {
  menuValue: any = [
    {
      value: 1,
      lable: 'Kích hoạt',
    },
    {
      value: 0,
      lable: 'Vô hiệu hóa',
    },
    {
      value: null,
      lable: 'Tất cả',
    },
  ];
  editMode = false;
  vehicleBookingPriceStatus: any = [];
  bookingPrices: any = [
    {
      id: '1',
      vehicleType: 'xe máy',
      distanceDefault: 2,
      priceFixed: 12000,
      pricePerKm: 10000,
      status: 1,
    },
  ];
  displayDialog = false;

  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._mapVehicleBookingStatus();
  }
  private _mapVehicleBookingStatus() {
    this.vehicleBookingPriceStatus = Object.keys(
      STATUS_VEHICLE_BOOKING_PRICE
    ).map((key) => {
      return {
        id: key,
        lable: STATUS_VEHICLE_BOOKING_PRICE[key].lable,
        class: STATUS_VEHICLE_BOOKING_PRICE[key].class,
      };
    });
  }
  createBookingPrice(editMode: boolean) {
    this.editMode = editMode;
    this.displayDialog = true;
  }
  onChangeFillterByName(e: any) {}
  onGetValueMenu(e: any) {}
  onDeleteBookingPrice(id: string, deleteStatus: boolean) {
    this.confirmationService.confirm({});
  }
  updateBookingPrice(editMode: boolean, id: string) {}
  cancelDialog(displayDialog: boolean, comebackStatus: boolean) {
    this.displayDialog = false;
  }
  onSaveBookingPrice() {}
  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;
  }
}
