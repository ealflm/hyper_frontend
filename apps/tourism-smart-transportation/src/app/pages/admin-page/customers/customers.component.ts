import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomersService } from './../../../services/customers.service';
import {
  Customer,
  CustomersResponse,
} from './../../../models/CustomerResponse';
import { STATUS_PARTNER } from './../../../constant/status';
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
  animations: [
    trigger('openCloseIcon', [
      state(
        'openIcon',
        style({
          transform: 'rotate(0deg)',
        })
      ),
      state(
        'closeIcon',
        style({
          transform: 'rotate(90deg)',
        })
      ),
      transition('openIcon => closeIcon', [animate('0.3s')]),
      transition('closeIcon => openIcon', [animate('0.3s')]),
    ]),
  ],
})
export class CustomersComponent implements OnInit {
  isOpenIconFillter = true;

  //
  customers: Customer[] = [];
  status: any[] = [];

  //
  fillterLastName?: string | null;
  fillterStatus?: number | null = null;
  //
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;
  //
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  gender = [
    {
      id: 'false',
      lable: 'Nữ',
    },
    {
      id: 'true',
      lable: 'Nam',
    },
  ];

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
    this.status = Object.keys(STATUS_PARTNER).map((key) => {
      return {
        id: key,
        lable: STATUS_PARTNER[key].lable,
        class: STATUS_PARTNER[key].class,
      };
    });
  }
  onChangeFillterByLastName(e: any) {
    this.fillterLastName = e.target.value;
    this._getAllCustomers();
  }
  navmenuclick(value?: any | null) {
    this.fillterStatus = value;
    this._getAllCustomers();
  }
  onToggleIconFillter() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
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
    // this.comebackStatus = false;
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
      this.router.navigate([`account-customers/${id}`]);
    }
  }
}
