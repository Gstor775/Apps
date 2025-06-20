import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types';

const WORKOUTS_KEY = 'workout_history';

export const saveWorkout = async (workout: any) => {
  const history = await getWorkouts();
  history.push(workout);
  await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(history));
};

export const getWorkouts = async () => {
  const data = await AsyncStorage.getItem(WORKOUTS_KEY);
  return data ? JSON.parse(data) : [];
};

class WorkoutService {
    private workouts: Workout[] = [];

    addWorkout(workout: Workout): void {
        this.workouts.push(workout);
    }

    getWorkouts(): Workout[] {
        return this.workouts;
    }

    getWorkoutByDate(date: string): Workout | undefined {
        return this.workouts.find(workout => {
            const workoutDateStr = workout.date instanceof Date
                ? workout.date.toISOString().split('T')[0]
                : workout.date;
            return workoutDateStr === date;
        });
    }

    calculateAveragePace(): number {
        const totalPace = this.workouts.reduce((total, workout) => total + workout.avgPace, 0);
        return totalPace / this.workouts.length || 0;
    }

    calculateTotalCaloriesBurned(): number {
        return this.workouts.reduce((total, workout) => total + workout.caloriesBurned, 0);
    }

    getWorkoutHistory(): Array<{ date: string; distance: number; elapsedTime: string; avgPace: number; caloriesBurned: number }> {
        return this.workouts.map(workout => ({
            date: workout.date instanceof Date
                ? workout.date.toISOString().split('T')[0]
                : workout.date,
            distance: workout.distance,
            elapsedTime: typeof workout.elapsedTime === 'string'
                ? workout.elapsedTime
                : `${workout.elapsedTime.hours.toString().padStart(2, '0')}:${workout.elapsedTime.minutes.toString().padStart(2, '0')}:${workout.elapsedTime.seconds.toString().padStart(2, '0')}`,
            avgPace: workout.avgPace,
            caloriesBurned: typeof workout.caloriesBurned === 'number'
                ? workout.caloriesBurned
                : Number(workout.caloriesBurned),
        }));
    }
}

export default new WorkoutService();