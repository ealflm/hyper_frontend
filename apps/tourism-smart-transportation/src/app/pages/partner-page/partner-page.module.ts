import { PartnerServiceGuard } from './../../auth/partner-service.guard';
import { ServiceTypeEnum } from './../../constant/service-type';
import { DriverTripHistoryComponent } from './driver-trip-history/driver-trip-history.component';
import { PipeModule } from '../../primeng/pipe/pipe.module';
import { PartnerGuard } from './../../auth/partner.guard';
import { ComponentsModule } from './../../components/components.module';
import { SettingModule } from './../admin-page/setting/setting.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FinanceModule } from './../admin-page/finance/finance.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzZorroAntdModule } from './../../nz-zorro-antd/nz-zorro-antd.module';
import { MaterialuiModule } from './../../materialui/materialui.module';
import { PrimengModule } from './../../primeng/primeng.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerPageComponent } from './partner-page.component';
import { SideBarPartnerComponent } from '../../shared/side-bar-partner/side-bar-partner.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverComponent } from './driver/driver.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { PartnerMapPageComponent } from './map/partner-map-page.component';
import { ProfileComponent } from '../../components/profile/profile.component';
import { RentStationFormComponent } from './map/rent-station-form/rent-station-form.component';
import { RouteFormComponent } from './map/route-form/route-form.component';

const PARTNER_ROUTES: Routes = [
  {
    path: '',
    component: PartnerPageComponent,
    canActivate: [PartnerGuard],
    children: [
      {
        path: 'partner',
        redirectTo: 'partner/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: 'partner/dashboard',
        pathMatch: 'full',
      },
      { path: 'partner/dashboard', component: DashboardComponent },
      {
        path: 'partner/driver',
        component: DriverComponent,
        data: {
          userRoles: [
            ServiceTypeEnum.BookCarService,
            ServiceTypeEnum.BusService,
          ], // Multiple Allowed User
        },
        canActivate: [PartnerServiceGuard],
      },
      {
        path: 'partner/driver/trip-history/:id',
        component: DriverTripHistoryComponent,
        data: {
          userRoles: [
            ServiceTypeEnum.BookCarService,
            ServiceTypeEnum.BusService,
          ], // Multiple Allowed User
        },
        canActivate: [PartnerServiceGuard],
      },
      {
        path: 'partner/vehicle',
        component: VehicleComponent,
        data: {
          userRoles: [
            ServiceTypeEnum.BookCarService,
            ServiceTypeEnum.BusService,
            ServiceTypeEnum.RentCarService,
          ], // Multiple Allowed User
        },
        canActivate: [PartnerServiceGuard],
      },
      {
        path: 'partner/schedule',
        component: ScheduleComponent,
        data: {
          userRoles: [ServiceTypeEnum.BusService], // Multiple Allowed User
        },
        canActivate: [PartnerServiceGuard],
      },
      { path: 'partner/map', component: PartnerMapPageComponent },
      {
        path: 'partner/map/route',
        component: RouteFormComponent,
        data: {
          userRoles: [ServiceTypeEnum.BusService], // Multiple Allowed User
        },
        canActivate: [PartnerServiceGuard],
      },
      {
        path: 'partner/map/route/:id',
        component: RouteFormComponent,
        data: {
          userRoles: [ServiceTypeEnum.BusService], // Multiple Allowed User
        },
        canActivate: [PartnerServiceGuard],
      },
      { path: 'partner/profile', component: ProfileComponent },
    ],
  },
];
@NgModule({
  declarations: [
    PartnerPageComponent,
    SideBarPartnerComponent,
    DashboardComponent,
    DriverComponent,
    DriverTripHistoryComponent,
    VehicleComponent,
    ScheduleComponent,
    PartnerMapPageComponent,
    RentStationFormComponent,
    RouteFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PARTNER_ROUTES),
    PrimengModule,
    MaterialuiModule,
    NzZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    FinanceModule,
    MatDialogModule,
    SettingModule,
    ComponentsModule,
    PipeModule,
  ],
})
export class PartnerPageModule {}
