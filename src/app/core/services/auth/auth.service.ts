import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { User } from '../../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}users/login`, {
      username,
      password,
    });
  }

  signup(
    firstname: string,
    lastname: string,
    username: string,
    password: string
  ): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}users`, {
      username,
      password,
      firstname,
      lastname,
    });
  }
}
