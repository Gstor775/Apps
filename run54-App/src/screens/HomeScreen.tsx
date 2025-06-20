import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    RunScreen: undefined;
    WorkoutEditorScreen: undefined;
    HistoryScreen: undefined;
    StepTrackerScreen: undefined;
    SettingsScreen: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Workout App</Text>
            <Button
                title="Run Tracker"
                onPress={() => navigation.navigate('RunScreen')}
            />
            <Button
                title="Workout Editor"
                onPress={() => navigation.navigate('WorkoutEditorScreen')}
            />
            <Button
                title="History"
                onPress={() => navigation.navigate('HistoryScreen')}
            />
            <Button
                title="Step Tracker"
                onPress={() => navigation.navigate('StepTrackerScreen')}
            />
            <Button
                title="Settings"
                onPress={() => navigation.navigate('SettingsScreen')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default HomeScreen;