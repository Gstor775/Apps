import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'user_settings';

const SettingsScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isHeartRateMonitoringEnabled, setIsHeartRateMonitoringEnabled] = useState(true);
  const [stepGoal, setStepGoal] = useState('10000');

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await AsyncStorage.getItem(SETTINGS_KEY);
        if (data) {
          const settings = JSON.parse(data);
          setIsNotificationsEnabled(settings.isNotificationsEnabled ?? true);
          setIsHeartRateMonitoringEnabled(settings.isHeartRateMonitoringEnabled ?? true);
          setStepGoal(settings.stepGoal ?? '10000');
        }
      } catch (e) {
        // Handle error if needed
      }
    };
    loadSettings();
  }, []);

  const toggleNotifications = () => setIsNotificationsEnabled(prev => !prev);
  const toggleHeartRateMonitoring = () => setIsHeartRateMonitoringEnabled(prev => !prev);

  const handleSave = async () => {
    const settings = {
      isNotificationsEnabled,
      isHeartRateMonitoringEnabled,
      stepGoal,
    };
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      Alert.alert('Settings Saved', `Step Goal: ${stepGoal}\nNotifications: ${isNotificationsEnabled ? 'On' : 'Off'}\nHeart Rate Monitoring: ${isHeartRateMonitoringEnabled ? 'On' : 'Off'}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save settings.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Enable Heart Rate Monitoring</Text>
        <Switch
          value={isHeartRateMonitoringEnabled}
          onValueChange={toggleHeartRateMonitoring}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Daily Step Goal</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={stepGoal}
          onChangeText={setStepGoal}
        />
      </View>
      <Button title="Save Settings" onPress={handleSave} />
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
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  settingLabel: {
    fontSize: 18,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: 80,
    marginLeft: 10,
  },
});

export default SettingsScreen;