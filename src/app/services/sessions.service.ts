import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getHeaders } from '../utils/headers.utils';
import { UsersService } from './users.service';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {

  sessionsPrewiew: Session[] = []; // para la creacion/edicion de rutinas
  currentSessionPreview: Session;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  getSessionById(id: string) {
    return this.http.get(`${environment.base_url}/sessions/${id}`, getHeaders());
  }

  createSession(session: Session) {
    return this.http.post(`${environment.base_url}/sessions`, session, getHeaders());
  }

  updateSession(session: Session) {
    return this.http.put(`${environment.base_url}/sessions/${session.uid}`, session, getHeaders());
  }

  updateSessionExercises(id: string, exerciseId: string, mode: 'add' | 'remove') {
    const data = { exerciseId, mode };
    return this.http.put(`${environment.base_url}/sessions/update-exercises/${id}`, data, getHeaders());
  }

}
