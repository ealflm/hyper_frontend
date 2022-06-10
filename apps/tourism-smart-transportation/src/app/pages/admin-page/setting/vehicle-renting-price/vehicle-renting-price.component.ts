import { Category } from './../../../../models/CategoryResponse';
import { PublishYear } from './../../../../models/PublishYearResponse';
import { RentingConfigService } from './../../../../services/renting-config.service';
import {
  RentingPrice,
  RentingPricesResponse,
} from './../../../../models/RentingPriceResponse';
import { PublishYearService } from './../../../../services/publish-year.service';
import { CategorySerivce } from './../../../../services/category.service';
import { STATUS_VEHICLE_RENTING_PRICE } from './../../../../constant/status';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tourism-smart-transportation-vehicle-renting-price',
  templateUrl: './vehicle-renting-price.component.html',
  styleUrls: ['./vehicle-renting-price.component.scss'],
})
export class VehicleRentingPriceComponent implements OnInit, AfterViewInit {
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
  status: any = [];
  filterByStatus = 1;
  filterByName = '';
  //
  rentingPriceForm!: FormGroup;
  //
  rentingPrices: RentingPrice[] = [];
  displayDialog = false;
  category: Category[] = [];
  publishYear: PublishYear[] = [];

  //
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;
  isSubmit = false;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoryService: CategorySerivce,
    private publishYearService: PublishYearService,
    private rentingService: RentingConfigService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this._mapVehicleBookingStatus();
    this.getListRentingPrice();
    this._mapCategoryDropDown();
    this._mapPublishYearDropDown();
    this._initRentingForm();
  }
  ngAfterViewInit(): void {}
  private _mapVehicleBookingStatus() {
    this.status = Object.keys(STATUS_VEHICLE_RENTING_PRICE).map((key) => {
      return {
        id: key,
        lable: STATUS_VEHICLE_RENTING_PRICE[key].lable,
        class: STATUS_VEHICLE_RENTING_PRICE[key].class,
      };
    });
  }
  private _mapCategoryDropDown() {
    this.categoryService.getListCategory().subscribe((res) => {
      this.category = res.body.items;
    });
  }
  private _mapPublishYearDropDown() {
    this.publishYearService.getListPublishYear().subscribe((res) => {
      this.publishYear = res.body.items;
    });
  }
  private _initRentingForm() {
    this.rentingPriceForm = this.fb.group({
      id: '',
      publishYearId: ['', Validators.required],
      categoryId: ['', Validators.required],
      minTime: ['', Validators.required],
      maxTime: ['', Validators.required],
      pricePerHour: ['', Validators.required],
      fixedPrice: ['', Validators.required],
      weekendPrice: ['', Validators.required],
      holidayPrice: ['', Validators.required],
    });
  }
  get _rentingForms() {
    return this.rentingPriceForm.controls;
  }
  createRentingPrice() {
    this.editMode = false;
    this.displayDialog = true;
    this.isSubmit = false;
    this._rentingForms['id'].setValue('');
    this._rentingForms['publishYearId'].setValue('');
    this._rentingForms['categoryId'].setValue('');
    this._rentingForms['minTime'].setValue('');
    this._rentingForms['maxTime'].setValue('');
    this._rentingForms['pricePerHour'].setValue('');
    this._rentingForms['fixedPrice'].setValue('');
    this._rentingForms['weekendPrice'].setValue('');
    this._rentingForms['holidayPrice'].setValue('');
  }
  onChangeFillterByName(e: any) {
    this.filterByName = e.target.value;
  }
  onGetValueMenu(value: number) {
    this.filterByStatus = value;
    this.getListRentingPrice();
  }
  onDeleteRentingPrice(id: string) {
    this.confirmationService.confirm({
      accept: () => {
        this.rentingService.deleteRentingConfig(id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã khóa giá đặt xe!',
          });
          this.getListRentingPrice();
        });
      },
    });
  }
  updateRentingPrice(id: string) {
    this.editMode = true;
    this.displayDialog = true;
    this.rentingService.getRentingConfigById(id).subscribe((res) => {
      this._rentingForms['id'].setValue(res.body.id);
      this._rentingForms['publishYearId'].setValue(res.body.publishYearId);
      this._rentingForms['categoryId'].setValue(res.body.categoryId);
      this._rentingForms['minTime'].setValue(res.body.minTime);
      this._rentingForms['maxTime'].setValue(res.body.maxTime);
      this._rentingForms['pricePerHour'].setValue(res.body.pricePerHour);
      this._rentingForms['fixedPrice'].setValue(res.body.fixedPrice);
      this._rentingForms['weekendPrice'].setValue(res.body.weekendPrice);
      this._rentingForms['holidayPrice'].setValue(res.body.holidayPrice);
    });
  }
  getListRentingPrice() {
    this.rentingService
      .getListRentingConfig(this.filterByStatus)
      .subscribe((res) => {
        this.rentingPrices = res.body;
      });
  }
  cancelDialog() {
    this.displayDialog = false;
    this.editMode = false;
    this.isSubmit = false;
  }
  onSaveRentingPrice() {
    this.isSubmit = true;
    if (this.rentingPriceForm.invalid) return;
    const rentingPrice: RentingPrice = {
      categoryId: this._rentingForms['categoryId'].value,
      publishYearId: this._rentingForms['publishYearId'].value,
      minTime: this._rentingForms['minTime'].value,
      maxTime: this._rentingForms['maxTime'].value,
      pricePerHour: this._rentingForms['pricePerHour'].value,
      fixedPrice: this._rentingForms['fixedPrice'].value,
      weekendPrice: this._rentingForms['weekendPrice'].value,
      holidayPrice: this._rentingForms['holidayPrice'].value,
    };
    if (this.isSubmit && this.editMode) {
      const id = this._rentingForms['id'].value;
      this.rentingService
        .updateRentingConfig(id, rentingPrice)
        .subscribe((res) => {
          if (res?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
          }
          this.getListRentingPrice();
        });
      this.isSubmit = false;
    } else if (this.isSubmit && !this.editMode) {
      this.rentingService.createRentingConfig(rentingPrice).subscribe((res) => {
        if (res?.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: res.message,
          });
        }
        this.getListRentingPrice();
      });
      this.isSubmit = false;
    }
    this.displayDialog = false;
  }
}
