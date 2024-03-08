import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WorkoutComponent } from './workouts/workout/workout.component';
import { WorkoutSummaryModalComponent } from './workouts/workout/workout-summary-modal/workout-summary-modal.component';
import { WorkoutsListComponent } from './workouts/workouts-list/workouts-list.component';
import { RoutinesListComponent } from './routines/routines-list/routines-list.component';
import { ProfileComponent } from './profile/profile.component';
import { SessionComponent } from './sessions/session/session.component';
import { ExercisesListModalComponent } from './sessions/exercises-list-modal/exercises-list-modal.component';
import { RoutineComponent } from './routines/routine/routine.component';
import { ExerciseFormModalComponent } from './sessions/exercise-form-modal/exercise-form-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    WorkoutComponent,
    WorkoutSummaryModalComponent,
    WorkoutsListComponent,
    RoutinesListComponent,
    ProfileComponent,
    SessionComponent,
    ExercisesListModalComponent,
    RoutineComponent,
    ExerciseFormModalComponent
  ],
  exports: [],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
