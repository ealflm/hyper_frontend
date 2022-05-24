import { OrdersResponse, Order } from './../../../../models/OrderResponse';
import { OrderService } from './../../../../services/order.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CustomersService } from './../../../../services/customers.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription, throwIfEmpty } from 'rxjs';
import { CustomerResponse } from '../../../../models/CustomerResponse';
import { AgeCheck } from '../../../../providers/CustomValidators';

@Component({
  selector: 'tourism-smart-transportation-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  editModeStatus = false;
  //
  fillterStatus?: boolean = true;
  //
  gender = [
    {
      id: false,
      lable: 'Nữ',
    },
    {
      id: true,
      lable: 'Nam',
    },
  ];
  deleteFile?: string | null;
  customerEditForm!: FormGroup;
  currentPhone?: string;
  cusTiersHis: any[] = [];
  transactionHis: Order[] = [];

  more_vertId?: number;
  private subscription?: Subscription;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private customerService: CustomersService,
    private messageService: MessageService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initCustomerForm();
    this._getDetailCustomer();
    if (this.fillterStatus) {
      this._getTierByUser();
    } else {
      this._getOrderByCusId();
    }
  }
  _getDetailCustomer() {
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
            const pipe = new DatePipe('en-US');
            let dobPipe: any;
            if (cusRes.body.dateOfBirth) {
              dobPipe = pipe.transform(dobRes, 'dd/MM/yyy');
            }
            this._customersEditForm['dateOfBirth'].setValue(dobPipe);
            this._customersEditForm['selectedGender'].setValue(
              cusRes.body.gender
            );
            this._customersEditForm['phone'].setValue(cusRes.body.phone);
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
        firstName: [{ value: '', disabled: true }, Validators.required],
        lastName: [{ value: '', disabled: true }, Validators.required],
        dateOfBirth: [{ value: '', disabled: true }, Validators.required],
        selectedGender: [{ value: '', disabled: true }, Validators.required],
        phone: [
          { value: '', disabled: true },
          Validators.required,
          // Validators.minLength(9),
          // Validators.maxLength(15),
        ],
        email: [{ value: '', disabled: true }, [Validators.required]],
        addressUser: [{ value: '', disabled: true }, Validators.required],
        photoUrl: [''],
        deleteFile: [''],
      },
      {
        validator: [AgeCheck('dateOfBirth')],
      }
    );
  }
  actionDetails(id?: number) {
    if (!id) {
      this.more_vertId = -1;
    }
    this.more_vertId = id;
  }
  navmenuclick(e: boolean) {
    this.fillterStatus = e;
    if (this.fillterStatus) {
      this._getTierByUser();
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
    const dobPipe = pipe.transform(dobRes, 'dd/MM/yyy');
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
      console.log(e);
    });
    this.customerService
      .updateCustomerById(this._customersEditForm['id'].value, editFormData)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          if (error.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: error.error.message,
            });
          }
        }
      );
    this.editModeStatus = false;
  }
  _getTierByUser() {
    this.route.paramMap.subscribe((params) => {
      const idCus = params.get('id');
      this.customerService
        .getTierByCustomerId(idCus ? idCus : '')
        .subscribe((tiersRes: any) => {
          this.cusTiersHis = tiersRes.body.items;
        });
    });
  }
  _getOrderByCusId() {
    this.route.paramMap.subscribe((params) => {
      const idCus = params.get('id');
      this.orderService
        .getOrderByCusId(idCus ? idCus : '')
        .subscribe((transRes: OrdersResponse) => {
          this.transactionHis = transRes.body?.items;
        });
    });
  }
  onGetDetails(e: any) {
    console.log(e);

    // this.router.navigate([`danhngu/${e}`]);
  }
}