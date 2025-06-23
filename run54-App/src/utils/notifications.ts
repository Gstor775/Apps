import * as Notifications from 'expo-notifications';

// Request permissions (should be called on app start)
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Schedule a notification at a specific time
export const scheduleNotification = async (
  title: string, 
  body: string, 
  seconds: number,
  repeats: boolean = false // Add repeats parameter with default value
) => {
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      type: 'timeInterval',
      seconds, // Delay in seconds
      repeats, // Set to true if you want it to repeat
    },
  });
};

// Cancel a scheduled notification by its identifier
export const cancelNotification = async (identifier: string) => {
  await Notifications.cancelScheduledNotificationAsync(identifier);
};

// Configure notification settings (foreground handling)
export const configureNotificationSettings = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};