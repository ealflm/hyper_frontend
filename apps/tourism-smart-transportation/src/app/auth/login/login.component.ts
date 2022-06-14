import { LocalStorageService } from './../localstorage.service';
import { AdminService } from './../../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { exhaustMap, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tourism-smart-transportation-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  isSubmit = false;
  userForm!: FormGroup;
  $sub: Subject<any> = new Subject();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private userService: AdminService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.localStorageService.getToken();
    if (token) {
      console.log('token');
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if (tokenDecode.Role === 'Admin') {
        this.router.navigate(['admin/dashboard']);
      } else if (tokenDecode.Role === 'Partner') {
        this.router.navigate(['partner/dashboard']);
      }
    }

    this._initForm();
  }
  private _initForm() {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }
  onSignIn() {
    this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    // }, 1500);
    this.isSubmit = true;
    if (this.userForm.invalid) {
      this.loading = false;
      return;
    }
    this.authService
      .signWithPartner(
        this.usersForm['username'].value,
        this.usersForm['password'].value
      )
      .pipe(takeUntil(this.$sub))
      .subscribe({
        next: (res) => {
          if (res.token !== null) {
            this.localStorageService.setToken(res.token);
            this.router.navigate(['partner/dashboard']);
            this.loading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          // console.log(error);
          if (error.status === 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Chưa xác thực',
              detail: 'Tài khoản hoặc mật khẩu không đúng',
            });
          }
          if (error.status === 500) {
            this.messageService.add({
              severity: 'error',
              summary: 'Chưa xác thực',
              detail: 'Tài khoản mật khẩu không đúng',
            });
          }
          this.loading = false;
        },
        complete: () => {
          this.$sub.unsubscribe();
          this.loading = false;
        },
      });
  }
  loginAdmin() {
    this.loading = true;
    // setTimeout(() => {
    //   this.loading = false;
    // }, 1500);
    this.isSubmit = true;
    if (this.userForm.invalid) {
      this.loading = false;
      return;
    }
    this.authService
      .signIn(
        this.usersForm['username'].value,
        this.usersForm['password'].value
      )
      .pipe(takeUntil(this.$sub))
      .subscribe({
        next: (res) => {
          if (res.token !== null) {
            this.localStorageService.setToken(res.token);
            this.router.navigate(['admin/dashboard']);
            this.loading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          // console.log(error);
          if (error.status === 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Chưa xác thực',
              detail: 'Tài khoản hoặc mật khẩu không đúng',
            });
          }
          if (error.status === 500) {
            this.messageService.add({
              severity: 'error',
              summary: 'Chưa xác thực',
              detail: 'Tài khoản mật khẩu không đúng',
            });
          }
          this.loading = false;
        },
        complete: () => {
          this.$sub.unsubscribe();
          this.loading = false;
        },
      });
  }
  get usersForm() {
    return this.userForm.controls;
  }
}
