import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Routine } from 'src/app/models/routine.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { RoutinesService } from 'src/app/services/routines.service';

@Component({
  selector: 'app-routines-list',
  templateUrl: './routines-list.component.html',
  styleUrls: ['./routines-list.component.scss'],
})
export class RoutinesListComponent  implements OnInit {

  routines: Routine[] = [];
  searchText: string = '';

  constructor(
    private exceptionsService: ExceptionsService,
    private routinesService: RoutinesService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadRoutines();
  }

  loadRoutines() {
    this.routinesService.getRoutines(this.searchText).subscribe({
      next: (res) => {
        this.routines = res['routines'];
      },
      error: (err) => {
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
          role: 'confirm',
          handler: () => {
            this.changeActiveRoutine(id);
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
