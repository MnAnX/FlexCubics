import React from 'react';
import colors from '../../styles/colors';

const style = {
  container: {
    display: 'flex',
    flexFlow: 'row',
    fontSize: 18,
  },
  highlightText: {
    color: colors.primary
  },
}

export default ({label, value}) => {
  return (
    <p style={style.container}>
      {label}&nbsp;<span style={style.highlightText}>{value}</span>
    </p>
  );
};
