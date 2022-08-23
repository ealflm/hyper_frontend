import { map } from 'rxjs';
import {
  OrderServiceTypeFilter,
  ServiceTypeEnum,
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
import { PrimeNGConfig } from 'primeng/api';

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
  orderServiceTypeFilter = OrderServiceTypeFilter;
  customerTripServiceFilter = ServiceTypeFilter;
  invoiceDialog = false;
  ServiceTypeEnum = ServiceTypeEnum;
  invoiceDetails: any = [];
  totalPrice = 0;
  invoiceTotal?: Order;
  constructor(
    private orderService: PurchaseHistoryService,
    private configPrimeng: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.getListOrders();
  }
  OnGetMenuClick(value: any) {
    // console.log(value);
    if (value === 1) {
      this.customerTripFilter = false;
      this.getListOrders();
    } else if (value === 2) {
      this.customerTripFilter = true;
      this.getListCustomerTrip();
    }
  }
  getListOrders() {
    this.orderService.getListOrders().subscribe((orderRes) => {
      this.orders = orderRes.body.items.sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
      this.orders.forEach(
        (order) => (order.createdDate = new Date(order.createdDate))
      );
    });
  }
  getListCustomerTrip() {
    this.orderService.getListCustomerTrip().subscribe((customerTripRes) => {
      this.customerTrips = customerTripRes.body;
      this.customerTrips.forEach(
        (customerTrip) =>
          (customerTrip.createdDate = new Date(customerTrip.createdDate))
      );
    });
  }
  viewInvoiceDetail(order: Order) {
    this.invoiceDialog = true;
    this.invoiceTotal = order;
    this.orderService.getTransactionsByOrderId(order.id).subscribe((res) => {
      this.invoiceDetails = res.body.items.sort(
        (a, b) =>
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );
    });
  }
}
