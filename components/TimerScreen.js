import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TimerScreen = ({ route }) => {
  const navigation = useNavigation();
  const { rectifierId } = route.params;
  const [timers, setTimers] = useState([
    { id: 1, time: 0 },
    { id: 2, time: 0 },
    { id: 3, time: 0 },
    { id: 4, time: 0 },
    { id: 5, time: 0 },
    { id: 6, time: 0 },
  ]);

  const adjustTime = (id, amount) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, time: timer.time + amount } : timer
      )
    );
  };

  const renderTimer = ({ item }) => (
    <View style={styles.timerContainer}>
      <TouchableOpacity style={styles.timer} onPress={() => navigation.navigate('Rectificador', { rectifierId: item.id })}>
        <Text style={styles.timerText}>BAÑO {item.id}</Text>
        <Text style={styles.timeText}>{item.time} min</Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTime(item.id, -5)}>
          <Text style={styles.buttonText}>-5 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTime(item.id, 5)}>
          <Text style={styles.buttonText}>+5 min</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={timers}
        renderItem={renderTimer}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  listContainer: {
    alignItems: 'center',
  },
  timerContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  timer: {
    backgroundColor: '#3949ab',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    width: 200,
    marginBottom: 10,
  },
  timerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  timeText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  adjustButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TimerScreen;
