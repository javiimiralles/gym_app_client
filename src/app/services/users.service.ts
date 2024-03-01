import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { getHeaders } from '../utils/headers.utils';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private user: User;

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder,) { }

  login(email: string, password: string): Observable<any> {
    const loginForm = this.formBuilder.group({
      email,
      password
    });
    return this.http.post(`${environment.base_url}/login`, loginForm.value)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res['token'] as string);
          const { uid, role } = res;
          this.user = new User(uid, null, null, null, null, role);
        })
      );
  }

  logout(): void {
    this.cleanLocalStorage();
    this.router.navigateByUrl('/login');
  }

  validate(correct: boolean, incorrect: boolean): Observable<boolean> {

    if (this.token === '') {
      this.cleanLocalStorage();
      return of(incorrect);
    }

    return this.http.get(`${environment.base_url}/login/token`, getHeaders())
      .pipe(
        tap((res: any) => {
          const { token, uid, name, email, gender, role } = res;
          localStorage.setItem('token', token);
          this.user = new User(uid, name, email, null, gender, role);
        }),
        map (res => {
          return correct;
        }),
        catchError (err => {
          this.cleanLocalStorage();
          return of(incorrect);
        })
      );
  }

  validateToken(): Observable<boolean> {
    return this.validate(true, false);
  }

  validateNoToken(): Observable<boolean> {
    return this.validate(false, true);
  }

  cleanLocalStorage(): void{
    localStorage.removeItem('token');
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.user.uid;
  }

  get name(): string {
    return this.user.name;
  }

  get email(): string {
    return this.user.email;
  }

  get gender(): string {
    return this.user.gender;
  }

  get role(): string {
    return this.user.role;
  }

}
