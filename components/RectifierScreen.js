import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RectifierScreen = ({ route }) => {
  const { rectifierId } = route.params;

  const handleCommand = (command) => {
    fetch(`http://192.168.1.65/${command}`)
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  };

  const renderButton = (title, command) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleCommand(command)}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Control de Rectificador {rectifierId}</Text>
      <View style={styles.buttonContainer}>
        {renderButton('Subir', `R${rectifierId}UP`)}
        {renderButton('Bajar', `R${rectifierId}DOWN`)}
        {renderButton('MANUAL', `relay${rectifierId}on`)}
        {renderButton('CONTROLADO', `relay${rectifierId}off`)}
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
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RectifierScreen;
