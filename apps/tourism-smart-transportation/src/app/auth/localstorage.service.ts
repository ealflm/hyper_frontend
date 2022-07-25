import { Injectable } from '@angular/core';
const TOKEN = 'jwtToken';
const POWERBI_TOKEN = 'PowerBIToken';
const PARTNER_ROLE = 'Role';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}
  setToken(data: any) {
    localStorage.setItem(TOKEN, data);
  }
  getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }
  removeToken() {
    localStorage.removeItem(TOKEN);
  }
  setPowerBIToken(powerBItoken: string) {
    localStorage.setItem(POWERBI_TOKEN, powerBItoken);
  }
  getPowerBIToken(): string | null {
    return localStorage.getItem(POWERBI_TOKEN);
  }
  setUserTokenDecode() {
    const token = this.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      const user = {
        id: tokenDecode.PartnerId,
        email: tokenDecode.Email,
        photoUrl: tokenDecode.PhotoUrl,
        username: tokenDecode.Username,
        role: tokenDecode.Role,
        name: tokenDecode.FirstName + ' ' + tokenDecode.LastName,
        serviceTypeList: tokenDecode.ServiceTypeList,
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  removeUserStorage() {
    localStorage.removeItem('user');
  }
  get getUser() {
    const userStr = localStorage.getItem('user');
    let user: any;
    if (userStr) {
      user = JSON.parse(userStr ? userStr : '');
    }
    return user;
  }
  setRoleForPartner(role: any) {
    localStorage.setItem(PARTNER_ROLE, JSON.stringify(role));
  }
  get getRolePartner() {
    let role = localStorage.getItem(PARTNER_ROLE);
    if (role) {
      role = JSON.parse(role);
      return role;
    }
    return null;
  }
  removeServiceToken() {
    localStorage.removeItem(PARTNER_ROLE);
  }
}
