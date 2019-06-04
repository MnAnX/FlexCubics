import React from 'react';
import { Platform } from 'react-native';
import Image from 'react-native-image-progress';
import ImageProgressBar from 'react-native-progress/Bar';
import ImageProgressCircle from 'react-native-progress/Circle';


export default ({source, style, onPress, children, resizeMode}) => {
  let LoadingIndicator = (Platform.OS === 'ios') ? ImageProgressCircle : ImageProgressBar;
  return (
    <Image source={source} style={style} resizeMode={resizeMode? resizeMode : 'cover'} indicator={LoadingIndicator} onPress={onPress}>
      {children}
    </Image>
  );
};
