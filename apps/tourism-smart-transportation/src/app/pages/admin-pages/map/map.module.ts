import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverComponent } from './driver/driver.component';
import { StationStaticComponent } from './station-static/station-static.component';
import { StationCarRentalComponent } from './station-car-rental/station-car-rental.component';
import { RouteComponent } from './route/route.component';
const MAP_ROUTE: Routes = [
  {
    path: 'map',
    redirectTo: 'map/station-car-rental',
    pathMatch: 'full',
  },
  {
    path: 'station-car-rental',
    component: StationCarRentalComponent,
  },
  {
    path: 'route',
    component: RouteComponent,
  },
  {
    path: 'station-static',
    component: StationStaticComponent,
  },
  {
    path: 'driver',
    component: DriverComponent,
  },
];
@NgModule({
  declarations: [
    DriverComponent,
    StationStaticComponent,
    StationCarRentalComponent,
    RouteComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(MAP_ROUTE)],
})
export class MapModule {}
