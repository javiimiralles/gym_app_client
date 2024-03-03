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

@NgModule({
  declarations: [
    HomeComponent,
    WorkoutComponent,
    WorkoutSummaryModalComponent,
    WorkoutsListComponent,
    RoutinesListComponent,
    ProfileComponent
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
