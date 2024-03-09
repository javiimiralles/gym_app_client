import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Exercise } from 'src/app/models/exercise.model';
import { Routine } from 'src/app/models/routine.model';
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
  activeRoutine: Routine;
  exercises: Exercise[] = [];
  sets: number[] = [];
  totalSets: number = 0;
  loading: boolean = true;

  constructor(
    private exceptionsService: ExceptionsService,
    private routinesService: RoutinesService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadNextSession();
  }

  loadNextSession() {
    this.routinesService.getNextSession().subscribe({
      next: (res) => {
        if(res['nextSession']) {
          this.nextSession = res['nextSession'];
          this.activeRoutine = res['routine'];
          this.exercises = [];
          for(let itemExercise of this.nextSession.exercises) {
            this.exercises.push(itemExercise.exercise as Exercise);
            this.sets.push(itemExercise.sets);
            this.totalSets += itemExercise.sets;
          }
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        this.exceptionsService.throwError(err);
      }
    })
  }

  skipSession() {
    this.routinesService.skipSession(this.activeRoutine.uid).subscribe({
      next: () => {
        this.loadNextSession();
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  async presentSkipSessionAlert() {
    const alert = await this.alertController.create({
      header: '¿Quieres saltarte esta sesión?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Saltar',
          role: 'confirm',
          handler: () => {
            this.skipSession();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    });

    await alert.present();
  }

  startWorkout() {
    this.router.navigate(['/user/workout-in-progress/new'], { queryParams: { sessionId: this.nextSession.uid } });
  }

}
