import { ConfirmationService, MessageService } from 'primeng/api';
import { LocalStorageService } from './../../../auth/localstorage.service';
import { map } from 'rxjs';
import {
  OrderServiceTypeFilter,
  STATUS_CUSTOMER_TRIP_FILTER,
} from './../../../constant/service-type';
import {
  STATUS_CUSTOMER_TRIP,
  STATUS_TRANSACTION,
} from './../../../constant/status';
import { Component, OnInit } from '@angular/core';
import { MenuFilterOrder } from '../../../constant/menu-filter-status';
import { Order } from '../../../models/OrderResponse';
import { PurchaseHistoryService } from '../../../services/purchase-history.service';
import { CustomerTrip } from '../../../models/CustomerTripResponse';
import { ServiceTypeFilter } from '../../../constant/service-type';

@Component({
  selector: 'tourism-smart-transportation-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  loading = false;
  menuValue = MenuFilterOrder;
  orders: Order[] = [];
  orderStatus = STATUS_TRANSACTION;
  customerTripStatus = STATUS_CUSTOMER_TRIP;
  customerTrips: CustomerTrip[] = [];
  customerTripFilter = false;
  orderServiceTypeFilter = ServiceTypeFilter;
  customerTripServiceFilter = ServiceTypeFilter;
  statusCustomerTripFilter = STATUS_CUSTOMER_TRIP_FILTER;
  invoiceDialog = false;

  invoiceDetails: any = [];
  totalPrice = 0;
  partnerId = '';
  invoiceTotal?: Order;
  constructor(
    private orderService: PurchaseHistoryService,
    private localStorageService: LocalStorageService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    this.partnerId = user?.id;
    this.getListOrders();
  }
  OnGetMenuClick(value: any) {
    if (value === 1) {
      this.customerTripFilter = false;
      this.getListOrders();
    } else if (value === 2) {
      this.customerTripFilter = true;
      this.getListCustomerTrip();
    }
  }
  getListOrders() {
    this.orderService
      .getListOrdersForPartner(this.partnerId)
      .subscribe((orderRes) => {
        this.orders = orderRes.body.items;
      });
  }
  getListCustomerTrip() {
    this.orderService
      .getListCustomerTripForPartner(this.partnerId)
      .subscribe((customerTripRes) => {
        this.customerTrips = customerTripRes.body;
      });
  }
  viewInvoiceDetail(id: string, order: Order) {
    this.invoiceDialog = true;
    console.log(order);
    this.invoiceTotal = order;
    this.orderService
      .getTransactionsByOrderIdForPartner(id)
      .subscribe((res) => {
        this.invoiceDetails = res.body.items.sort(
          (a, b) =>
            new Date(a.createdDate).getTime() -
            new Date(b.createdDate).getTime()
        );
      });
  }
  activeVehicle(id: string) {
    this.confirmService.confirm({
      key: 'activeVehicleConfirm',
      accept: () => {
        this.orderService.returnVehicle(id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Trả xe thành công',
          });
          this.getListCustomerTrip();
        });
      },
    });
  }
}
