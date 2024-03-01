import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getHeaders } from '../utils/headers.utils';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class RoutinesService {

  userId: string = this.usersService.uid;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  getNextSession() {
    return this.http.get(`${environment.base_url}/routines/next-session/${this.userId}`, getHeaders());
  }
}
