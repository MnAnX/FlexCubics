import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Badge } from 'react-native-elements'
import colors from '../styles/colors';

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    margin: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    color: colors.text,
  },
})

export default ({label, value, color, onPress}) => {
  let containerStyle = style.container
  if(color) {
    containerStyle = [style.container, {backgroundColor : color}]
  }
  return (
    <Badge containerStyle={containerStyle} onPress={onPress}>
      <Text style={style.label}>{label}</Text>
      <Text style={style.text}>{value}</Text>
    </Badge>
  );
};
