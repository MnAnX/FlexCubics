import React from 'react';

import { TouchableHighlight, Text } from 'react-native';

import style from '../styles/sidebar';

export default ({title, onPress}) => {
  return (
    <TouchableHighlight onPress={onPress} style={style.navItem} >
      <Text style={style.navItemTitle}>{title}</Text>
    </TouchableHighlight>);
};
