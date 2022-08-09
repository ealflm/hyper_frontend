import { LocalStorageService } from './localstorage.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartnerGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.localStorage.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      // console.log(tokenDecode.Role)
      if (
        !this._tokenExpired(tokenDecode.exp) &&
        tokenDecode.Role === 'Partner'
      ) {
        return true;
      } else {
        this.localStorage.removeToken();
        this.router.navigate(['login']);
        return false;
      }
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }

  private _tokenExpired(exp: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= exp;
  }
}
