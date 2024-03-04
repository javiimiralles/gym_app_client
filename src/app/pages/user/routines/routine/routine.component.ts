import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'src/app/models/session.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { SessionsService } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
})
export class RoutineComponent  implements OnInit {

  name: string;
  description: string;
  sessions: Session[] = this.sessionsService.sessionsPrewiew;

  constructor(
    private exceptionsService: ExceptionsService,
    private sessionsService: SessionsService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.sessions);
  }

  goToSession(index: number) {
    if(index === this.sessions.length) {
      this.sessionsService.sessionsPrewiew.push(new Session('', null, null, null, []));
    }
    this.router.navigateByUrl(`/user/session/${index}`);
  }

  saveRoutine() {

  }

}
