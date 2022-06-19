import { Injectable } from '@angular/core';
const TOKEN = 'jwtToken';
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
  setUserTokenDecode() {
    const token = this.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      const user = {
        id: tokenDecode.Id,
        email: tokenDecode.Email,
        photoUrl: tokenDecode.PhotoUrl,
        username: tokenDecode.Username,
        role: tokenDecode.Role,
        name: tokenDecode.FirstName + ' ' + tokenDecode.LastName,
      };
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  removeUserStorage() {
    localStorage.removeItem('user');
  }
  get getUser() {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr ? userStr : '');
    return user;
  }
}
