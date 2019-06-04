import React from 'react';

import { View, Text, Image, StyleSheet } from 'react-native';

import colors from '../styles/colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    marginTop: -5
  },
  text: {
    position: 'absolute',
    bottom: 4,
    color: colors.darkBlue,
    fontSize: 12,
    backgroundColor: 'transparent'
  }
});

export default ({selected, title, iconImg, activeIconImg}) => (
  <View style={style.container}>
    <View style={style.imageContainer}>
      <Image source={selected ? activeIconImg : iconImg}  style={style.image} />
    </View>
    <Text style={style.text}>{title}</Text>
  </View>
);
