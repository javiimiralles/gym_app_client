import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ExerciseSessionInterface } from 'src/app/interfaces/exercises.interface';
import { SessionsService } from 'src/app/services/sessions.service';
import { ExercisesListModalComponent } from '../exercises-list-modal/exercises-list-modal.component';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { Session } from 'src/app/models/session.model';
import { Exercise } from 'src/app/models/exercise.model';
import { RoutinesService } from 'src/app/services/routines.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent  implements OnInit {

  name: string;
  exercises: ExerciseSessionInterface[] = [];
  session: Session;
  sessionId: string;
  routineId: string;
  mode: string;

  constructor(
    private sessionsService: SessionsService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private router: Router,
    private exceptionsService: ExceptionsService,
    private routinesService: RoutinesService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        this.sessionId = params['id'];
        this.routineId = params['routineId'];
        this.mode = params['mode'];
        if(this.sessionId !== 'new') {
          this.loadSession();
        }
      }
    })
  }

  loadSession() {
    this.sessionsService.getSessionById(this.sessionId).subscribe({
      next: (res) => {
        this.session = res['session'];
        this.name = this.session.name;
        this.exercises = this.session.exercises;
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  saveSession() {
    if(this.sessionId === 'new') {
      this.createSession();
    } else {
      this.updateSession();
    }
  }

  createSession() {
    this.session = new Session('', this.name, null, null, null);
    this.session.exercises = this.parseExercises();

    this.sessionsService.createSession(this.session).subscribe({
      next: (res) => {
        this.routinesService.updateRoutineSessions(this.routineId, res['session'].uid, 'add').subscribe({
          next: () => {
            this.toastService.presentToast('Sesión creada', 'success');
            this.goToRoutine();
          },
          error: (err) => {
            this.exceptionsService.throwError(err);
          }
        })
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  updateSession() {
    this.session.name = this.name;
    this.session.exercises = this.parseExercises();

    this.sessionsService.updateSession(this.session).subscribe({
      next: () => {
        this.toastService.presentToast('Sesión editada', 'success');
        this.goToRoutine();
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  parseExercises() {
    const newExercisesArray: ExerciseSessionInterface[] = [];
    for(let exerciseInterface of this.exercises) {
      const aux: any = exerciseInterface.exercise; // para la edicion tiene campo _id en vez de uid
      newExercisesArray.push({
        exercise: (exerciseInterface.exercise as Exercise).uid || aux._id,
        sets: exerciseInterface.sets,
        repetitions: exerciseInterface.repetitions
      })
    }
    return newExercisesArray;
  }

  async openExerxisesListModal() {
    if(this.sessionId === 'new') {
      this.sessionsService.currentSessionPreview = new Session('', null, null, null, []);
    }
    const modal = await this.modalController.create({
      component: ExercisesListModalComponent,
      componentProps: {
        sessionId: this.sessionId
      }
    });
    modal.present();

    // esperamos a que se cierre el modal para actualizar la lista de ejercicios
    const { data } =  await modal.onWillDismiss();
    if(data == true) {
      this.loadSession();
    } else if(data == false) {
      this.exercises = this.sessionsService.currentSessionPreview.exercises;
    }
  }

  getRepsInputValue(repsString: string, isMinInput: boolean) {
    const repsArray = repsString.split('-');
    if(isMinInput) {
      return Number(repsArray[0]);
    } else {
      return repsArray[1] ? Number(repsArray[1]) : Number(repsArray[0]);
    }
  }

  goToRoutine() {
    this.router.navigate(['/user/routine'], { queryParams: { id: this.routineId, mode: this.mode } });
  }

  onSetsInputChange(event: any, index: number) {
    const sets = event.target.value;
    this.exercises[index].sets = sets;
  }

  onRepetitionsInputChange(event: any, index: number, isMinInput: boolean) {
    const currentReps = this.exercises[index].repetitions;
    const repsArray = currentReps.split('-');
    let minReps: number;
    let maxReps: number;
    if(isMinInput) {
      minReps = event.target.value;
      maxReps = repsArray[1] ? Number(repsArray[1]) : Number(repsArray[0]); // si solo hay un valor es que las reps esperadas eran exactas
    } else {
      minReps = Number(repsArray[0]);
      maxReps = event.target.value;
    }
    this.exercises[index].repetitions = `${minReps}-${maxReps}`;
  }

}
