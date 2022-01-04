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
  constructor() {}

  ngOnInit(): void {}

  onToggle() {
    this.status = !this.status;
    if (this.statusLink) {
      setTimeout(() => {
        this.statusLink = false;
      }, 230);
    } else {
      this.statusLink = true;
    }
  }
  onShowSetting() {
    this.showMore = !this.showMore;
  }
  mouseEnter() {
    this.status = true;
    console.log(this.status);

    if (this.statusLink) {
      setTimeout(() => {
        this.statusLink = false;
      }, 230);
    } else {
      this.statusLink = true;
    }
  }
  mouseLeave() {
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
