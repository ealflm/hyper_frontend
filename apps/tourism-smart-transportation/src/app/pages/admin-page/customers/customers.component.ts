import { MenuFilterStatus } from './../../../constant/menu-filter-status';
import { Gender } from './../../../constant/gender';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomersService } from './../../../services/customers.service';
import {
  Customer,
  CustomersResponse,
} from './../../../models/CustomerResponse';
import { STATUS_CUSTOMER } from './../../../constant/status';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-users',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  //
  customers: Customer[] = [];
  status: any[] = [];

  //
  fillterLastName?: string | null;
  fillterStatus?: number | null = 1;
  //
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;
  //
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  gender = Gender;
  menuValue = MenuFilterStatus;
  constructor(
    private customerService: CustomersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._mapStatus();
    this._getAllCustomers();
  }
  private _mapStatus() {
    this.status = Object.keys(STATUS_CUSTOMER).map((key) => {
      return {
        id: key,
        lable: STATUS_CUSTOMER[key].lable,
        class: STATUS_CUSTOMER[key].class,
      };
    });
  }
  onChangeFillterByLastName(e: any) {
    this.fillterLastName = e.target.value;
    this._getAllCustomers();
  }
  OnGetMenuClick(e: any) {
    this.fillterStatus = e;
    this._getAllCustomers();
  }

  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;

    this._getAllCustomers();
  }
  _getAllCustomers() {
    this.customerService
      .getAllCustomers(
        this.fillterLastName,
        null,
        this.fillterStatus,
        this.pageIndex,
        this.itemsPerPage,
        null
      )
      .subscribe((customersResponse: CustomersResponse) => {
        this.totalItems = customersResponse.body?.totalItems as number;
        this.customers = customersResponse.body?.items;
      });
  }

  createCustomer() {}

  showConfirmDialog(id: string) {
    if (id) {
      this.confirmationService.confirm({
        accept: () => {
          this.customerService.deleteCustomerById(id).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã khóa khách hàng',
            });
            this._getAllCustomers();
          });
        },
      });
    }
  }
  navCustomerDetail(id?: string) {
    if (id) {
      this.router.navigate([`admin/account-customers/${id}`]);
    }
  }
}
