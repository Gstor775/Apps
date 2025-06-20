import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Modal, Vibration } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Metronome from './Metronome';
import IntervalEditor from './IntervalEditor';
import { saveWorkout, getWorkouts } from '../services/WorkoutService';

type Interval = {
  type: 'run' | 'rest';
  durationSec?: number;
  distanceM?: number;
  paceGoal?: number;
};

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const DEFAULT_CADENCE = 180;

interface RunTrackerProps {
  onStop?: () => void;
}

const RunTracker: React.FC<RunTrackerProps> = ({ onStop }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [route, setRoute] = useState<Location.LocationObject[]>([]);
  const [distance, setDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [pace, setPace] = useState(0);
  const [avgPace, setAvgPace] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [intervals, setIntervals] = useState<Interval[]>([
    { type: 'run', durationSec: 300, paceGoal: 6 },
    { type: 'rest', durationSec: 60 },
    { type: 'run', durationSec: 300, paceGoal: 6 },
  ]);
  const [currentIntervalIdx, setCurrentIntervalIdx] = useState(0);
  const [intervalElapsed, setIntervalElapsed] = useState(0);
  const [showIntervalEditor, setShowIntervalEditor] = useState(false);

  const [showMetronome, setShowMetronome] = useState(false);
  const [paceGoal, setPaceGoal] = useState(6);
  const [metronomeBpm, setMetronomeBpm] = useState(DEFAULT_CADENCE);
  const [useLivePace, setUseLivePace] = useState(false);
  const [intervalDistance, setIntervalDistance] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const locationSub = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
      if (locationSub.current) locationSub.current.remove();
    };
  }, []);

  // Calories estimate
  const estimateCalories = (meters: number) => {
    const weight = 70;
    return ((meters / 1000) * weight * 0.75).toFixed(0);
  };

  // Interval logic (supporting time- and distance-based)
  useEffect(() => {
    if (!isRunning) return;
    if (intervals.length === 0) return;
    if (currentIntervalIdx >= intervals.length) return;

    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);

    const interval = intervals[currentIntervalIdx];
    setIntervalElapsed(0);
    setIntervalDistance(0);

    // Time-based interval
    if (interval.durationSec) {
      intervalTimerRef.current = setInterval(() => {
        setIntervalElapsed((prev) => {
          if (interval.durationSec && prev + 1 >= interval.durationSec) {
            Vibration.vibrate(500);
            if (currentIntervalIdx + 1 < intervals.length) {
              setCurrentIntervalIdx(currentIntervalIdx + 1);
              setIntervalElapsed(0);
              setIntervalDistance(0);
            } else {
              setIsRunning(false);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentIntervalIdx, intervals]);

  // Distance-based interval logic (update on location change)
  useEffect(() => {
    if (!isRunning) return;
    if (intervals.length === 0) return;
    if (currentIntervalIdx >= intervals.length) return;
    const interval = intervals[currentIntervalIdx];
    if (!interval.distanceM) return;

    if (route.length < 2) return;
    const last = route[route.length - 1];
    const prev = route[route.length - 2];
    const d = getDistanceFromLatLonInMeters(
      prev.coords.latitude,
      prev.coords.longitude,
      last.coords.latitude,
      last.coords.longitude
    );
    setIntervalDistance((dist) => {
      const newDist = dist + d;
      if (interval.distanceM && newDist >= interval.distanceM) {
        Vibration.vibrate(500);
        if (currentIntervalIdx + 1 < intervals.length) {
          setCurrentIntervalIdx(currentIntervalIdx + 1);
          setIntervalElapsed(0);
          return 0;
        } else {
          setIsRunning(false);
        }
      }
      return newDist;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  // Metronome BPM logic
  const paceToBpm = (pace: number) => Math.round(1400 / pace);

  useEffect(() => {
    if (!useLivePace) {
      setMetronomeBpm(paceToBpm(paceGoal));
    }
  }, [paceGoal, useLivePace]);

  useEffect(() => {
    if (useLivePace && isRunning && pace > 0) {
      setMetronomeBpm(paceToBpm(pace));
    }
  }, [pace, useLivePace, isRunning]);

  // Start run
  const startRun = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.');
      return;
    }
    setIsRunning(true);
    setRoute([]);
    setDistance(0);
    setElapsed(0);
    setPace(0);
    setAvgPace(0);
    setCalories(0);
    setCurrentIntervalIdx(0);
    setIntervalElapsed(0);

    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    locationSub.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Highest, distanceInterval: 5 },
      (loc) => {
        setRoute((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const d = getDistanceFromLatLonInMeters(
              last.coords.latitude,
              last.coords.longitude,
              loc.coords.latitude,
              loc.coords.longitude
            );
            setDistance((dist) => dist + d);
            setPace((elapsed > 0 && d > 0) ? (elapsed / 60) / (distance / 1000) : 0);
            setAvgPace((distance > 0) ? (elapsed / 60) / (distance / 1000) : 0);
            setCalories(Number(estimateCalories(distance + d)));
          }
          return [...prev, loc];
        });
      }
    );
  };

  // Stop run
  const stopRun = async () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    if (locationSub.current) locationSub.current.remove();
    const workout = {
      date: new Date().toISOString(),
      route,
      distance,
      elapsed,
      avgPace,
      calories,
      intervals,
    };
    setWorkoutHistory((prev) => [...prev, workout]);
    await saveWorkout(workout);
    if (onStop) onStop();
  };

  return (
    <View style={styles.container}>
      <Button title="Edit Intervals" onPress={() => setShowIntervalEditor(true)} />
      <Modal visible={showIntervalEditor} animationType="slide">
        <IntervalEditor intervals={intervals} setIntervals={setIntervals} />
        <Button title="Done" onPress={() => setShowIntervalEditor(false)} />
      </Modal>
      <Text style={styles.title}>Run Tracker</Text>
      <Text>Distance: {(distance / 1000).toFixed(2)} km</Text>
      <Text>Elapsed: {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</Text>
      <Text>Pace: {pace.toFixed(2)} min/km</Text>
      <Text>Avg Pace: {avgPace.toFixed(2)} min/km</Text>
      <Text>Calories: {calories}</Text>
      <Text>Heart Rate: {heartRate ? heartRate : '--'} bpm</Text>
      <View style={{ marginVertical: 10 }}>
        <Text>
          Interval {currentIntervalIdx + 1}/{intervals.length} - {intervals[currentIntervalIdx]?.type.toUpperCase()}
        </Text>
        {intervals[currentIntervalIdx]?.durationSec ? (
          <Text>
            {intervalElapsed}s / {intervals[currentIntervalIdx]?.durationSec}s
          </Text>
        ) : intervals[currentIntervalIdx]?.distanceM ? (
          <Text>
            {intervalDistance.toFixed(1)}m / {intervals[currentIntervalIdx]?.distanceM}m
          </Text>
        ) : null}
        {intervals[currentIntervalIdx]?.paceGoal && (
          <Text>Pace Goal: {intervals[currentIntervalIdx]?.paceGoal} min/km</Text>
        )}
      </View>
      <Button title={isRunning ? "Stop Run" : "Start Run"} onPress={isRunning ? stopRun : startRun} />
      <Button title="Show Metronome" onPress={() => setShowMetronome(true)} />
      <Modal visible={showMetronome} animationType="slide">
        <Metronome
          bpm={metronomeBpm}
          onBpmChange={setMetronomeBpm}
          onPlayChange={() => {}}
        />
        <Button title="Close Metronome" onPress={() => setShowMetronome(false)} />
      </Modal>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: route[0]?.coords.latitude || 37.78825,
          longitude: route[0]?.coords.longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {route.length > 0 && (
          <>
            <Polyline
              coordinates={route.map((loc) => ({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }))}
              strokeWidth={4}
              strokeColor="blue"
            />
            <Marker
              coordinate={{
                latitude: route[0].coords.latitude,
                longitude: route[0].coords.longitude,
              }}
              title="Start"
            />
            <Marker
              coordinate={{
                latitude: route[route.length - 1].coords.latitude,
                longitude: route[route.length - 1].coords.longitude,
              }}
              title="Current"
            />
          </>
        )}
      </MapView>
      <Text style={styles.historyTitle}>Workout History:</Text>
      {workoutHistory.length === 0 ? (
        <Text>No history yet.</Text>
      ) : (
        workoutHistory.map((w, i) => (
          <Text key={i} style={styles.historyEntry}>
            {w.date}: {(w.distance / 1000).toFixed(2)} km, {Math.floor(w.elapsed / 60)}:{(w.elapsed % 60).toString().padStart(2, '0')} min, {w.calories} kcal
          </Text>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  map: { width: '100%', height: 200, marginVertical: 10 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  historyEntry: { fontSize: 14 },
});

export default RunTracker;