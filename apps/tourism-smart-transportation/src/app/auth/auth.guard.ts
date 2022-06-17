// import { SocialUser, SocialAuthService } from 'angularx-social-login';
// import { LocalstorageService, LocalStorageService } from './localstorage.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const token = this.localStorage.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if (
        !this._tokenExpired(tokenDecode.exp) &&
        tokenDecode.Role === 'Admin'
      ) {
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    } else {
      this.localStorage.removeToken();
      this.router.navigate(['login']);
      return false;
    }
  }
  canLoad(route: Route): boolean {
    const urlPath = route.path;
    if (urlPath === 'partner') {
      alert('unauthorised the page');
      return false;
    }
    return true;
  }
  private _tokenExpired(exp: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= exp;
  }
}
