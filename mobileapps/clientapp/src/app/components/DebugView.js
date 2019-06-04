import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 20,
    backgroundColor: 'rgba(155,100,0,.7)'
  },
  text: {
    fontSize: 18,
    fontFamily: 'Courier',
    color: 'white'
  }
})

export default ({text}) => (

  <View style={style.container}>
    <Text style={style.text}>{JSON.stringify(text)}</Text>
  </View>
);
