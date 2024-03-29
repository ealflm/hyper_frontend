import { validateEmty } from '../../../../providers/CustomValidators';
import { MenuFilterStatus } from './../../../../constant/menu-filter-status';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PublishYear } from './../../../../models/PublishYearResponse';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { STATUS_BUS_PRICE } from './../../../../constant/status';
import { PublishYearService } from './../../../../services/publish-year.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-year-of-manufacture',
  templateUrl: './year-of-manufacture.component.html',
  styleUrls: ['./year-of-manufacture.component.scss'],
})
export class YearOfManufactureComponent implements OnInit {
  menuValue = MenuFilterStatus;
  editMode = false;
  displayDialog = false;
  VehicleYearOfPublishes: any = [];
  vehicleYearOfPublishStatus: any = [];
  currentPublishYear: any = [];
  filterPublishYear = '';
  fillterPublishYearStatus = 1;
  status: any = [];
  publishYearForm!: FormGroup;
  isSubmit = false;
  loading = false;
  constructor(
    private publishYearService: PublishYearService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllVehiclePublishYear();
    this._status();
    this._initPublishYearForm();
  }
  private _status() {
    this.status = Object.keys(STATUS_BUS_PRICE).map((key) => {
      return {
        id: key,
        lable: STATUS_BUS_PRICE[key].lable,
        class: STATUS_BUS_PRICE[key].class,
      };
    });
  }

  private _initPublishYearForm() {
    this.publishYearForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required, validateEmty]],
    });
  }
  get _publishYearForm() {
    return this.publishYearForm.controls;
  }
  onChangeFillterByName(e: any) {
    this.filterPublishYear = e.target.value;
    if (this.filterPublishYear == '') {
      this.VehicleYearOfPublishes = this.currentPublishYear;
    } else {
      this.VehicleYearOfPublishes = this.VehicleYearOfPublishes.filter(
        (value: any) => {
          return (
            value.name &&
            value.name
              .toLowerCase()
              .includes(this.filterPublishYear.toLowerCase())
          );
        }
      );
    }
  }
  onGetValueMenu(e: any) {
    this.fillterPublishYearStatus = e;
    this.getAllVehiclePublishYear();
  }
  getAllVehiclePublishYear() {
    this.publishYearService
      .getListPublishYear(this.fillterPublishYearStatus)
      .subscribe((res) => {
        this.VehicleYearOfPublishes = res.body.items;
        this.currentPublishYear = res.body.items;
      });
  }
  createVehicleYearOfPublish() {
    this.isSubmit = false;
    this.editMode = false;
    this.displayDialog = true;
    this.publishYearForm.reset();
  }
  updateVehicleYearOfPublish(id: string) {
    this.displayDialog = true;
    this.editMode = true;
    this.publishYearService.getPublishYearById(id).subscribe((res) => {
      // console.log(res);

      const timesplit = res.body.name?.split(' - ');
      // console.log(timesplit);
      const time = new Date(timesplit ? timesplit[0] : '');
      const time2 = new Date(timesplit ? timesplit[1] : '');
      const timeCompleted = [time, time2];
      this._publishYearForm['id'].setValue(res.body.id);
      this._publishYearForm['name'].setValue(timeCompleted);
      this._publishYearForm['description'].setValue(res.body.description);
    });
  }
  onDeleteVehicleearOfPublish(id: string) {
    this.confirmationService.confirm({
      accept: () => {
        this.publishYearService.deletePublishYearByid(id).subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã khóa đối tác',
          });
          this.getAllVehiclePublishYear();
        });
      },
    });
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
  onSaveVehicleYearOfPublish() {
    this.isSubmit = true;
    if (this.publishYearForm.invalid) return;
    this.loading = true;
    if (this.isSubmit && this.editMode) {
      const id = this._publishYearForm['id'].value;
      const publishYear: PublishYear = {
        name:
          this.convertTime(this._publishYearForm['name'].value[0]) +
          ' - ' +
          this.convertTime(this._publishYearForm['name'].value[1]),
        description: this._publishYearForm['description'].value,
        status: 1,
      };
      this.publishYearService.updatePublishYearById(id, publishYear).subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this.displayDialog = false;
            this.editMode = false;
            this.loading = false;
            this.getAllVehiclePublishYear();
          }
        },
        (error) => {
          this.displayDialog = true;
          this.editMode = true;
          this.loading = false;
        }
      );
    } else if (this.isSubmit && !this.editMode) {
      const publishYear: PublishYear = {
        name:
          this.convertTime(this._publishYearForm['name'].value[0]) +
          ' - ' +
          this.convertTime(this._publishYearForm['name'].value[1]),
        description: this._publishYearForm['description'].value,
      };
      this.publishYearService.createPublishYear(publishYear).subscribe(
        (res) => {
          if (res.statusCode === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this.getAllVehiclePublishYear();
            this.displayDialog = false;
            this.editMode = false;
            this.loading = false;
          }
        },
        (error) => {
          this.displayDialog = true;
          this.editMode = false;
          this.loading = false;
        }
      );
    }
  }
  convertTime(value: string) {
    const time = new Date(value);
    const pipe = new DatePipe('en-US');
    const timeConverted = pipe.transform(time, 'yyyy');
    return timeConverted;
  }
}
