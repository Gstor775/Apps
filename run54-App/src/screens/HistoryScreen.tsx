import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getWorkouts } from '../services/WorkoutService';
import { Workout } from '../types';

const HistoryScreen = () => {
  const [history, setHistory] = useState<Workout[]>([]);

  useEffect(() => {
    // Fetch workouts from storage/service
    const fetchHistory = async () => {
      const workouts = await getWorkouts();
      setHistory(workouts.reverse()); // Show most recent first
    };
    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: Workout }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{typeof item.date === 'string' ? item.date : item.date.toString()}</Text>
      <Text>Distance: {(item.distance).toFixed(2)} km</Text>
      <Text>Time: {typeof item.elapsedTime === 'string'
        ? item.elapsedTime
        : `${item.elapsedTime.hours}h ${item.elapsedTime.minutes}m ${item.elapsedTime.seconds}s`}</Text>
      <Text>Avg Pace: {item.avgPace?.toFixed(2)} min/km</Text>
      <Text>Calories: {item.caloriesBurned}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>
      {history.length === 0 ? (
        <Text>No workouts yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  item: { marginBottom: 16, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
  date: { fontWeight: 'bold', marginBottom: 4 },
});

export default HistoryScreen;