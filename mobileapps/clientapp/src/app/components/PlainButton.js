import React from 'react';
import { Button } from 'react-native-elements'
import colors from '../styles/colors';

export default ({title, icon, onPress, style, disabled}) => {
  return (
    <Button
      containerViewStyle={style ? style : {margin: 20, borderRadius: 20}}
      buttonStyle={{borderWidth: 1, borderColor: colors.primary}}
      backgroundColor='white'
      color={colors.primary}
      rounded
      icon={{name: icon, color: colors.primary}}
      title={title}
      disabled={disabled}
      underlayColor='grey'
      onPress={onPress}/>
  );
};
