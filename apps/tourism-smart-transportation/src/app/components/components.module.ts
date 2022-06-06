import { MaterialuiModule } from './../materialui/materialui.module';
import { PrimengModule } from './../primeng/primeng.module';
import { DataMapComponent } from './data-map/data-map.component';
import { DotsMenuComponent } from './dots-menu/dots-menu.component';
import { DriverDetailComponent } from './driver-detail/driver-detail.component';
import { HeaderStatusComponent } from './header-status/header-status.component';
import { ListDriversComponent } from './list-drivers/list-drivers.component';
import { PagenotfoundComponentComponent } from './pagenotfound-component/pagenotfound-component.component';
import { ListRentStationsComponent } from './list-rent-stations/list-rent-stations.component';
import { ListRoutesComponent } from './list-routes/list-routes.component';
import { ListStationsComponent } from './list-stations/list-stations.component';
import { MapComponent } from './map/map.component';
import { RentStationDetailComponent } from './rent-station-detail/rent-station-detail.component';
import { RouteDetailComponent } from './route-detail/route-detail.component';
import { StationDetailComponent } from './station-detail/station-detail.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    StationDetailComponent,
    RouteDetailComponent,
    RentStationDetailComponent,
    MapComponent,
    ListStationsComponent,
    ListRoutesComponent,
    ListRentStationsComponent,
    PagenotfoundComponentComponent,
    ListDriversComponent,
    HeaderStatusComponent,
    DriverDetailComponent,
    DotsMenuComponent,
    DataMapComponent,
  ],
  exports: [
    StationDetailComponent,
    RouteDetailComponent,
    RentStationDetailComponent,
    MapComponent,
    ListStationsComponent,
    ListRoutesComponent,
    ListRentStationsComponent,
    PagenotfoundComponentComponent,
    ListDriversComponent,
    HeaderStatusComponent,
    DriverDetailComponent,
    DotsMenuComponent,
    DataMapComponent,
  ],
  imports: [CommonModule, PrimengModule, MaterialuiModule],
})
export class ComponentsModule {}
