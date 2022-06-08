import { STATUS_VEHICLE_RENTING_PRICE } from './../../../../constant/status';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'tourism-smart-transportation-vehicle-renting-price',
  templateUrl: './vehicle-renting-price.component.html',
  styleUrls: ['./vehicle-renting-price.component.scss'],
})
export class VehicleRentingPriceComponent implements OnInit {
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
  vehicleRentingPriceStatus: any = [];
  rentingPrices: any = [
    {
      id: '1',
      publishYear: '2013',
      vehicleType: 'xe máy',
      timePerHours: 2,
      timePricePerHours: 90000,
      priceFixed: 10000,
      priceWeekend: 11000,
      priceHoliday: 12000,
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
    this.vehicleRentingPriceStatus = Object.keys(
      STATUS_VEHICLE_RENTING_PRICE
    ).map((key) => {
      return {
        id: key,
        lable: STATUS_VEHICLE_RENTING_PRICE[key].lable,
        class: STATUS_VEHICLE_RENTING_PRICE[key].class,
      };
    });
  }
  createRentingPrice() {
    this.editMode = false;
    this.displayDialog = true;
  }
  onChangeFillterByName(e: any) {}
  onGetValueMenu(e: any) {}
  onDeleteRentingPrice(id: string) {
    this.confirmationService.confirm({});
  }
  updateRentingPrice(id: string) {
    this.editMode = true;
  }
  cancelDialog() {
    this.displayDialog = false;
  }
  onSaveRentingPrice() {}
  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;
  }
}
