import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TimerProvider } from './components/TimerContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <TimerProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TimerProvider>
  );
};

export default App;
