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
  creatingRoutine: boolean;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  getRoutineById(id: string) {
    return this.http.get(`${environment.base_url}/routines/${id}`, getHeaders());
  }

  getRoutines(text: string) {
    return this.http.get(`${environment.base_url}/routines?userId=${this.userId}&text=${text}`, getHeaders());
  }

  getNextSession() {
    return this.http.get(`${environment.base_url}/routines/next-session/${this.userId}`, getHeaders());
  }
}
