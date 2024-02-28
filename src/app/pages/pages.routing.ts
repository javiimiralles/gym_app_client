import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './user/home/home.component';

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
                                                  titulo: 'Tu siguiente sesión',
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
