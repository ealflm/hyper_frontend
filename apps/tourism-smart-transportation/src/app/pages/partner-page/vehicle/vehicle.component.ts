import { MapService } from './../../../services/map.service';
import {
  ServiceTypeEnum,
  ServiceTypeFilter,
} from './../../../constant/service-type';
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
import { validateEmty } from '../../../providers/CustomValidators';

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
  vehicleTypes: VehicleType[] = [];
  serviceTypes: ServiceType[] = [];
  serviceTypeFilter = ServiceTypeFilter;
  rentStations: RentStation[] = [];
  publishYears: PublishYear[] = [];
  vehicleClass: VehicleClass[] = [];
  subscription = new Subscription();
  searchSubject$ = new Subject<string>();
  partnerId = '';
  filterByName = '';
  filterByStatus = 1;
  vehicleTypeArrCur: VehicleType[] = [];
  createStatus = false;
  currentLicensePlates? = '';
  ServiceTypeEnum = ServiceTypeEnum;
  isSubmit = false;
  loading = false;
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
    private localStorageService: LocalStorageService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    this.partnerId = user?.id;
    this._getVehicleTypes();
    this._getServiceTypes();
    this._getPublishYears();
    this._getCategorys();
    this.getListVehicleOfPartner();
    this._mapStatus();
    this._getRentStation();
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
      id: [''],
      vehicleId: [''],
      partnerId: [''],
      serviceTypeId: ['', Validators.required],
      vehicleTypeId: ['', Validators.required],
      rentStationId: [''],
      publishYearId: [''],
      vehicleClassId: [''],
      name: ['', [Validators.required, validateEmty]],
      licensePlates: [
        '',
        [
          Validators.required,
          validateEmty,
          Validators.pattern(/^[0-9]{2}[A-Z]{1}[0-9]{1}-[0-9]{4,5}/),
        ],
      ],
      color: ['', [Validators.required, validateEmty]],
    });
  }
  private _getVehicleTypes() {
    this.vehicleTypeService.getListVehicleTypeForPartner(1).subscribe((res) => {
      // this.vehicleTypes = res.body;
      this.vehicleTypeArrCur = res.body;
    });
  }
  private _getServiceTypes() {
    this.serviceTypeService
      .getListServiceTypeForPartner(this.partnerId)
      .subscribe((res: any) => {
        this.serviceTypes = res.body;
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
  private _getRentStation() {
    this.mapService
      .getListRentStationForPartner(this.partnerId, null, 1)
      .subscribe((res) => {
        this.rentStations = res.body.items;
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
              detail: 'Đã khóa phương tiện',
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
      ServiceTypeEnum.RentCarService
    ) {
      this._vehiclesForm['rentStationId'].setValidators(Validators.required);
      this._vehiclesForm['publishYearId'].setValidators(Validators.required);
      this._vehiclesForm['vehicleClassId'].setValidators(Validators.required);
    } else {
      this._vehiclesForm['rentStationId'].clearValidators();
      this._vehiclesForm['publishYearId'].clearValidators();
      this._vehiclesForm['vehicleClassId'].clearValidators();
      this._vehiclesForm['rentStationId'].setValue(null);
      this._vehiclesForm['publishYearId'].setValue(null);
      this._vehiclesForm['vehicleClassId'].setValue(null);
    }
    if (
      this._vehiclesForm['serviceTypeId'].value == ServiceTypeEnum.BusService
    ) {
      this.vehicleTypes = this.vehicleTypeArrCur.filter(
        (value) => value.seats > 7
      );
      console.log(this.vehicleTypes);
    } else {
      this.vehicleTypes = this.vehicleTypeArrCur.filter(
        (value) => value.seats <= 7
      );
    }
    this.vehicleForm.updateValueAndValidity();
  }
  createVehicle() {
    this.isSubmit = false;
    this.displayDialog = true;
    this.editMode = false;
    this.createStatus = true;
    this.vehicleForm.reset();
    this.vehicleTypes = [];
    this.setEnableForm();
    this._vehiclesForm['rentStationId'].clearValidators();
    this._vehiclesForm['publishYearId'].clearValidators();
    this._vehiclesForm['vehicleClassId'].clearValidators();
  }
  viewVehicleDetail(id: string) {
    this.displayDialog = true;
    this.editMode = false;
    this.createStatus = false;
    this.setDisableForm();
    this.vehicleService.getVehicleByIdForPartner(id).subscribe((res) => {
      if (res.body.serviceTypeId == ServiceTypeEnum.RentCarService) {
        this._vehiclesForm['rentStationId'].setValue(res.body.rentStationId);
        this._vehiclesForm['publishYearId'].setValue(res.body.publishYearId);
        this._vehiclesForm['vehicleClassId'].setValue(res.body.categoryId);
        this._vehiclesForm['rentStationId'].setValidators(Validators.required);
        this._vehiclesForm['publishYearId'].setValidators(Validators.required);
        this._vehiclesForm['vehicleClassId'].setValidators(Validators.required);
        this.vehicleTypes = this.vehicleTypeArrCur.filter(
          (value) => value.seats <= 7
        );
      } else if (
        res.body.serviceTypeId == ServiceTypeEnum.BusService ||
        res.body.serviceTypeId == ServiceTypeEnum.BookCarService
      ) {
        this._vehiclesForm['rentStationId'].clearValidators();
        this._vehiclesForm['publishYearId'].clearValidators();
        this._vehiclesForm['vehicleClassId'].clearValidators();
        this._vehiclesForm['rentStationId'].setValue(null);
        this._vehiclesForm['publishYearId'].setValue(null);
        this._vehiclesForm['vehicleClassId'].setValue(null);
        this.vehicleTypes = this.vehicleTypeArrCur.filter(
          (value) => value.seats > 7
        );
      }
      this.currentLicensePlates = res?.body?.licensePlates;
      this._vehiclesForm['vehicleId'].setValue(res.body.id);
      this._vehiclesForm['vehicleTypeId'].setValue(res.body.vehicleTypeId);
      this._vehiclesForm['partnerId'].setValue(res.body.partnerId);
      this._vehiclesForm['serviceTypeId'].setValue(res.body.serviceTypeId);
      this._vehiclesForm['name'].setValue(res.body.name);
      this._vehiclesForm['licensePlates'].setValue(res.body.licensePlates);
      this._vehiclesForm['color'].setValue(res.body.color);
      this._vehiclesForm['id'].setValue(res.body.id);
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
    this.loading = true;
    if (!this.editMode) {
      const vehicle: Vehicle = {
        partnerId: this.partnerId,
        vehicleTypeId: this._vehiclesForm['vehicleTypeId'].value,
        rentStationId: this._vehiclesForm['rentStationId'].value,
        publishYearId: this._vehiclesForm['publishYearId'].value,
        categoryId: this._vehiclesForm['vehicleClassId'].value,
        name: this._vehiclesForm['name'].value,
        licensePlates: this._vehiclesForm['licensePlates'].value,
        color: this._vehiclesForm['color'].value,
        serviceTypeId: this._vehiclesForm['serviceTypeId'].value,
      };
      this.vehicleService.createVehicleForPartner(vehicle).subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo phương tiện thành công',
            });
            this.displayDialog = false;
            this.loading = false;
            this.editMode = false;
            this.isSubmit = false;
            this.getListVehicleOfPartner();
          }
        },
        (error) => {
          this.displayDialog = true;
          this.loading = false;
          this.editMode = false;
          this.isSubmit = false;
        }
      );
    }
  }
  onSaveChange() {
    const valueChange = this._vehiclesForm['licensePlates'].value;
    let vehicle: Vehicle;
    if (this.editMode) {
      const vehicleId = this._vehiclesForm['id'].value;
      if (valueChange == this.currentLicensePlates) {
        vehicle = {
          partnerId: this.partnerId,
          vehicleTypeId: this._vehiclesForm['vehicleTypeId'].value,
          rentStationId: this._vehiclesForm['rentStationId'].value,
          publishYearId: this._vehiclesForm['publishYearId'].value,
          categoryId: this._vehiclesForm['vehicleClassId'].value,
          name: this._vehiclesForm['name'].value,
          color: this._vehiclesForm['color'].value,
          serviceTypeId: this._vehiclesForm['serviceTypeId'].value,
        };
      } else {
        vehicle = {
          partnerId: this.partnerId,
          vehicleTypeId: this._vehiclesForm['vehicleTypeId'].value,
          rentStationId: this._vehiclesForm['rentStationId'].value,
          publishYearId: this._vehiclesForm['publishYearId'].value,
          categoryId: this._vehiclesForm['vehicleClassId'].value,
          licensePlates: this._vehiclesForm['licensePlates'].value,
          name: this._vehiclesForm['name'].value,
          color: this._vehiclesForm['color'].value,
          serviceTypeId: this._vehiclesForm['serviceTypeId'].value,
        };
      }

      this.vehicleService.updateVehicleForPartner(vehicleId, vehicle).subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật phương tiện thành công',
            });
            this.getListVehicleOfPartner();
            this.displayDialog = false;
            this.loading = false;
            this.editMode = false;
            this.isSubmit = false;
          }
        },
        (error) => {
          this.displayDialog = true;
          this.editMode = true;
          this.loading = false;
          this.isSubmit = false;
        }
      );
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
            this.displayDialog = false;
          });
      },
    });
  }
}
