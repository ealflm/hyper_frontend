import { ServiceTypeService } from './../../../services/service-type.service';
import { ServiceType } from './../../../models/ServiceTypeResponse';
import { MenuFilterStatusDiscount } from './../../../constant/menu-filter-status';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiscountService } from './../../../services/discount.service';
import { STATUS_DISCOUNT } from './../../../constant/status';
import { Component, OnInit } from '@angular/core';
import { checkMoreThanTodayValidator } from '../../../providers/CustomValidators';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Discount,
  DiscountResponse,
  DiscountsResponse,
} from '../../../models/DiscountResponse';

@Component({
  selector: 'tourism-smart-transportation-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
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
      transition('openIcon <=> closeIcon', [animate('1s')]),
    ]),
  ],
})
export class DiscountComponent implements OnInit {
  isOpenIconFillter?: boolean = true;
  discounts: Discount[] = [];
  discountStatus: any[] = [];
  serviceTypes: ServiceType[] = [];
  displayDialog = false;
  editMode = false;
  comebackStatus = false;
  isSubmit = false;
  discountForm!: FormGroup;

  uploadedFiles: any[] = [];
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';
  deleteFile?: string | null;
  //
  fillterStatus: number | null = 1;
  fillterByName?: string | null;
  //
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 7;
  menuValue = MenuFilterStatusDiscount;
  constructor(
    private discountService: DiscountService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceTypeService: ServiceTypeService
  ) {
    this._mapDiscountStatus();
  }
  ngOnInit(): void {
    this._getServiceType();
    this._getAllDiscount();
    this._initDiscountForm();
  }
  private _getServiceType() {
    this.serviceTypeService.getAllServiceType().subscribe((serviceTypeRes) => {
      this.serviceTypes = serviceTypeRes.body.items;
    });
  }
  private _mapDiscountStatus() {
    this.discountStatus = Object.keys(STATUS_DISCOUNT).map((key) => {
      return {
        id: key,
        lable: STATUS_DISCOUNT[key].lable,
        class: STATUS_DISCOUNT[key].class,
      };
    });
  }
  private _initDiscountForm() {
    this.discountForm = this.fb.group(
      {
        id: [''],
        title: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.maxLength(50)]],
        serviceType: ['', [Validators.required]],
        time: ['', [Validators.required]],
        photoUrl: [''],
        value: [
          '',
          [Validators.required, Validators.min(0), Validators.max(1)],
        ],
        deleteFile: [''],
      },
      {
        validator: [checkMoreThanTodayValidator('time')],
      }
    );
  }
  get _discountsForm() {
    return this.discountForm.controls;
  }
  onToggle() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
  }
  _getAllDiscount() {
    this.discountService
      .getAllDiscounts(
        this.fillterByName,
        this.fillterStatus,
        this.pageIndex,
        this.itemsPerPage,
        null
      )
      .subscribe((discountResponse: DiscountsResponse) => {
        this.totalItems = discountResponse.body.totalItems;
        this.discounts = discountResponse.body?.items;
      });
  }
  onChangeFillterByName(e: any) {
    this.fillterByName = e.target.value;
    this._getAllDiscount();
  }
  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;
    this._getAllDiscount();
  }
  OnGetMenuClick(value: any) {
    this.fillterStatus = value;
    this._getAllDiscount();
  }

  onUpload(event: any) {
    const avatarFile = event.target.files[0];
    if (avatarFile) {
      this.discountForm.patchValue({ image: avatarFile });
      this._discountsForm['photoUrl'].setValue(avatarFile);
      this._discountsForm['deleteFile'].setValue(this.deleteFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imagePreview = fileReader.result;
      };
      fileReader.readAsDataURL(avatarFile);
    }
  }
  cancelDialog(displayDialog: boolean, comebackStatus: boolean) {
    this.displayDialog = displayDialog;
    this.comebackStatus = comebackStatus;
    this.confirmationService.confirm({});
  }
  showDialog(editMode: boolean, id?: string, comebackStatus?: boolean) {
    this.displayDialog = !this.displayDialog;
    this.editMode = editMode;
    if (id && editMode) {
      this.editMode = true;
      this.isSubmit = false;
      this.discountService
        .getDiscountById(id)
        .subscribe((discountResponse: DiscountResponse) => {
          this._discountsForm['id'].setValue(discountResponse.body?.id);
          this._discountsForm['title'].setValue(discountResponse.body?.title);
          this._discountsForm['description'].setValue(
            discountResponse.body?.description
          );
          this._discountsForm['serviceType'].setValue(
            discountResponse.body?.serviceTypeId
          );
          const pipe = new DatePipe('en-US');
          const timeStart = new Date(
            discountResponse.body.timeStart.toString()
          );
          const timeEnd = new Date(discountResponse.body.timeEnd.toString());
          const timeRange = [timeStart, timeEnd];
          this._discountsForm['time'].setValue(timeRange);
          this._discountsForm['photoUrl'].setValue(
            discountResponse.body?.photoUrl
          );
          this._discountsForm['value'].setValue(discountResponse.body.value);
          discountResponse.body?.photoUrl == '' ||
          discountResponse.body?.photoUrl == null
            ? (this.imagePreview = '../assets/image/imagePreview.png')
            : (this.imagePreview = `https://se32.blob.core.windows.net/admin/${discountResponse.body?.photoUrl}`);
          this.deleteFile = discountResponse.body?.photoUrl?.trim();
        });
    } else if (!editMode && comebackStatus) {
      this.isSubmit = false;
    } else if (!editMode && !comebackStatus) {
      this.isSubmit = false;
      this._discountsForm['id'].setValue('');
      this._discountsForm['title'].setValue('');
      this._discountsForm['description'].setValue('');
      this._discountsForm['serviceType'].setValue('');
      this._discountsForm['time'].setValue('');
      this._discountsForm['value'].setValue('');
      this._discountsForm['photoUrl'].setValue('');
      this.imagePreview = '../assets/image/imagePreview.png';
      this.deleteFile = null;
    }
  }

  onSaveInfor() {
    this.isSubmit = true;
    if (this.discountForm.invalid) return;
    console.log(this._discountsForm['time'].value[0]);
    console.log(this._discountsForm['time'].value[1]);

    const formData = new FormData();
    const idDiscount = this._discountsForm['id'].value;
    if (this.editMode) {
      this.displayDialog = false;
      this.isSubmit = false;
      formData.append('Description', this._discountsForm['description'].value);
      formData.append('Title', this._discountsForm['title'].value);
      formData.append(
        'ServiceTypeId',
        this._discountsForm['serviceType'].value
      );

      const timeStart = this.convertTime(
        this._discountsForm['time'].value[0]
          ? this._discountsForm['time'].value[0]
          : ''
      );
      formData.append('TimeStart', timeStart ? timeStart : ' ');
      const timeEnd = this.convertTime(
        this._discountsForm['time'].value[1]
          ? this._discountsForm['time'].value[1]
          : ''
      );
      formData.append('Value', this._discountsForm['value'].value);
      formData.append('TimeEnd', timeEnd ? timeEnd : '');
      formData.append('UploadFile', this._discountsForm['photoUrl'].value);
      if (this._discountsForm['deleteFile'].value) {
        formData.append('DeleteFile', this._discountsForm['deleteFile'].value);
      }
      formData.forEach((res) => {
        console.log(res);
      });
      if (idDiscount != null) {
        this.discountService.updateDiscountById(idDiscount, formData).subscribe(
          (updatePartnerRes) => {
            if (updatePartnerRes.statusCode === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: updatePartnerRes.message,
              });
            }
            this._getAllDiscount();
            this.editMode = false;
          }
          // (error: HttpErrorResponse) => {
          //   this.messageService.add({
          //     severity: 'error',
          //     summary: 'Thất bại',
          //     detail: error.error.message,
          //   });
          // }
        );
      }
    } else if (!this.editMode) {
      this.isSubmit = false;
      this.displayDialog = false;
      formData.append('Title', this._discountsForm['title'].value);
      const timeStart = this.convertTime(
        this._discountsForm['time'].value[0]
          ? this._discountsForm['time'].value[0]
          : ''
      );
      formData.append('TimeStart', timeStart ? timeStart : ' ');
      const timeEnd = this.convertTime(
        this._discountsForm['time'].value[1]
          ? this._discountsForm['time'].value[1]
          : ''
      );
      formData.append('TimeEnd', timeEnd ? timeEnd : '');
      formData.append('Description', this._discountsForm['description'].value);
      formData.append(
        'ServiceTypeId',
        this._discountsForm['serviceType'].value
      );
      formData.append('Value', this._discountsForm['value'].value);
      formData.append('UploadFile', this._discountsForm['photoUrl'].value);
      if (this._discountsForm['deleteFile'].value) {
        formData.append('DeleteFile', this._discountsForm['deleteFile'].value);
      }
      formData.forEach((res) => {
        console.log(res);
      });
      this.discountService.createDiscount(formData).subscribe(
        (discountRes) => {
          if (discountRes.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: discountRes.message,
            });
          }
          this._getAllDiscount();
        }
        // (error: HttpErrorResponse) => {
        //   this.messageService.add({
        //     severity: 'error',
        //     summary: 'Thất bại',
        //     detail: error.error.message,
        //   });
        // }
      );
    }
  }
  convertTime(value: string) {
    const time = new Date(value);
    const pipe = new DatePipe('en-US');
    const timeConverted = pipe.transform(time, 'yyyy-MM-dd');
    return timeConverted;
  }
  showConfirmDialog(id: string, deleteStatus: boolean) {
    this.comebackStatus = false;
    if (deleteStatus) {
      this.confirmationService.confirm({
        accept: () => {
          this.discountService.deleteDiscountById(id).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã khóa khuyến mãi',
            });
            this._getAllDiscount();
          });
        },
      });
    }
  }
}
