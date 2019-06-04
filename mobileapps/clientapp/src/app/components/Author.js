import React from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';

import Image from '../components/ImageLoader';

import colors from '../styles/colors';

const style = StyleSheet.create({
  author: {
    alignItems: 'center'
  },
  imageWrapper: {
    padding: 4,
    backgroundColor: 'white',
    shadowColor: '#333',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    shadowOpacity: .5,
    borderRadius: 4
  },
  image: {
    width: 126,
    height: 126
  },
  name: {
    paddingTop: 3,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryText,
    backgroundColor: 'transparent'
  }
})

export default ({name, imageUrl, onPress}) => {
  return (
    <View style={style.author}>
      <TouchableHighlight style={style.imageWrapper} underlayColor='#ddd' onPress={onPress}>
        <View style={style.image}>
          <Image source={{uri: imageUrl}} style={style.image} />
        </View>
      </TouchableHighlight>
      <Text style={style.name}>{name}</Text>
    </View>
  );
};
