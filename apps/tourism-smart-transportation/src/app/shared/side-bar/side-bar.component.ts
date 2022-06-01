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
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private mapboxService: MapBoxService
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
        setTimeout(() => {
          this.statusLink = false;
          this.displayAvatar = true;
        }, 200);
      }
    }
    console.log(this.status);
  }
  mouseLeave() {
    if (this.locked) {
      return;
    } else if (this.locked == false) {
      this.status = false;
      if (!this.statusLink) {
        this.statusLink = true;
        this.displayAvatar = false;
      }
    }
    console.log(this.status);
  }
  onClickAvatar() {
    this.displayAvatar = !this.displayAvatar;
  }
  onLogout() {
    this.localStorage.removeToken();
    this.router.navigate(['login']);
  }
}
