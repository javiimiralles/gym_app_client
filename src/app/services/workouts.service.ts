import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getHeaders } from '../utils/headers.utils';
import { UsersService } from './users.service';
import { Workout } from '../models/workout.model';
import { formatDate } from '../utils/date.utils';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {

  userId: string = this.usersService.uid;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  createWorkout(workout: Workout) {
    workout.date = formatDate(new Date());
    workout.user = this.userId;
    return this.http.post(`${environment.base_url}/workouts`, workout, getHeaders());
  }

}
