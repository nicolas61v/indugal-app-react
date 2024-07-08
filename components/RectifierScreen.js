import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const RectifierScreen = ({ route, navigation }) => {
  const { rectifierId } = route.params;
  const [activeButton, setActiveButton] = useState(null); // Estado para el botón activo

  const handleCommand = (command) => {
    fetch(`http://192.168.1.65/${command}`)
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error(error));
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
          setActiveButton(command); // Actualiza el estado del botón activo
        }
      }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/indugalLogo.png')} style={styles.logo} />
      <Text style={styles.title}>BAÑO {rectifierId}</Text>
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
        onPress={() => navigation.goBack()} // Asume que `navigation` está disponible como prop
      >
        <Text style={styles.backButtonText}>REGRESAR</Text>
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
    borderColor: '#3949ab', // Color del borde
    padding: 15, // Espacio dentro del borde
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
    backgroundColor: '#b71c1c', // Color azul para el botón activo
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
