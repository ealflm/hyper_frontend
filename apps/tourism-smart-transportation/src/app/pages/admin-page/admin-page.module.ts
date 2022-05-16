import { AuthGuardService } from './../../auth/auth.guard';
import { NzZorroAntdModule } from '../../nz-zorro-antd/nz-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from '../../components/map/map.component';
import { MaterialuiModule } from '../../materialui/materialui.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page.component';
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
    component: AdminPageComponent,
    // canActivate: [AuthGuardService],
    // data: {
    //   role: 'ROLE_ADMIN'
    // },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'account-partner', component: PartnerComponent },
      { path: 'account-users', component: UsersComponent },
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
    AdminPageComponent,
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
    NzZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    UtilityServicesModule,
    FinanceModule,
    MapModule,
  ],
})
export class AdminPageModule {}