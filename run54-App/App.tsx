import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { configureNotificationSettings, requestNotificationPermissions, scheduleNotification } from './src/utils/notifications';


export default function App() {
  useEffect(() => {
    configureNotificationSettings();
    requestNotificationPermissions();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to run54-App!</Text>
    </View>
  );
}