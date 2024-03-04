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

  constructor(private http: HttpClient, private usersService: UsersService) {}

  getSessionById(id: string) {
    return this.http.get(`${environment.base_url}/sessions/${id}`, getHeaders());
  }

}
