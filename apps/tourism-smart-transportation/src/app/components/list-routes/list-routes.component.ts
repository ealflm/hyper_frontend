import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Route } from '../../models/RouteResponse';

@Component({
  selector: 'tourism-smart-transportation-list-routes',
  templateUrl: './list-routes.component.html',
  styleUrls: ['./list-routes.component.scss'],
})
export class ListRoutesComponent implements OnInit {
  @Input() routes: Route[] = [];
  @Output() GetFillterRoute: EventEmitter<any> = new EventEmitter<any>();
  @Output() GetIdRoute: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  onChangeFillterMapRoute(e: any) {
    this.GetFillterRoute.emit(e.target.value);
  }
  showDetail(id?: string) {
    this.GetIdRoute.emit({
      showDetailStatus: true,
      id: id,
    });
  }
}
