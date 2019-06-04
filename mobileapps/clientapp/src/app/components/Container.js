import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ({children}) => {
  return (<View style={style.container}>
      {children}
    </View>);
};
