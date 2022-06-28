import { ProfileComponent } from './../../components/profile/profile.component';
import { PipeModule } from './../../pipe/pipe.module';
import { CheckedComponent } from './../../shared/checked/checked.component';
import { ComponentsModule } from './../../components/components.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MapPageComponent } from './map/map-page.component';
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
import { FormStationComponent } from './map/form-station/form-station.component';
import { SettingModule } from './setting/setting.module';
import { CardComponent } from './card/card.component';
import { FailureComponent } from '../../shared/failure/failure.component';
import { PartnerDetailComponent } from './partners/partner-detail/partner-detail.component';
import { PowerBIEmbedModule } from 'powerbi-client-angular';

const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    // canActivate: [AuthGuardService],
    children: [
      {
        path: 'admin',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full',
      },
      { path: 'admin/dashboard', component: DashboardComponent },
      { path: 'admin/account-partners', component: PartnersComponent },
      { path: 'admin/account-partners/:id', component: PartnerDetailComponent },

      { path: 'admin/account-customers', component: CustomersComponent },
      {
        path: 'admin/account-customers/:id',
        component: CustomerDetailsComponent,
      },
      { path: 'admin/manage-service', component: ManagerServicesComponent },
      {
        path: 'admin/manage-service/create-package',
        component: ServiceDetailComponent,
      },
      {
        path: 'admin/manage-service/edit-package/:id',
        component: ServiceDetailComponent,
      },

      { path: 'admin/discount', component: DiscountComponent },
      { path: 'admin/card', component: CardComponent },

      // Loading modules UILITY-SERVICES

      { path: 'admin/map', component: MapPageComponent },
      {
        path: 'admin/setting',
        loadChildren: () =>
          import('./setting/setting.module').then((m) => m.SettingModule),
      },
      { path: 'admin/profile', component: ProfileComponent },
      // {
      //   path: 'finance',
      //   loadChildren: () =>
      //     import('./finance/finance.module').then((m) => m.FinanceModule),
      // },
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
    CustomerDetailsComponent,
    ServiceDetailComponent,
    FormStationComponent,
    MapPageComponent,
    CheckedComponent,
    CardComponent,
    FailureComponent,
    PartnerDetailComponent,
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
    MatDialogModule,
    SettingModule,
    ComponentsModule,
    PipeModule,
    PowerBIEmbedModule,
  ],
})
export class AdminPageModule {}
