import React, { useState } from 'react';

const WorkoutEditor: React.FC = () => {
    const [workoutName, setWorkoutName] = useState('');
    const [intervals, setIntervals] = useState<{ distance: number; time: number; rest: number }[]>([]);
    const [goals, setGoals] = useState<{ type: string; value: number }[]>([]);
    const [paceGoal, setPaceGoal] = useState<number | null>(null);

    const addInterval = () => {
        setIntervals([...intervals, { distance: 0, time: 0, rest: 0 }]);
    };

    const removeInterval = (index: number) => {
        setIntervals(intervals.filter((_, i) => i !== index));
    };

    const saveWorkout = () => {
        // Logic to save the workout
        console.log({
            workoutName,
            intervals,
            goals,
            paceGoal,
        });
    };

    return (
        <div>
            <h1>Workout Editor</h1>
            <input
                type="text"
                placeholder="Workout Name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
            />
            <h2>Intervals</h2>
            {intervals.map((interval, index) => (
                <div key={index}>
                    <input
                        type="number"
                        placeholder="Distance (miles)"
                        value={interval.distance}
                        onChange={(e) => {
                            const newIntervals = [...intervals];
                            newIntervals[index].distance = Number(e.target.value);
                            setIntervals(newIntervals);
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Time (seconds)"
                        value={interval.time}
                        onChange={(e) => {
                            const newIntervals = [...intervals];
                            newIntervals[index].time = Number(e.target.value);
                            setIntervals(newIntervals);
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Rest (seconds)"
                        value={interval.rest}
                        onChange={(e) => {
                            const newIntervals = [...intervals];
                            newIntervals[index].rest = Number(e.target.value);
                            setIntervals(newIntervals);
                        }}
                    />
                    <button onClick={() => removeInterval(index)}>Remove Interval</button>
                </div>
            ))}
            <button onClick={addInterval}>Add Interval</button>
            <h2>Goals</h2>
            {/* Goals input logic can be added here */}
            <h2>Pace Goal</h2>
            <input
                type="number"
                placeholder="Pace Goal (min/mile)"
                value={paceGoal || ''}
                onChange={(e) => setPaceGoal(Number(e.target.value))}
            />
            <button onClick={saveWorkout}>Save Workout</button>
        </div>
    );
};

export default WorkoutEditor;