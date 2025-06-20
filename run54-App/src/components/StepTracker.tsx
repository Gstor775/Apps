import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ProgressBarAndroid, Platform } from 'react-native';
const ProgressViewIOS = require('@react-native-community/progress-view').default;
import { StepService } from '../services/StepService';

interface StepHistoryEntry {
    date: string;
    steps: number;
}

const StepTracker = () => {
    const [steps, setSteps] = useState(0);
    const [goal, setGoal] = useState(10000); // Default step goal
    const [history, setHistory] = useState<StepHistoryEntry[]>([]);
    const [customGoal, setCustomGoal] = useState('');

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const currentSteps = await StepService.getSteps();
                setSteps(currentSteps);
            } catch (e) {
                setSteps(0);
            }
        };

        const fetchHistory = async () => {
            try {
                const stepHistory = await StepService.getStepHistory();
                setHistory(stepHistory);
            } catch (e) {
                setHistory([]);
            }
        };

        fetchSteps();
        fetchHistory();
    }, []);

    const handleSetGoal = (newGoal: number) => {
        setGoal(newGoal);
        if (StepService.setStepGoal) {
            StepService.setStepGoal(newGoal);
        }
    };

    const progress = Math.min(steps / goal, 1);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Step Tracker</Text>
            <Text style={styles.steps}>Current Steps: {steps}</Text>
            <Text style={styles.goal}>Step Goal: {goal}</Text>
            <Text style={styles.progress}>{Math.round(progress * 100)}% of goal</Text>
            {Platform.OS === 'android' ? (
                <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} />
            ) : (
                <ProgressViewIOS progress={progress} />
            )}
            <View style={styles.goalInputContainer}>
                <TextInput
                    style={styles.goalInput}
                    placeholder="Set custom goal"
                    keyboardType="numeric"
                    value={customGoal}
                    onChangeText={setCustomGoal}
                />
                <Button
                    title="Set Goal"
                    onPress={() => {
                        const num = parseInt(customGoal, 10);
                        if (!isNaN(num) && num > 0) {
                            handleSetGoal(num);
                            setCustomGoal('');
                        }
                    }}
                />
            </View>
            <Text style={styles.historyTitle}>Step History:</Text>
            {history.length === 0 ? (
                <Text style={styles.historyEntry}>No history yet.</Text>
            ) : (
                history.map((entry, index) => (
                    <Text key={index} style={styles.historyEntry}>
                        {entry.date}: {entry.steps} steps
                    </Text>
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    steps: {
        fontSize: 18,
        marginVertical: 10,
    },
    goal: {
        fontSize: 18,
        marginVertical: 10,
    },
    progress: {
        fontSize: 16,
        marginBottom: 10,
    },
    goalInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    goalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginRight: 10,
        width: 120,
    },
    historyTitle: {
        fontSize: 20,
        marginTop: 20,
        fontWeight: 'bold',
    },
    historyEntry: {
        fontSize: 16,
    },
});

export default StepTracker;