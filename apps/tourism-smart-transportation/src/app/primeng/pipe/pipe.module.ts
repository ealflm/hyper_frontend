import { LimitLengthPipe } from './limit-length.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LimitLengthPipe],
  imports: [CommonModule],
  exports: [LimitLengthPipe],
})
export class PipeModule {}
