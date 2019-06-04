import React from 'react';
import { Button } from 'react-native-elements'
import colors from '../styles/colors';

export default ({title, icon, onPress, style, disabled}) => {
  return (
    <Button
      containerViewStyle={style ? style : {margin: 20, borderRadius: 20}}
      backgroundColor={colors.primary}
      rounded
      raised
      icon={{name: icon}}
      title={title}
      disabled={disabled}
      underlayColor='grey'
      onPress={onPress}/>
  );
};
