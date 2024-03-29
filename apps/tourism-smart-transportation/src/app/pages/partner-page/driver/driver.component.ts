import { ServiceTypeEnum } from './../../../constant/service-type';
import {
  DriverMenuFilterStatus,
  MenuFilterStatus,
} from './../../../constant/menu-filter-status';
import { DriverResponse } from './../../../models/DriverResponse';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { STATUS_DRIVER } from './../../../constant/status';
import { Vehicle } from './../../../models/VehicleResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DriverService } from './../../../services/driver.service';
import { LocalStorageService } from './../../../auth/localstorage.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Driver } from '../../../models/DriverResponse';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import {
  AgeCheck,
  PHONE_NUMBER_REGEX,
  validateEmty,
} from '../../../providers/CustomValidators';
import {
  debounceTime,
  Subscription,
  Subject,
  distinctUntilChanged,
  switchMap,
  takeLast,
} from 'rxjs';
import { VehicleService } from '../../../services/vehicle.service';
import { Gender } from '../../../constant/gender';
import { Router } from '@angular/router';

@Component({
  selector: 'tourism-smart-transportation-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
})
export class DriverComponent implements OnInit, OnDestroy, AfterViewInit {
  menuValue = DriverMenuFilterStatus;
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';

  drivers: Driver[] = [];
  driverForm!: FormGroup;
  filterName = '';
  filterStatus = null;
  status: any = [];
  gender = Gender;
  vehicles: any = [];
  partnerId = '';
  editMode = false;
  isSubmit = false;
  displayDialog = false;
  dialogDetail = false;
  statusBiding = 1;
  loading = false;
  hiddenDropdownVehicle = false;
  today = new Date(Date.now()).getFullYear();
  minDate = new Date(this.today - 18, 1, 1);

