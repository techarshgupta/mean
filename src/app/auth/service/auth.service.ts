import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../model/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListner = new Subject<boolean>();
  private tokenTimer: any; // NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post('http://localhost:3000/api/user/signUp', authData)
      .subscribe(response => {
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData).subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expireInDuration = response.expiresIn;
        this.setAuthTimer(expireInDuration);
        this.isAuthenticated = true;
        this.authStatusListner.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
        this.saveAuthData(token, expirationDate);
        this.router.navigate(['/']);
      }
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const isInFuture = authInformation.expirationDate.getTime() - now.getTime();
    if (isInFuture > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(isInFuture / 1000);
      this.authStatusListner.next(true);
    }

  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
    };
  }
}
