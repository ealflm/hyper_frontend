import { MenuFilterStatus } from './../../../constant/menu-filter-status';
import { VehicleClass } from './../../../models/VehicleClassResponse';
import { PublishYear } from './../../../models/PublishYearResponse';
import { RentStation } from './../../../models/RentStationResponse';
import { ServiceType } from './../../../models/ServiceTypeResponse';
import { VehicleType } from './../../../models/VehicleTypeResponse';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Vehicle } from './../../../models/VehicleResponse';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit {
  editMode = false;
  displayDialog = false;
  status: any = [];
  menuValue = MenuFilterStatus;
  vehicles: Vehicle[] = [];
  vehicleForm!: FormGroup;
  isSubmit = false;
  vehicleTypes: VehicleType[] = [];
  serviceTypes: ServiceType[] = [];
  rentStations: RentStation[] = [];
  publishYears: PublishYear[] = [];
  vehicleClass: VehicleClass[] = [];
  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this._initVehicleForm();
  }
  private _initVehicleForm() {
    this.vehicleForm = this.fb.group({
      partnerId: [''],
      serviceTypeId: [''],
      vehicleTypeId: [''],
      rentStationId: [''],
      publishYearId: [''],
      vehicleClassId: [''],
      name: [''],
      licensePlates: [''],
      color: [''],
    });
  }
  get _vehiclesForm() {
    return this.vehicleForm.controls;
  }
  onChangeFilterByName(e: any) {}
  OnGetMenuClick(value: number) {}
  deleteVehicle(id: string) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      accept: () => {},
    });
  }

  createVehicle() {
    this.displayDialog = true;
    this.editMode = false;
  }
  viewVehicleDetail(id: string) {
    this.displayDialog = true;
    this.editMode = false;
  }
  cancelDialog() {
    this.displayDialog = false;
    this.editMode = false;
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {
        this.displayDialog = true;
      },
    });
  }

  onSaveVehicle() {}
}
