import { NgModule } from '@angular/core';

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
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { TreeTableModule } from 'primeng/treetable';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [],
  imports: [
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
    TagModule,
    DividerModule,
    PasswordModule,
    CalendarModule,
    ConfirmDialogModule,
    TooltipModule,
    TreeTableModule,
    InputNumberModule,
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
    TagModule,
    DividerModule,
    PasswordModule,
    CalendarModule,
    ConfirmDialogModule,
    TooltipModule,
    TreeTableModule,
    InputNumberModule,
  ],
})
export class PrimengModule {}
