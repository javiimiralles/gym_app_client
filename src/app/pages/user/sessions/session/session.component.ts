import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ExerciseSessionInterface } from 'src/app/interfaces/exercises.interface';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { RoutinesService } from 'src/app/services/routines.service';
import { SessionsService } from 'src/app/services/sessions.service';
import { getDifficultyColor } from 'src/app/utils/difficulty-color.utils';
import { ExercisesListModalComponent } from '../exercises-list-modal/exercises-list-modal.component';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent  implements OnInit {

  name: string;
  exercises: ExerciseSessionInterface[] = [];
  sessionIndex: number;
  creatingRoutine: boolean = this.routinesService.creatingRoutine;

  constructor(
    private sessionsService: SessionsService,
    private activatedRoute: ActivatedRoute,
    private routinesService: RoutinesService,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.sessionIndex = Number(this.activatedRoute.snapshot.params['index']);
    this.initExercises();
  }

  getDifficultyColor(difficulty: string) {
    getDifficultyColor(difficulty);
  }

  goToRoutine() {
    this.sessionsService.sessionsPrewiew[this.sessionIndex].name = this.name;
    this.router.navigateByUrl('/user/routine');
  }

  async openExerxisesListModal() {
    const modal = await this.modalController.create({
      component: ExercisesListModalComponent,
      componentProps: {
        sessionIndex: this.sessionIndex
      }
    });
    modal.present();

    // esperamos a que se cierre el modal para actualizar la lista de ejercicios
    await modal.onWillDismiss();
    this.initExercises();
  }

  getRepsInputValue(repsString: string, isMinInput: boolean) {
    const repsArray = repsString.split('-');
    if(isMinInput) {
      return Number(repsArray[0]);
    } else {
      return repsArray[1] ? Number(repsArray[1]) : Number(repsArray[0]);
    }
  }

  onSetsInputChange(event: any, index: number) {
    const sets = event.target.value;
    this.sessionsService.sessionsPrewiew[this.sessionIndex].exercises[index].sets = sets;
  }

  onRepetitionsInputChange(event: any, index: number, isMinInput: boolean) {
    const currentReps = this.sessionsService.sessionsPrewiew[this.sessionIndex].exercises[index].repetitions;
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
    if(minReps > maxReps) {
      this.sessionsService.sessionsPrewiew[this.sessionIndex].exercises[index].repetitions = `${minReps}-${minReps}`;
    } else if(maxReps < minReps) {
      this.sessionsService.sessionsPrewiew[this.sessionIndex].exercises[index].repetitions = `${maxReps}-${maxReps}`;
    } else {
      this.sessionsService.sessionsPrewiew[this.sessionIndex].exercises[index].repetitions = `${minReps}-${maxReps}`;
    }
  }

  initExercises() {
    if(this.sessionsService.sessionsPrewiew[this.sessionIndex].exercises) {
      this.exercises = this.sessionsService.sessionsPrewiew[this.sessionIndex].exercises;
    } else {
      this.sessionsService.sessionsPrewiew[this.sessionIndex].exercises = [];
      this.exercises = [];
    }
  }

}
