import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { ExerciseSessionInterface } from 'src/app/interfaces/exercises.interface';
import { SessionsService } from 'src/app/services/sessions.service';
import { ExercisesListModalComponent } from '../exercises-list-modal/exercises-list-modal.component';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { Session } from 'src/app/models/session.model';
import { Exercise } from 'src/app/models/exercise.model';
import { RoutinesService } from 'src/app/services/routines.service';
import { ToastService } from 'src/app/services/toast.service';
import Sortable from 'sortablejs';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit, AfterViewInit {

  name: string;
  exercises: ExerciseSessionInterface[] = [];
  removedExercises: string[] = [];
  session: Session;
  sessionId: string;
  routineId: string;
  mode: string;

  loading: boolean = false;
  saving: boolean = false;

  constructor(
    private sessionsService: SessionsService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private router: Router,
    private exceptionsService: ExceptionsService,
    private routinesService: RoutinesService,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef
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

  ngAfterViewInit(): void {
    const container = document.querySelector('.cards-container');
    Sortable.create(container, {
      animation: 200,
      delay: 200,
      delayOnTouchOnly: true,
      onEnd: (event) => {
        const { oldIndex, newIndex } = event;

        // 1. Extrae el elemento movido
        const [movedElement] = this.exercises.splice(oldIndex, 1);
        // 2. Inserta el elemento movido en su nueva posición
        this.exercises.splice(newIndex, 0, movedElement);
        if(this.sessionId === 'new') {
          this.sessionsService.currentSessionPreview.exercises = this.exercises;
        }
        this.changeDetectorRef.markForCheck();
      },
      onStart: () => {
        window.navigator.vibrate(50); // Vibra por 50 milisegundos
      }
    });
  }

  loadSession() {
    this.loading = true;
    this.sessionsService.getSessionById(this.sessionId).subscribe({
      next: (res) => {
        this.session = res['session'];
        this.name = this.session.name;
        this.exercises = this.session.exercises;
        this.loading = false;
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
        this.loading = false;
      }
    })
  }

  saveSession() {
    this.saving = true;
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
            this.saving = false;
            this.toastService.presentToast('Sesión creada', 'success');
            this.goToRoutine();
          },
          error: (err) => {
            this.exceptionsService.throwError(err);
            this.saving = false;
          }
        })
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
        this.saving = false;
      }
    })
  }

  updateSession() {
    this.deleteExercises();
    this.session.name = this.name;
    this.session.exercises = this.parseExercises();

    this.sessionsService.updateSession(this.session).subscribe({
      next: () => {
        this.saving = false;
        this.toastService.presentToast('Sesión editada', 'success');
        this.goToRoutine();
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
        this.saving = false;
      }
    })
  }

  removeExercisePreview(index: number, exercise: any) {
    if(this.sessionId === 'new') {
      this.sessionsService.currentSessionPreview.exercises.splice(index, 1);
      this.exercises.splice(index, 1);
    } else {
      this.removedExercises.push(exercise._id);
      this.exercises = (this.exercises as any[]).filter(elem => elem.exercise._id !== exercise._id);
    }
  }

  deleteExercises() {
    for(let exerciseId of this.removedExercises) {
      this.sessionsService.updateSessionExercises(this.sessionId, exerciseId, 'remove').subscribe({
        error: (err) => {
          this.exceptionsService.throwError(err);
        }
      })
    }
  }

  handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    this.exercises = event.detail.complete(this.exercises);
  }

  parseExercises() {
    const newExercisesArray: ExerciseSessionInterface[] = [];
    for(let exerciseInterface of this.exercises) {
      const aux: any = exerciseInterface.exercise; // para la edicion tiene campo _id en vez de uid
      newExercisesArray.push({
        exercise: (exerciseInterface.exercise as Exercise).uid || aux._id,
        sets: exerciseInterface.sets,
        repetitions: exerciseInterface.repetitions,
        dropset: exerciseInterface.dropset
      })
    }
    return newExercisesArray;
  }

  async openExerxisesListModal() {
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
      console.log(this.exercises);
      this.changeDetectorRef.markForCheck();
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

  toggleDropset(index: number) {
    this.exercises[index].dropset = !this.exercises[index].dropset;
  }

}
