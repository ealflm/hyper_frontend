import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountComponent } from './discount/discount.component';
import { ManagerServicesComponent } from './manager-services/manager-services.component';

const SERVICES: Routes = [
  {
    path: 'setting',
    redirectTo: 'setting/services',
    pathMatch: 'full',
  },
  {
    path: 'services',
    component: ManagerServicesComponent,
  },
  {
    path: 'discount',
    component: DiscountComponent,
  },
];

@NgModule({
  declarations: [DiscountComponent],
  imports: [CommonModule, RouterModule.forChild(SERVICES)],
})
export class UtilityServicesModule {}
