import { ServiceTypeEnum } from './../../../constant/service-type';
import { MenuFilterStatus } from './../../../constant/menu-filter-status';
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
import { AgeCheck } from '../../../providers/CustomValidators';
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

@Component({
  selector: 'tourism-smart-transportation-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
})
export class DriverComponent implements OnInit, OnDestroy, AfterViewInit {
  menuValue = MenuFilterStatus;
  imagePreview?: string | ArrayBuffer | null =
    '../assets/image/imagePreview.png';

  drivers: Driver[] = [];
  driverForm!: FormGroup;
  filterName = '';
  filterStatus = 1;
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
  private searchSubscription?: Subscription;
  private readonly searchSubject = new Subject<string>();
  constructor(
    private localStorageService: LocalStorageService,
    private driverService: DriverService,
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
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
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^-?(0|[0-9]{10}\d*)?$/)],
        ],
        selectedGender: ['', Validators.required],
        vehicleId: [''],
        createdDate: [{ value: '', disabled: true }],
        modifiedDate: [{ value: '', disabled: true }],
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
          }
          this.loading = false;
          this.getListDriverOfPartner();
        },
        (error) => {
          this.loading = false;
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
          }
          this.loading = false;
          this.getListDriverOfPartner();
        },
        (error) => {
          this.loading = false;
        }
      );
    }
    this.editMode = false;
    this.isSubmit = false;
    this.displayDialog = false;
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
    this.driverService.getDriverById(id).subscribe((res) => {
      this.statusBiding = res.body.status ? res.body.status : 1;
      this._driversForm['id'].setValue(res.body.id);
      this._driversForm['createdDate'].setValue(res.body.createdDate);
      this._driversForm['modifiedDate'].setValue(res.body.modifiedDate);
      this._driversForm['firstName'].setValue(res.body.firstName);
      this._driversForm['lastName'].setValue(res.body.lastName);

      this._driversForm['dateOfBirth'].setValue(
        this.convertDateOfBirth(
          res.body.dateOfBirth ? res.body.dateOfBirth?.toString() : ''
        )
      );
      this._driversForm['phone'].setValue(res.body.phone);
      this._driversForm['selectedGender'].setValue(
        res.body.gender ? res.body.gender.toString() : ''
      );
      this._driversForm['vehicleId'].setValue(res.body.vehicleId);
      res.body.photoUrl == '' || res.body?.photoUrl == null
        ? (this.imagePreview = '../assets/image/imagePreview.png')
        : (this.imagePreview = `https://se32.blob.core.windows.net/driver/${res.body?.photoUrl}`);
    });
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
  convertDateOfBirth(value: string) {
    const dobRes = new Date(value ? value.toString() : '');
    const pipe = new DatePipe('en-US');
    let dobPipe: any;
    if (value) {
      dobPipe = pipe.transform(dobRes, 'dd/MM/yyy');
    }
    return dobPipe;
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
