import { PagenotfoundComponentComponent } from './../components/pagenotfound-component/pagenotfound-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { PrimengModule } from '../primeng/primeng.module';

export const usersRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', pathMatch: 'full', component: PagenotfoundComponentComponent },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(usersRoutes),
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
  ],
})
export class AuthModule {}
