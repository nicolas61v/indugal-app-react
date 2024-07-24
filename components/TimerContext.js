import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState({});
  const [intervals, setIntervals] = useState({});
  const [activeStates, setActiveStates] = useState({});

  useEffect(() => {
    loadTimers();
  }, []);

  const loadTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      const storedStates = await AsyncStorage.getItem('activeStates');
      if (storedTimers) setTimers(JSON.parse(storedTimers));
      if (storedStates) setActiveStates(JSON.parse(storedStates));
    } catch (error) {
      console.error('Error loading timers or states:', error);
    }
  };

  const saveTimers = async (newTimers) => {
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
    } catch (error) {
      console.error('Error saving timers:', error);
    }
  };

  const saveActiveStates = async (newStates) => {
    try {
      await AsyncStorage.setItem('activeStates', JSON.stringify(newStates));
    } catch (error) {
      console.error('Error saving active states:', error);
    }
  };

  const handleCommand = (command) => {
    fetch(`http://10.10.0.56/${command}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => console.log(data))
      .catch(error => {
        console.error('Error en el comando:', error);
        Alert.alert('Error', 'Asegúrate de estar conectado a la red del dispositivo.');
      });
  };

  const startTimer = (rectifierId) => {
    stopTimer(rectifierId); // Asegurarse de que no haya múltiples intervalos

    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTime = Math.max((prevTimers[rectifierId] || 0) - 1, 0);
        const updatedTimers = { ...prevTimers, [rectifierId]: newTime };
        saveTimers(updatedTimers);

        if (newTime === 0) {
          stopTimer(rectifierId);
          handleCommand(`relay${rectifierId}off`);
          setActiveStates((prevStates) => {
            const newStates = { ...prevStates, [rectifierId]: `relay${rectifierId}off` };
            saveActiveStates(newStates);
            return newStates;
          });
          Alert.alert(`Baño ${rectifierId}`, 'El tiempo ha terminado');
        }

        return updatedTimers;
      });
    }, 1000);

    setIntervals((prevIntervals) => ({
      ...prevIntervals,
      [rectifierId]: interval,
    }));
  };

  const stopTimer = (rectifierId) => {
    if (intervals[rectifierId]) {
      clearInterval(intervals[rectifierId]);
      setIntervals((prevIntervals) => {
        const { [rectifierId]: _, ...rest } = prevIntervals;
        return rest;
      });
    }
  };

  const setTimerDuration = (rectifierId, duration) => {
    setTimers((prevTimers) => {
      const updatedTimers = { ...prevTimers, [rectifierId]: duration };
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  const setActiveButton = (rectifierId, state) => {
    setActiveStates((prevStates) => {
      const newStates = { ...prevStates, [rectifierId]: state };
      saveActiveStates(newStates);
      return newStates;
    });
  };

  return (
    <TimerContext.Provider value={{ 
      timers, 
      startTimer, 
      stopTimer, 
      setTimerDuration, 
      activeStates, 
      setActiveButton,
      handleCommand
    }}>
      {children}
    </TimerContext.Provider>
  );
};