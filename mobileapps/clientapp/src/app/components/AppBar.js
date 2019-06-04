import React from 'react';

import { View, TouchableHighlight, Text, StyleSheet, Image } from 'react-native';

import colors from '../styles/colors';

const style = StyleSheet.create({
  title: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  subTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.steelBlue,
  },
  text: {
    color: colors.white,
    textAlign: 'center'
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
  },
  subTitleText: {
    fontSize: 14,
    padding: 6
  },
  arrowContainer: {
    position: 'absolute',
    left: -10,
    height: 60,
    justifyContent: 'center',
  },
  arrow: {
    margin: 20,
    height: 40,
    width: 40
  }
});

export default ({title, nextAction}) => {
  return (
    <View style={style.title}>
      <TouchableHighlight style={style.arrowContainer} onPress={nextAction} underlayColor='#003163'>
        <Image style={style.arrow} source={require('../images/icons/apps.png')} />
      </TouchableHighlight>
      <Text style={[style.text, style.titleText]}>{title}</Text>
    </View>
  );
};
