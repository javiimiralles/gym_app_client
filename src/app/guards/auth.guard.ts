import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { tap } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usersService: UsersService,
              private router: Router,
              private toastService: ToastService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usersService.validateToken()
              .pipe(
                tap( resp => {
                  // Si devuelve falso, el token no es bueno, salimos a login
                  if (!resp) {
                    this.router.navigateByUrl('/login');
                  } else {
                    // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
                    if ((next.data['role'] !== '*') && (this.usersService['role'] !== next.data['role'])) {
                      switch (this.usersService.role) {
                        case 'ADMIN':
                          this.toastService.presentToast('El usuario es un administrador', 'danger')
                          this.router.navigateByUrl('/login');
                          break;
                        case 'USER':
                          this.router.navigateByUrl('/user/home');
                          break;
                      }
                    }
                  }
                })
              );
  }

}
