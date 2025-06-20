import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const WorkoutEditorScreen = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [intervals, setIntervals] = useState([{ time: '', distance: '', rounds: '' }]);
  const [goals, setGoals] = useState({ freeGoal: '', paceGoal: '' });

  const handleAddInterval = () => {
    setIntervals([...intervals, { time: '', distance: '', rounds: '' }]);
  };

  const handleRemoveInterval = (index: number) => {
    setIntervals(intervals.filter((_, i) => i !== index));
  };

  const handleSaveWorkout = () => {
    // Logic to save the workout (e.g., to AsyncStorage or backend)
    console.log('Workout saved:', { workoutName, intervals, goals });
    // You can add a success message or navigation here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Workout Editor</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
      />
      <Text style={styles.sectionTitle}>Intervals</Text>
      {intervals.map((interval, index) => (
        <View key={index} style={styles.intervalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Interval Time (sec)"
            value={interval.time}
            keyboardType="numeric"
            onChangeText={(text) => {
              const newIntervals = [...intervals];
              newIntervals[index].time = text;
              setIntervals(newIntervals);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Interval Distance (m)"
            value={interval.distance}
            keyboardType="numeric"
            onChangeText={(text) => {
              const newIntervals = [...intervals];
              newIntervals[index].distance = text;
              setIntervals(newIntervals);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Rounds"
            value={interval.rounds}
            keyboardType="numeric"
            onChangeText={(text) => {
              const newIntervals = [...intervals];
              newIntervals[index].rounds = text;
              setIntervals(newIntervals);
            }}
          />
          {intervals.length > 1 && (
            <Button title="Remove Interval" color="#d9534f" onPress={() => handleRemoveInterval(index)} />
          )}
        </View>
      ))}
      <Button title="Add Interval" onPress={handleAddInterval} />
      <Text style={styles.sectionTitle}>Goals</Text>
      <TextInput
        style={styles.input}
        placeholder="Free Goal (e.g. 5km, 30min)"
        value={goals.freeGoal}
        onChangeText={(text) => setGoals({ ...goals, freeGoal: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Pace Goal (min/km)"
        value={goals.paceGoal}
        keyboardType="numeric"
        onChangeText={(text) => setGoals({ ...goals, paceGoal: text })}
      />
      <Button title="Save Workout" onPress={handleSaveWorkout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  intervalContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
});

export default WorkoutEditorScreen;