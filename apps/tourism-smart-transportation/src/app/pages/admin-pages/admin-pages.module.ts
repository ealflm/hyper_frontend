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
const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPagesComponent,
    // canActivate: [AuthGuardService],
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
        component: DashboardComponent,
        children: [{ path: 'service', component: DashboardComponent }],
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
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_ROUTES),
    PrimengModule,
    MaterialuiModule,
  ],
})
export class AdminPagesModule {}
