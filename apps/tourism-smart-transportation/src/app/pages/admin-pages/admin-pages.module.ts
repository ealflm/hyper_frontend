import { MaterialuiModule } from './../../materialui/materialui.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPagesComponent } from './admin-pages.component';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
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
    ],
  },
];
@NgModule({
  declarations: [AdminPagesComponent, SideBarComponent, DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_ROUTES),
    PrimengModule,
    MaterialuiModule,
  ],
})
export class AdminPagesModule {}
