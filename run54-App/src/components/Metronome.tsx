import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

const DEFAULT_BPM = 180;

const Metronome = ({
  bpm = DEFAULT_BPM,
  isPlaying = false,
  onBpmChange,
  onPlayChange,
}: {
  bpm?: number;
  isPlaying?: boolean;
  onBpmChange?: (bpm: number) => void;
  onPlayChange?: (playing: boolean) => void;
}) => {
  const [playing, setPlaying] = useState(isPlaying);
  const [currentBpm, setCurrentBpm] = useState(bpm);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Set audio mode to allow overlay with music
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: false,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  useEffect(() => {
    setPlaying(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    setCurrentBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    if (playing) {
      startMetronome();
    } else {
      stopMetronome();
    }
    return () => stopMetronome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, currentBpm]);

  const startMetronome = async () => {
    await loadSound();
    playClick(); // Play immediately
    const interval = (60 / currentBpm) * 1000;
    intervalRef.current = setInterval(() => {
      playClick();
    }, interval);
  };

  const stopMetronome = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (soundRef.current) soundRef.current.stopAsync();
  };

  const loadSound = async () => {
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/Metronome-click.wav')
      );
      soundRef.current = sound;
    }
  };

  const playClick = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  const handleBpmChange = (value: number) => {
    setCurrentBpm(value);
    if (onBpmChange) onBpmChange(value);
  };

  const handlePlayToggle = () => {
    setPlaying((prev) => {
      if (onPlayChange) onPlayChange(!prev);
      return !prev;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Metronome</Text>
      <Text style={styles.bpm}>{currentBpm} BPM</Text>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={60}
        maximumValue={220}
        step={1}
        value={currentBpm}
        onValueChange={handleBpmChange}
      />
      <Button title={playing ? 'Stop' : 'Start'} onPress={handlePlayToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 16 },
  label: { fontSize: 18, fontWeight: 'bold' },
  bpm: { fontSize: 24, marginVertical: 8 },
});

export default Metronome;