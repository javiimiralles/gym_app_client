import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './user/home/home.component';
import { WorkoutComponent } from './user/workouts/workout/workout.component';
import { WorkoutsListComponent } from './user/workouts/workouts-list/workouts-list.component';
import { RoutinesListComponent } from './user/routines/routines-list/routines-list.component';
import { ProfileComponent } from './user/profile/profile.component';

const routes: Routes = [
  /*============== RUTAS ADMIN =============*/
  { path: 'admin', component: AdminLayoutComponent, data: { role: 'ADMIN' },  canActivate: [AuthGuard],
    children: [
      { path: '**', redirectTo: 'dashboard-admin'}
    ]
  },
  /*============== RUTAS USUARIO =============*/
  { path: 'user', component: AdminLayoutComponent, data: { role: 'USER' },  canActivate: [AuthGuard],
    children: [
      /********** Inicio *************/
      { path: 'home', component: HomeComponent, data: {
                                                  title: 'Inicio',
                                                  backButtonUrl: ''
                                                }},
      /********** Workouts *************/
      { path: 'workout-in-progress/:id', component: WorkoutComponent, data: {
                                                  title: 'Entrenamiento',
                                                  backButtonUrl: ''
                                                }},
      { path: 'workouts-list', component: WorkoutsListComponent, data: {
                                                  title: 'Mis sesiones',
                                                  backButtonUrl: ''
                                                }},
      /********** Routines *************/
      { path: 'routines-list', component: RoutinesListComponent, data: {
                                                  title: 'Mis rutinas',
                                                  backButtonUrl: ''
                                                }},
      /********** Profile *************/
      { path: 'profile', component: ProfileComponent, data: {
                                                  title: 'Mis rutinas',
                                                  backButtonUrl: ''
                                                }},
      { path: '**', redirectTo: 'home' }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
