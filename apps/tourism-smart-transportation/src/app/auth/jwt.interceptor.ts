import { MessageService } from 'primeng/api';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from './localstorage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private localstorageService: LocalStorageService,
    private messageService: MessageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.localstorageService.getToken();
    const isAPIUrl = request.url.startsWith(environment.apiURL);
    if (token && isAPIUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            console.log(error);
            this.localstorageService.removeToken();
          }
          if (error.status === 400) {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: error.error.message,
            });
          }
          if (error.status === 500) {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: error.error.message,
            });
          }
          if (error.status === 404) {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: error?.error?.message,
            });
          }
        }
        return throwError(error);
      })
    );
  }
}
