import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import RunScreen from '../screens/RunScreen';
import HistoryScreen from '../screens/HistoryScreen';
import WorkoutEditorScreen from '../screens/WorkoutEditorScreen';
import StepTrackerScreen from '../screens/StepTrackerScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Run" component={RunScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Workout Editor" component={WorkoutEditorScreen} />
      <Tab.Screen name="Step Tracker" component={StepTrackerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;