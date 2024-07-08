import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RectifierScreen from '../components/RectifierScreen';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const renderButton = (title, rectifierId) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('Rectifier', { rectifierId })}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderButton('Rectificador 1', 1)}
      {renderButton('Rectificador 2', 2)}
      {renderButton('Rectificador 3', 3)}
      {renderButton('Rectificador 4', 4)}
      {renderButton('Rectificador 5', 5)}
      {renderButton('Rectificador 6', 6)}
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
  button: {
    backgroundColor: '#4CAF50', // Fondo del botón
    paddingVertical: 10, // Espaciado vertical
    paddingHorizontal: 20, // Espaciado horizontal
    borderRadius: 5, // Bordes redondeados
    marginVertical: 5, // Espaciado entre botones
    alignItems: 'center', // Centrar el texto horizontalmente
  },
  buttonText: {
    color: '#fff', // Color del texto
    fontSize: 16, // Tamaño del texto
    fontWeight: 'bold', // Grosor del texto
  },
});

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Rectifier" component={RectifierScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
