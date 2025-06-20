import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';


const History: React.FC = () => {
    // Sample data for workout history
    const workoutHistory = [
        {
            id: 1,
            route: 'Central Park Loop',
            distance: '5 miles',
            elapsedTime: '00:45:30',
            pace: '9:06 min/mile',
            avgPace: '9:00 min/mile',
            calorieBurn: '500 kcal',
            date: '2023-10-01',
        },
        {
            id: 2,
            route: 'River Trail',
            distance: '3 miles',
            elapsedTime: '00:30:15',
            pace: '10:05 min/mile',
            avgPace: '10:00 min/mile',
            calorieBurn: '300 kcal',
            date: '2023-09-28',
        },
        // Add more sample workouts as needed
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Workout History</Text>
            {workoutHistory.map(workout => (
                <View key={workout.id} style={styles.item}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{workout.route}</Text>
                    <Text>Distance: {workout.distance}</Text>
                    <Text>Elapsed Time: {workout.elapsedTime}</Text>
                    <Text>Pace: {workout.pace}</Text>
                    <Text>Average Pace: {workout.avgPace}</Text>
                    <Text>Calories Burned: {workout.calorieBurn}</Text>
                    <Text>Date: {workout.date}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  item: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
