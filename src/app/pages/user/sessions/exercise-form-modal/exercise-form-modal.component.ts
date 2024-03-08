import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Exercise } from 'src/app/models/exercise.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ExercisesService } from 'src/app/services/exercises.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-exercise-form-modal',
  templateUrl: './exercise-form-modal.component.html',
  styleUrls: ['./exercise-form-modal.component.scss'],
})
export class ExerciseFormModalComponent  implements OnInit {

  @Input() sessionId: string;

  muscles: string[] = ['PECHO', 'ABDOMINALES', 'DORSALES',
                      'BICEPS', 'TRICEPS', 'ANTEBRAZOS',
                      'TRAPECIOS', 'GLUTEOS','GEMELOS',
                      'ISQUIOS', 'CUADRICEPS', 'HOMBROS'];
  selectedMuscles: string[] = [];
  muscleError: boolean = false;

  exercise: Exercise = new Exercise('', null, [], 'BAJA');

  constructor(
    private modalController: ModalController,
    private exceptionsService: ExceptionsService,
    private exercisesService: ExercisesService,
    private toastService: ToastService
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss(null);
  }

  setDifficulty(difficulty: string) {
    if(difficulty === 'BAJA') {
      document.getElementById('low').setAttribute('color', 'success');
      document.getElementById('medium').setAttribute('color', 'ligth');
      document.getElementById('high').setAttribute('color', 'ligth');
    } else if(difficulty === 'MEDIA') {
      document.getElementById('low').setAttribute('color', 'ligth');
      document.getElementById('medium').setAttribute('color', 'warning');
      document.getElementById('high').setAttribute('color', 'ligth');
    } else {
      document.getElementById('low').setAttribute('color', 'ligth');
      document.getElementById('medium').setAttribute('color', 'ligth');
      document.getElementById('high').setAttribute('color', 'danger');
    }
    this.exercise.difficulty = difficulty;
  }

  updateSelectedMuscles(muscle: string) {
    const index = this.selectedMuscles.indexOf(muscle);
    if(index == -1) {
      this.muscleError = false;
      this.selectedMuscles.push(muscle);
      document.getElementById(muscle).setAttribute('color', 'success');
    } else {
      this.selectedMuscles.splice(index, 1);
      document.getElementById(muscle).setAttribute('color', 'ligth');
    }
  }

  createExercise() {
    if(!this.validate()) return;

    this.exercise.muscles = this.selectedMuscles;
    this.exercisesService.createExercise(this.exercise).subscribe({
      next: () => {
        this.toastService.presentToast('Ejercicio creado', 'success');
        this.modalController.dismiss();
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })

  }

  validate() {
    let valid: boolean = true;
    if(this.selectedMuscles.length == 0) {
      this.muscleError = true;
      valid = false;
    }

    if(this.exercise.name == null || this.exercise.name === '') {
      document.querySelector('.custom-input').classList.add('ion-touched', 'ion-invalid');
      valid = false;
    } else {
      document.querySelector('.custom-input').classList.remove('ion-touched', 'ion-invalid');
    }

    return valid;
  }

}
