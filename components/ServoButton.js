import React from 'react';
import { Button } from 'react-native';

const handleButtonPress = (url) => {
  fetch(url)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));
};

const ServoButton = ({ title, command }) => {
  const url = `http://192.168.1.65/${command}`;
  return <Button title={title} onPress={() => handleButtonPress(url)} />;
};

export default ServoButton;
