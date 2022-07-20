import { MODE } from './../../../../constant/mode';
import { MenuFilterStatus } from './../../../../constant/menu-filter-status';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusConfigService } from './../../../../services/bus-config.service';
import {
  BusPrice,
  BusPricesResponse,
  BusPriceResponse,
} from './../../../../models/BusPriceResponse';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { STATUS_BUS_PRICE } from '../../../../constant/status';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { checkMoreThanMinDistance } from '../../../../providers/CustomValidators';

@Component({
  selector: 'tourism-smart-transportation-bus-price',
  templateUrl: './bus-price.component.html',
  styleUrls: ['./bus-price.component.scss'],
})
export class BusPriceComponent implements OnInit {
  menuValue = MenuFilterStatus;
  mode = MODE;
  editMode = false;
  busPriceStatus: any = [];
  busPrices: BusPrice[] = [];
  displayDialog = false;
  displaySetPriceDefault = false;
  //
  fillterByStatus = 1;
  //

  busPriceForm!: FormGroup;
  priceDefaultForm!: FormGroup;
  isSubmit = false;
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private busConfigService: BusConfigService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this._mapBusPriceStatus();
    this.getAllBusPrice();
    this._initBusPriceForm();
    this._initPriceDefaultForm();
  }
  private _mapBusPriceStatus() {
    this.busPriceStatus = Object.keys(STATUS_BUS_PRICE).map((key) => {
      return {
        id: key,
        lable: STATUS_BUS_PRICE[key].lable,
        class: STATUS_BUS_PRICE[key].class,
      };
    });
  }

  getAllBusPrice() {
    this.busConfigService
      .getListBusPrice(this.fillterByStatus)
      .subscribe((busPriceRes: BusPricesResponse) => {
        this.busPrices = busPriceRes.body;
      });
  }
  private _initBusPriceForm() {
    this.busPriceForm = this.fb.group({
      id: '',
      mode: ['distance', [Validators.required]],
      minRouteDistance: ['', [Validators.required]],
      maxRouteDistance: ['', [Validators.required]],
      minDistance: ['', [Validators.required]],
      maxDistance: ['', [Validators.required]],
      price: ['', [Validators.required]],
      minStation: [0],
      maxStation: [0],
    });
  }
  private _initPriceDefaultForm() {
    this.priceDefaultForm = this.fb.group(
      {
        maxDistance: ['', [Validators.required, Validators.min(0)]],
        minDistance: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(1)]],
      },
      {
        validator: [checkMoreThanMinDistance('minDistance', 'maxDistance')],
      }
    );
  }
  get _priceDefaultForm() {
    return this.priceDefaultForm.controls;
  }
  get _busPriceForms() {
    return this.busPriceForm.controls;
  }
  onChangeMode() {
    this.onSetValidatorForm();
  }
  createBusPrice() {
    this.editMode = false;
    this.displayDialog = true;
  }
  onChangeFillterByName(e: any) {}
  onGetValueMenu(e: number) {
    this.fillterByStatus = e;
    this.getAllBusPrice();
  }
  onDeleteBusPrice(id: string) {
    this.confirmationService.confirm({
      accept: () => {
        this.busConfigService.deleteBusPrice(id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã khóa đối tác',
          });
          this.getAllBusPrice();
        });
      },
    });
  }
  updateBusPrice(id: string) {
    this.editMode = true;
    this.displayDialog = true;
    this.busConfigService
      .getBusPriceById(id)
      .subscribe((busPriceRes: BusPriceResponse) => {
        this._busPriceForms['id'].setValue(busPriceRes.body.id);
        this._busPriceForms['mode'].setValue(busPriceRes.body.mode);
        this._busPriceForms['minRouteDistance'].setValue(
          busPriceRes.body.minRouteDistance
        );
        this._busPriceForms['maxRouteDistance'].setValue(
          busPriceRes.body.maxRouteDistance
        );
        this._busPriceForms['minDistance'].setValue(
          busPriceRes.body.minDistance
        );
        this._busPriceForms['maxDistance'].setValue(
          busPriceRes.body.maxDistance
        );
        this._busPriceForms['minStation'].setValue(busPriceRes.body.minStation);
        this._busPriceForms['maxStation'].setValue(busPriceRes.body.maxStation);
        this._busPriceForms['price'].setValue(busPriceRes.body.price);
      });
  }
  cancelDialog() {
    this.displayDialog = false;
    this.displaySetPriceDefault = false;
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {
        this.displaySetPriceDefault = true;
        // this.displayDialog = true;
      },
    });
  }
  onSaveBusPrice() {
    this.isSubmit = true;
    if (this.isSubmit && this.busPriceForm.invalid) {
      return;
    }
    if (this.isSubmit && this.editMode) {
      const id = this._busPriceForms['id'].value;
      const busPriceUpdate: BusPrice = {
        mode: this._busPriceForms['mode'].value,
        minDistance: this._busPriceForms['minDistance'].value,
        maxDistance: this._busPriceForms['maxDistance'].value,
        minRouteDistance: this._busPriceForms['minRouteDistance'].value,
        maxRouteDistance: this._busPriceForms['maxRouteDistance'].value,
        minStation: this._busPriceForms['minStation'].value,
        maxStation: this._busPriceForms['maxStation'].value,
        price: this._busPriceForms['price'].value,
      };
      this.busConfigService
        .updateBusPrice(id, busPriceUpdate)
        .subscribe((busPriceRes: any) => {
          if (busPriceRes?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: busPriceRes.message,
            });
          }
          this.getAllBusPrice();
        });
    } else if (this.isSubmit && !this.editMode) {
      const busPrice: BusPrice = {
        mode: this._busPriceForms['mode'].value,
        minDistance: this._busPriceForms['minDistance'].value,
        maxDistance: this._busPriceForms['maxDistance'].value,
        minRouteDistance: this._busPriceForms['minRouteDistance'].value,
        maxRouteDistance: this._busPriceForms['maxRouteDistance'].value,
        minStation: this._busPriceForms['minStation'].value,
        maxStation: this._busPriceForms['maxStation'].value,
        price: this._busPriceForms['price'].value,
      };
      this.busConfigService
        .createBusPrice(busPrice)
        .subscribe((busPriceRes: any) => {
          if (busPriceRes?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: busPriceRes.message,
            });
          }
          this.getAllBusPrice();
        });
    }
    this.isSubmit = false;
    this.editMode = false;
    this.displayDialog = false;
  }
  onSetValidatorForm() {
    if (this._busPriceForms['mode'].value === 'distance') {
      this._busPriceForms['minDistance'].setValidators([Validators.required]);
      this._busPriceForms['maxDistance'].setValidators([Validators.required]);
      this._busPriceForms['minStation'].setValue(0);
      this._busPriceForms['maxStation'].setValue(0);
      this._busPriceForms['minStation'].clearValidators();
      this._busPriceForms['maxStation'].clearValidators();
    } else if (this._busPriceForms['mode'].value === 'station') {
      this._busPriceForms['minDistance'].clearValidators();
      this._busPriceForms['maxDistance'].clearValidators();
      this._busPriceForms['minDistance'].setValue(0);
      this._busPriceForms['maxDistance'].setValue(0);
      this._busPriceForms['minStation'].setValidators([Validators.required]);
      this._busPriceForms['maxStation'].setValidators([Validators.required]);
    }
  }

  createPriceDefault() {
    this.isSubmit = false;
    this.displaySetPriceDefault = true;
    this.priceDefaultForm.reset();
  }
  onSavePriceDefautl() {
    this.isSubmit = true;
    if (this.isSubmit && this.priceDefaultForm.invalid) {
      return;
    }
    if (this.isSubmit) {
      const busPriceUpdate: BusPrice = {
        minDistance: this._priceDefaultForm['minDistance'].value * 1000,
        maxDistance: this._priceDefaultForm['maxDistance'].value * 1000,
        price: this._priceDefaultForm['price'].value,
      };
      this.busConfigService
        .createBusPrice(busPriceUpdate)
        .subscribe((busPriceRes: any) => {
          if (busPriceRes?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: busPriceRes.message,
            });
          }
          this.displaySetPriceDefault = false;

          this.getAllBusPrice();
        });
    }
  }
}
