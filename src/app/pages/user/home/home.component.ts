import { Component, OnInit } from '@angular/core';
import { Exercise } from 'src/app/models/exercise.model';
import { Session } from 'src/app/models/session.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { RoutinesService } from 'src/app/services/routines.service';

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
    private routinesService: RoutinesService
  ) { }

  ngOnInit() {
    this.routinesService.getNextSession().subscribe({
      next: (res) => {
        this.nextSession = res['nextSession'];
        for(let itemExercise of this.nextSession.exercises) {
          this.exercises.push(itemExercise.exercise as Exercise);
          this.sets.push(itemExercise.sets);
          this.totalSets += itemExercise.sets;
        }
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  getDifficultyColor(difficulty: string) {
    switch(difficulty) {
      case 'BAJA':
        return 'success';
      case 'MEDIA':
        return 'warning';
      default:
        return 'danger';
    }
  }
}
