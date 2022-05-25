import { MapModule } from './../admin-page/map/map.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzZorroAntdModule } from './../../nz-zorro-antd/nz-zorro-antd.module';
import { MaterialuiModule } from './../../materialui/materialui.module';
import { PrimengModule } from './../../primeng/primeng.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerPageComponent } from './partner-page.component';

const PARTNER_ROUTES: Routes = [
  {
    path: '',
    component: PartnerPageComponent,
    data: {
      role: 'Partner',
    },
    children: [],
  },
];
@NgModule({
  declarations: [PartnerPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(PARTNER_ROUTES),
    PrimengModule,
    MaterialuiModule,
    NzZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    MapModule,
  ],
})
export class PartnerPageModule {}
