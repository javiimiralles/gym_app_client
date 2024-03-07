import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ExerciseSessionInterface } from 'src/app/interfaces/exercises.interface';
import { Exercise } from 'src/app/models/exercise.model';
import { Routine } from 'src/app/models/routine.model';
import { Session } from 'src/app/models/session.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { RoutinesService } from 'src/app/services/routines.service';
import { SessionsService } from 'src/app/services/sessions.service';
import { ToastService } from 'src/app/services/toast.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
})
export class RoutineComponent implements OnInit, OnDestroy {

  name: string;
  description: string;
  sessions: Session[] = [];

  routineId: string;
  routine: Routine = new Routine('');

  mode: string;

  constructor(
    private exceptionsService: ExceptionsService,
    private sessionsService: SessionsService,
    private router: Router,
    private routinesService: RoutinesService,
    private toastService: ToastService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        this.routineId = params['id'];
        this.mode = params['mode'];
        this.loadRoutine();
      }
    })

    // para mostrar el aviso de que perdera su progreso si pulsa en el boton
    // de volver atras del propio movil
    App.addListener('backButton', this.preventGoBack.bind(this));
  }

  ngOnDestroy(): void {
    App.removeAllListeners();
  }

  loadRoutine() {
    this.routinesService.getRoutineById(this.routineId).subscribe({
      next: (res) => {
        this.routine = res['routine'];
        this.name = this.routine.name;
        this.description = this.routine.description;
        this.sessions = this.routine.sessions as Session[];
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
        this.router.navigateByUrl('/user/routines-list');
      }
    })
  }

  deleteRoutine() {
    this.routinesService.deleteRoutine(this.routineId).subscribe({
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  // para volver atras hay que confirmar que se perderán los cambios
  async preventGoBack() {
    const alert = await this.alertController.create({
      header: '¿Seguro que quieres salir?',
      subHeader: 'No se guardarán los cambios realizados',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Continuar',
          role: 'confirm',
        },
        {
          text: 'Descartar cambios',
          role: 'cancel',
          handler: () => {
            if(this.mode === 'creating') {
              this.deleteRoutine();
            }
            this.router.navigateByUrl('/user/routines-list');
          }
        }
      ]
    });

    await alert.present();
  }


  updateRoutine() {
    this.routine.name = this.name;
    this.routine.description = this.description;
    this.routinesService.updateRoutine(this.routine).subscribe({
      next: () => {
        this.toastService.presentToast('Rutina guardada', 'success');
        this.router.navigateByUrl('/user/routines-list');
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    });
  }

  goToSession(session: any) {
    const id = session === 'new' ? 'new' : session._id;
    this.router.navigate(['/user/session'], { queryParams: { id, routineId: this.routine.uid, mode: this.mode }});
  }


}
