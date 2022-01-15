import { AuthGuardService } from './../../auth/auth.guard';
import { MaterialuiModule } from './../../materialui/materialui.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPagesComponent } from './admin-pages.component';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { PartnerComponent } from '../partner/partner.component';
import { UsersComponent } from '../users/users.component';
import { ManagerServicesComponent } from '../manager-services/manager-services.component';
import { ManagerVehicleTypeComponent } from '../manager-vehicle-type/manager-vehicle-type.component';
const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPagesComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'account-partner', component: PartnerComponent },
      { path: 'account-users', component: UsersComponent },
      {
        path: 'setting',
        redirectTo: 'setting/services',
        pathMatch: 'full',
      },
      {
        path: 'setting',
        children: [
          { path: 'services', component: ManagerServicesComponent },
          { path: 'vehicle-type', component: ManagerVehicleTypeComponent },
        ],
      },
    ],
  },
];
@NgModule({
  declarations: [
    AdminPagesComponent,
    SideBarComponent,
    DashboardComponent,
    PartnerComponent,
    UsersComponent,
    ManagerServicesComponent,
    ManagerVehicleTypeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_ROUTES),
    PrimengModule,
    MaterialuiModule,
  ],
})
export class AdminPagesModule {}
