import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import Container from './Container';

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    paddingVertical: 10,
    color: '#00bbdf',
    fontSize: 18,
    fontWeight: '600'
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22
  }
});

export default ({hideNavBar = false, hideTabBar = false}) => {
  return (
    <Container>
      <View style={style.container}>
        <Text style={style.header}>Coming Soon!</Text>
        <Text style={style.text}>{`We will notify you as soon as this\nfeature becomes available!`}</Text>
      </View>
      <View style={{flex: 1}}/>
    </Container>
  );
};
