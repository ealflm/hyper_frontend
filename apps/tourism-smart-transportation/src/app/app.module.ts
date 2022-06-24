import { PartnerGuard } from './auth/partner.guard';
import { AuthGuardService } from './auth/auth.guard';
import { MapComponent } from './components/map/map.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { PrimengModule } from './primeng/primeng.module';
import { MaterialuiModule } from './materialui/materialui.module';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { NzZorroAntdModule } from './nz-zorro-antd/nz-zorro-antd.module';
import { en_US, NZ_I18N, NzI18nModule } from 'ng-zorro-antd/i18n';
import { SettingModule } from './pages/admin-page/setting/setting.module';
import { CheckedComponent } from './shared/checked/checked.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    AuthModule,
    ReactiveFormsModule,
    FormsModule,
    PrimengModule,
    MaterialuiModule,
    NzZorroAntdModule,
    NzI18nModule,
    NoopAnimationsModule
  ],
  providers: [
    AuthGuardService,
    PartnerGuard,
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
