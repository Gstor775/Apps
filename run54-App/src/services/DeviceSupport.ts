import { Platform } from 'react-native';

const DeviceSupport = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  isSupported: function() {
    return this.isAndroid || this.isIOS;
  },
  getDeviceInfo: function() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
    };
  },
};

export default DeviceSupport;