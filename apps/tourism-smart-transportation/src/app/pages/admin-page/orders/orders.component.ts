import { map } from 'rxjs';
import { OrderServiceTypeFilter } from './../../../constant/service-type';
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
  orderServiceTypeFilter = OrderServiceTypeFilter;
  customerTripServiceFilter = ServiceTypeFilter;
  invoiceDialog = false;

  invoiceDetails: any = [];
  totalPrice = 0;
  invoiceTotal?: Order;
  constructor(private orderService: PurchaseHistoryService) {}

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
      this.orders = orderRes.body.items;
    });
  }
  getListCustomerTrip() {
    this.orderService.getListCustomerTrip().subscribe((customerTripRes) => {
      this.customerTrips = customerTripRes.body;
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
