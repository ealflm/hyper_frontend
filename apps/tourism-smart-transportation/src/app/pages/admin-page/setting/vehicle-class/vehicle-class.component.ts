import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-vehicle-class',
  templateUrl: './vehicle-class.component.html',
  styleUrls: ['./vehicle-class.component.scss'],
})
export class VehicleClassComponent implements OnInit {
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
  vehicleClasses: any = [];
  editMode = false;
  vehicleClassStatus: any = [];
  displayDialog = false;
  constructor() {}
  ngOnInit(): void {}
  createVehicleClass() {
    this.displayDialog = true;
  }
  onDeleteVehicleClass(id: string) {}
  updateVehicleClass(id: string) {}
  onChangeFillterByName(name: any) {}
  onGetValueMenu(e: any) {}
  onSaveVehicleClass() {}
  cancelDialog() {
    this.displayDialog = false;
  }
}
