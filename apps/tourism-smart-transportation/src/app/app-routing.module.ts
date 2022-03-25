import { AdminPagesModule } from './pages/admin-pages/admin-pages.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


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
      // useHash: true,
      // initialNavigation: 'enabled',
    }),
    AdminPagesModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
