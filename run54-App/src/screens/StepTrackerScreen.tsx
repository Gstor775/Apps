import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StepService } from '../services/StepService';
import StepTracker from '../components/StepTracker';

const StepTrackerScreen = () => {
    const [steps, setSteps] = useState(0);
    const [goal, setGoal] = useState(10000); // Default step goal
    type StepHistoryEntry = { date: string; steps: number };
    const [stepHistory, setStepHistory] = useState<StepHistoryEntry[]>([]);

    useEffect(() => {
        const fetchSteps = async () => {
            const currentSteps = await StepService.getSteps();
            setSteps(currentSteps);
        };

        const fetchStepHistory = async () => {
            const history = await StepService.getStepHistory();
            setStepHistory(history);
        };

        fetchSteps();
        fetchStepHistory();
    }, []);

    const handleSetGoal = (newGoal: number) => {
        setGoal(newGoal);
        StepService.setStepGoal(newGoal);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Step Tracker</Text>
            <StepTracker />
            <Text style={styles.steps}>Current Steps: {steps}</Text>
            <Text style={styles.goal}>Step Goal: {goal}</Text>
            <Button title="Set Goal to 12000" onPress={() => handleSetGoal(12000)} />
            <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Step History:</Text>
                {stepHistory.map((entry, index) => (
                    <Text key={index} style={styles.historyEntry}>
                        {entry.date}: {entry.steps} steps
                    </Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    steps: {
        fontSize: 18,
        marginBottom: 10,
    },
    goal: {
        fontSize: 18,
        marginBottom: 20,
    },
    historyContainer: {
        marginTop: 20,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    historyEntry: {
        fontSize: 16,
    },
});

export default StepTrackerScreen;