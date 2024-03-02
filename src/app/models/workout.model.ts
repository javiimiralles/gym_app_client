import { ExerciseWorkoutInterface } from "../interfaces/exercise-workout.interface";
import { Exercise } from "./exercise.model";
import { Session } from "./session.model";

export class Workout {
  constructor(
    public uid: string,
    public date?: string | Date,
    public routine?: string,
    public session?: string | Session,
    public exercises?: ExerciseWorkoutInterface[],
    public note?: string,
    public user?: string
  ) {}
}
