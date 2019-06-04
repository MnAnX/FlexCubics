import React from 'react';

import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';

import colors from '../styles/colors';

const style = StyleSheet.create({
  title: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  titleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ({title}) => {
  return (
    <View style={style.title}>
      <Text style={style.titleText}>{title}</Text>
    </View>
  );
};
