import { ConfirmationService, MessageService } from 'primeng/api';
import { STATUS_TIER } from './../../../constant/status';
import { TierService } from './../../../services/tier.service';
import { Router } from '@angular/router';
import { Service } from '../../../models/Service';
import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Tier, TiersResponse } from '../../../models/TierResponse';

@Component({
  selector: 'tourism-smart-transportation-manager-services',
  templateUrl: './manager-services.component.html',
  styleUrls: ['./manager-services.component.scss'],
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
      transition('openIcon => closeIcon', [animate('0.2s')]),
      transition('closeIcon => openIcon', [animate('0.2s')]),
    ]),
  ],
})
export class ManagerServicesComponent implements OnInit {
  isOpenIconFillter = true;
  //
  packageServices: Tier[] = [];
  tierStatus: any[] = [];
  //
  fillterStatus: number | null = null;
  fillterByName: any | null;
  totalItems = 0;
  //
  pageIndex?: number = 0;
  itemsPerPage?: number = 5;
  selectedServices?: Service[];
  constructor(
    private router: Router,
    private tierService: TierService,
    private confirmService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._getAllTiers();
    this._mapTierStatus();
  }
  createPackage() {
    this.router.navigate(['manage-service/create-package']);
  }
  _mapTierStatus() {
    this.tierStatus = Object.keys(STATUS_TIER).map((key) => {
      return {
        id: STATUS_TIER[key].id,
        lable: STATUS_TIER[key].lable,
        class: STATUS_TIER[key].class,
      };
    });
  }
  onToggleIconFillter() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
  }
  onDelete(id?: string) {
    if (id) {
      this.confirmService.confirm({
        accept: () => {
          this.tierService.deleteTier(id).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: res.message,
            });
            this._getAllTiers();
          });
        },
      });
    }
    this._getAllTiers();
  }
  _getAllTiers() {
    this.tierService
      .getAllTier(
        this.fillterByName,
        this.fillterStatus,
        this.pageIndex,
        this.itemsPerPage,
        null
      )
      .subscribe((partnersResponse: TiersResponse) => {
        this.totalItems = partnersResponse.body?.totalItems as number;
        this.packageServices = partnersResponse.body?.items;
      });
  }
  navmenuclick(value: any) {
    this.fillterStatus = value;
    this._getAllTiers();
  }
  onChangeFillterByLastName(e: any) {
    this.fillterByName = e.target.value;
    this._getAllTiers();
  }
  navPackageDetail(id?: string) {
    this.router.navigate([`manage-service/edit-package/${id}`]);
  }
  onPaginate(e: any) {
    this.pageIndex = e.page + 1;
    this.itemsPerPage = e.rows;
    this._getAllTiers();
  }
}
