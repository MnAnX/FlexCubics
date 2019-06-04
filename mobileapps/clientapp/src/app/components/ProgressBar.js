import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

const { clamp, toFinite } = require('lodash');

import colors from '../styles/colors';
const style = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  text: {
    marginBottom: 5,
    fontSize: 26,
    backgroundColor: 'transparent',
    color: colors.primary
  },
  secondaryText: {
    margin: 5,
    fontSize: 12,
    backgroundColor: 'transparent',
    color: colors.grey
  },
  progressContainer: {
    height: 10,
    flexDirection: 'row',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  progress: {
    backgroundColor: colors.orange
  }
});

export default ({progress = 0, hideText = false}) => {
  progress = clamp(toFinite(progress), 0, 1);

  const progressText = (<Text style={style.text}>{Math.round(progress * 100)}%</Text>);

  return (
    <View style={style.container}>
      { hideText || progressText }
      <View style={style.progressContainer}>
        <View style={[style.progress, { flex: progress }]} />
        <View style={{ flex: 1 - progress }} />
      </View>
      <Text style={style.secondaryText}>Complete</Text>
    </View>
  );
};
