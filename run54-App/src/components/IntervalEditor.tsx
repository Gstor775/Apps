import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Interval = {
  type: 'run' | 'rest';
  durationSec?: number;
  distanceM?: number;
  paceGoal?: number;
};

const defaultInterval: Interval = { type: 'run', durationSec: 300, paceGoal: 6 };

const IntervalEditor = ({
  intervals,
  setIntervals,
}: {
  intervals: Interval[];
  setIntervals: (intervals: Interval[]) => void;
}) => {
  const [newType, setNewType] = useState<'run' | 'rest'>('run');
  const [newDuration, setNewDuration] = useState('300');
  const [newDistance, setNewDistance] = useState('');
  const [newPace, setNewPace] = useState('6');

  const addInterval = () => {
    const interval: Interval = { type: newType };
    if (newDuration) interval.durationSec = parseInt(newDuration, 10);
    if (newDistance) interval.distanceM = parseInt(newDistance, 10);
    if (newType === 'run' && newPace) interval.paceGoal = parseFloat(newPace);
    setIntervals([...intervals, interval]);
    setNewDuration('300');
    setNewDistance('');
    setNewPace('6');
  };

  const removeInterval = (idx: number) => {
    setIntervals(intervals.filter((_, i) => i !== idx));
  };

  return (
    <View style={styles.editorContainer}>
      <Text style={styles.title}>Interval Editor</Text>
      <View style={styles.row}>
        <Text>Type:</Text>
        <Picker
          selectedValue={newType}
          style={{ height: 40, width: 100 }}
          onValueChange={(itemValue) => setNewType(itemValue)}
        >
          <Picker.Item label="Run" value="run" />
          <Picker.Item label="Rest" value="rest" />
        </Picker>
      </View>
      <View style={styles.row}>
        <Text>Duration (sec):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={newDuration}
          onChangeText={setNewDuration}
        />
      </View>
      <View style={styles.row}>
        <Text>Distance (m):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={newDistance}
          onChangeText={setNewDistance}
        />
      </View>
      {newType === 'run' && (
        <View style={styles.row}>
          <Text>Pace Goal (min/km):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={newPace}
            onChangeText={setNewPace}
          />
        </View>
      )}
      <Button title="Add Interval" onPress={addInterval} />
      <Text style={styles.subtitle}>Intervals:</Text>
      <FlatList
        data={intervals}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.intervalRow}>
            <Text>
              {item.type.toUpperCase()} - {item.durationSec ? `${item.durationSec}s` : ''}{' '}
              {item.distanceM ? `${item.distanceM}m` : ''}{' '}
              {item.paceGoal ? `Pace: ${item.paceGoal}` : ''}
            </Text>
            <Button title="Remove" onPress={() => removeInterval(index)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  editorContainer: { padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginVertical: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 4, marginLeft: 8, width: 60 },
  intervalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 2 },
});

export default IntervalEditor;