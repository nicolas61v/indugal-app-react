import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ServoButton from './ServoButton'; 
import RelayButton from './RelayButton';

const RectifierScreen = ({ route }) => {
  const { rectifierId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control de Rectificador {rectifierId}</Text>
      <View style={styles.buttonContainer}>
        <ServoButton title={`${rectifierId} Subir`} command={`R${rectifierId}UP`} />
        <ServoButton title={`${rectifierId} bajar`} command={`R${rectifierId}DOWN`} />
        <RelayButton title="MANUAL" command={`relay${rectifierId}on`} />
        <RelayButton title="CONTROLADO" command={`relay${rectifierId}off`} />
      </View>
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
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-between',
    height: 200,
  },
});

export default RectifierScreen;
