import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Exercise } from 'src/app/models/exercise.model';
import { Session } from 'src/app/models/session.model';
import { Workout } from 'src/app/models/workout.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { SessionsService } from 'src/app/services/sessions.service';
import { AlertController, ModalController } from '@ionic/angular';
import { WorkoutsService } from 'src/app/services/workouts.service';
import { ExerciseWorkoutInterface } from 'src/app/interfaces/exercise-workout.interface';
import { ToastService } from 'src/app/services/toast.service';
import { WorkoutSummaryModalComponent } from './workout-summary-modal/workout-summary-modal.component';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
})
export class WorkoutComponent  implements OnInit {

  session: Session = new Session('');
  exercises: any[] = [];
  sets: number[] = [];
  totalSets: number = 0;
  expectedRepetitions: string[] = [];
  exerciseNames: string[] = [];
  difficulties: string[] = [];
  workoutId: string;
  workout: Workout;

  formVisibility: boolean[] = [];
  workoutForm: FormGroup;

  constructor(
    private exceptionsService: ExceptionsService,
    private activatedRoute: ActivatedRoute,
    private sessionsService: SessionsService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.workoutId = this.activatedRoute.snapshot.params['id'];
    if(this.workoutId === 'new') {
      this.activatedRoute.queryParams.subscribe(params => {
        this.loadSession(params['sessionId']);
      });
    }
  }

  loadSession(id: string) {
    this.sessionsService.getSessionById(id).subscribe({
      next: (res) => {
        this.session = res['session'];
        for(let itemExercise of this.session.exercises) {
          this.exercises.push(itemExercise.exercise as Exercise);
          this.sets.push(itemExercise.sets);
          this.totalSets += itemExercise.sets;
          this.populateForm(itemExercise);
          this.expectedRepetitions.push(itemExercise.repetitions);
          this.exerciseNames.push((itemExercise.exercise as Exercise).name);
          this.difficulties.push((itemExercise.exercise as Exercise).difficulty);
        }
        this.formVisibility = this.exercises.map(() => false);
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  async openWorkoutSummaryModal() {
    const exercisesInterface: ExerciseWorkoutInterface[] = [];
    for(let i = 0; i < this.exercises.length; i++) {
      exercisesInterface.push({
        exercise: this.exercises[i]._id,
        sets: this.workoutForm.value['exercises'][i]['sets']
      });
    }
    this.workout = new Workout('', null, null, this.session.uid, exercisesInterface, '');

    const modal = await this.modalController.create({
      component: WorkoutSummaryModalComponent,
      componentProps: {
        workout: this.workout,
        expectedRepetitions: this.expectedRepetitions,
        difficulties: this.difficulties,
        names: this.exerciseNames
      }
    });

    modal.present();
  }

  async cancelWorkout() {
    const alert = await this.alertController.create({
      header: '¿Quieres cancelar el entrenamiento?',
      subHeader: 'No se guardará tu progreso',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Continuar sesión',
          role: 'confirm',
        },
        {
          text: 'Descartar sesión',
          role: 'cancel',
          handler: () => {
            this.router.navigateByUrl('/user/home');
          }
        }
      ]
    });

    await alert.present();
  }

  toggleForm(event: Event, index: number): void {
    event.stopPropagation();
    this.formVisibility[index] = !this.formVisibility[index];
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

  // Logica de los formularios
  initForm() {
    this.workoutForm = this.formBuilder.group({
      exercises: this.formBuilder.array([])
    });
  }

  populateForm(exercise: any) {
    const exerciseFormGroup = this.formBuilder.group({
      sets: this.formBuilder.array(this.initSets(exercise.sets))
    });

    (this.workoutForm.get('exercises') as FormArray).push(exerciseFormGroup);
  }

  initSets(setsCount: number): FormGroup[] {
    return Array.from({ length: setsCount }, () => this.formBuilder.group({
      repetitions: ['', Validators.required],
      weight: ['', Validators.required]
    }));
  }

  get exercisesFormArray(): FormArray {
    return this.workoutForm.get('exercises') as FormArray;
  }

  onSubmit() {
    if(!this.workoutForm.valid) return;

    if(this.workoutId === 'new') {
      this.openWorkoutSummaryModal();
    }
  }

}