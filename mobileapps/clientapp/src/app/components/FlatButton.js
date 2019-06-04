import React from 'react';
import { Button } from 'react-native-elements'
import colors from '../styles/colors';

export default ({title, icon, onPress, style, disabled, color}) => {
  let fontColor = color? color : colors.primary;
  return (
    <Button
      style={style ? style : {margin: 4}}
      buttonStyle={{borderRadius: 4}}
      backgroundColor='transparent'
      color={fontColor}
      textStyle={{fontWeight: 'bold', fontSize: 20}}
      icon={{name: icon, color: fontColor, size: 20}}
      title={title}
      disabled={disabled}
      underlayColor='grey'
      onPress={onPress}/>
  );
};
