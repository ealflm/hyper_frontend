import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceDefaultComponent } from './price-default/price-default.component';
import { ServiceTypeComponent } from './service-type/service-type.component';

const SERVICES: Routes = [
  {
    path: 'setting',
    redirectTo: 'setting/price-default',
    pathMatch: 'full',
  },
  {
    path: 'price-default',
    component: PriceDefaultComponent,
  },
  {
    path: 'service-type',
    component: ServiceTypeComponent,
  },
];

@NgModule({
  declarations: [PriceDefaultComponent, ServiceTypeComponent],
  imports: [CommonModule, RouterModule.forChild(SERVICES)],
})
export class UtilityServicesModule {}
