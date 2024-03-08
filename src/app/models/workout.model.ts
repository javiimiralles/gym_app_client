import { ExerciseWorkoutInterface } from "../interfaces/exercises.interface";
import { Session } from "./session.model";

export class Workout {
  constructor(
    public uid: string,
    public date?: Date,
    public routine?: string,
    public session?: string | Session,
    public exercises?: ExerciseWorkoutInterface[],
    public note?: string,
    public user?: string
  ) {}
}
