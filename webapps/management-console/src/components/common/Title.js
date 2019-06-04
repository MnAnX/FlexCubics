import React from 'react';
import colors from '../../styles/colors';

const style = {
  title: {
    textAlign: 'center',
    fontSize: 32
  },
  titleText1: {
    display: 'inline-block',
    color: colors.primary
  },
  titleText2: {
    display: 'inline-block',
  },
}

export default ({text1, text2}) => {
  return (
    <div style={style.title}>
      <span style={style.titleText1}>{text1}</span>
      { " " }
      <span style={style.titleText2}>{text2}</span>
    </div>
  );
};
