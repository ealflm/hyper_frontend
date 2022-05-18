import { MapService } from './../../services/map.service';
import { AuthGuardService } from './../../auth/auth.guard';
import { NzZorroAntdModule } from '../../nz-zorro-antd/nz-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ManagerServicesComponent } from './manager-services/manager-services.component';
import { UtilityServicesModule } from './utility-services/utility-services.module';
import { FinanceModule } from './finance/finance.module';
import { MapModule } from './map/map.module';
import { DiscountComponent } from './discount/discount.component';
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
      { path: 'manage-service', component: ManagerServicesComponent },
      { path: 'discount', component: DiscountComponent },
      // Loading modules UILITY-SERVICES
      {
        path: 'setting',
        loadChildren: () =>
          import('./utility-services/utility-services.module').then(
            (m) => m.UtilityServicesModule
          ),
      },
      {
        path: 'map',
        loadChildren: () => import('./map/map.module').then((m) => m.MapModule),
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./finance/finance.module').then((m) => m.FinanceModule),
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
    DiscountComponent,
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
