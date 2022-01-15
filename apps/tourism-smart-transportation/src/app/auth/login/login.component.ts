import { LocalStorageService } from './../localstorage.service';
import { AdminService } from './../../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'tourism-smart-transportation-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  isSubmit = false;
  userForm!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private userService: AdminService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.localStorageService.getToken()) {
      this.router.navigate(['/dashboard']);
    }
    this._initForm();
  }
  private _initForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  onSignIn() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.isSubmit = true;
    if (this.userForm.invalid) {
      return;
    }
    this.userService
      .signIn(this.usersForm['email'].value, this.usersForm['password'].value)
      .subscribe(
        (res) => {
          if (res.token !== undefined) {
            this.localStorageService.setToken(res.token);
            this.router.navigate(['dashboard']);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.error,
            });
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          if (error.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: 'email or password incorect',
              detail: error.message,
            });
          }
        }
      );
  }
  get usersForm() {
    return this.userForm.controls;
  }
}
