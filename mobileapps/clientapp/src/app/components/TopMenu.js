import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../styles/colors';

const style = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})

export default ({children}) => {
  return (
    <LinearGradient colors={[colors.primary, colors.darkBlue]} style={style.menu}>
      {children}
    </LinearGradient>
  );
};
