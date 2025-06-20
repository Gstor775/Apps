import { Platform } from 'react-native';
import { Health } from 'react-native-health'; // Example library for health integration
import { PermissionsAndroid } from 'react-native';

const HealthIntegration = {
  requestPermissions: async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Activity Recognition Permission',
          message: 'This app needs access to your activity data.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS permissions are handled differently
  },

  getSteps: async () => {
    const options = {
      startDate: new Date(2023, 0, 1).toISOString(), // Start date for step tracking
      endDate: new Date().toISOString(), // End date for step tracking
    };

    return new Promise((resolve, reject) => {
      Health.getStepCount(options, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  getHeartRate: async () => {
    const options = {
      startDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Last hour
      endDate: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      Health.getHeartRate(options, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  // Additional methods for other health metrics can be added here
};

export default HealthIntegration;