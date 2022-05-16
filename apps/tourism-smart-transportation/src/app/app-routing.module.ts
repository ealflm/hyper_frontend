import { AdminPageModule } from './pages/admin-page/admin-page.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/admin-page/admin-page.module').then(
        (m) => m.AdminPageModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/partner-page/partner-page.module').then(
        (m) => m.PartnerPageModule
      ),
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
    AdminPageModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
