import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
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
      <Image source={require('../assets/indugalLogo.png')} style={styles.logo} />
      <View style={styles.buttonContainer}>
        <ScrollView contentContainerStyle={styles.buttonColumn}>
          {renderButton('BAÑO 1', 1)}
          {renderButton('BAÑO 3', 3)}
          {renderButton('BAÑO 5', 5)}
        </ScrollView>
        <ScrollView contentContainerStyle={styles.buttonColumn}>
          {renderButton('BAÑO 2', 2)}
          {renderButton('BAÑO 4', 4)}
          {renderButton('BAÑO 6', 6)}
        </ScrollView>
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
  logo: {
    width: '80%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  buttonColumn: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3949ab',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    alignItems: 'center',
    width: 120,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
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
