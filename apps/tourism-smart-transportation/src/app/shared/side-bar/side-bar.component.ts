import { Router } from '@angular/router';
import { LocalStorageService } from './../../auth/localstorage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  status = true;
  statusLink = false;
  showMoreService = false;
  showMoreFinance = false;
  showMoreMap = false;
  locked = true;
  displayAvatar = false;
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
    } else {
      this.status = true;
      if (this.statusLink) {
        setTimeout(() => {
          this.statusLink = false;
          this.displayAvatar = false;
        }, 230);
      }
    }
  }
  mouseLeave() {
    if (this.locked) {
      return;
    } else {
      this.status = false;
      if (this.statusLink) {
        setTimeout(() => {
          this.statusLink = true;
        }, 230);
      } else {
        this.statusLink = true;
        this.displayAvatar = false;
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
