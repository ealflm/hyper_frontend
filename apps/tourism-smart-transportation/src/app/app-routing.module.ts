import { PartnerGuard } from './auth/partner.guard';
import { AuthGuardService } from './auth/auth.guard';
import { AdminPageModule } from './pages/admin-page/admin-page.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PartnerPageModule } from './pages/partner-page/partner-page.module';

const routes: Routes = [
  {
    path: 'admin',
    // canLoad: [AuthGuardService],
    loadChildren: () =>
      import('./pages/admin-page/admin-page.module').then(
        (m) => m.AdminPageModule
      ),
  },
  {
    path: 'partner',
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
      preloadingStrategy: PreloadAllModules,
      // useHash: true,
      // initialNavigation: 'enabled',
    }),
    PartnerPageModule,
    AdminPageModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
