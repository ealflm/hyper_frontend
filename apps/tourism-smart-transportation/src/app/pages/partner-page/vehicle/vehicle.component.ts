import { STATUS_VEHICLE } from './../../../constant/status';
import { LocalStorageService } from './../../../auth/localstorage.service';
import { VehicleService } from './../../../services/vehicle.service';
import {
  Observable,
  Subject,
  BehaviorSubject,
  Subscription,
  debounce,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { CategorySerivce } from './../../../services/category.service';
import { MenuFilterStatus } from './../../../constant/menu-filter-status';
import { VehicleClass } from './../../../models/VehicleClassResponse';
import { PublishYear } from './../../../models/PublishYearResponse';
import { RentStation } from './../../../models/RentStationResponse';
import { ServiceType } from './../../../models/ServiceTypeResponse';
import { VehicleType } from './../../../models/VehicleTypeResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Vehicle } from './../../../models/VehicleResponse';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { VehicleTypesService } from '../../../services/vehicle-types.service';
import { ServiceTypeService } from '../../../services/service-type.service';
import { PublishYearService } from '../../../services/publish-year.service';

@Component({
  selector: 'tourism-smart-transportation-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
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
  subscription = new Subscription();
  searchSubject$ = new Subject<string>();
  partnerId = '';
  filterByName = '';
  filterByStatus = 1;
  createStatus = false;
  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private vehicleTypeService: VehicleTypesService,
    private serviceTypeService: ServiceTypeService,
    private publishYearService: PublishYearService,
    private categoryService: CategorySerivce,
    private cd: ChangeDetectorRef,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this._getVehicleTypes();
    this._getServiceTypes();
    this._getPublishYears();
    this._getCategorys();
    this.getListVehicleOfPartner();
    const user = this.localStorageService.getUser;
    this.partnerId = user.id;
    console.log(this.partnerId);

    this._mapStatus();
  }
  ngAfterViewInit(): void {
    this._initVehicleForm();
    this.subscription = this.searchSubject$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.getListVehicleOfPartner();
      });
  }
  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  private _mapStatus() {
    this.status = Object.keys(STATUS_VEHICLE).map((key) => {
      return {
        id: key,
        lable: STATUS_VEHICLE[key].lable,
        class: STATUS_VEHICLE[key].class,
      };
    });
  }
  private _initVehicleForm() {
    this.vehicleForm = this.fb.group({
      vehicleId: [''],
      partnerId: [''],
      serviceTypeId: ['', Validators.required],
      vehicleTypeId: ['', Validators.required],
      rentStationId: [''],
      publishYearId: [''],
      vehicleClassId: [''],
      name: ['', Validators.required],
      licensePlates: ['', Validators.required],
      color: ['', Validators.required],
    });
  }
  private _getVehicleTypes() {
    this.vehicleTypeService.getListVehicleTypeForPartner(1).subscribe((res) => {
      this.vehicleTypes = res.body;
    });
  }
  private _getServiceTypes() {
    this.serviceTypeService
      .getListServiceTypeForPartner()
      .subscribe((res: any) => {
        this.serviceTypes = res.body.items;
      });
  }
  private _getPublishYears() {
    this.publishYearService.getListPublishYearForPartner().subscribe((res) => {
      this.publishYears = res.body.items;
    });
  }
  private _getCategorys() {
    this.categoryService.getListCategoryForPartner().subscribe((res) => {
      this.vehicleClass = res.body.items;
    });
  }
  get _vehiclesForm() {
    return this.vehicleForm.controls;
  }
  setDisableForm() {
    this._vehiclesForm['serviceTypeId'].disable();
    this._vehiclesForm['vehicleTypeId'].disable();
    this._vehiclesForm['rentStationId'].disable();
    this._vehiclesForm['publishYearId'].disable();
    this._vehiclesForm['vehicleClassId'].disable();
    this._vehiclesForm['name'].disable();
    this._vehiclesForm['licensePlates'].disable();
    this._vehiclesForm['color'].disable();
  }
  setEnableForm() {
    this._vehiclesForm['serviceTypeId'].enable();
    this._vehiclesForm['vehicleTypeId'].enable();
    this._vehiclesForm['rentStationId'].enable();
    this._vehiclesForm['publishYearId'].enable();
    this._vehiclesForm['vehicleClassId'].enable();
    this._vehiclesForm['name'].enable();
    this._vehiclesForm['licensePlates'].enable();
    this._vehiclesForm['color'].enable();
  }
  onChangeFilterByName(e: any) {
    this.filterByName = e.target.value;
    this.searchSubject$.next(this.filterByName);
  }
  OnGetMenuClick(value: number) {
    this.filterByStatus = value;
    this.getListVehicleOfPartner();
  }
  getListVehicleOfPartner() {
    this.vehicleService
      .getListVehicleByPartnerIdForPartner(
        this.partnerId,
        this.filterByName,
        this.filterByStatus
      )
      .subscribe((res) => {
        this.vehicles = res.body;
      });
  }
  deleteVehicle(id: string) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      accept: () => {
        this.vehicleService.deleteVehicleForPartner(id).subscribe((res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã khóa tài xế',
            });
          }
          this.getListVehicleOfPartner();
        });
      },
    });
  }
  onChangeServiceType() {
    if (
      this._vehiclesForm['serviceTypeId'].value ==
      '5168511d-57f1-460a-8c7c-14664e3dbccc'
    ) {
      this._vehiclesForm['rentStationId'].setValidators(Validators.required);
      this._vehiclesForm['publishYearId'].setValidators(Validators.required);
      this._vehiclesForm['vehicleClassId'].setValidators(Validators.required);
    } else {
      this._vehiclesForm['rentStationId'].clearValidators();
      this._vehiclesForm['publishYearId'].clearValidators();
      this._vehiclesForm['vehicleClassId'].clearValidators();
      this._vehiclesForm['rentStationId'].setValue('');
      this._vehiclesForm['publishYearId'].setValue('');
      this._vehiclesForm['vehicleClassId'].setValue('');
    }
    this.vehicleForm.updateValueAndValidity();
  }
  createVehicle() {
    this.displayDialog = true;
    this.editMode = false;
    this.createStatus = true;
    this.vehicleForm.reset();
  }
  viewVehicleDetail(id: string) {
    this.displayDialog = true;
    this.editMode = false;
    this.createStatus = false;
    this.setDisableForm();
    this.vehicleService.getVehicleByIdForPartner(id).subscribe((res) => {
      if (res.body.serviceTypeId == '5168511d-57f1-460a-8c7c-14664e3dbccc') {
        this._vehiclesForm['rentStationId'].setValue(res.body.rentStationId);
        this._vehiclesForm['publishYearId'].setValue('');
        this._vehiclesForm['vehicleClassId'].setValue('');
        this._vehiclesForm['rentStationId'].setValidators(Validators.required);
        this._vehiclesForm['publishYearId'].setValidators(Validators.required);
        this._vehiclesForm['vehicleClassId'].setValidators(Validators.required);
      } else if (
        res.body.serviceTypeId !== '5168511d-57f1-460a-8c7c-14664e3dbccc'
      ) {
        this._vehiclesForm['rentStationId'].clearValidators();
        this._vehiclesForm['publishYearId'].clearValidators();
        this._vehiclesForm['vehicleClassId'].clearValidators();
        this._vehiclesForm['rentStationId'].setValue('');
        this._vehiclesForm['publishYearId'].setValue('');
        this._vehiclesForm['vehicleClassId'].setValue('');
      }

      this._vehiclesForm['vehicleId'].setValue(res.body.id);
      this._vehiclesForm['partnerId'].setValue(res.body.partnerId);
      this._vehiclesForm['serviceTypeId'].setValue(res.body.serviceTypeId);
      this._vehiclesForm['name'].setValue(res.body.name);
      this._vehiclesForm['licensePlates'].setValue(res.body.licensePlates);
      this._vehiclesForm['color'].setValue(res.body.color);
    });
    this.vehicleForm.updateValueAndValidity();
  }
  onChangeEdit() {
    this.editMode = true;
    this.createStatus = false;
    this.setEnableForm();
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

  onSaveVehicle() {
    this.isSubmit = true;
    if (this.vehicleForm.invalid) return;
    if (!this.editMode) {
      const vehicle: Vehicle = {
        partnerId: this.partnerId,
        vehicleTypeId: this._vehiclesForm['vehicleTypeId'].value,
        rentStationId: this._vehiclesForm['rentStationId'].value,
        publishYearId: this._vehiclesForm['publishYearId'].value,
        vehicleClassId: this._vehiclesForm['vehicleClassId'].value,
        name: this._vehiclesForm['name'].value,
        licensePlates: this._vehiclesForm['licensePlates'].value,
        color: this._vehiclesForm['color'].value,
        serviceTypeId: this._vehiclesForm['serviceTypeId'].value,
      };
      console.log(vehicle);
      this.vehicleService.createVehicleForPartner(vehicle).subscribe((res) => {
        if (res.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tạo phương tiện thành công',
          });
        }
        this.getListVehicleOfPartner();
      });
    }
  }
  onSaveChange() {
    if (this.editMode) {
      const vehicleId = this._vehiclesForm['id'].value;
      const vehicle: Vehicle = {
        partnerId: this.partnerId,
        vehicleTypeId: this._vehiclesForm['vehicleTypeId'].value,
        rentStationId: this._vehiclesForm['rentStationId'].value,
        publishYearId: this._vehiclesForm['publishYearId'].value,
        vehicleClassId: this._vehiclesForm['vehicleClassId'].value,
        name: this._vehiclesForm['name'].value,
        licensePlates: this._vehiclesForm['licensePlates'].value,
        color: this._vehiclesForm['color'].value,
        serviceTypeId: this._vehiclesForm['serviceTypeId'].value,
      };
      console.log(vehicle);

      this.vehicleService
        .updateVehicleForPartner(vehicleId, vehicle)
        .subscribe((res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật phương tiện thành công',
            });
          }
          this.getListVehicleOfPartner();
        });
    }
  }
  restoreVehicle(id: string) {
    const vehicle: Vehicle = {
      status: 1,
    };
    this.confirmationService.confirm({
      key: 'restoreConfirm',
      accept: () => {
        this.vehicleService
          .updateVehicleForPartner(id, vehicle)
          .subscribe((res) => {
            if (res.statusCode === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Kích hoạt phương tiện thành công',
              });
            }
            this.getListVehicleOfPartner();
          });
      },
    });
  }
}
