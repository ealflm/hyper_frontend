import { Vehicle } from './../../models/VehicleResponse';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
})
export class VehicleDetailComponent implements OnInit {
  @Input() VehicleDetail!: Vehicle;
  constructor() {}

  ngOnInit(): void {}
}
