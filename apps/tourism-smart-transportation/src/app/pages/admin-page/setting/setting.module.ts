import { ComponentsModule } from './../../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from './../../../primeng/primeng.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPriceComponent } from './bus-price/bus-price.component';
import { VehicleBookingPriceComponent } from './vehicle-booking-price/vehicle-booking-price.component';
import { VehicleRentingPriceComponent } from './vehicle-renting-price/vehicle-renting-price.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { VehicleClassComponent } from './vehicle-class/vehicle-class.component';
import { YearOfManufactureComponent } from './year-of-manufacture/year-of-manufacture.component';

const SETTING_ROUTE: Routes = [
  {
    path: 'admin/setting',
    redirectTo: 'admin/setting/vehicle-type',
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
  {
    path: 'vehicle-type',
    component: VehicleTypeComponent,
  },
  {
    path: 'vehicle-class',
    component: VehicleClassComponent,
  },
  {
    path: 'vehicle-manufacture-year',
    component: YearOfManufactureComponent,
  },
];
@NgModule({
  declarations: [
    BusPriceComponent,
    VehicleBookingPriceComponent,
    VehicleRentingPriceComponent,
    VehicleTypeComponent,
    VehicleClassComponent,
    YearOfManufactureComponent,
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
