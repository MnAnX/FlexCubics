import React from 'react';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import { isEmpty } from 'lodash'
import { Icon } from 'react-native-elements'

import Image from '../components/ImageLoader';

import colors from '../styles/colors';

const style = StyleSheet.create({
  book: {
    padding: 4,
    backgroundColor: 'white',
    shadowColor: '#333',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    shadowOpacity: .5,
    borderRadius: 4
  },
  image: {
    width: 140,
    height: 200
  },
  authorOverlay: {
    flex: 1,
    position: 'absolute',
    width: 140,
    height: 62,
    top: 138,
    left: 0,
    opacity: 0.8,
    backgroundColor: colors.primary,
  },
  removeModeOverlay: {
    flex: 1,
    position: 'absolute',
    width: 148,
    height: 208,
    top: 0,
    left: 0,
    opacity: 0.6,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'left',
    position: 'absolute',
    top: 24,
    left: 8,
    right: 8,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    shadowOpacity: .5,
  },
  authorFirstName: {
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: 'transparent',
    color: colors.darkBlue,
    textAlign: 'right',
    position: 'absolute',
    top: 150,
    right: 8,
  },
  authorLastName: {
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: 'transparent',
    color: colors.primaryText,
    textAlign: 'right',
    position: 'absolute',
    top: 170,
    right: 8,
  }
})

export default ({imageUrl, defaultCoverUrl, title, author, isRemoveMode, onPress, removeFunc, isOwner}) => {
  const bookCover = () => {
    let authorNames = author ? author.split(' ') : [''];
    let authorFirstName = authorNames[0];
    let authorLastName = authorNames.length > 1 ? authorNames[1] : '';
    let coverUrl = isOwner ? "https://s3-us-west-2.amazonaws.com/system-data/template/covers/template_owner_cover.png" : defaultCoverUrl
    if(!isEmpty(imageUrl)){
      return (
        <Image source={{uri: imageUrl}} style={style.image} onPress={onPress}>
          {!isEmpty(author) && <View style={style.authorOverlay} />}
          <View>
            <Text style={[style.authorFirstName, {color: 'white'}]}>{authorFirstName}</Text>
            <Text style={[style.authorLastName, {color: 'white'}]}>{authorLastName}</Text>
          </View>
        </Image>
      );
    } else {
      return (
        <Image source={{uri: coverUrl}} style={style.image} onPress={onPress}>
          <View>
            <Text style={style.title}>{title}</Text>
            <Text style={style.authorFirstName}>{authorFirstName}</Text>
            <Text style={style.authorLastName}>{authorLastName}</Text>
          </View>
        </Image>
      );
    }
  }

  const removeModeOverlay = () => {
    return (
      <View style={style.removeModeOverlay}>
        <Icon
          reverse
          raised
          name='delete-forever'
          color='dimgrey'
          onPress={()=>{removeFunc()}}
          />
      </View>
    )
  }

  return (
    <View>
      <TouchableHighlight style={style.book} underlayColor='#ddd' onPress={onPress}>
        <View style={style.image}>
          {bookCover()}
        </View>
      </TouchableHighlight>
      {isRemoveMode && removeModeOverlay()}
    </View>
  );
};
