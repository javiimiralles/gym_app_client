import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Routine } from 'src/app/models/routine.model';
import { Session } from 'src/app/models/session.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { RoutinesService } from 'src/app/services/routines.service';
import { ToastService } from 'src/app/services/toast.service';
import { App } from '@capacitor/app';
import Sortable from 'sortablejs';
import { SessionsService } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
})
export class RoutineComponent implements OnInit, OnDestroy, AfterViewInit {

  name: string;
  description: string;
  sessions: Session[] = [];
  sessionIds: string[] = [];
  removedSessions: string[] = [];

  routineId: string;
  routine: Routine = new Routine('');

  mode: string;

  loading: boolean = false;

  constructor(
    private exceptionsService: ExceptionsService,
    private router: Router,
    private routinesService: RoutinesService,
    private toastService: ToastService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private sessionsService: SessionsService
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

  ngAfterViewInit(): void {
    const container = document.querySelector('.cards-container');
    Sortable.create(container, {
      animation: 200,
      onEnd: (event) => {
        const { oldIndex, newIndex } = event;

        // 1. Extrae el elemento movido
        const [movedElement] = this.sessions.splice(oldIndex, 1);
        const [movedElementId] = this.sessionIds.splice(oldIndex, 1);
        // 2. Inserta el elemento movido en su nueva posición
        this.sessions.splice(newIndex, 0, movedElement);
        this.sessionIds.splice(newIndex, 0, movedElementId);

        this.changeDetectorRef.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    App.removeAllListeners();
  }

  loadRoutine() {
    this.loading = true;
    this.routinesService.getRoutineById(this.routineId).subscribe({
      next: (res) => {
        this.routine = res['routine'];
        this.name = this.routine.name;
        this.description = this.routine.description;
        this.sessions = this.routine.sessions as Session[];
        this.sessionIds = (this.sessions as any[]).map(session => session._id);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
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
    });
  }

  deleteSessions() {
    for(let sessionId of this.removedSessions) {
      this.routinesService.updateRoutineSessions(this.routineId, sessionId, 'remove').subscribe({
        error: (err) => {
          this.exceptionsService.throwError(err);
        }
      })
    }
  }

  async presentDeleteSessionAlert(event: Event, session: any) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: '¿Quieres borrar la sesión?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.sessionIds = this.sessionIds.filter(elem => elem !== session._id);
            this.removedSessions.push(session._id);
            this.sessions = this.sessions.filter(elem => elem !== session);
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

  // para volver atras hay que confirmar que se perderán los cambios
  async preventGoBack() {
    const alert = await this.alertController.create({
      header: '¿Seguro que quieres salir?',
      subHeader: 'No se guardarán los cambios realizados',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Continuar',
          role: 'cancel',
        },
        {
          text: 'Descartar cambios',
          role: 'confirm',
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
    this.deleteSessions(); // elimina definitivamente las sesiones que se hayan eliminado
    this.routine.name = this.name;
    this.routine.description = this.description;
    this.routine.sessions = this.sessionIds;
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
    if(id === 'new') {
      this.sessionsService.currentSessionPreview = new Session('', null, null, null, []);
    }
    this.router.navigate(['/user/session'], { queryParams: { id, routineId: this.routine.uid, mode: this.mode }});
  }


}
