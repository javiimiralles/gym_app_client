import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Workout } from 'src/app/models/workout.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { WorkoutsService } from 'src/app/services/workouts.service';
import { getDifficultyColor } from 'src/app/utils/difficulty-color.utils';

@Component({
  selector: 'app-workout-summary-modal',
  templateUrl: './workout-summary-modal.component.html',
  styleUrls: ['./workout-summary-modal.component.scss'],
})
export class WorkoutSummaryModalComponent  implements OnInit {

  @Input() workout: Workout;
  @Input() expectedRepetitions: string[];
  @Input() difficulties: string[];
  @Input() names: string[];

  note: string;

  constructor(
    private workoutsService: WorkoutsService,
    private toastService: ToastService,
    private router: Router,
    private exceptionsService: ExceptionsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  closeModal() {
    return this.modalController.dismiss();
  }

  createWorkout() {
    this.workout.note = this.note;
    this.workoutsService.createWorkout(this.workout).subscribe({
      next: (res) => {
        this.modalController.dismiss();
        this.toastService.presentToast('Sesión guardada', 'success');
        this.router.navigateByUrl('/user/home');
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  getDifficultyColor(difficulty: string) {
    getDifficultyColor(difficulty);
  }

}
