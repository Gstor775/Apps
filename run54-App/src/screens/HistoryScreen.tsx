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

  const renderItem = ({ item, index }: { item: Workout; index: number }) => (
    <View style={styles.item}>
      <Text style={styles.date}>
        {typeof item.date === 'string' ? item.date : item.date?.toString() || 'No date'}
      </Text>
      <Text>Distance: {item.distance ? item.distance.toFixed(2) : '0.00'} km</Text>
      <Text>
        Time: {typeof item.elapsedTime === 'string'
          ? item.elapsedTime
          : item.elapsedTime
            ? `${item.elapsedTime.hours}h ${item.elapsedTime.minutes}m ${item.elapsedTime.seconds}s`
            : 'N/A'}
      </Text>
      <Text>Avg Pace: {item.avgPace !== undefined ? item.avgPace.toFixed(2) : 'N/A'} min/km</Text>
      <Text>Calories: {item.caloriesBurned ?? 'N/A'}</Text>
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
          keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,     
  },
  item: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default HistoryScreen;