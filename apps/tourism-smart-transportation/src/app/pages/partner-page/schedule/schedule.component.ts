import { ConfirmationService } from 'primeng/api';
import { DateOfWeek } from './../../../constant/dates';
import { Vehicle } from './../../../models/VehicleResponse';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MenuFilterStatus } from './../../../constant/menu-filter-status';
import { Component, OnInit } from '@angular/core';
import { Route } from '../../../models/RouteResponse';

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
  dates = DateOfWeek;
  status: any = [];
  createStatus = false;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this._initScheduleForm();
  }
  private _initScheduleForm() {
    this.scheduleForm = this.fb.group({
      vehicleName: [''],
      vehicleLicensePlatesId: [''],
      routeNameId: [''],
      dateOfWeek: [''],
      timeStart: [''],
      timeEnd: [''],
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
    this._schedulesForm['vehicleLicensePlatesId'].setValue('');
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
  onSaveSchedule() {}
  onSaveChange() {}
}
