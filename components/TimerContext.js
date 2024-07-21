import React, { createContext, useState, useEffect } from 'react';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timers, setTimers] = useState({});
  const [intervals, setIntervals] = useState({});

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem('timers');
        if (storedTimers) {
          setTimers(JSON.parse(storedTimers));
        }
      } catch (error) {
        console.error('Error loading timers:', error);
      }
    };

    loadTimers();
  }, []);

  const saveTimers = async (newTimers) => {
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
    } catch (error) {
      console.error('Error saving timers:', error);
    }
  };

  const startTimer = (rectifierId) => {
    stopTimer(rectifierId); // Ensure no multiple intervals

    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTime = (prevTimers[rectifierId] || 0) - 1;
        const updatedTimers = { ...prevTimers, [rectifierId]: Math.max(newTime, 0) };
        saveTimers(updatedTimers);
        return updatedTimers;
      });
    }, 1000);

    setIntervals((prevIntervals) => ({
      ...prevIntervals,
      [rectifierId]: interval,
    }));
  };

  const stopTimer = (rectifierId) => {
    clearInterval(intervals[rectifierId]);
    setIntervals((prevIntervals) => {
      const { [rectifierId]: _, ...rest } = prevIntervals;
      return rest;
    });
  };

  const setTimerDuration = (rectifierId, duration) => {
    setTimers((prevTimers) => {
      const updatedTimers = { ...prevTimers, [rectifierId]: duration };
      saveTimers(updatedTimers);
      return updatedTimers;
    });
  };

  return (
    <TimerContext.Provider value={{ timers, startTimer, stopTimer, setTimerDuration }}>
      {children}
    </TimerContext.Provider>
  );
};
