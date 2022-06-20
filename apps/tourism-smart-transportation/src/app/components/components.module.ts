import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './../components/profile/profile.component';
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
import { ListVehicleComponent } from './list-vehicle/list-vehicle.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';
import { LoadingComponent } from './loading/loading.component';
import { IonicModule } from '@ionic/angular';

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
    ListVehicleComponent,
    VehicleDetailComponent,
    ProfileComponent,
    LoadingComponent,
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
    ListVehicleComponent,
    VehicleDetailComponent,
    ProfileComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialuiModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
})
export class ComponentsModule {}
