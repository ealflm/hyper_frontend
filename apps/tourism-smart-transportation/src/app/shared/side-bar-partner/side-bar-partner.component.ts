import { Router } from '@angular/router';
import { LocalStorageService } from './../../auth/localstorage.service';
import { Component, OnInit } from '@angular/core';

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
  constructor(
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
    this.router.navigate(['login']);
  }
}
