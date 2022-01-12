import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  status = true;
  statusLink = false;
  showMore = false;
  locked = true;
  displayAvatar = false;
  constructor() {}

  ngOnInit(): void {}

  onToggle() {
    this.locked = !this.locked;
  }
  onShowSetting() {
    this.showMore = !this.showMore;
  }
  mouseEnter() {
    if (this.locked) {
      return;
    } else {
      this.status = true;
      if (this.statusLink) {
        setTimeout(() => {
          this.statusLink = false;
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
      }
    }
  }
  onClickAvatar() {
    this.displayAvatar = !this.displayAvatar;
  }
}
