import {
  Transaction,
  TransactionsResponse,
} from './../../../../models/TransactionResponse';
import { Gender } from './../../../../constant/gender';
import {
  STATUS_TRANSACTION,
  STATUS_CUSTOMER,
  STATUS_PACKAGE,
} from './../../../../constant/status';
import { PurchaseHistoryService } from './../../../../services/purchase-history.service';
import {
  OrdersResponse,
  Order,
  OrderDetail,
  OrderDetailsResponse,
} from './../../../../models/OrderResponse';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CustomersService } from './../../../../services/customers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, Subscription, throwIfEmpty } from 'rxjs';
import { CustomerResponse } from '../../../../models/CustomerResponse';
import {
  AgeCheck,
  PHONE_NUMBER_REGEX,
  validateEmty,
} from '../../../../providers/CustomValidators';
import { Payment, PaymentsResponse } from '../../../../models/PaymentResponse';
import {
  PackageHistory,
  PackageHistorysResponse,
} from '../../../../models/PackageHistoryResponse';

@Component({
  selector: 'tourism-smart-transportation-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  editModeStatus = false;
  displayDialog?: boolean = false;
  paymentDialogStatus?: boolean = false;
  //
  fillterStatus?: boolean = true;
  //
  transactionStatus: any[] = [];
  packageStatus: any[] = [];
  gender = Gender;
  deleteFile?: string | null;
  customerEditForm!: FormGroup;
  currentPhone?: string;
  packageHistory: PackageHistory[] = [];
  orders: Order[] = [];
  transactions: Transaction[] = [];
  orderDetails: OrderDetail[] = [];
  status: any = [];
  statusBiding? = 1;
  loading = false;
  private subscription?: Subscription;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private customerService: CustomersService,
    private messageService: MessageService,
    private purchaseHistoryService: PurchaseHistoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initCustomerForm();
    this._getDetailCustomer();
    if (this.fillterStatus) {
      this._getPackgeHistoryByUser();
    } else {
      this._getOrderByCusId();
    }
    this._mapPaymentStatus();
    this._mapPackageHistoryStatus();
    this._mapStatus();
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
  private _mapPaymentStatus() {
    this.transactionStatus = Object.keys(STATUS_TRANSACTION).map((key) => {
      return {
        id: STATUS_TRANSACTION[key].id,
        lable: STATUS_TRANSACTION[key].lable,
        class: STATUS_TRANSACTION[key].class,
      };
    });
  }
  private _mapPackageHistoryStatus() {
    this.packageStatus = Object.keys(STATUS_PACKAGE).map((key) => {
      return {
        id: STATUS_PACKAGE[key].id,
        lable: STATUS_PACKAGE[key].lable,
        class: STATUS_PACKAGE[key].class,
      };
    });
  }
  private _getDetailCustomer() {
    this.subscription = this.route.params.subscribe((params) => {
      const idCus = params['id'];
      if (idCus) {
        this.customerService
          .getCustomerById(idCus)
          .subscribe((cusRes: CustomerResponse) => {
            this._customersEditForm['id'].setValue(cusRes.body.id);
            this._customersEditForm['firstName'].setValue(
              cusRes.body.firstName
            );
            this._customersEditForm['lastName'].setValue(cusRes.body.lastName);
            const dobRes = new Date(
              cusRes.body.dateOfBirth ? cusRes.body.dateOfBirth.toString() : ''
            );

            this._customersEditForm['dateOfBirth'].setValue(dobRes);
            this._customersEditForm['selectedGender'].setValue(
              cusRes.body.gender
            );
            this._customersEditForm['phone'].setValue(cusRes.body.phone);
            this._customersEditForm['cardUid'].setValue(cusRes.body.cardUid);

            this.currentPhone = cusRes.body.phone;
            this._customersEditForm['email'].setValue(cusRes.body.email);
            this._customersEditForm['addressUser'].setValue(
              cusRes.body.address1
            );
            this._customersEditForm['photoUrl'].setValue(cusRes.body.photoUrl);
            cusRes.body?.photoUrl == '' || cusRes.body?.photoUrl == null
              ? (this.imagePreview = '../assets/image/imagePreview.png')
              : (this.imagePreview = `https://se32.blob.core.windows.net/customer/${cusRes.body?.photoUrl}`);
            this.deleteFile = cusRes.body?.photoUrl?.trim();
            this.statusBiding = cusRes.body?.status;
          });
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  _initCustomerForm() {
    this.customerEditForm = this.fb.group(
      {
        id: [''],
        firstName: [
          { value: '', disabled: true },
          [Validators.required, validateEmty],
        ],
        lastName: [
          { value: '', disabled: true },
          [Validators.required, validateEmty],
        ],
        dateOfBirth: [
          { value: '', disabled: true },
          [Validators.required, validateEmty],
        ],
        selectedGender: [
          { value: '', disabled: true },
          [Validators.required, validateEmty],
        ],
        phone: [
          { value: '', disabled: true },

          [Validators.required, Validators.pattern(PHONE_NUMBER_REGEX)],
          // Validators.minLength(9),
          // Validators.maxLength(15),
        ],
        cardUid: [{ value: '', disabled: true }],
        email: [
          { value: '', disabled: true },
          [Validators.required, validateEmty],
        ],
        addressUser: [
          { value: '', disabled: true },
          [Validators.required, validateEmty],
        ],
        photoUrl: [''],
        deleteFile: [''],
      },
      {
        validator: [AgeCheck('dateOfBirth')],
      }
    );
  }
  navmenuclick(e: boolean) {
    this.fillterStatus = e;
    if (this.fillterStatus) {
      this._getPackgeHistoryByUser();
    } else {
      this._getOrderByCusId();
    }
  }
  get _customersEditForm() {
    return this.customerEditForm.controls;
  }
  onChangeEdit() {
    this.editModeStatus = true;
    this._customersEditForm['firstName'].enable();
    this._customersEditForm['lastName'].enable();
    this._customersEditForm['dateOfBirth'].enable();
    this._customersEditForm['selectedGender'].enable();
    this._customersEditForm['phone'].enable();
    this._customersEditForm['email'].enable();
    this._customersEditForm['addressUser'].enable();
  }
  onCancleEdit() {
    this.editModeStatus = false;
    this._customersEditForm['firstName'].disable();
    this._customersEditForm['lastName'].disable();
    this._customersEditForm['dateOfBirth'].disable();
    this._customersEditForm['selectedGender'].disable();
    this._customersEditForm['phone'].disable();
    this._customersEditForm['email'].disable();
    this._customersEditForm['addressUser'].disable();
    this._getDetailCustomer();
  }
  onUpload(event: any) {
    const avatarFile = event.target.files[0];
    if (avatarFile) {
      this.customerEditForm.patchValue({ image: avatarFile });
      this._customersEditForm['photoUrl'].setValue(avatarFile);
      this._customersEditForm['deleteFile'].setValue(this.deleteFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imagePreview = fileReader.result;
      };
      fileReader.readAsDataURL(avatarFile);
    }
  }
  onSaveChange() {
    if (this.customerEditForm.invalid) {
      return;
    }
    this.loading = true;
    const editFormData = new FormData();
    editFormData.append(
      'FirstName',
      this._customersEditForm['firstName'].value
    );
    editFormData.append('LastName', this._customersEditForm['lastName'].value);
    editFormData.append(
      'Gender',
      this._customersEditForm['selectedGender'].value.toString()
    );
    const dobRes = new Date(this._customersEditForm['dateOfBirth'].value);
    const pipe = new DatePipe('en-US');
    const dobPipe = pipe.transform(dobRes, 'yyyy/MM/dd');
    editFormData.append('Birthday', dobPipe ? dobPipe : '');

    if (this.currentPhone !== this._customersEditForm['phone'].value) {
      editFormData.append('Phone', this._customersEditForm['phone'].value);
    }

    editFormData.append('Email', this._customersEditForm['email'].value);
    editFormData.append(
      'Address1',
      this._customersEditForm['addressUser'].value
    );
    editFormData.append(
      'UploadFile',
      this._customersEditForm['photoUrl'].value
    );
    editFormData.append(
      'DeleteFile',
      this._customersEditForm['deleteFile'].value
    );
    editFormData.forEach((e) => {
      // console.log(e);
    });
    this.customerService
      .updateCustomerById(this._customersEditForm['id'].value, editFormData)
      .subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
          }
        },
        (error) => {},
        () => {
          this.onCancleEdit();
          this.loading = false;
        }
      );
    this.editModeStatus = false;
  }
  _getPackgeHistoryByUser() {
    this.route.paramMap.subscribe((params) => {
      const idCus = params.get('id');
      this.customerService
        .getPackgeUsedByCustomerId(idCus ? idCus : '')
        .subscribe((packageHistory: PackageHistorysResponse) => {
          this.packageHistory = packageHistory.body.items;
        });
    });
  }
  _getOrderByCusId() {
    this.route.paramMap.subscribe((params) => {
      const idCus = params.get('id');
      this.purchaseHistoryService
        .getOrderByCusId(idCus ? idCus : '')
        .subscribe((transRes: OrdersResponse) => {
          this.orders = transRes.body?.items.sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          );
        });
    });
  }
  onGetOrderDetails(e: any) {
    this.displayDialog = true;
    this.paymentDialogStatus = e.paymentDialogStatus;
    this.purchaseHistoryService
      .getOrderDetailsByOrderId(e.orderId)
      .pipe(
        map((data: OrderDetailsResponse) => {
          this.orderDetails = data.body.items.map(
            (orderDetail: OrderDetail) => {
              return {
                price: orderDetail.price,
                quantity: orderDetail.quantity,
                content: orderDetail.content,
                totalPrice: orderDetail.quantity * orderDetail.price,
              };
            }
          );
        })
      )
      .subscribe();
  }
  onGetPaymentDetails(e: any) {
    this.displayDialog = true;
    this.paymentDialogStatus = e.paymentDialogStatus;
    // this.purchaseHistoryService
    //   .getPaymentsByOrderId(e.orderId)
    //   .pipe(
    //     map((data) => {
    //       this.payments = data.body.items.map((x: any) => {
    //         return {
    //           data: {
    //             amount: x.amount,
    //             content: x.content,
    //             createdDate: x.createdDate,
    //           },
    //           children: x.transactionList.map((element: any) => {
    //             return {
    //               data: {
    //                 content: element.content,
    //                 amount: element.amount,
    //                 createdDate: element.createdDate,
    //               },
    //             };
    //           }),
    //         };
    //       });
    //     })
    //   )
    //   .subscribe();
    this.displayDialog = true;
    this.paymentDialogStatus = e.paymentDialogStatus;
    this.purchaseHistoryService
      .getTransactionsByOrderId(e.orderId)
      .pipe(
        map((data) => {
          this.transactions = data.body.items.map((x: any) => {
            return {
              amount: x.amount,
              content: x.content,
              createdDate: x.createdDate,
            };
          });
        })
      )
      .subscribe();
  }

  normalizeToTreeNodeData(res: any) {
    if (res) {
      this.transactions = res.map((x: any) => {
        return {
          data: {
            amount: x.amount,
            content: x.content,
            createdDate: x.createdDate,
          },
          children: x.transactionList.map((element: any) => {
            return {
              data: {
                content: element.content,
                amount: element.amount,
                createdDate: element.createdDate,
              },
            };
          }),
        };
      });
    }
  }
}
