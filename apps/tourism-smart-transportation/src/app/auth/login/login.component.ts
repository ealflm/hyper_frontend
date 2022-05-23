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
    if (this.localStorageService.getToken()) {
      this.router.navigate(['/dashboard']);
    }
    this._initForm();
  }
  private _initForm() {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
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
      .signIn(
        this.usersForm['username'].value,
        this.usersForm['password'].value
      )
      .pipe(takeUntil(this.$sub))
      .subscribe({
        next: (res) => {
          if (res.token !== null) {
            this.localStorageService.setToken(res.token);
            this.router.navigate(['dashboard']);
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

    // this.userService
    //   .signIn(this.usersForm['email'].value, this.usersForm['password'].value)
    //   .subscribe({
    //     next: (res) => {
    //       if (res.token !== undefined) {
    //         this.localStorageService.setToken(res.token);
    //         this.router.navigate(['dashboard']);
    //       }
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       // console.log(error.status);
    //       if (error.status === 401) {
    //         this.messageService.add({
    //           severity: 'error',
    //           summary: 'Unauthorized',
    //           detail: 'Email or password incorect',
    //         });
    //       }
    //     },
    //   });
  }
  get usersForm() {
    return this.userForm.controls;
  }
}
