import React from 'react';
import { View } from 'react-native';

import style from '../styles/shelf';

export default ({children, columns}) => {
  const spacerChildren = new Array(columns - children.length).fill(<View/>);
  children = children.concat(spacerChildren);

  const rowItems = children.map((child, idx) => {
    return <View key={idx} style={style.rowItem}>{child}</View>
  });

  return (
    <View style={style.row}>
      {rowItems}
    </View>
  );
};
