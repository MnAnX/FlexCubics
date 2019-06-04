import React from 'react';
import colors from '../../styles/colors';

const style = {
  row: {
    display: 'flex',
    flexFlow: 'row',
  },
  highlightText: {
    color: colors.primary
  },
}

export default ({label, value}) => {
  return (
    <p style={style.row}>
      {label}&nbsp;<span style={style.highlightText}>{value}</span>
    </p>
  );
};
