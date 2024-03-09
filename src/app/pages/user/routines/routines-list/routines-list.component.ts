import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Routine } from 'src/app/models/routine.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { RoutinesService } from 'src/app/services/routines.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-routines-list',
  templateUrl: './routines-list.component.html',
  styleUrls: ['./routines-list.component.scss'],
})
export class RoutinesListComponent  implements OnInit {

  routines: Routine[] = [];
  searchText: string = '';

  loading: boolean = false;

  constructor(
    private exceptionsService: ExceptionsService,
    private routinesService: RoutinesService,
    private alertController: AlertController,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadRoutines();
  }

  loadRoutines() {
    this.loading = true;
    this.routinesService.getRoutines(this.searchText).subscribe({
      next: (res) => {
        this.routines = res['routines'];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.exceptionsService.throwError(err);
      }
    })
  }

  createRoutine() {
    this.routinesService.createRoutine(new Routine('')).subscribe({
      next: (res) => {
        this.router.navigate(['/user/routine'], { queryParams: { id: res['routine'].uid, mode: 'creating' } });
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  deleteRoutine(id: string) {
    this.routinesService.deleteRoutine(id).subscribe({
      next: () => {
        this.toastService.presentToast('Rutina eliminada', 'success');
        this.loadRoutines();
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  async presentDeleteRoutineAlert(event: Event, id: string) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: '¿Quieres borrar la rutina?',
      subHeader: 'Se perderán todas las sesiones asociadas',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.deleteRoutine(id);
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

  async presentChangeActiveAlert(event: Event, id: string, activating: boolean) {
    event.stopPropagation();
    const subHeader = activating ? 'Si tienes otra rutina activa se desactivará' : 'Se reiniciará el progreso de la rutina';
    const alert = await this.alertController.create({
      header: `¿Quieres ${activating ? 'activar' : 'desactivar'} esta rutina?`,
      subHeader,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: activating ? 'Activar' : 'Desactivar',
          role: activating ? '' : 'confirm',
          handler: () => {
            this.changeActiveRoutine(id);
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

  changeActiveRoutine(id: string) {
    this.routinesService.changeActiveRoutine(id).subscribe({
      next: () => {
        this.loadRoutines();
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  goToRoutine(id: string) {
    this.router.navigate(['/user/routine'], { queryParams: { id, mode: 'editing' } });
  }

}
