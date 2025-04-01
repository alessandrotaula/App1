import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import AppNavigator from './app/navigation/AppNavigator';
import { scheduleNotification, registerForPushNotificationsAsync } from './app/utils/notificationHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './app/context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// StatusBar component that adapts to theme
function AdaptiveStatusBar() {
  const { isDarkMode } = useTheme();
  return <StatusBar style={isDarkMode ? "light" : "dark"} />;
}

export default function App() {
  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      // Check if first launch
      const hasLaunched = await AsyncStorage.getItem('@app_has_launched');
      
      if (!hasLaunched) {
        // Set default settings on first launch
        const defaultSettings = {
          notificationsEnabled: false,
          notificationTime: '20:00',
          customMessage: 'Time for your daily gratitude practice!'
        };
        
        await AsyncStorage.setItem('@gratitude_settings', JSON.stringify(defaultSettings));
        await AsyncStorage.setItem('@app_has_launched', 'true');
      } else {
        // Set up notifications based on saved settings
        await registerForPushNotificationsAsync();
        await scheduleNotification();
      }
    };
    
    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AdaptiveStatusBar />
          <AppNavigator />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
