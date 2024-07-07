import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Button, StyleSheet } from 'react-native';
import RectifierScreen from '../components/RectifierScreen';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Rectificador 1" onPress={() => navigation.navigate('Rectifier', { rectifierId: 1 })} />
      <Button title="Rectificador 2" onPress={() => navigation.navigate('Rectifier', { rectifierId: 2 })} />
      <Button title="Rectificador 3" onPress={() => navigation.navigate('Rectifier', { rectifierId: 3 })} />
      <Button title="Rectificador 4" onPress={() => navigation.navigate('Rectifier', { rectifierId: 4 })} />
      <Button title="Rectificador 5" onPress={() => navigation.navigate('Rectifier', { rectifierId: 5 })} />
      <Button title="Rectificador 6" onPress={() => navigation.navigate('Rectifier', { rectifierId: 6 })} />
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
