import React from 'react';
import colors from '../../styles/colors';

const style = {
  sectionTitle: {
    color: colors.primary,
    fontSize: 20
  },
}

export default ({text}) => {
  return (
    <div style={style.sectionTitle}>{text}</div>
  )
};
