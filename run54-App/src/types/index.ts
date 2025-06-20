export interface Workout {
    id: string;
    route: string;
    distance: number; // in miles or kilometers
    elapsedTime: string | { hours: number; minutes: number; seconds: number };
    pace: number; // pace in minutes per mile or kilometer
    avgPace: number; // average pace in minutes per mile or kilometer
    caloriesBurned: number; // estimated calories burned (renamed for consistency)
    date: string | Date;
}

export interface Interval {
    duration: number; // in seconds
    type: 'run' | 'rest';
    paceGoal?: number; // optional pace goal for the interval
}

export interface WorkoutGoal {
    type: 'distance' | 'time';
    target: number; // target distance in miles/kilometers or time in seconds
    intervals: Interval[];
}

export interface StepData {
    date: Date;
    steps: number;
}

export interface UserSettings {
    stepGoal: number;
    paceControlEnabled: boolean;
    metronomeBPM: number; // beats per minute for metronome
}

export interface HealthData {
    heartRate: number; // current heart rate
    steps: number; // daily step count
}