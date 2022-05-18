import { Service } from '../../../models/services';
import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
  selected: any = '1';
  isOpenIconFillter = true;
  services: Service[] = [
    {
      name: 'Đi theo chuyến',
      code: 'FIXED-XD-1432',
      createDate: '05/07/2020',
      userCreate: 'Công Danh',
      editDate: '09/12/2021',
      userEdit: 'Đam Mê',
      status: '1',
    },
    {
      name: 'Đặt xe',
      code: 'CUST-XD-1432',
      createDate: '22/07/2021',
      userCreate: 'Trần Gia Nguyên',
      editDate: '02/10/2021',
      userEdit: 'Đam Mê',
      status: '2',
    },
    {
      name: 'Thuê xe',
      code: 'RENT-XD-1432',
      createDate: '02/02/2020',
      userCreate: 'Thanh Sang',
      editDate: '01/01/2022',
      userEdit: 'Đam Mê',
      status: '3',
    },
  ];
  selectedServices?: Service[];
  constructor() {}

  ngOnInit(): void {}
  navmenuclick(value: any) {
    this.selected = value;
  }
  onToggle() {
    this.isOpenIconFillter = !this.isOpenIconFillter;
  }
  onDelete() {
    console.log(this.selectedServices);
  }
}
