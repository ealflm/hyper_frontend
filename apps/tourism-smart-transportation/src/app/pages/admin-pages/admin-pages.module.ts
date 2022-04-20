import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './../../components/map/map.component';
import { AuthGuardService } from './../../auth/auth.guard';
import { MaterialuiModule } from './../../materialui/materialui.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPagesComponent } from './admin-pages.component';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PartnerComponent } from './partner/partner.component';
import { UsersComponent } from './users/users.component';
import { ManagerServicesComponent } from './utility-services/manager-services/manager-services.component';
import { UtilityServicesModule } from './utility-services/utility-services.module';
import { FinanceModule } from './finance/finance.module';
import { MapModule } from './map/map.module';
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
      // {
      //   path: 'setting',
      //   redirectTo: 'setting/services',
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'setting',
      //   children: [
      //     { path: 'services', component: ManagerServicesComponent },
      //   ],
      // },
      // Loading modules UILITY-SERVICES
      {
        path: 'setting',
        loadChildren: () =>
          import('./utility-services/utility-services.module').then(
            (m) => m.UtilityServicesModule
          ),
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./finance/finance.module').then((m) => m.FinanceModule),
      },
      {
        path: 'map',
        loadChildren: () => import('./map/map.module').then((m) => m.MapModule),
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
    MapComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_ROUTES),
    PrimengModule,
    MaterialuiModule,
    FormsModule,
    ReactiveFormsModule,
    UtilityServicesModule,
    FinanceModule,
    MapModule,
  ],
})
export class AdminPagesModule {}
