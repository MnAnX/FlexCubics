import React from 'react';

import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';

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
    left: 0,
    top: -4,
    height: 64,
    paddingHorizontal: 18,
  },
  arrow: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
  }
});

export default ({title, subTitle, nextAction}) => {
  const subtitleLines = subTitle ? subTitle.split('\n').length : 0;
  return (
    <View>
      { title &&
        <View style={style.title}>
          { nextAction &&
            <TouchableHighlight style={style.arrowContainer} onPress={nextAction} underlayColor='#003163'>
              <Text style={style.arrow} >&#8249;</Text>
            </TouchableHighlight>
          }
          <Text style={[style.text, style.titleText]}>{title}</Text>
        </View>
      }
      { subTitle &&
        <View style={[style.subTitle, {height: 22 + subtitleLines * 20}]}>
          <Text style={[style.text, style.subTitleText]}>{subTitle}</Text>
        </View>
      }
    </View>
  );
};
