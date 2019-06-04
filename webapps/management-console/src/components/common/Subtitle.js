import React from 'react';
import colors from '../../styles/colors';

const style = {
  subtitle: {
    fontSize: 28
  },
}

export default ({text}) => {
  return (
    <div style={style.subtitle}>{text}</div>
  )
};
