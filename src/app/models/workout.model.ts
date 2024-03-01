import { Exercise } from "./exercise.model";
import { Session } from "./session.model";

export class Workout {
  constructor(
    public uid: string,
    public date?: Date,
    public session?: string | Session,
    public exsercises?: [{
      exercise: string | Exercise,
      sets: [{
        repetitions: number,
        weight: number
      }]
    }],
    public note?: string,
    public user?: string
  ) {}
}
