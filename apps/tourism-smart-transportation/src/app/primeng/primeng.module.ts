import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule,
    MessagesModule,
    MessageModule,
  ],
  exports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule,
    MessagesModule,
    MessageModule,
  ],
})
export class PrimengModule {}
