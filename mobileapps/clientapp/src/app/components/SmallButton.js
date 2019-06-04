import React from 'react';
import { Button } from 'react-native-elements'
import colors from '../styles/colors';

export default ({title, icon, onPress, style, disabled, color}) => {
  let fillColor = color ? color : colors.primary
  return (
    <Button
      style={style ? style : {margin: 4}}
      backgroundColor='transparent'
      color={fillColor}
      textStyle={{fontWeight: 'bold'}}
      icon={{name: icon, color: fillColor}}
      title={title}
      disabled={disabled}
      underlayColor='grey'
      onPress={onPress}/>
  );
};
