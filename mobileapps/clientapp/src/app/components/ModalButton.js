import React from 'react';

import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';

const style = StyleSheet.create({
  defaultOuterStyle: {
    flex: 1,
    borderColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth
  },
  separator: {
    borderRightWidth: StyleSheet.hairlineWidth
  },
  button: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ({label, disabled = false, onPress, style: outerStyle = style.defaultOuterStyle, separator = false}) => {
  return (
    <TouchableHighlight style={[outerStyle, separator && style.separator]} onPress={onPress}>
      <View style={style.button}>
        <Text style={{color: 'white', backgroundColor: 'transparent', fontSize: 18}}>{label}</Text>
      </View>
    </TouchableHighlight>
  );
};
