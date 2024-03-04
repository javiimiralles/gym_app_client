import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Routine } from 'src/app/models/routine.model';
import { Session } from 'src/app/models/session.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { RoutinesService } from 'src/app/services/routines.service';
import { SessionsService } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-routines-list',
  templateUrl: './routines-list.component.html',
  styleUrls: ['./routines-list.component.scss'],
})
export class RoutinesListComponent  implements OnInit {

  routines: Routine[] = [];
  searchText: string = '';

  constructor(
    private exceptionsService: ExceptionsService,
    private routinesService: RoutinesService,
    private router: Router,
    private sessionsService: SessionsService
  ) { }

  ngOnInit() {
    this.loadRoutines();
  }

  loadRoutines() {
    this.routinesService.getRoutines(this.searchText).subscribe({
      next: (res) => {
        this.routines = res['routines'];
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  goToRoutineView(createMode: boolean, sessionIndex: number, routineIndex: number) {
    this.routinesService.creatingRoutine = createMode;
    if(createMode) {
      this.sessionsService.sessionsPrewiew = [];
      this.sessionsService.sessionsPrewiew.push(new Session(''));
      this.router.navigateByUrl(`/user/session/${sessionIndex}`);
    } else {
      this.sessionsService.sessionsPrewiew = (this.routines[routineIndex].sessions as any[]).map(s => {
        return { uid: s._id, ...s }
      });
      this.router.navigateByUrl(`/user/routine/${this.routines[routineIndex].uid}`);
    }
  }

}
