import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  waiting: boolean = false;
  email: string;
  password: string;

  constructor(
    private router: Router,
    private exceptionsService: ExceptionsService,
    private usersService: UsersService
  ) { }

  ngOnInit() {}

  submit() {
    if(!this.validate()) return;

    this.waiting = true;
    this.usersService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.waiting = false;
        this.router.navigateByUrl('/user/home');
      },
      error: (err) => {
        this.waiting = false;
        this.exceptionsService.throwError(err);
      }
    })
  }

  validate() {
    let valid = true;

    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');
    emailElement.classList.remove('ion-invalid', 'ion-touched');
    passwordElement.classList.remove('ion-invalid', 'ion-touched');

    if(this.email == null || this.email === '') {
      valid = false;
      emailElement.classList.add('ion-invalid', 'ion-touched');
    }

    if(!this.password || this.password === '') {
      valid = false;
      passwordElement.classList.add('ion-invalid', 'ion-touched');
    }

    return valid;
  }

}
