import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getHeaders } from '../utils/headers.utils';
import { UsersService } from './users.service';
import { Routine } from '../models/routine.model';

@Injectable({
  providedIn: 'root'
})
export class RoutinesService {

  userId: string = this.usersService.uid;

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

  createRoutine(routine: Routine) {
    routine.user = this.userId;
    return this.http.post(`${environment.base_url}/routines`, routine, getHeaders());
  }

  updateRoutine(routine: Routine) {
    routine.user = this.userId;
    return this.http.put(`${environment.base_url}/routines/${routine.uid}`, routine, getHeaders());
  }

  changeActiveRoutine(id: string) {
    return this.http.put(`${environment.base_url}/routines/change-active/${id}/${this.userId}`, null, getHeaders());
  }

  updateRoutineSessions(id: string, sessionId: string, mode: 'add' | 'remove') {
    const data = { sessionId, mode }
    return this.http.put(`${environment.base_url}/routines/update-sessions/${id}`, data, getHeaders());
  }

  skipSession(id: string) {
    return this.http.put(`${environment.base_url}/routines/skip-session/${id}`, null, getHeaders());
  }

  deleteRoutine(id: string) {
    return this.http.delete(`${environment.base_url}/routines/${id}`, getHeaders());
  }
}
