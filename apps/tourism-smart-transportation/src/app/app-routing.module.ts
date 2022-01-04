import { AdminPagesModule } from './pages/admin-pages/admin-pages.module';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: AdminPagesModule,
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      initialNavigation: 'enabled',
    }),
    AdminPagesModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
