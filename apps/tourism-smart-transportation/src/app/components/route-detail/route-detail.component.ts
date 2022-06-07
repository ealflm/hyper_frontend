import { Component, Input, OnInit } from '@angular/core';
import { Route } from '../../models/RouteResponse';

@Component({
  selector: 'tourism-smart-transportation-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.scss'],
})
export class RouteDetailComponent implements OnInit {
  @Input() RouteDetail!: Route;
  constructor() {}

  ngOnInit(): void {}
}
