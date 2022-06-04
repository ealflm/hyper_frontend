import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-rent-station-detail',
  templateUrl: './rent-station-detail.component.html',
  styleUrls: ['./rent-station-detail.component.scss'],
})
export class RentStationDetailComponent implements OnInit {
  rentStation: any = [];
  constructor() {}

  ngOnInit(): void {}
  editRentStation(id: string) {}
}
