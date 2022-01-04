import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [],
  imports: [CommonModule, CardModule, InputTextModule, ButtonModule],
  exports: [CardModule, InputTextModule, ButtonModule],
})
export class PrimengModule {}
