import { MenuFilterStatus } from './../../../../constant/menu-filter-status';
import { STATUS_BUS_PRICE } from './../../../../constant/status';
import {
  VehicleTypesResponse,
  VehicleType,
  VehicleTypeResponse,
} from './../../../../models/VehicleTypeResponse';
import { HttpResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleTypesService } from './../../../../services/vehicle-types.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss'],
})
export class VehicleTypeComponent implements OnInit {
  menuValue = MenuFilterStatus;
  displayDialog = false;
  vehicleTypes: VehicleType[] = [];
  status: any = [];
  fuel: any = [
    {
      name: 'Xăng',
      lable: 'Xăng',
    },
    {
      name: 'Dầu',
      lable: 'Dầu',
    },
  ];
  editMode = false;
  filterVehicleTypeStatus = 1;
  vehicleTypeForm!: FormGroup;
  filterByLabel = '';
  isSubmit = false;
  constructor(
    private vehicleTypeService: VehicleTypesService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllVehicleType();
    this._mapStatus();
    this._initVehicleTypeForm();
  }
  private _mapStatus() {
    this.status = Object.keys(STATUS_BUS_PRICE).map((key) => {
      return {
        id: key,
        lable: STATUS_BUS_PRICE[key].lable,
        class: STATUS_BUS_PRICE[key].class,
      };
    });
  }
  private _initVehicleTypeForm() {
    this.vehicleTypeForm = this.fb.group({
      id: [''],
      label: ['', [Validators.required]],
      seats: ['', [Validators.required]],
      fuel: ['', [Validators.required]],
    });
  }
  get _vehicleTypeForm() {
    return this.vehicleTypeForm.controls;
  }
  createVehicleType() {
    this.editMode = false;
    this.displayDialog = true;
    this.vehicleTypeForm.reset();
    // this._vehicleTypeForm['id'].setValue('');
    // this._vehicleTypeForm['label'].setValue('');
    // this._vehicleTypeForm['seats'].setValue('');
    // this._vehicleTypeForm['fuel'].setValue('');
  }
  onChangeFillterByName(e: any) {
    this.filterByLabel = e.target.value;
    this.getAllVehicleType();
  }
  onGetValueMenu(value: number) {
    this.filterVehicleTypeStatus = value;
    this.getAllVehicleType();
  }
  onDeleteVehicleType(id: string) {
    this.confirmationService.confirm({
      accept: () => {
        this.vehicleTypeService.deleteVehicleType(id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã khóa loại xe',
          });
          this.getAllVehicleType();
        });
      },
    });
  }
  updateVehicleType(id: string) {
    this.editMode = true;
    this.displayDialog = true;
    this.vehicleTypeService
      .getVehicleById(id)
      .subscribe((vehicleTypeRes: VehicleTypeResponse) => {
        this._vehicleTypeForm['id'].setValue(vehicleTypeRes.body.id);
        this._vehicleTypeForm['label'].setValue(vehicleTypeRes.body.label);
        this._vehicleTypeForm['seats'].setValue(vehicleTypeRes.body.seats);
        this._vehicleTypeForm['fuel'].setValue(vehicleTypeRes.body.fuel);
      });
  }
  onSaveVehicleType() {
    this.isSubmit = true;
    if (this.vehicleTypeForm.invalid) return;
    if (this.isSubmit && this.editMode) {
      const id = this._vehicleTypeForm['id'].value;
      const vehicleType: VehicleType = {
        label: this._vehicleTypeForm['label'].value,
        seats: this._vehicleTypeForm['seats'].value,
        fuel: this._vehicleTypeForm['fuel'].value,
      };
      this.vehicleTypeService
        .updateVehicleType(id, vehicleType)
        .subscribe((res) => {
          if (res?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
          }
          this.getAllVehicleType();
        });
    } else if (this.isSubmit && !this.editMode) {
      const vehicleType: VehicleType = {
        label: this._vehicleTypeForm['label'].value,
        seats: this._vehicleTypeForm['seats'].value,
        fuel: this._vehicleTypeForm['fuel'].value,
      };
      this.vehicleTypeService
        .createVehicleType(vehicleType)
        .subscribe((res) => {
          if (res?.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
          }
          this.getAllVehicleType();
        });
    }
    this.editMode = false;
    this.displayDialog = false;
  }
  cancelDialog() {
    this.displayDialog = false;
    this.editMode = false;
    // this.confirmationService.confirm({});
  }
  getAllVehicleType() {
    this.vehicleTypeService
      .getAllVehicleType(this.filterByLabel, this.filterVehicleTypeStatus)
      .subscribe((vehicleTypeRes: VehicleTypesResponse) => {
        this.vehicleTypes = vehicleTypeRes.body;
      });
  }
}
