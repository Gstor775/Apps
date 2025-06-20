import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import RunTracker from '../components/RunTracker';

const RunScreen = () => {
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = () => setIsTracking(true);
  const stopTracking = () => setIsTracking(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Run Tracker</Text>
      {isTracking ? (
        <RunTracker onStop={stopTracking} />
      ) : (
        <Button title="Start Tracking" onPress={startTracking} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RunScreen;