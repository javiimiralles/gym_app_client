import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Workout } from 'src/app/models/workout.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { WorkoutsService } from 'src/app/services/workouts.service';
import { WorkoutSummaryModalComponent } from '../workout/workout-summary-modal/workout-summary-modal.component';

@Component({
  selector: 'app-workouts-list',
  templateUrl: './workouts-list.component.html',
  styleUrls: ['./workouts-list.component.scss'],
})
export class WorkoutsListComponent  implements OnInit {

  workouts: Workout[] = [];
  currentWeekStart: Date;
  currentWeekEnd: Date;
  startDate: string;
  endDate: string;

  constructor(
    private exceptionsService: ExceptionsService,
    private workoutsService: WorkoutsService,
    private alertController: AlertController,
    private toastService: ToastService,
    private modalController: ModalController
  ) {
    this.initDates();
  }

  ngOnInit() {
    this.loadWorkouts();
  }

  loadWorkouts() {
    this.workoutsService.getWorkouts(this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.workouts = res['workouts'];
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  deleteWorkout(id: string) {
    this.workoutsService.deleteWorkout(id).subscribe({
      next: () => {
        this.toastService.presentToast('Entrenamiento eliminado', 'success');
        this.loadWorkouts();
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  async openWorkoutSummaryModal(id: string) {
    const modal = await this.modalController.create({
      component: WorkoutSummaryModalComponent,
      componentProps: {
        workoutId: id
      }
    });
    modal.present();
  }

  async presentDeleteWorkoutAlert(event: Event, id: string) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: '¿Quieres borrar el entrenamiento?',
      subHeader: 'No podrás recuperarlo',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Eliminar',
          role: 'cancel',
          handler: () => {
            this.deleteWorkout(id);
          }
        },
        {
          text: 'Cancelar',
          role: 'confirm',
        }
      ]
    });

    await alert.present();
  }

  // Logica de las fechas
  initDates() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const currentDay = today.getDate();
    const difference = dayOfWeek - (dayOfWeek === 0 ? -6 : 1);

    const startOfWeek = new Date(today.setDate(currentDay - difference));
    startOfWeek.setHours(0, 0, 0, 0);
    this.currentWeekStart = startOfWeek;

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 99);
    this.currentWeekEnd = endOfWeek;

    this.startDate = this.formatDate(startOfWeek);
    this.endDate = this.formatDate(endOfWeek);
  }

  // Formatear fechas como 'YYYY-MM-DD'
  formatDate(date: Date) {
    return date.toISOString().substring(0, 10);
  }

  reorderDate(date: string) {
    date = date.substring(0, 10);
    const dateArray = date.split('-');
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
  }

  describeDate(date: Date) {
    date = new Date(date);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  changeWeek(x: 1 | -1) {
    const currentWeekStart = new Date(this.startDate);
    const currentWeekEnd = new Date(this.endDate);
    this.startDate = this.formatDate(new Date(currentWeekStart.getTime() + 7*x * 24 * 60 * 60 *1000));
    this.endDate = this.formatDate(new Date(currentWeekEnd.getTime() + 7*x * 24 * 60 * 60 *1000));
    this.loadWorkouts();
  }

}
