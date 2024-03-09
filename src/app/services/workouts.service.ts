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

  getWorkoutById(id: string) {
    return this.http.get(`${environment.base_url}/workouts/${id}`, getHeaders());
  }

  getWorkouts(startDate: string, endDate: string) {
    return this.http.get(`${environment.base_url}/workouts?userId=${this.userId}&startDate=${startDate}&endDate=${endDate}`, getHeaders());
  }

  getLastWorkout(sessionId: string) {
    return this.http.get(`${environment.base_url}/workouts/last-workout/${sessionId}`, getHeaders());
  }

  createWorkout(workout: Workout) {
    (workout as any).date = formatDate(new Date());
    workout.user = this.userId;
    return this.http.post(`${environment.base_url}/workouts`, workout, getHeaders());
  }

  deleteWorkout(id: string) {
    return this.http.delete(`${environment.base_url}/workouts/${id}`, getHeaders());
  }

}
