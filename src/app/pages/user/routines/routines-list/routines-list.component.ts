import { Component, OnInit } from '@angular/core';
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
    private routinesService: RoutinesService
  ) { }

  ngOnInit() {
    this.loadRoutines();
  }

  loadRoutines() {
    this.routinesService.getRoutines(this.searchText).subscribe({
      next: (res) => {
        this.routines = res['routines'];
        console.log(this.routines);
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

}
