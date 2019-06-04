import React from 'react';

import { View, Text } from 'react-native';

import style from '../styles/sidebar';

export default ({onClose, title}) => {
  return (<View style={style.header}>
      <Text onPress={onClose} style={style.close}>&#x2a2f;</Text>
      <Text style={style.headerTitle}>{title}</Text>
    </View>);
};
