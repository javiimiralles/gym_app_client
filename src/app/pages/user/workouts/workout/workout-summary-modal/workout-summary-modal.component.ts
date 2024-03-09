import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Exercise } from 'src/app/models/exercise.model';
import { Session } from 'src/app/models/session.model';
import { Workout } from 'src/app/models/workout.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { WorkoutsService } from 'src/app/services/workouts.service';
@Component({
  selector: 'app-workout-summary-modal',
  templateUrl: './workout-summary-modal.component.html',
  styleUrls: ['./workout-summary-modal.component.scss'],
})
export class WorkoutSummaryModalComponent  implements OnInit {

  @Input() workoutId: string;
  @Input() workout: Workout = new Workout('');
  @Input() expectedRepetitions: string[] = [];
  @Input() difficulties: string[] = [];
  @Input() names: string[] = [];

  note: string;

  constructor(
    private workoutsService: WorkoutsService,
    private toastService: ToastService,
    private router: Router,
    private exceptionsService: ExceptionsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if(this.workoutId) {
      this.loadWorkout();
    }
  }

  loadWorkout() {
    this.workoutsService.getWorkoutById(this.workoutId).subscribe({
      next: (res) => {
        this.workout = res['workout'];
        this.note = this.workout.note;
        const session: Session = this.workout.session as Session;
        const sessionExercises = session.exercises;
        for(let i = 0; i < sessionExercises.length; i++) {
          this.expectedRepetitions.push(sessionExercises[i].repetitions);
          this.names.push((this.workout.exercises[i].exercise as Exercise).name);
          this.difficulties.push((sessionExercises[i].exercise as Exercise).difficulty);
        }
      },
      error: (err) => {
        this.modalController.dismiss();
      }
    })
  }

  createWorkout() {
    this.workout.note = this.note;
    this.workoutsService.createWorkout(this.workout).subscribe({
      next: () => {
        this.modalController.dismiss();
        this.toastService.presentToast('Sesión guardada', 'success');
        this.router.navigateByUrl('/user/home');
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }



  closeModal() {
    return this.modalController.dismiss();
  }
}
