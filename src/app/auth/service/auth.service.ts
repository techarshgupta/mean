import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../model/auth-data.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http.post('http://localhost/api/user/signUp', authData)
      .subscribe(response => {
        console.log('TCL: AuthService -> createUser -> response', response);
      });
  }
}