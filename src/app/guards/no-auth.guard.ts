import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private usersService: UsersService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usersService.validateNoToken()
              .pipe(
                tap( resp => {
                  if (!resp) {
                    switch (this.usersService.role) {
                      case 'ADMIN':
                        this.router.navigateByUrl('/admin/dashboard-admin');
                        break;
                      case 'USER':
                        this.router.navigateByUrl('/user/home');
                        break;
                    }
                  }
                })
              );
  }
}
