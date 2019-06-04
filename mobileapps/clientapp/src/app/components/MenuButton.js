import React from 'react';
import { View, TouchableHighlight, Text, Image, StyleSheet, TextInput, Button } from 'react-native';
import { Icon } from 'react-native-elements'

import colors from '../styles/colors';

const style = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center'
  },
  menuText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  menuIcon: {
    color: 'white',
    marginLeft: 20,
    marginRight: 10
  }
});

export default ({title, icon, iconType, onPress}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor='grey'>
      <View style={style.wrap}>
        <Icon style={style.menuIcon} name={icon} type={iconType} color='white'/>
        <Text style={style.menuText}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};
