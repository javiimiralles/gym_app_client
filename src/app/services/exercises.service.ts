import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getHeaders } from '../utils/headers.utils';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  userId: string = this.usersService.uid;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  getExercises(text: string, difficulty: string, muscle: string) {
    let url = `${environment.base_url}/exercises?userId=${this.userId}`;
    if(text && text !== '') {
      url += `&text=${text}`;
    }
    if(difficulty && difficulty !== '') {
      url += `&difficulty=${difficulty}`;
    }
    if(muscle && muscle !== '') {
      url += `&muscle=${muscle}`;
    }
    return this.http.get(url, getHeaders());
  }
}
