import { ServiceTypeEnum } from './../../constant/service-type';
import { ServiceType } from './../../models/ServiceTypeResponse';
import { PartnersService } from './../../services/partners.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './../../auth/localstorage.service';
import { Component, OnInit } from '@angular/core';
import { Partner, PartnerResponse } from '../../models/PartnerResponse';

@Component({
  selector: 'tourism-smart-transportation-side-bar-partner',
  templateUrl: './side-bar-partner.component.html',
  styleUrls: ['./side-bar-partner.component.scss'],
})
export class SideBarPartnerComponent implements OnInit {
  locked = true;
  status = true;
  statusLink = false;

  showMoreService = false;
  showMoreFinance = false;
  showMoreMap = false;
  displayAvatar = false;
  statusName = true;
  user: any;
  partner!: Partner;
  photoUrl = '';
  serviceTypeList: any;
  checkServiceType = {
    BusService: false,
    RentService: false,
    BookService: false,
  };
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private partnersService: PartnersService
  ) {}

  ngOnInit(): void {
    this.localStorageService.setUserTokenDecode();
    this.user = this.localStorageService.getUser;
    if (this.user) {
      this.serviceTypeList = this.user.serviceTypeList.split('|');
      if (
        this.serviceTypeList.includes(ServiceTypeEnum.BusService) &&
        this.serviceTypeList.includes(ServiceTypeEnum.RentCarService)
      ) {
        this.checkServiceType.BusService = true;
        this.checkServiceType.BookService = true;
        this.checkServiceType.RentService = true;
        this.localStorage.setRoleForPartner(this.checkServiceType);
      } else if (this.serviceTypeList.includes(ServiceTypeEnum.BusService)) {
        this.checkServiceType.BusService = true;
        this.checkServiceType.BookService = true;
        this.localStorage.setRoleForPartner(this.checkServiceType);
      } else if (
        this.serviceTypeList.includes(ServiceTypeEnum.BookCarService)
      ) {
        this.checkServiceType.RentService = true;
        this.checkServiceType.BookService = true;
        this.localStorage.setRoleForPartner(this.checkServiceType);
      } else if (
        this.serviceTypeList.includes(ServiceTypeEnum.RentCarService)
      ) {
        this.checkServiceType.RentService = true;
        this.localStorage.setRoleForPartner(this.checkServiceType);
      }
    }
    this._getPartnerProfile();
  }
  private _getPartnerProfile() {
    this.partnersService
      .getProfileForPartner(this.user.id)
      .subscribe((partnerRes) => {
        this.partner = partnerRes.body;
        this.partner.photoUrl =
          'https://se32.blob.core.windows.net/partner/' +
          partnerRes.body.photoUrl;
      });
  }
  onToggle() {
    this.locked = !this.locked;
  }
  onShowMoreSetting() {
    this.showMoreService = !this.showMoreService;
  }
  onShowMoreFinance() {
    this.showMoreFinance = !this.showMoreFinance;
  }
  onShowMoreMap() {
    this.showMoreMap = !this.showMoreMap;
  }
  mouseEnter() {
    if (this.locked) {
      return;
    } else if (this.locked == false) {
      this.status = true;
      if (this.statusLink) {
        this.statusLink = false;
        if (this.status) {
          setTimeout(() => {
            this.statusName = true;
          }, 100);
        }
      }
    }
    // console.log(this.status);
  }
  mouseLeave() {
    if (this.locked) {
      return;
    } else if (this.locked == false) {
      this.status = false;
      if (!this.statusLink) {
        this.statusLink = true;
        this.displayAvatar = false;
        this.statusName = false;
      }
    }
  }
  onClickAvatar() {
    this.displayAvatar = !this.displayAvatar;
  }
  onLogout() {
    this.localStorage.removeToken();
    this.localStorage.removeUserStorage();
    this.localStorage.removeServiceToken();
    this.router.navigate(['login']);
  }
}
