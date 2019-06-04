import React from 'react';
import { View, Platform } from 'react-native';
import colors from '../styles/colors';

export default () => {
  return (
    <View style={{height: (Platform.OS === 'ios') ? 24 : 0, backgroundColor: colors.primary}}>
    </View>
  );
};
