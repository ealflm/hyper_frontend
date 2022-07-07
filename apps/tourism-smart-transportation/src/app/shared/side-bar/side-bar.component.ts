import { MapBoxService } from './../../services/map-box.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './../../auth/localstorage.service';
import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'tourism-smart-transportation-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  locked = true;
  status = true;
  statusLink = false;

  showMoreService = false;
  showMoreFinance = false;
  showMoreMap = false;
  displayAvatar = false;
  statusName = true;
  user: any;
  photoUrl = '';
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private mapboxService: MapBoxService
  ) {}

  ngOnInit(): void {
    this.localStorage.setUserTokenDecode();
    this.user = this.localStorage.getUser;
    if (this.user) {
      if (this.user.photoUrl === '' || !this.user.photoUrl) {
        this.photoUrl = '../../../assets/image/default-avatar.png';
      } else {
        this.photoUrl =
          'https://se32.blob.core.windows.net/admin/' + this.user.photoUrl;
      }
    }
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
    this.router.navigate(['login']);
  }
}
