import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WorkoutComponent } from './workouts/workout/workout.component';
import { WorkoutSummaryModalComponent } from './workouts/workout/workout-summary-modal/workout-summary-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    WorkoutComponent,
    WorkoutSummaryModalComponent
  ],
  exports: [
    HomeComponent,
    WorkoutComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
