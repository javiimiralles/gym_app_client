import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExerciseSessionInterface } from 'src/app/interfaces/exercises.interface';
import { Exercise } from 'src/app/models/exercise.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ExercisesService } from 'src/app/services/exercises.service';
import { SessionsService } from 'src/app/services/sessions.service';

@Component({
  selector: 'app-exercises-list-modal',
  templateUrl: './exercises-list-modal.component.html',
  styleUrls: ['./exercises-list-modal.component.scss'],
})
export class ExercisesListModalComponent  implements OnInit {

  @Input() sessionId: string;
  @Input() sessionIndex: number;

  noResultsFound: boolean = false;
  searchResults: Exercise[] = [];
  searchText: string ;
  difficulty: string;
  muscle: string;

  constructor(
    private exceptionsService: ExceptionsService,
    private modalController: ModalController,
    private exercisesService: ExercisesService,
    private sessionsService: SessionsService
  ) { }

  ngOnInit() {}

  loadExercises() {
    this.exercisesService.getExercises(this.searchText, this.difficulty, this.muscle).subscribe({
      next: (res) => {
        this.searchResults = res['exercises'];
        this.noResultsFound = this.searchResults.length === 0;
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  addExerciseToSession(exercise: Exercise) {
    if(this.sessionId === 'new') {
      this.sessionsService.currentSessionPreview.exercises.push({
        exercise: exercise,
        sets: 3,
        repetitions: '10-12'
      });
      this.modalController.dismiss(false);
    } else {
      this.sessionsService.updateSessionExercises(this.sessionId, exercise.uid, 'add').subscribe({
        next: () => {
          this.modalController.dismiss(true);
        }, error: (err) => {
          this.exceptionsService.throwError(err);
        }
      })
    }
  }

  onSearchbarChange(event) {
    this.searchText = event.detail.value;
    this.loadExercises();
  }

  closeModal() {
    this.modalController.dismiss(null);
  }

}
