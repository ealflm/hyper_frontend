import { MapBoxService } from './../../../../services/map-box.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Station } from '../../../../models/StationResponse';

@Component({
  selector: 'tourism-smart-transportation-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss'],
})
export class RouteFormComponent implements OnInit, AfterContentChecked {
  routeForm!: FormGroup;
  isSubmit = false;
  editMode = false;
  stations: Station[] = [
    {
      id: '123',
      description: 'Trạm số 1',
      address: 'Hồ Cẩm Đào',
    },
    {
      id: '123',
      description: 'Trạm số 2',
      address: 'Bình Dương Tân Uyên',
    },
  ];
  constructor(private fb: FormBuilder, private mapBoxService: MapBoxService) {}

  ngOnInit(): void {
    this.initRouteForm();
    this.mapBoxService.initializeMiniMap();
  }
  ngAfterContentChecked(): void {
    this.mapBoxService.miniMap.resize();
  }
  private initRouteForm() {
    this.routeForm = this.fb.group({});
  }
  get _routesForm() {
    return this.routeForm.controls;
  }
  onReoderStations() {
    console.log(this.stations);
  }
  onCancle() {}
  onSave() {}
}
