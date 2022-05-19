import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { PaginatorModule } from 'primeng/paginator';

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
    DialogModule,
    DropdownModule,
    FileUploadModule,
    PaginatorModule,
  ],
  exports: [
    CardModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    PaginatorModule,
  ],
})
export class PrimengModule {}
