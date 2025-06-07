import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen';
import MainMenuScreen from './screens/MainMenuScreen';
import DiameterSelectionScreen from './screens/DiameterSelectionScreen';
import CameraScreen from './screens/CameraScreen';
import ResultsScreen from './screens/ResultsScreen';
import ReportScreen from './screens/ReportScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1976d2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ title: 'TMT Ring Test - Login' }}
          />
          <Stack.Screen 
            name="MainMenu" 
            component={MainMenuScreen}
            options={{ title: 'Main Menu' }}
          />
          <Stack.Screen 
            name="DiameterSelection" 
            component={DiameterSelectionScreen}
            options={{ title: 'Select Bar Diameter' }}
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen}
            options={{ title: 'Capture TMT Bar' }}
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen}
            options={{ title: 'Test Results' }}
          />
          <Stack.Screen 
            name="Report" 
            component={ReportScreen}
            options={{ title: 'Generate Report' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
