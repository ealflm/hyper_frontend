import { PackageService } from './../../../services/package.service';
import { MenuFilterStatus } from './../../../constant/menu-filter-status';
import { ConfirmationService, MessageService } from 'primeng/api';
import { STATUS_TIER } from './../../../constant/status';
import { Router } from '@angular/router';
import { Service } from '../../../models/ServicesResponse';
import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Package } from '../../../models/PackageResponse';

@Component({
  selector: 'tourism-smart-transportation-manager-services',
  templateUrl: './manager-services.component.html',
  styleUrls: ['./manager-services.component.scss'],
})
export class ManagerServicesComponent implements OnInit {
  //
  packageServices: Package[] = [];
  PackageStatus: any[] = [];
  //
  fillterStatus: number | null = 1;
  fillterByName: any | null;
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;
  selectedServices?: Service[];
  menuValue = MenuFilterStatus;
  constructor(
    private router: Router,
    private packageService: PackageService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._getListPackage();
    this._mapPackageStatus();
  }
  createPackage() {
    this.router.navigate(['admin/manage-service/create-package']);
  }
  private _mapPackageStatus() {
    this.PackageStatus = Object.keys(STATUS_TIER).map((key) => {
      return {
        id: STATUS_TIER[key].id,
        lable: STATUS_TIER[key].lable,
        class: STATUS_TIER[key].class,
      };
    });
  }

  onDelete(id?: string) {
    if (id) {
      this.confirmService.confirm({
        accept: () => {
          this.packageService.deletePackage(id).subscribe((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this._getListPackage();
          });
        },
      });
    }
    this._getListPackage();
  }
  private _getListPackage() {
    this.packageService
      .getAllPackage(
        this.fillterByName,
        this.fillterStatus,
        this.pageIndex,
        this.itemsPerPage,
        null
      )
      .subscribe((packageResponse) => {
        this.totalItems = packageResponse.body?.totalItems as number;
        this.packageServices = packageResponse.body?.items;
      });
  }
  onGetValueMenu(value: any) {
    this.fillterStatus = value;
    this._getListPackage();
  }

  onChangeFillterByLastName(e: any) {
    this.fillterByName = e.target.value;
    this._getListPackage();
  }
  navPackageDetail(id?: string) {
    this.router.navigate([`admin/manage-service/edit-package/${id}`]);
  }
  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;
    this._getListPackage();
  }
}
