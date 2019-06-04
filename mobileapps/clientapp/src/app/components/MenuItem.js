import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'
import { MenuOption } from 'react-native-popup-menu';
import colors from '../styles/colors';

const style = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    padding: 2,
  },
  menuItem: {
    fontSize: 20,
    color: colors.primaryText,
    marginBottom: 4,
  },
})

export default ({text, icon, disabled, onSelect}) => {
  return (
    <MenuOption onSelect={onSelect} disabled={disabled}>
      <View style={style.conatiner}>
        <Icon style={{paddingRight: 4}} name={icon} color={colors.primary} />
        <Text style={style.menuItem}>{text}</Text>
      </View>
    </MenuOption>
  );
};