  private searchSubscription?: Subscription;
  private readonly searchSubject = new Subject<string>();
  constructor(
    private localStorageService: LocalStorageService,
    private driverService: DriverService,
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    if (user) {
      this.partnerId = user?.id;
    }
    this.getListDriverOfPartner();
    this._getlistVehicleForBookCarService();
    this._initDriverForm();
    this._mapStatus();
  }
  ngAfterViewInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        // console.log(value);
        this.getListDriverOfPartner();
      });
  }
  public ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
  private _mapStatus() {
    this.status = Object.keys(STATUS_DRIVER).map((key) => {
      return {
        id: key,
        lable: STATUS_DRIVER[key].lable,
        class: STATUS_DRIVER[key].class,
      };
    });
  }
  private _initDriverForm() {
    this.driverForm = this.fb.group(
      {
        id: [''],
        firstName: ['', [Validators.required, validateEmty]],
        lastName: ['', [Validators.required, validateEmty]],
        dateOfBirth: ['', Validators.required],
        phone: [
          '',
          [Validators.required, Validators.pattern(PHONE_NUMBER_REGEX)],
        ],
        selectedGender: ['', Validators.required],
        vehicleId: [''],
        vehicleName: [{ value: '', disabled: true }],
        createdDate: [{ value: '', disabled: true }],
        modifiedDate: [{ value: '', disabled: true }],
        feedback: [0],
      },
      {
        validator: [AgeCheck('dateOfBirth')],
      }
    );
  }
  get _driversForm() {
    return this.driverForm.controls;
  }
  onChangeFilterByName(e: any) {
    // search lazy
    this.filterName = e.target.value;
    this.searchSubject.next(this.filterName);
  }
  private _getlistVehicleForBookCarService() {
    this.vehicleService
      .getListVehicleDropdownForPartner(
        this.partnerId,
        ServiceTypeEnum.BookCarService
      )
      .subscribe((vehicleRes) => (this.vehicles = vehicleRes.body));
  }
  OnGetMenuClick(e: any) {
    this.filterStatus = e;
    this.getListDriverOfPartner();
  }
  deleteDriver(id: string) {
    this.confirmationService.confirm({
      key: 'deleteDriver',
      accept: () => {
        this.driverService.deleteDriverById(id).subscribe((res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã khóa tài xế',
            });
          }
          this.getListDriverOfPartner();
        });
      },
    });
  }
  createDriver() {
    this.editMode = false;
    this.isSubmit = false;
    this.displayDialog = true;
    this._driversForm['vehicleId'].clearValidators();
    this.driverForm.reset();
    this.enableForm();
  }
  onSave() {
    this.isSubmit = true;

    if (this.driverForm.invalid) return;
    this.loading = true;
    const dobRes = new Date(this._driversForm['dateOfBirth'].value);
    const pipe = new DatePipe('en-US');
    const dobPipe = pipe.transform(dobRes, 'yyyy-MM-dd');
    if (this.editMode) {
      const driverId = this._driversForm['id'].value;

      const driver: Driver = {
        firstName: this._driversForm['firstName'].value,
        lastName: this._driversForm['lastName'].value,
        dateOfBirth: dobPipe ? dobPipe : '',
        gender:
          this._driversForm['selectedGender'].value === 'true' ? true : false,
        phone: this._driversForm['phone'].value,
        vehicleId: this._driversForm['vehicleId'].value,
      };
      this.driverService.updateDriverById(driverId, driver).subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật thành công',
            });
            this.loading = false;
            this.isSubmit = false;
            this.editMode = false;
            this.displayDialog = false;
            this.getListDriverOfPartner();
          }
        },
        (error) => {
          this.isSubmit = false;
          this.loading = false;
          this.editMode = true;
          this.displayDialog = true;
        }
      );
    } else {
      const driver: Driver = {
        partnerId: this.partnerId,
        firstName: this._driversForm['firstName'].value,
        lastName: this._driversForm['lastName'].value,
        dateOfBirth: dobPipe ? dobPipe : '',
        gender:
          this._driversForm['selectedGender'].value === 'true' ? true : false,
        phone: this._driversForm['phone'].value,
        // vehicleId: this._driversForm['vehicleId'].value,
      };
      this.driverService.createDriver(driver).subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo tài xế thành công',
            });
            this.displayDialog = false;
            this.loading = false;
            this.isSubmit = false;
            this.editMode = false;
            this.getListDriverOfPartner();
          }
        },
        (error) => {
          this.editMode = false;
          this.isSubmit = false;
          this.loading = false;
          this.displayDialog = true;
        }
      );
    }
  }
  onCancel() {
    this.displayDialog = false;
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {
        this.displayDialog = true;
        // console.log(this.editMode);
      },
    });
  }
  onChangeEdit() {
    this.editMode = true;
    this._driversForm['vehicleId'].setValidators([Validators.required]);
    this.dialogDetail = false;
    this.displayDialog = true;
    this.cd.detectChanges();
    this.enableForm();
  }
  viewDriverDetail(id: string) {
    this.editMode = false;
    this.dialogDetail = true;
    this.displayDialog = false;
    this.disableForm();
    this._getlistVehicleForBookCarService();
    this.driverService.getDriverById(id).subscribe((res) => {
      this.statusBiding = res.body.status ? res.body.status : 1;
      this._driversForm['id'].setValue(res.body.id);
      this._driversForm['createdDate'].setValue(res.body.createdDate);
      this._driversForm['modifiedDate'].setValue(res.body.modifiedDate);
      this._driversForm['firstName'].setValue(res.body.firstName);
      this._driversForm['lastName'].setValue(res.body.lastName);
      const dobRes = new Date(res.body.dateOfBirth ? res.body.dateOfBirth : '');
      this._driversForm['dateOfBirth'].setValue(dobRes);
      this._driversForm['phone'].setValue(res.body.phone);
      this._driversForm['selectedGender'].setValue(
        res.body.gender ? res.body.gender.toString() : ''
      );
      this._driversForm['vehicleId'].setValue(res.body.vehicleId);
      this._driversForm['feedback'].setValue(res.body.feedbackRating);
      if (res.body.vehicleName) {
        this._driversForm['vehicleName'].setValue(
          res.body.vehicleTypeLabel +
            ' ' +
            res.body.vehicleName +
            ' | ' +
            res.body.licensePlates
        );
      } else {
        this._driversForm['vehicleName'].setValue('');
      }

      res.body.photoUrl == '' || res.body?.photoUrl == null
        ? (this.imagePreview = '../assets/image/imagePreview.png')
        : (this.imagePreview = `https://se32.blob.core.windows.net/driver/${res.body?.photoUrl}`);
      if (res.body.vehicleId) {
        this.vehicleService
          .getVehicleByIdForPartner(res.body.vehicleId)
          .subscribe((vehicleRes) => {
            if (vehicleRes.body.serviceTypeId === ServiceTypeEnum.BusService) {
              this.hiddenDropdownVehicle = true;
            } else {
              this.hiddenDropdownVehicle = false;
            }
          });
      } else {
        this.hiddenDropdownVehicle = false;
      }
    });
  }
  viewDriverTripHistoy(id: string) {
    this.router.navigate([`partner/driver/trip-history/${id}`]);
  }
  enableForm() {
    this._driversForm['firstName'].enable();
    this._driversForm['lastName'].enable();
    this._driversForm['dateOfBirth'].enable();
    this._driversForm['phone'].enable();
    this._driversForm['selectedGender'].enable();
    this._driversForm['vehicleId'].enable();
  }
  disableForm() {
    this._driversForm['firstName'].disable();
    this._driversForm['lastName'].disable();
    this._driversForm['dateOfBirth'].disable();
    this._driversForm['phone'].disable();
    this._driversForm['selectedGender'].disable();
    this._driversForm['vehicleId'].disable();
  }

  getListDriverOfPartner() {
    this.driverService
      .getListDriverOfPartner(
        this.partnerId,
        this.filterName,
        this.filterStatus
      )
      .subscribe((res) => (this.drivers = res.body));
  }
}
