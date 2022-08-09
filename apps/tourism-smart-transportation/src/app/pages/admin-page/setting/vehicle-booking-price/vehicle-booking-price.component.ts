import { MenuFilterStatus } from './../../../../constant/menu-filter-status';
import { BookingPrice } from './../../../../models/BookingPriceResponse';
import { VehicleType } from './../../../../models/VehicleTypeResponse';
import { BookingConfigService } from './../../../../services/booking-config.service';
import { Category } from './../../../../models/CategoryResponse';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CategorySerivce } from './../../../../services/category.service';
import { STATUS_VEHICLE_BOOKING_PRICE } from './../../../../constant/status';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { VehicleTypesService } from '../../../../services/vehicle-types.service';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { map } from 'rxjs';
import { stringToASCII } from '../../../../providers/ConvertUnicode';

@Component({
  selector: 'tourism-smart-transportation-vehicle-booking-price',
  templateUrl: './vehicle-booking-price.component.html',
  styleUrls: ['./vehicle-booking-price.component.scss'],
})
export class VehicleBookingPriceComponent implements OnInit {
  menuValue = MenuFilterStatus;
  editMode = false;
  status: any = [];
  filterByStatus = 1;
  filterByName = '';
  vehicleType: VehicleType[] = [];
  bookingPrices: BookingPrice[] = [];
  currentBookingPrice: BookingPrice[] = [];
  displayDialog = false;

  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 10;
  bookingPriceForm!: FormGroup;
  isSubmit = false;
  loading = false;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private vehicleTypeService: VehicleTypesService,
    private fb: FormBuilder,
    private bookingService: BookingConfigService
  ) {}

  ngOnInit(): void {
    this._mapVehicleBookingStatus();
    this._mapVehicleTypeDropDown();
    this._initBookingForm();
    this.getAllBookingPrice();
  }
  private _mapVehicleBookingStatus() {
    this.status = Object.keys(STATUS_VEHICLE_BOOKING_PRICE).map((key) => {
      return {
        id: key,
        lable: STATUS_VEHICLE_BOOKING_PRICE[key].lable,
        class: STATUS_VEHICLE_BOOKING_PRICE[key].class,
      };
    });
  }
  private _mapVehicleTypeDropDown() {
    this.vehicleTypeService.getAllVehicleType().subscribe((res) => {
      this.vehicleType = res.body;
    });
  }
  private _initBookingForm() {
    this.bookingPriceForm = this.fb.group({
      id: [''],
      vehicleTypeId: ['', Validators.required],
      fixedPrice: ['', [Validators.required, Validators.min(1)]],
      fixedDistance: ['', [Validators.required, Validators.min(1)]],
      pricePerKilometer: ['', [Validators.required, Validators.min(1)]],
      status: [''],
    });
  }
  get _bookingForms() {
    return this.bookingPriceForm.controls;
  }
  getAllBookingPrice() {
    this.bookingService
      .getListBookingConfig(this.filterByStatus)
      .subscribe((res) => {
        this.bookingPrices = res.body.sort(
          (a, b) => a.fixedPrice - b.fixedPrice
        );
        this.currentBookingPrice = res.body.sort(
          (a, b) => a.fixedPrice - b.fixedPrice
        );
      });
  }
  createBookingPrice() {
    this.editMode = false;
    this.displayDialog = true;
    this.bookingPriceForm.reset();
    // this._bookingForms['vehicleTypeId'].setValue('');
    // this._bookingForms['fixedPrice'].setValue('');
    // this._bookingForms['fixedDistance'].setValue('');
    // this._bookingForms['pricePerKilometer'].setValue('');
  }
  onChangeFillterByName(e: any) {
    this.filterByName = e.target.value;
    if (this.filterByName == '') {
      this.bookingPrices = this.currentBookingPrice;
    } else {
      this.bookingPrices = this.bookingPrices.filter((value) => {
        return (
          value.vehicleLabel &&
          value.vehicleLabel
            .toLowerCase()
            .includes(this.filterByName.toLowerCase())
        );
      });
    }
  }
  onGetValueMenu(value: any) {
    this.filterByStatus = value;
    this.getAllBookingPrice();
  }
  onDeleteBookingPrice(id: string) {
    this.confirmationService.confirm({
      accept: () => {
        this.bookingService.deleteBookingPrice(id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã khóa giá đặt xe!',
          });
          this.getAllBookingPrice();
        });
      },
    });
  }
  updateBookingPrice(id: string) {
    this.editMode = true;
    this.displayDialog = true;
    this.bookingService.getBookingPriceById(id).subscribe((res) => {
      // console.log(res);
      this._bookingForms['id'].setValue(res.body.id);
      this._bookingForms['vehicleTypeId'].setValue(res.body.vehicleTypeId);
      this._bookingForms['fixedPrice'].setValue(res.body.fixedPrice);
      this._bookingForms['fixedDistance'].setValue(res.body.fixedDistance);
      this._bookingForms['pricePerKilometer'].setValue(
        res.body.pricePerKilometer
      );
    });
  }
  cancelDialog() {
    this.displayDialog = false;
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {
        this.displayDialog = true;
      },
    });
  }
  onSaveBookingPrice() {
    this.isSubmit = true;
    if (this.bookingPriceForm.invalid) return;
    this.loading = true;
    const id = this._bookingForms['id'].value;
    const bookingPrice: BookingPrice = {
      vehicleTypeId: this._bookingForms['vehicleTypeId'].value,
      fixedPrice: this._bookingForms['fixedPrice'].value,
      fixedDistance: this._bookingForms['fixedDistance'].value,
      pricePerKilometer: this._bookingForms['pricePerKilometer'].value,
      status: 1,
    };
    if (this.isSubmit && this.editMode) {
      this.bookingService.updateBookingPrice(id, bookingPrice).subscribe(
        (res) => {
          if (res?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this.isSubmit = false;
            this.editMode = false;
            this.displayDialog = false;
            this.loading = false;
            this.getAllBookingPrice();
          }
        },
        (error) => {
          this.isSubmit = false;
          this.editMode = true;
          this.displayDialog = true;
          this.loading = false;
        }
      );
    } else if (!this.editMode && this.isSubmit) {
      this.bookingService.createBookingPrice(bookingPrice).subscribe(
        (res) => {
          if (res?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this.getAllBookingPrice();
            this.isSubmit = false;
            this.editMode = false;
            this.displayDialog = false;
            this.loading = false;
          }
        },
        (error) => {
          this.isSubmit = false;
          this.editMode = false;
          this.displayDialog = true;
          this.loading = false;
        }
      );
    }
  }
}
