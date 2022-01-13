import { Service } from './../../models/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-manager-services',
  templateUrl: './manager-services.component.html',
  styleUrls: ['./manager-services.component.scss'],
})
export class ManagerServicesComponent implements OnInit {
  selected: any = '1';
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
  constructor() {}

  ngOnInit(): void {}
  navmenuclick(value: any) {
    this.selected = value;
  }
}
