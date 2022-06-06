import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponentsModule } from './../../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from './../../../primeng/primeng.module';
import { HeaderStatusComponent } from './../../../components/header-status/header-status.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPriceComponent } from './bus-price/bus-price.component';
import { VehicleBookingPriceComponent } from './vehicle-booking-price/vehicle-booking-price.component';
import { VehicleRentingPriceComponent } from './vehicle-renting-price/vehicle-renting-price.component';

const SETTING_ROUTE: Routes = [
  {
    path: 'setting',
    redirectTo: 'setting/bus-price',
    pathMatch: 'full',
  },
  {
    path: 'bus-price',
    component: BusPriceComponent,
  },
  {
    path: 'vehicle-booking-price',
    component: VehicleBookingPriceComponent,
  },
  {
    path: 'vehicle-renting-price',
    component: VehicleRentingPriceComponent,
  },
];
@NgModule({
  declarations: [
    BusPriceComponent,
    VehicleBookingPriceComponent,
    VehicleRentingPriceComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SETTING_ROUTE),
    PrimengModule,
    ReactiveFormsModule,
    ComponentsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingModule {}
