import { Exercise } from "./exercise.model";

export class Session {
  constructor(
    public uid: string,
    public name?: string,
    public muscles?: string[],
    public difficulty?: string,
    public exercises?: [{
      exercise: string | Exercise,
      sets: number,
      repetitions: string
    }]
  ) {}
}
