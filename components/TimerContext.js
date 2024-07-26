import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState({});
  const [intervals, setIntervals] = useState({});
  const [activeStates, setActiveStates] = useState({});
  const [orderNumbers, setOrderNumbers] = useState({});
  const notificationQueue = useRef([]);

  useEffect(() => {
    loadTimers();
    loadOrderNumbers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (notificationQueue.current.length > 0) {
        const { type, text1, text2 } = notificationQueue.current.shift();
        Toast.show({
          type,
          text1,
          text2,
          visibilityTime: 5000,
          autoHide: true,
          topOffset: 40,
          position: 'top',
        });
      }
    }, 5500); // Slightly longer than visibilityTime to ensure no overlap

    return () => clearInterval(interval);
  }, []);

  const queueNotification = useCallback((type, text1, text2) => {
    notificationQueue.current.push({ type, text1, text2 });
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

  const handleCommand = useCallback((command) => {
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
        queueNotification('error', 'Error', 'Asegúrate de estar conectado a la red del dispositivo.');
      });
  }, [queueNotification]);

  const showNotification = useCallback((rectifierId) => {
    const orderNumber = orderNumbers[rectifierId] || '00';
    queueNotification('info', `Baño ${rectifierId}`, `El tiempo ha terminado. Orden: ${orderNumber}`);
  }, [orderNumbers, queueNotification]);

  const startTimer = useCallback((rectifierId) => {
    stopTimer(rectifierId);

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
          showNotification(rectifierId);
          clearOrderNumber(rectifierId);
        }

        return updatedTimers;
      });
    }, 1000);

    setIntervals((prevIntervals) => ({
      ...prevIntervals,
      [rectifierId]: interval,
    }));
  }, [stopTimer, handleCommand, showNotification, clearOrderNumber]);

  const stopTimer = useCallback((rectifierId) => {
    if (intervals[rectifierId]) {
      clearInterval(intervals[rectifierId]);
      setIntervals((prevIntervals) => {
        const { [rectifierId]: _, ...rest } = prevIntervals;
        return rest;
      });
    }
  }, [intervals]);

  const setTimerDuration = useCallback((rectifierId, duration) => {
    setTimers((prevTimers) => {
      const updatedTimers = { ...prevTimers, [rectifierId]: duration };
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  }, []);

  const setActiveButton = useCallback((rectifierId, state) => {
    setActiveStates((prevStates) => {
      const newStates = { ...prevStates, [rectifierId]: state };
      saveActiveStates(newStates);
      return newStates;
    });
  }, []);

  const loadOrderNumbers = async () => {
    try {
      const storedOrderNumbers = await AsyncStorage.getItem('orderNumbers');
      if (storedOrderNumbers) setOrderNumbers(JSON.parse(storedOrderNumbers));
    } catch (error) {
      console.error('Error loading order numbers:', error);
    }
  };

  const saveOrderNumbers = async (newOrderNumbers) => {
    try {
      await AsyncStorage.setItem('orderNumbers', JSON.stringify(newOrderNumbers));
    } catch (error) {
      console.error('Error saving order numbers:', error);
    }
  };

  const updateOrderNumber = useCallback((rectifierId, digit, value) => {
    setOrderNumbers((prevOrderNumbers) => {
      const currentNumber = prevOrderNumbers[rectifierId] || '00';
      let newNumber;
      if (digit === 0) {
        newNumber = value + currentNumber[1];
      } else {
        newNumber = currentNumber[0] + value;
      }
      const updatedOrderNumbers = { ...prevOrderNumbers, [rectifierId]: newNumber };
      saveOrderNumbers(updatedOrderNumbers);
      return updatedOrderNumbers;
    });
  }, []);

  const confirmOrderNumber = useCallback((rectifierId) => {
    queueNotification('success', `Baño ${rectifierId}`, `Orden ${orderNumbers[rectifierId] || '00'} confirmada`);
  }, [orderNumbers, queueNotification]);

  const clearOrderNumber = useCallback((rectifierId) => {
    setOrderNumbers((prevOrderNumbers) => {
      const updatedOrderNumbers = { ...prevOrderNumbers, [rectifierId]: '00' };
      saveOrderNumbers(updatedOrderNumbers);
      return updatedOrderNumbers;
    });
  }, []);

  const contextValue = {
    timers,
    startTimer,
    stopTimer,
    setTimerDuration,
    activeStates,
    setActiveButton,
    handleCommand,
    orderNumbers,
    updateOrderNumber,
    confirmOrderNumber,
    clearOrderNumber
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </TimerContext.Provider>
  );
};
