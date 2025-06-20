import AsyncStorage from '@react-native-async-storage/async-storage';

const STEP_STORAGE_KEY = '@daily_steps';

export const StepService = {
  async recordSteps(steps: number) {
    try {
      const currentSteps = await this.getSteps();
      const newSteps = currentSteps + steps;
      await AsyncStorage.setItem(STEP_STORAGE_KEY, JSON.stringify(newSteps));
    } catch (error) {
      console.error('Error recording steps:', error);
    }
  },

  async getSteps(): Promise<number> {
    try {
      const steps = await AsyncStorage.getItem(STEP_STORAGE_KEY);
      return steps ? JSON.parse(steps) : 0;
    } catch (error) {
      console.error('Error retrieving steps:', error);
      return 0;
    }
  },

  async setStepGoal(goal: number) {
    try {
      await AsyncStorage.setItem('@step_goal', JSON.stringify(goal));
    } catch (error) {
      console.error('Error setting step goal:', error);
    }
  },

  async getStepGoal(): Promise<number> {
    try {
      const goal = await AsyncStorage.getItem('@step_goal');
      return goal ? JSON.parse(goal) : 0;
    } catch (error) {
      console.error('Error retrieving step goal:', error);
      return 0;
    }
  },

  async compareSteps(timeFrame: 'day' | 'month' | 'year'): Promise<number[]> {
    // Placeholder for comparison logic
    return [];
  },

  async getStepHistory(): Promise<{ date: string; steps: number }[]> {
    try {
      const history = await AsyncStorage.getItem('@step_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error retrieving step history:', error);
      return [];
    }
  },
};