import { HideMissingDirective } from './hide-missing.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HideMissingDirective],
  imports: [CommonModule],
  exports: [HideMissingDirective],
})
export class DirectiveModule {}
