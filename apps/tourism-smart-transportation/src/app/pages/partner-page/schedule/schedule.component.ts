import { DriverService } from './../../../services/driver.service';
import { Driver } from './../../../models/DriverResponse';
import { TripService } from './../../../services/trip.service';
import { Trip } from './../../../models/TripResponse';
import { ServiceTypeEnum } from './../../../constant/service-type';
import { LocalStorageService } from './../../../auth/localstorage.service';
import { VehicleService } from './../../../services/vehicle.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DateOfWeek } from './../../../constant/dates';
import { Vehicle } from './../../../models/VehicleResponse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuFilterStatus } from './../../../constant/menu-filter-status';
import { Component, OnInit } from '@angular/core';
import { Route } from '../../../models/RouteResponse';
import { RouteService } from '../../../services/route.service';
import { convertTime } from '../../../providers/ConvertDate';
@Component({
  selector: 'tourism-smart-transportation-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  menuValue = MenuFilterStatus;
  schedules: any = [];
  dialogDetail = false;
  editMode = false;
  displayDialog = false;

  scheduleForm!: FormGroup;
  isSubmit = false;
  vehicles: Vehicle[] = [];
  routes: Route[] = [];
  drivers: Driver[] = [];
  dates = DateOfWeek;
  status: any = [];
  createStatus = false;
  partnerId = '';
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
    this._getVehicleDropdown();
    this._getRoutesDropdown();
    this._getDriverDropdown();
    this._initScheduleForm();
  }
  private _getVehicleDropdown() {
    this.vehicleService
      .getListVehicleDropdownForPartner(
        this.partnerId,
        ServiceTypeEnum.BusService
      )
      .subscribe((vehicle) => {
        this.vehicles = vehicle.body;
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
    this.driverService
      .getListDriverOfPartner(this.partnerId, null, 1)
      .subscribe((res) => {
        this.drivers = res.body;
      });
  }
  private _initScheduleForm() {
    this.scheduleForm = this.fb.group({
      tripName: ['', [Validators.required]],
      vehicleId: ['', [Validators.required]],
      driverId: ['', Validators.required],
      routeId: ['', [Validators.required]],
      dateOfWeek: ['', [Validators.required]],
      timeStart: ['', [Validators.required]],
      timeEnd: ['', [Validators.required]],
    });
  }
  get _schedulesForm() {
    return this.scheduleForm.controls;
  }
  onChangeFilterByName(e: any) {}
  OnGetMenuClick(value: number) {}
  createSchedule() {
    this.displayDialog = true;
    this.isSubmit = false;
    this.editMode = false;
    this.createStatus = true;
    this.scheduleForm.reset();
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
  deleteSchedule(id: string) {}
  viewsScheduleDetail(id: string) {
    this.displayDialog = true;
    this.createStatus = false;
    this.editMode = false;
  }
  onChangeEdit() {
    this.editMode = true;
    this.createStatus = false;
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

    const trip: Trip = {
      routeId: this._schedulesForm['routeId'].value,
      tripName: this._schedulesForm['tripName'].value,
      driverId: this._schedulesForm['driverId'].value,
      dayOfWeek: this._schedulesForm['dateOfWeek'].value,
      vehicleId: this._schedulesForm['vehicleId'].value,
      timeStart: convertTime(this._schedulesForm['timeStart'].value),
      timeEnd: convertTime(this._schedulesForm['timeEnd'].value),
    };
    this.tripService.createTrip(trip).subscribe((res) => {
      if (res.statusCode === 201) {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Tạo chuyến đi thành công',
        });
      }
      this.displayDialog = false;
    });
  }
  onSaveChange() {}
}
