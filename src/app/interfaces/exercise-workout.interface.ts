import { Exercise } from "../models/exercise.model"

export interface ExerciseWorkoutInterface {
  exercise: string | Exercise,
  sets: [{
    repetitions: number,
    weight: number
  }]
}
