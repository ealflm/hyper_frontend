import { PartnerGuard } from './auth/partner.guard';
import { AuthGuardService } from './auth/auth.guard';
import { AdminPageModule } from './pages/admin-page/admin-page.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ExtraOptions,
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router';
import { PartnerPageModule } from './pages/partner-page/partner-page.module';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: 'home',
    // canLoad: [AuthGuardService],
    component: HomeComponent,
  },
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
const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
  preloadingStrategy: PreloadAllModules,
  // ...any other options you'd like to use
};
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, routerOptions),
    PartnerPageModule,
    AdminPageModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
