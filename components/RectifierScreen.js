import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RectifierScreen = ({ route, navigation }) => {
  const { rectifierId } = route.params;
  const [activeButton, setActiveButton] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    // Load initial state from AsyncStorage
    const loadState = async () => {
      try {
        const storedTime = await AsyncStorage.getItem(`rectifier${rectifierId}_time`);
        const storedButton = await AsyncStorage.getItem(`rectifier${rectifierId}_button`);
        if (storedTime !== null) setTimer(parseInt(storedTime, 10));
        if (storedButton !== null) setActiveButton(storedButton);
      } catch (e) {
        console.error('Error loading state:', e);
      }
    };
    loadState();
  }, [rectifierId]);

  useEffect(() => {
    // Timer management effect
    let timerInterval;
    if (isTimerRunning && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer(prevTimer => {
          const newTime = prevTimer - 1;
          if (newTime <= 0) {
            clearInterval(timerInterval);
            handleCommand(`relay${rectifierId}off`);
            setActiveButton(`relay${rectifierId}off`);
            setIsTimerRunning(false);
            Alert.alert(`Baño ${rectifierId}`, 'El tiempo ha terminado');
            return 0;
          }
          saveState(newTime, activeButton);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isTimerRunning, timer, rectifierId, activeButton]);

  const handleCommand = (command) => {
    fetch(`http://10.10.0.68/${command}`)
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => {
        console.error('Error en el comando:', error);
        Alert.alert('Error', 'No se pudo enviar el comando.');
      });
  };

  const renderButton = (title, command, isControlButton) => (
    <TouchableOpacity
      style={[
        styles.button,
        isControlButton && activeButton === command ? styles.activeButton : null,
      ]}
      onPress={() => {
        handleCommand(command);
        if (isControlButton) {
          setActiveButton(command);
          setIsTimerRunning(command === `relay${rectifierId}on`);
          saveState(timer, command);
        }
      }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const adjustTimer = (adjustment) => {
    const newTime = Math.max(timer + adjustment * 60, 0);
    setTimer(newTime);
    saveState(newTime, activeButton);
  };

  const saveState = async (time, button) => {
    try {
      await AsyncStorage.setItem(`rectifier${rectifierId}_time`, time.toString());
      if (button !== null && button !== undefined) {
        await AsyncStorage.setItem(`rectifier${rectifierId}_button`, button);
      } else {
        await AsyncStorage.removeItem(`rectifier${rectifierId}_button`);
      }
    } catch (e) {
      console.error('Error saving state:', e);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/indugalLogo.png')} style={styles.logo} />
      <Text style={styles.title}>BAÑO {rectifierId}</Text>
      <View style={styles.timerContainer}>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => adjustTimer(-5)}
        >
          <Text style={styles.adjustButtonText}>-5 Min</Text>
        </TouchableOpacity>
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => adjustTimer(5)}
        >
          <Text style={styles.adjustButtonText}>+5 Min</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        {renderButton('SUBIR VOLTAJE', `R${rectifierId}UP`, false)}
        {renderButton('BAJAR VOLTAJE', `R${rectifierId}DOWN`, false)}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('CONTROL MANUAL', `relay${rectifierId}on`, true)}
        {renderButton('CONTROL REMOTO', `relay${rectifierId}off`, true)}
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>MENU</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 50,
    marginBottom: 30,
    borderWidth: 8,
    borderRadius: 20,
    borderColor: '#3949ab',
    padding: 15,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#3949ab',
    borderRadius: 10,
    padding: 10,
  },
  adjustButton: {
    backgroundColor: '#3949ab',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerBox: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#3949ab',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  timerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3949ab',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#3949ab',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: '#b71c1c',
  },
  logo: {
    width: '80%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#3949ab',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default RectifierScreen;
