import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tourism-smart-transportation-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.scss'],
})
export class RouteDetailComponent implements OnInit {
  @Input() RouteDetail: any = [];
  constructor() {}

  ngOnInit(): void {}
}
