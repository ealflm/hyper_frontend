import { map } from 'rxjs';
import { STATUS_TRIP } from './../../../constant/status';
import { DriverService } from './../../../services/driver.service';
import { Driver } from './../../../models/DriverResponse';
import { TripService } from './../../../services/trip.service';
import { Trip } from './../../../models/TripResponse';
import { ServiceTypeEnum } from './../../../constant/service-type';
import { LocalStorageService } from './../../../auth/localstorage.service';
import { VehicleService } from './../../../services/vehicle.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DateOfWeek, DateOfWeekMap } from './../../../constant/dates';
import { Vehicle } from './../../../models/VehicleResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MenuFilterStatus,
  MenuFilterTrip,
} from './../../../constant/menu-filter-status';
import { Component, OnInit } from '@angular/core';
import { Route } from '../../../models/RouteResponse';
import { RouteService } from '../../../services/route.service';
import {
  convertHoursMinutes,
  convertHoursToDateString,
  convertTime,
  formatDateToFE,
} from '../../../providers/ConvertDate';
import {
  checkMoreThanTimeStart,
  validateEmty,
} from '../../../providers/CustomValidators';
import {
  getFirstLastDateCurrentWeek,
  getISOWeeksInYear,
} from '../../../providers/GetDateOfWeek';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
@Component({
  selector: 'tourism-smart-transportation-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
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
export class ScheduleComponent implements OnInit {
  isOpenIconFillter?: boolean = true;
  menuValue = MenuFilterTrip;
  filterStatus = 1;
  dialogDetail = false;
  editMode = false;
  displayDialog = false;
  loading = false;

  scheduleForm!: FormGroup;
  isSubmit = false;
  vehicles: Vehicle[] = [];
  routes: Route[] = [];
  drivers: Driver[] = [];
  trips: Trip[] = [];
  dates = DateOfWeek;
  status: any = [];
  mapDate = DateOfWeekMap;
  createStatus = false;
  partnerId = '';
  weeks: any = [];
  selectedWeek: any;
  selectedDay: any;
  routeId = null;
  selectedRoute: any;
  clearFilterStatus = false;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private vehicleService: VehicleService,
    private localStorageService: LocalStorageService,
    private routeService: RouteService,
    private tripService: TripService,
    private messageService: MessageService,
    private driverService: DriverService
  ) {}
  ngOnInit(): void {
    const user = this.localStorageService.getUser;
    if (user) {
      this.partnerId = user?.id;
    }
    this._mapStatus();
    this.selectedWeek = getFirstLastDateCurrentWeek();
    this._getFirstLastDateInWeekOfYear();
    this._getListTrip();
    this._getVehicleDropdown();
    this._getRoutesDropdown();
    this._getDriverDropdown();
    this._initScheduleForm();
  }

  private _getFirstLastDateInWeekOfYear() {
    this.weeks = getISOWeeksInYear();
  }
  clearFilter() {
    this.routeId = null;
    this.selectedRoute = null;
    this.selectedDay = null;
    this.clearFilterStatus = !this.clearFilterStatus;
    this._getListTrip();
  }
  onSelectedWeek() {
    this.routeId = null;
    this.selectedRoute = null;
    this.selectedDay = null;
    this._getListTrip();
  }
  onSelectedDay() {
    // console.log(this.selectedDay);
    this._getListTrip();
  }
  onSelectedRoute() {
    // console.log(this.selectedRoute.id);
    this.routeId = this.selectedRoute.id;
    console.log(this.routeId);

    this._getListTrip();
  }
  onToggleIconFillter() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
  }
  private _mapStatus() {
    this.status = Object.keys(STATUS_TRIP).map((key) => {
      return {
        id: key,
        lable: STATUS_TRIP[key].lable,
        class: STATUS_TRIP[key].class,
      };
    });
  }
  // private _mapDateOfWeek() {
  //   this.mapDate = Object.keys(DateOfWeekMap).map((key, index) => {
  //     return {
  //       id: key,
  //       name: DateOfWeekMap[key].name,
  //     };
  //   });
  // }
  private _getVehicleDropdown() {
    this.vehicleService
      .getListVehicleByPartnerIdForPartner(this.partnerId, null, 1)
      .subscribe((vehicle) => {
        this.vehicles = vehicle.body.filter(
          (value) => value.serviceTypeId === ServiceTypeEnum.BusService
        );
      });
  }
  private _getRoutesDropdown() {
    this.routeService
      .getRouteForPartner(this.partnerId)
      .subscribe((routeRes) => {
        this.routes = routeRes.body.items;
      });
  }
  private _getDriverDropdown() {
    this.tripService
      .getDriverDropDown(this.partnerId)
      .pipe(
        map((driverRes) => {
          this.drivers = driverRes.body;
        })
      )
      .subscribe();
  }
  private _getListTrip(tripName?: string) {
    this.tripService
      .getListTrip(
        this.partnerId,
        tripName,
        this.filterStatus,
        this.selectedWeek.start + '-' + this.selectedWeek.end,
        this.selectedDay,
        this.routeId
      )
      .subscribe((tripRes) => {
        this.trips = tripRes.body.items;
      });
  }
  private _initScheduleForm() {
    this.scheduleForm = this.fb.group(
      {
        tripId: [''],
        tripName: ['', [Validators.required, validateEmty]],
        vehicleId: ['', [Validators.required]],
        driverId: ['', Validators.required],
        routeId: ['', [Validators.required]],
        dateOfWeek: ['', [Validators.required]],
        timeStart: ['', [Validators.required]],
        timeEnd: ['', [Validators.required]],
      },
      {
        validator: [checkMoreThanTimeStart('timeStart', 'timeEnd')],
      }
    );
  }
  get _schedulesForm() {
    return this.scheduleForm.controls;
  }
  onChangeFilterByName(e: any) {
    this._getListTrip(e.target.value);
  }
  OnGetMenuClick(value: number) {
    this.filterStatus = value;
    this._getListTrip();
  }
  createSchedule() {
    this.displayDialog = true;
    this.isSubmit = false;
    this.editMode = false;
    this.createStatus = true;
    this.scheduleForm.reset();
    this._setEnableForm();
  }
  resetForm() {
    this._schedulesForm['vehicleName'].setValue('');
    this._schedulesForm['vehicleId'].setValue('');
    this._schedulesForm['driverId'].setValue('');
    this._schedulesForm['routeNameId'].setValue('');
    this._schedulesForm['dateOfWeek'].setValue('');
    this._schedulesForm['timeStart'].setValue('');
    this._schedulesForm['timeEnd'].setValue('');
  }
  deleteSchedule(id: string) {
    this.confirmationService.confirm({
      key: 'deleteConfirm',
      accept: () => {
        this.tripService.deleteTrip(id).subscribe((res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa chuyến thành công',
            });
            this._getListTrip();
          }
        });
      },
    });
  }
  viewsScheduleDetail(id: string) {
    this.displayDialog = true;
    this.createStatus = false;
    this.editMode = false;
    this.isSubmit = false;

    this._setDisableForm();
    this.tripService.getTripById(id).subscribe((tripRes) => {
      this._schedulesForm['tripId'].setValue(tripRes.body.tripId);

      this._schedulesForm['routeId'].setValue(tripRes.body.routeId);
      this._schedulesForm['tripName'].setValue(tripRes.body.tripName);
      this._schedulesForm['driverId'].setValue(tripRes.body.driverId);
      this._schedulesForm['dateOfWeek'].setValue(tripRes.body.dayOfWeek);
      this._schedulesForm['vehicleId'].setValue(tripRes.body.vehicleId);
      this._schedulesForm['timeStart'].setValue(
        convertHoursToDateString(tripRes.body.timeStart)
      );

      this._schedulesForm['timeEnd'].setValue(
        convertHoursToDateString(tripRes.body.timeEnd)
      );
    });
  }
  onChangeEdit() {
    this.editMode = true;
    this.createStatus = false;
    this.displayDialog = true;
    this._setEnableForm();
  }
  private _setDisableForm() {
    this._schedulesForm['routeId'].disable();
    this._schedulesForm['tripName'].disable();
    this._schedulesForm['driverId'].disable();
    this._schedulesForm['dateOfWeek'].disable();
    this._schedulesForm['vehicleId'].disable();
    this._schedulesForm['timeStart'].disable();
    this._schedulesForm['timeEnd'].disable();
  }
  private _setEnableForm() {
    this._schedulesForm['routeId'].enable();
    this._schedulesForm['tripName'].enable();
    this._schedulesForm['driverId'].enable();
    this._schedulesForm['dateOfWeek'].enable();
    this._schedulesForm['vehicleId'].enable();
    this._schedulesForm['timeStart'].enable();
    this._schedulesForm['timeEnd'].enable();
  }
  onCancel() {
    this.displayDialog = false;
    this.confirmationService.confirm({
      key: 'confirmCloseDialog',
      accept: () => {
        this.displayDialog = true;
      },
    });
  }
  onSaveSchedule() {
    this.isSubmit = true;
    if (this.scheduleForm.invalid) return;
    this.loading = true;
    const trip: Trip = {
      routeId: this._schedulesForm['routeId'].value,
      tripName: this._schedulesForm['tripName'].value,
      driverId: this._schedulesForm['driverId'].value,
      dayOfWeek: this._schedulesForm['dateOfWeek'].value,
      vehicleId: this._schedulesForm['vehicleId'].value,
      timeStart: convertHoursMinutes(this._schedulesForm['timeStart'].value),
      timeEnd: convertHoursMinutes(this._schedulesForm['timeEnd'].value),
    };

    this.tripService.createTrip(trip).subscribe(
      (res) => {
        if (res.statusCode === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tạo chuyến đi thành công',
          });
          this.loading = false;
          this.editMode = false;
          this.displayDialog = false;
          this.isSubmit = false;
          this._getListTrip();
        }
      },
      (error) => {
        this.loading = false;
        this.editMode = false;
        this.displayDialog = true;
        this.isSubmit = false;
      }
    );
  }
  onSaveChange() {
    this.isSubmit = true;
    if (this.scheduleForm.invalid) return;
    this.loading = true;
    const trip: Trip = {
      routeId: this._schedulesForm['routeId'].value,
      tripName: this._schedulesForm['tripName'].value,
      driverId: this._schedulesForm['driverId'].value,
      dayOfWeek: this._schedulesForm['dateOfWeek'].value,
      vehicleId: this._schedulesForm['vehicleId'].value,
      timeStart: convertHoursMinutes(this._schedulesForm['timeStart'].value),
      timeEnd: convertHoursMinutes(this._schedulesForm['timeEnd'].value),
      status: 1,
    };

    this.tripService
      .updateTripById(this._schedulesForm['tripId'].value, trip)
      .subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Cập nhật chuyến đi thành công',
            });
            this.displayDialog = false;
            this.isSubmit = false;
            this.loading = false;
            this.editMode = false;
            this._getListTrip();
          }
        },
        (error) => {
          this.displayDialog = true;
          this.isSubmit = false;
          this.loading = false;
          this.editMode = true;
        }
      );
  }
}
