import * as Notifications from 'expo-notifications';

// Request permissions (should be called on app start)
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Schedule a notification at a specific time
export const scheduleNotification = async (title: string, body: string, trigger: Date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: trigger instanceof Date
      ? { type: Notifications.TriggerType.TIME, date: trigger }
      : trigger,
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