import { PipeModule } from './../../pipe/pipe.module';
import { LimitLengthPipe } from './../../pipe/limit-length.pipe';
import { PartnerGuard } from './../../auth/partner.guard';
import { CheckedComponent } from './../../shared/checked/checked.component';
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
import { AuthGuardService } from '../../auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverComponent } from './driver/driver.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MapComponent } from './map/map.component';

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
      { path: 'partner/driver', component: DriverComponent },
      { path: 'partner/vehicle', component: VehicleComponent },
      { path: 'partner/schedule', component: ScheduleComponent },
      { path: 'partner/map', component: MapComponent },
    ],
  },
];
@NgModule({
  declarations: [
    PartnerPageComponent,
    SideBarPartnerComponent,
    DashboardComponent,
    DriverComponent,
    VehicleComponent,
    ScheduleComponent,
    MapComponent,
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
