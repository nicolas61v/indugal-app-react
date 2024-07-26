import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { TimerContext } from '../components/TimerContext';  // Ajusta la ruta si es necesario

const RectifierScreen = ({ route, navigation }) => {
  const { rectifierId } = route.params;
  const { timers, startTimer, stopTimer, setTimerDuration, activeStates, setActiveButton, handleCommand, orderNumbers, updateOrderNumber, confirmOrderNumber, clearOrderNumber } = useContext(TimerContext);

  const timer = timers[rectifierId] || 0;
  const activeButton = activeStates[rectifierId] || null;
  const orderNumber = orderNumbers[rectifierId] || '00';

  const renderButton = (title, command, isControlButton) => (
    <TouchableOpacity
      style={[
        styles.button,
        isControlButton && activeButton === command ? styles.activeButton : null,
      ]}
      onPress={() => {
        if (isControlButton && command === `relay${rectifierId}on` && !validateInputs()) {
          return;
        }
        handleCommand(command);
        if (isControlButton) {
          setActiveButton(rectifierId, command);
          if (command === `relay${rectifierId}on`) {
            startTimer(rectifierId);
          } else {
            stopTimer(rectifierId);
          }
        }
      }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const adjustTimer = (adjustment) => {
    const newTime = Math.max(timer + adjustment * 60, 0);
    setTimerDuration(rectifierId, newTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const validateInputs = () => {
    if (timer === 0) {
      Alert.alert("Error", "El tiempo no puede ser 0. Por favor, ajuste el tiempo.");
      return false;
    }
    if (orderNumber === '00') {
      Alert.alert("Error", "El número de orden no puede ser 00. Por favor, ingrese un número de orden válido.");
      return false;
    }
    return true;
  };

  const renderOrderNumberControl = () => (
    <View style={styles.orderNumberContainer}>
      <View style={styles.digitsRow}>
        <View style={styles.digitContainer}>
          <TouchableOpacity style={styles.digitButton} onPress={() => updateOrderNumber(rectifierId, 0, (parseInt(orderNumber[0]) + 1) % 10)}>
            <Text style={styles.digitButtonText}>▲</Text>
          </TouchableOpacity>
          <Text style={styles.digitText}>{orderNumber[0]}</Text>
          <TouchableOpacity style={styles.digitButton} onPress={() => updateOrderNumber(rectifierId, 0, (parseInt(orderNumber[0]) - 1 + 10) % 10)}>
            <Text style={styles.digitButtonText}>▼</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.digitContainer}>
          <TouchableOpacity style={styles.digitButton} onPress={() => updateOrderNumber(rectifierId, 1, (parseInt(orderNumber[1]) + 1) % 10)}>
            <Text style={styles.digitButtonText}>▲</Text>
          </TouchableOpacity>
          <Text style={styles.digitText}>{orderNumber[1]}</Text>
          <TouchableOpacity style={styles.digitButton} onPress={() => updateOrderNumber(rectifierId, 1, (parseInt(orderNumber[1]) - 1 + 10) % 10)}>
            <Text style={styles.digitButtonText}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.orderButtonsContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={() => confirmOrderNumber(rectifierId)}>
          <Text style={styles.confirmButtonText}>✓</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={() => clearOrderNumber(rectifierId)}>
          <Text style={styles.clearButtonText}>Borrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/indugalLogo.png')} style={styles.logo} />
      <Text style={styles.title}>BAÑO {rectifierId}</Text>
      <View style={styles.contentContainer}>
        {renderOrderNumberControl()}
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
            onPress={() => adjustTimer(1)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  logo: {
    width: '80%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#3949ab',
    padding: 10,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#3949ab',
    borderRadius: 10,
    paddingHorizontal: 40,
    paddingVertical: 10,
    width: '90%',
    marginBottom: 20,
  },
  digitsRow: {
    flexDirection: 'row',
  },
  digitContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  digitButton: {
    backgroundColor: '#3949ab',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 2,
  },
  digitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  digitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3949ab',
  },
  orderButtonsContainer: {
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#f44336',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
