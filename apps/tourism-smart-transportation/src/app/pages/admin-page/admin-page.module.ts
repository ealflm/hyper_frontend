import { DataMapComponent } from './../../components/data-map/data-map.component';
import { HeaderStatusComponent } from './../../components/header-status/header-status.component';
import { DotsMenuComponent } from './../../components/dots-menu/dots-menu.component';
import { MapComponent } from './../../components/map/map.component';
import { MapPageComponent } from './map/map-page.component';
import { LimitLengthPipe } from './../../pipe/limit-length.pipe';
import { AuthGuardService } from './../../auth/auth.guard';
import { NzZorroAntdModule } from '../../nz-zorro-antd/nz-zorro-antd.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialuiModule } from '../../materialui/materialui.module';
import { Routes, RouterModule } from '@angular/router';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPageComponent } from './admin-page.component';
import { SideBarComponent } from '../../shared/side-bar/side-bar.component';
import { PrimengModule } from '../../primeng/primeng.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PartnersComponent } from './partners/partners.component';
import { CustomersComponent } from './customers/customers.component';
import { ManagerServicesComponent } from './manager-services/manager-services.component';
import { FinanceModule } from './finance/finance.module';
import { DiscountComponent } from './discount/discount.component';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { ServiceDetailComponent } from './manager-services/service-detail/service-detail.component';
import { StandardPriceComponent } from './standard-price/standard-price.component';
import { ListDriversComponent } from '../../components/list-drivers/list-drivers.component';
import { ListStationsComponent } from '../../components/list-stations/list-stations.component';
import { ListRentStationsComponent } from '../../components/list-rent-stations/list-rent-stations.component';
import { ListRoutesComponent } from '../../components/list-routes/list-routes.component';

const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    canActivate: [AuthGuardService],
    data: {
      role: 'Admin',
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'account-partners', component: PartnersComponent },
      { path: 'account-customers', component: CustomersComponent },
      {
        path: 'account-customers/:id',
        component: CustomerDetailsComponent,
      },
      { path: 'manage-service', component: ManagerServicesComponent },
      {
        path: 'manage-service/create-package',
        component: ServiceDetailComponent,
      },
      {
        path: 'manage-service/edit-package/:id',
        component: ServiceDetailComponent,
      },

      { path: 'discount', component: DiscountComponent },
      // Loading modules UILITY-SERVICES

      { path: 'map', component: MapPageComponent },
      // {
      //   path: 'map',
      //   loadChildren: () => import('./map/map.module').then((m) => m.MapModule),
      // },
      { path: 'standard-price', component: StandardPriceComponent },
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
    PartnersComponent,
    CustomersComponent,
    ManagerServicesComponent,
    DiscountComponent,
    LimitLengthPipe,
    CustomerDetailsComponent,
    ServiceDetailComponent,
    StandardPriceComponent,
    DotsMenuComponent,
    HeaderStatusComponent,
    MapPageComponent,
    MapComponent,
    DataMapComponent,
    ListDriversComponent,
    ListStationsComponent,
    ListRentStationsComponent,
    ListRoutesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_ROUTES),
    PrimengModule,
    MaterialuiModule,
    NzZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    FinanceModule,
  ],
})
export class AdminPageModule {}
