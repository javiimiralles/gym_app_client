import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Exercise } from 'src/app/models/exercise.model';
import { Session } from 'src/app/models/session.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { RoutinesService } from 'src/app/services/routines.service';
import { getDifficultyColor } from 'src/app/utils/difficulty-color.utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  nextSession: Session;
  exercises: Exercise[] = [];
  sets: number[] = [];
  totalSets: number = 0;

  constructor(
    private exceptionsService: ExceptionsService,
    private routinesService: RoutinesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routinesService.getNextSession().subscribe({
      next: (res) => {
        if(res['nextSession']) {
          this.nextSession = res['nextSession'];
          for(let itemExercise of this.nextSession.exercises) {
            this.exercises.push(itemExercise.exercise as Exercise);
            this.sets.push(itemExercise.sets);
            this.totalSets += itemExercise.sets;
          }
        }
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  startWorkout() {
    this.router.navigate(['/user/workout-in-progress/new'], { queryParams: { sessionId: this.nextSession.uid } });
  }

  getDifficultyColor(difficulty: string) {
    getDifficultyColor(difficulty);
  }

}
