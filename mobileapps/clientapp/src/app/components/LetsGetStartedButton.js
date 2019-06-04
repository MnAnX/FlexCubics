import React from 'react';

import { StyleSheet, TouchableHighlight, Text } from 'react-native';

const style = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: '#2792ce',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOpacity: 1,
    shadowOffset: {
      height: 2,
      width: 2
    },
    shadowRadius: 2,
  },
  red: {
    backgroundColor: '#b41b17'
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  }
});

export default ({label, onPress, red = false}) => {
  return (
    <TouchableHighlight onPress={onPress} style={[style.button, red && style.red]}
      underlayColor={ red ? '#991714' : '#2280b5'}>
      <Text style={style.text}>{label}</Text>
    </TouchableHighlight>
  );
};
