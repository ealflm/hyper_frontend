import { LocalStorageService } from './localstorage.service';
import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartnerServiceGuard implements CanActivate {
  constructor(
    @Inject(Router) private router: Router,
    private localStorageService: LocalStorageService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const allowedUserRoles = this.getRoutePermissions(route);
    const userRoles = this.localStorageService.getUser.serviceTypeList.split(
      '|',
      3
    );

    return this.checkPermission(allowedUserRoles, userRoles);
  }
  private getRoutePermissions(route: ActivatedRouteSnapshot) {
    if (route.data && route.data['userRoles']) {
      return route.data['userRoles'];
    }
    return null;
  }
  checkPermission(allowedUserRoles: any[], userRoles: any[]): boolean {
    const isFounded = allowedUserRoles.some((r) => userRoles.includes(r));
    if (isFounded) {
      return isFounded;
    } else {
      this.router.navigateByUrl('/page-not-found');
      return isFounded;
    }
  }
}
