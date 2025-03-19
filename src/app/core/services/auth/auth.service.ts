import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { AuthResponse, User } from '../../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<AuthResponse | null>(
    JSON.parse(localStorage.getItem('userData') || '{}')
  );
  user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}users/login`, {
      username,
      password,
    });
  }

  signup(
    firstname: string,
    lastname: string,
    username: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}users`, {
      username,
      password,
      firstname,
      lastname,
    });
  }

  setUser(user: AuthResponse | null) {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
    this.userSubject.next(user);
  }
}
