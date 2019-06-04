import React from 'react';
import { Button } from 'react-native-elements'
import colors from '../styles/colors';

export default ({title, icon, onPress, style, disabled, color}) => {
  return (
    <Button
      containerViewStyle={style ? style : {margin: 20, borderRadius: 30}}
      backgroundColor={color ? color : colors.accent}
      large
      rounded
      raised
      fontSize={20}
      fontWeight='bold'
      icon={{name: icon}}
      title={title}
      disabled={disabled}
      underlayColor='grey'
      onPress={onPress}/>
  );
};
