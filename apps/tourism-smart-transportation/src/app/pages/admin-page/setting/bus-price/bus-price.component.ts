import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { STATUS_BUS_PRICE } from '../../../../constant/status';

@Component({
  selector: 'tourism-smart-transportation-bus-price',
  templateUrl: './bus-price.component.html',
  styleUrls: ['./bus-price.component.scss'],
})
export class BusPriceComponent implements OnInit {
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
  busPriceStatus: any = [];
  busPrices: any = [
    {
      route: 1,
      distance: 2,
      numberOfStation: 3,
      price: 10000,
      mode: 'Khoảng cách',
      status: 1,
    },
  ];
  displayBusPriceDialog = false;

  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._mapBusPriceStatus();
  }
  private _mapBusPriceStatus() {
    this.busPriceStatus = Object.keys(STATUS_BUS_PRICE).map((key) => {
      return {
        id: key,
        lable: STATUS_BUS_PRICE[key].lable,
        class: STATUS_BUS_PRICE[key].class,
      };
    });
  }
  createBusPrice(editMode: boolean) {
    this.editMode = editMode;
    this.displayBusPriceDialog = true;
  }
  onChangeFillterByName(e: any) {}
  onGetValueMenu(e: any) {}
  onDeleteBusPrice(id: string, deleteStatus: boolean) {
    this.confirmationService.confirm({});
  }
  updateBusPrice(editMode: boolean, id: string) {}
  cancelDialog(displayDialog: boolean, comebackStatus: boolean) {
    this.displayBusPriceDialog = false;
  }
  onSaveBusPrice() {}
  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;
  }
}
