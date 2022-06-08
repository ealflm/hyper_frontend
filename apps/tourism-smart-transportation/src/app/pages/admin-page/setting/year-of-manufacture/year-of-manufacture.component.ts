import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-year-of-manufacture',
  templateUrl: './year-of-manufacture.component.html',
  styleUrls: ['./year-of-manufacture.component.scss'],
})
export class YearOfManufactureComponent implements OnInit {
  menuValue: any = [
    {
      value: 1,
      lable: 'Kích hoạt',
    },
    {
      value: 0,
      lable: 'Vô hiệu hóa',
    },
    {
      value: null,
      lable: 'Tất cả',
    },
  ];
  editMode = false;
  displayDialog = false;
  VehicleYearOfPublishes: any = [];
  vehicleYearOfPublishStatus: any = [];
  constructor() {}

  ngOnInit(): void {}
  onChangeFillterByName(e: any) {}
  onGetValueMenu(e: any) {}
  createVehicleYearOfPublish() {
    this.editMode = false;
    this.displayDialog = true;
  }
  updateVehicleYearOfPublish(id: string) {}
  onDeleteVehicleearOfPublish(id: string) {}
  cancelDialog() {
    this.displayDialog = false;
  }
  onSaveVehicleYearOfPublish() {}
}
