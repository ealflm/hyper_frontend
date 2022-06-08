import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss'],
})
export class VehicleTypeComponent implements OnInit {
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
  displayDialog = false;
  vehicleTypes: any = [];
  vehicleTypeStatus: any = [];
  fuel: any = [
    {
      name: 'Xăng',
      lable: 'Xăng',
    },
    {
      name: 'Dầu',
      lable: 'Dầu',
    },
  ];
  editMode = false;
  constructor() {}

  ngOnInit(): void {}
  createVehicleType() {
    this.editMode = false;
    this.displayDialog = true;
  }
  onChangeFillterByName(name: any) {}
  onGetValueMenu(value: number) {}
  onDeleteVehicleType(id: string) {}
  updateBusPrice(id: string) {}
  onSaveVehicleType() {}
  cancelDialog() {
    this.displayDialog = false;
    // this.confirmationService.confirm({});
  }
}
