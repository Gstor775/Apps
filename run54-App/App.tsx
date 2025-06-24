import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { configureNotificationSettings, requestNotificationPermissions, scheduleNotification } from './src/utils/notifications';
import AppNavigator from './src/navigation/AppNavigator';


export default function App() {
  useEffect(() => {
    configureNotificationSettings();
    requestNotificationPermissions();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      <Text style={{ textAlign: 'center', marginTop: 20 }}>Welcome to the Workout App</Text>
    </View>
  );
}
