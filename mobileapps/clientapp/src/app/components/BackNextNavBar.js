import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements'
import colors from '../styles/colors';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'grey',
    padding: 4,
  },
});

export default ({nextText, backText, nextAction, backAction, nextDisabled}) => {
  let backButtonTitle = backText ? backText : 'Go Back'
  let nextButtonTitle = nextText ? nextText : '  Next  '
  return (
    <View style={style.container}>
      <Button
        buttonStyle={{borderWidth: 1, borderColor: colors.primary}}
        underlayColor='grey'
        backgroundColor='white'
        color={colors.primary}
        rounded
        title={backButtonTitle}
        onPress={backAction}/>
      <Button
        backgroundColor={colors.primary}
        underlayColor='grey'
        rounded
        title={nextButtonTitle}
        disabled={nextDisabled}
        onPress={nextAction}/>
    </View>
  );
};
